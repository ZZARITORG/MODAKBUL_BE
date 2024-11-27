import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { USER_REPO, UserRepository } from './user.repository';
import { Meeting } from 'src/common/db/entities/meeting.entity';
import { CreateMeetingReqDto } from '../meeting/dtos/create-meeting-req-dto';
import { MeetingStatus, UserMeetingRelation } from 'src/common/db/entities/user-meeting-relation.entity';
import { ChangeStatusMeetingReqDto } from '../meeting/dtos/change-status-meeting-req-dto';
import { Notification, NotificationType } from 'src/common/db/entities/notification.entitiy';
import { CreateMeetingGroupReqDto } from '../meeting/dtos/create-meeting-group-req-dto';
import { Group } from 'src/common/db/entities/group.entity';
import { FrequentFriend } from 'src/common/db/entities/frequent_friends.entity';
import { FrequentGroup } from 'src/common/db/entities/frequent_groups.entity';
export const MEETING_REPO = 'MEETING_REPO';

@Injectable()
export class MeetingRepository extends Repository<Meeting> {
  private readonly logger = new Logger(MeetingRepository.name);
  private readonly userMeetingRepo: Repository<UserMeetingRelation>;

  constructor(
    @Inject(USER_REPO) private readonly userRepo: UserRepository,
    private dataSource: DataSource,
  ) {
    super(Meeting, dataSource.createEntityManager());
    this.userMeetingRepo = dataSource.getRepository(UserMeetingRelation);
  }
  private async createNotification(
    sourceUserId: string,
    targetUserId: string,
    type: NotificationType,
    meetingId?: string,
  ): Promise<void> {
    const notificationRepository = this.dataSource.getRepository(Notification); // Notification 레포지토리 가져오기
    const notification = notificationRepository.create({
      type: type, // 알림 타입 설정
      sourceUser: { id: sourceUserId }, // 친구 요청을 보낸 사람의 UUID
      targetUser: { id: targetUserId }, // 요청을 받은 사람의 UUID
      meetingId, // 약속 UUID (옵션)
    });

    await notificationRepository.save(notification); // 알림 저장
    this.logger.log(`알림이 생성되었습니다: ${JSON.stringify(notification)}`); // 로그에 알림 정보 기록
  }
  // 약속 생성
  async createMeeting(createMeetingReqDto: CreateMeetingReqDto, userId: string) {
    const meeting = this.create({
      ...createMeetingReqDto,
      hostId: userId,
    });

    const savedMeeting = await this.save(meeting);

    const host = await this.userRepo.findUserById(userId);

    const users = await this.userRepo.findUsersByIds(createMeetingReqDto.friendIds);

    // 호스트 - 약속 관계 생성
    const hostMeeting = await this.userMeetingRepo.create({
      meeting: savedMeeting,
      user: host,
      status: MeetingStatus.ACCEPTED,
    });

    // 초대멤버 - 약속 관계 생성
    const userMeetings = users.map((user) => {
      return this.userMeetingRepo.create({
        meeting: savedMeeting,
        user: user,
      });
    });
    //알림db에 추가
    for (const user of users) {
      await this.createNotification(
        host.id, // 호스트 ID (sourceUser)
        user.id, // 초대된 멤버 ID (targetUser)
        NotificationType.GROUP_INVITATION,
        savedMeeting.id,
      );
      // 친구 관계가 있으면 count를 1 증가시키거나, 없으면 새로 추가
      const existingFrequentFriend = await this.dataSource
        .getRepository(FrequentFriend)
        .createQueryBuilder('ff')
        .where(
          '(ff.source_id = :userId AND ff.target_id = :friendId) OR (ff.source_id = :friendId AND ff.target_id = :userId)',
          { userId: host.id, friendId: user.id },
        )
        .getOne();

      if (existingFrequentFriend) {
        // 이미 기록이 있으면 count 증가
        existingFrequentFriend.count += 1;
        await this.dataSource.getRepository(FrequentFriend).save(existingFrequentFriend);
      } else {
        // 기록이 없으면 새로운 FrequentFriend 추가
        const newFrequentFriend = this.dataSource.getRepository(FrequentFriend).create({
          source: host,
          target: user,
          count: 1,
        });
        await this.dataSource.getRepository(FrequentFriend).save(newFrequentFriend);
      }
    }

    await this.userMeetingRepo.save(hostMeeting);

    await this.userMeetingRepo.save(userMeetings);

    return await this.createQueryBuilder('meeting')
      .leftJoinAndSelect('meeting.userMeetingRelations', 'userMeeting')
      .leftJoinAndSelect('userMeeting.user', 'user')
      .where('meeting.id = :id', { id: savedMeeting.id })
      .getOne();
  }
  async createMeetingGroup(createMeetingGroupReqDto: CreateMeetingGroupReqDto, userId: string) {
    // 회의 생성
    const meeting = this.create({
      ...createMeetingGroupReqDto,
      hostId: userId,
    });

    const savedMeeting = await this.save(meeting);

    const host = await this.userRepo.findUserById(userId);

    // 주어진 그룹 ID들로 그룹을 조회하여 그룹 멤버들 가져오기
    const groups = await this.dataSource
      .getRepository(Group)
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.members', 'groupMember')
      .leftJoinAndSelect('groupMember.user', 'user')
      .where('group.id IN (:...groupIds)', { groupIds: createMeetingGroupReqDto.groupIds })
      .getMany();

    // 그룹 멤버들로부터 사용자 리스트를 생성
    const users = groups.flatMap((group) => group.members.map((member) => member.user));

    // 사용자 ID 중복 제거 (하나의 사용자가 여러 그룹에 포함되어 있을 수 있음)
    const uniqueUsers = Array.from(new Set(users.map((user) => user.id))).map((id) =>
      users.find((user) => user.id === id),
    );

    // // 호스트와 회의 관계 생성
    // const hostMeeting = this.userMeetingRepo.create({
    //   meeting: savedMeeting,
    //   user: host,
    //   status: MeetingStatus.ACCEPTED,
    // });

    // // 각 사용자에 대한 회의 관계 생성
    // const userMeetings = uniqueUsers.map((user) => {
    //   return this.userMeetingRepo.create({
    //     meeting: savedMeeting,
    //     user: user,
    //   });
    // });

    // FrequentGroup 생성 또는 업데이트
    for (const group of groups) {
      const frequentGroupRepository = this.dataSource.getRepository(FrequentGroup);
      let frequentGroup = await frequentGroupRepository.findOne({
        where: { source: { id: userId }, group: { id: group.id } },
      });

      if (!frequentGroup) {
        frequentGroup = frequentGroupRepository.create({
          source: host,
          group: group,
          count: 1,
        });
        await frequentGroupRepository.save(frequentGroup);
      } else {
        frequentGroup.count += 1;
        await frequentGroupRepository.save(frequentGroup);
      }

      this.logger.log(`FrequentGroup 업데이트됨: 사용자(${host.id})와 그룹(${group.id})`);
    }

    // FrequentFriend 생성 또는 업데이트
    for (const user of uniqueUsers) {
      const frequentFriendRepository = this.dataSource.getRepository(FrequentFriend);
      let frequentFriend = await frequentFriendRepository.findOne({
        where: { source: { id: userId }, target: { id: user.id } },
      });

      if (!frequentFriend) {
        frequentFriend = frequentFriendRepository.create({
          source: { id: userId },
          target: user,
          count: 1,
        });
        await frequentFriendRepository.save(frequentFriend);
      } else {
        frequentFriend.count += 1;
        await frequentFriendRepository.save(frequentFriend);
      }

      this.logger.log(`FrequentFriend 업데이트됨: 사용자(${userId})와 대상(${user.id})`);
    }

    // 미팅 생성 및 알림 보내기
    const hostMeeting = this.userMeetingRepo.create({
      meeting: savedMeeting,
      user: host,
      status: MeetingStatus.ACCEPTED,
    });

    const userMeetings = uniqueUsers.map((user) => {
      return this.userMeetingRepo.create({
        meeting: savedMeeting,
        user: user,
      });
    });
    // 각 사용자에게 그룹 초대 알림 생성
    for (const user of uniqueUsers) {
      await this.createNotification(
        host.id, // 호스트 ID (sourceUser)
        user.id, // 초대된 사용자 ID (targetUser)
        NotificationType.GROUP_INVITATION,
        savedMeeting.id, // 회의 ID
      );
    }

    // 호스트와 사용자 회의 관계 저장
    await this.userMeetingRepo.save(hostMeeting);
    await this.userMeetingRepo.save(userMeetings);

    // 회의 정보 반환
    return await this.createQueryBuilder('meeting')
      .leftJoinAndSelect('meeting.userMeetingRelations', 'userMeeting')
      .leftJoinAndSelect('userMeeting.user', 'user')
      .where('meeting.id = :id', { id: savedMeeting.id })
      .getOne();
  }

