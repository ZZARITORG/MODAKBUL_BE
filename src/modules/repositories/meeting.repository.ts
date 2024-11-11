import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { USER_REPO, UserRepository } from './user.repository';
import { Meeting } from 'src/common/db/entities/meeting.entity';
import { CreateMeetingReqDto } from '../meeting/dtos/create-meeting-req-dto';
import { MeetingStatus, UserMeetingRelation } from 'src/common/db/entities/user-meeting-relation.entity';
import { ChangeStatusMeetingReqDto } from '../meeting/dtos/change-status-meeting-req-dto';
export const MEETING_REPO = 'MEETING_REPO';

@Injectable()
export class MeetingRepository extends Repository<Meeting> {
  private readonly userMeetingRepo: Repository<UserMeetingRelation>;

  constructor(
    @Inject(USER_REPO) private readonly userRepo: UserRepository,
    private dataSource: DataSource,
  ) {
    super(Meeting, dataSource.createEntityManager());
    this.userMeetingRepo = dataSource.getRepository(UserMeetingRelation);
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

    await this.userMeetingRepo.save(hostMeeting);

    await this.userMeetingRepo.save(userMeetings);

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
        oneHourAgo: oneHourAgo.toISOString(),
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
        oneHourAgo: oneHourAgo.toISOString(),
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