  // 약속 수락
  async acceptMeeting(acceptMeetingReqDto: ChangeStatusMeetingReqDto, userId: string) {
    const userMeeting = await this.userMeetingRepo
      .createQueryBuilder('userMeeting')
      .innerJoinAndSelect('userMeeting.user', 'user')
      .innerJoinAndSelect('userMeeting.meeting', 'meeting')
      .where('user.id = :userId', { userId })
      .andWhere('meeting.id = :meetingId', { meetingId: acceptMeetingReqDto.meetingId })
      .getOne();

    if (!userMeeting) {
      throw new BadRequestException('해당 모임에 참여하지 않은 사용자입니다.');
    }

    userMeeting.status = MeetingStatus.ACCEPTED;

    await this.userMeetingRepo.save(userMeeting);

    return await this.createQueryBuilder('meeting')
      .leftJoinAndSelect('meeting.userMeetingRelations', 'userMeeting')
      .leftJoinAndSelect('userMeeting.user', 'user')
      .where('meeting.id = :id', { id: acceptMeetingReqDto.meetingId })
      .getOne();
  }

  // 약속 거절
  async rejectMeeting(rejectMeetingReqDto: ChangeStatusMeetingReqDto, userId: string) {
    const userMeeting = await this.userMeetingRepo
      .createQueryBuilder('userMeeting')
      .innerJoinAndSelect('userMeeting.user', 'user')
      .innerJoinAndSelect('userMeeting.meeting', 'meeting')
      .where('user.id = :userId', { userId })
      .andWhere('meeting.id = :meetingId', { meetingId: rejectMeetingReqDto.meetingId })
      .getOne();

    if (!userMeeting) {
      throw new BadRequestException('해당 모임에 참여하지 않은 사용자입니다.');
    }

    userMeeting.status = MeetingStatus.REJECTED;

    await this.userMeetingRepo.save(userMeeting);

    return await this.createQueryBuilder('meeting')
      .leftJoinAndSelect('meeting.userMeetingRelations', 'userMeeting')
      .leftJoinAndSelect('userMeeting.user', 'user')
      .where('meeting.id = :id', { id: rejectMeetingReqDto.meetingId })
      .getOne();
  }

  // 모든 예정된 약속 조회
  async getAcceptedMeetings(userId: string) {
    return await this.createQueryBuilder('meeting')
      .innerJoin(
        'meeting.userMeetingRelations',
        'userMeetingMain',
        'userMeetingMain.user_id = :userId AND userMeetingMain.status = :status',
        { userId, status: MeetingStatus.ACCEPTED },
      )
      .leftJoinAndSelect('meeting.userMeetingRelations', 'userMeetingAll')
      .leftJoinAndSelect('userMeetingAll.user', 'participants')
      .select([
        'meeting.id',
        'meeting.title',
        'meeting.content',
        'meeting.hostId',
        'meeting.location',
        'meeting.address',
        'meeting.detailAddress',
        'meeting.date',
        'userMeetingAll.status',
        'participants.id',
        'participants.userId',
        'participants.name',
        'participants.profileUrl',
      ])
      .orderBy('meeting.date', 'ASC')
      .getMany();
  }

  // 내가 호스트인 약속 조회
  async getHostMeetings(userId: string) {
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    console.log(oneHourAgo.toString());
    return await this.createQueryBuilder('meeting')
      .leftJoinAndSelect('meeting.userMeetingRelations', 'userMeetingAll')
      .leftJoinAndSelect('userMeetingAll.user', 'participants')
      .where('meeting.hostId = :userId AND meeting.date >= :oneHourAgo', {
        userId,
        oneHourAgo,
      })
      .select([
        'meeting.id',
        'meeting.title',
        'meeting.content',
        'meeting.hostId',
        'meeting.location',
        'meeting.address',
        'meeting.detailAddress',
        'meeting.date',
        'userMeetingAll.status',
        'participants.id',
        'participants.userId',
        'participants.name',
        'participants.profileUrl',
      ])
      .orderBy('meeting.date', 'ASC')
      .getMany();
  }

  // 내가 참가자인 약속 조회
  async getAcceptMeetingList(userId: string) {
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    return await this.createQueryBuilder('meeting')
      .innerJoin(
        'meeting.userMeetingRelations',
        'userMeetingMain',
        '"userMeetingMain"."user_id"::text = :userId AND "userMeetingMain"."status" = :status',
        { userId, status: MeetingStatus.ACCEPTED },
      )
      .leftJoinAndSelect('meeting.userMeetingRelations', 'userMeetingAll')
      .leftJoinAndSelect('userMeetingAll.user', 'participants')
      .where('"meeting"."host_id"::text != :userId AND "meeting"."date" >= :oneHourAgo', {
        userId,
        oneHourAgo,
      })
      .select([
        'meeting.id',
        'meeting.title',
        'meeting.content',
        'meeting.hostId',
        'meeting.location',
        'meeting.address',
        'meeting.detailAddress',
        'meeting.date',
        'userMeetingAll.status',
        'participants.id',
        'participants.userId',
        'participants.name',
        'participants.profileUrl',
      ])
      .orderBy('meeting.date', 'ASC')
      .cache(60000)
      .getMany();
  }

  // 수락 대기중인 약속 조회
  async getPendingMeetings(userId: string) {
    return await this.createQueryBuilder('meeting')
      .innerJoin(
        'meeting.userMeetingRelations',
        'userMeetingMain',
        'userMeetingMain.user_id = :userId AND userMeetingMain.status = :status',
        { userId, status: MeetingStatus.PENDING },
      )
      .leftJoinAndSelect('meeting.userMeetingRelations', 'userMeetingAll')
      .leftJoinAndSelect('userMeetingAll.user', 'participants')
      .where('meeting.date >= :currentDate', { currentDate: new Date() })
      .select([
        'meeting.id',
        'meeting.title',
        'meeting.content',
        'meeting.hostId',
        'meeting.location',
        'meeting.address',
        'meeting.detailAddress',
        'meeting.date',
        'userMeetingAll.status',
        'participants.id',
        'participants.userId',
        'participants.name',
        'participants.profileUrl',
      ])
      .orderBy('meeting.date', 'ASC')
      .getMany();
  }

  // 약속 상세 조회
  async getOneMeeting(meetingId: string) {
    return this.createQueryBuilder('meeting')
      .leftJoinAndSelect('meeting.userMeetingRelations', 'userMeetingAll')
      .leftJoinAndSelect('userMeetingAll.user', 'participants')
      .where('meeting.id = :meetingId', { meetingId })
      .select([
        'meeting.id',
        'meeting.title',
        'meeting.content',
        'meeting.hostId',
        'meeting.location',
        'meeting.address',
        'meeting.detailAddress',
        'meeting.date',
        'userMeetingAll.status',
        'participants.id',
        'participants.userId',
        'participants.name',
        'participants.profileUrl',
      ])
      .getOne();
  }
}
