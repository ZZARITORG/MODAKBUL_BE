import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { MEETING_REPO, MeetingRepository } from '../repositories/meeting.repository';
import { CreateMeetingReqDto } from './dtos/request/create-meeting-req-dto';
import { Meeting } from 'src/common/db/entities/meeting.entity';
import { ChangeStatusMeetingReqDto } from './dtos/request/change-status-meeting-req-dto';
import { CreateMeetingGroupReqDto } from './dtos/request/create-meeting-group-req-dto';
import { GROUP_REPO, GroupRepository } from '../repositories/group.repository';
import { FRIEND_REPO, FriendRepository } from '../repositories/friend.repository';
import { MeetingStatus } from 'src/common/db/entities/user-meeting-relation.entity';

@Injectable()
export class MeetingService {
  constructor(
    @Inject(MEETING_REPO) private readonly meetingRepo: MeetingRepository,
    @Inject(GROUP_REPO) private readonly groupRepo: GroupRepository,
    @Inject(FRIEND_REPO) private readonly friendShipRepo: FriendRepository,
  ) {}

  async createMeeting(createMeetingReqDto: CreateMeetingReqDto, userId: string): Promise<Meeting> {
    const date = new Date(createMeetingReqDto.date);

    if (date < new Date()) {
      throw new Error('약속시간이 현재시간보다 이전입니다.');
    }

    return await this.meetingRepo.createMeeting(createMeetingReqDto, userId);
    // TODO 알림보내기 : (알람 모듈에서 구현하고 여기서는 호출만 -> 여기서 로직짜면 너무 길어져서 가독성 떨어짐 ,책임분리 필요)
  }
  async createMeetingGroup(createMeetingGroupDto: CreateMeetingGroupReqDto, userId: string) {
    const date = new Date(createMeetingGroupDto.date);

    if (date < new Date()) {
      throw new Error('약속시간이 현재시간보다 이전입니다.');
    }

    const group = await this.groupRepo.findOne({
      where: { id: createMeetingGroupDto.groupId },
      relations: ['members', 'members.user'],
    });

    await this.meetingRepo.createMeetingByGroupId(userId, group, createMeetingGroupDto); //그룹 생성

    group.count++;
    const savedGroup = await this.groupRepo.save(group); //그룹 count 증가

    await this.friendShipRepo.countUp(userId, savedGroup); //친구 count 증가

    // TODO 알림보내기 : (알람 모듈에서 구현하고 여기서는 호출만 -> 여기서 로직짜면 너무 길어져서 가독성 떨어짐 ,책임분리 필요)
  }
  async acceptMeeting(acceptMeetingReqDto: ChangeStatusMeetingReqDto, userId: string) {
    const meeting = await this.meetingRepo.acceptMeeting(acceptMeetingReqDto, userId);
    return {
      id: meeting.id,
      status: meeting.status,
      user: {
        id: meeting.user.id,
        userId: meeting.user.userId,
        name: meeting.user.name,
        profileUrl: meeting.user.profileUrl,
      },
      meeting: {
        id: meeting.meeting.id,
        title: meeting.meeting.title,
        content: meeting.meeting.content,
        hostId: meeting.meeting.hostId,
        location: meeting.meeting.location,
        address: meeting.meeting.address,
        detailAddress: meeting.meeting.detailAddress,
        date: meeting.meeting.date,
        groupName: meeting.meeting.groupName,
        lat: meeting.meeting.lat,
        lng: meeting.meeting.lng,
      },
    };
  }

  async rejectMeeting(rejectMeetingReqDto: ChangeStatusMeetingReqDto, userId: string) {
    const meeting = await this.meetingRepo.rejectMeeting(rejectMeetingReqDto, userId);
    return {
      id: meeting.id,
      status: meeting.status,
      user: {
        id: meeting.user.id,
        userId: meeting.user.userId,
        name: meeting.user.name,
        profileUrl: meeting.user.profileUrl,
      },
      meeting: {
        id: meeting.meeting.id,
        title: meeting.meeting.title,
        content: meeting.meeting.content,
        hostId: meeting.meeting.hostId,
        location: meeting.meeting.location,
        address: meeting.meeting.address,
        detailAddress: meeting.meeting.detailAddress,
        date: meeting.meeting.date,
        groupName: meeting.meeting.groupName,
        lat: meeting.meeting.lat,
        lng: meeting.meeting.lng,
      },
    };
  }

  async getHostMeetingList(userId: string) {
    const meetings = await this.meetingRepo.getHostMeetings(userId);
    return await Promise.all(
      meetings.map(async (meeting) => {
        return {
          id: meeting.id,
          title: meeting.title,
          content: meeting.content,
          hostId: meeting.hostId,
          location: meeting.location,
          address: meeting.address,
          detailAddress: meeting.detailAddress,
          date: meeting.date,
          groupName: meeting.groupName,
          lat: meeting.lat,
          lng: meeting.lng,
          user: await Promise.all(
            meeting.userMeetingRelations.map(async (userMeetingRelation) => {
              let friendShipStatus: string;
              let isMainAgent;

              const friendShip = await this.friendShipRepo.findFriendshipByIds(userId, userMeetingRelation.user.id);

              if (!friendShip) {
                friendShipStatus = 'NONE';
                isMainAgent = 'NONE';
              } else {
                friendShipStatus = friendShip.status;
                isMainAgent = userId == friendShip.source.id;
              }

              return {
                id: userMeetingRelation.user.id,
                status: userMeetingRelation.status,
                userId: userMeetingRelation.user.userId,
                name: userMeetingRelation.user.name,
                profileUrl: userMeetingRelation.user.profileUrl,
                friendShipStatus,
                isMainAgent,
              };
            }),
          ),
        };
      }),
    );
  }

  async getAcceptMeetingList(userId: string) {
    const meetings = await this.meetingRepo.getAcceptMeetingList(userId);
    return await Promise.all(
      meetings.map(async (meeting) => {
        return {
          id: meeting.id,
          title: meeting.title,
          content: meeting.content,
          hostId: meeting.hostId,
          location: meeting.location,
          address: meeting.address,
          detailAddress: meeting.detailAddress,
          date: meeting.date,
          groupName: meeting.groupName,
          lat: meeting.lat,
          lng: meeting.lng,
          user: await Promise.all(
            meeting.userMeetingRelations.map(async (userMeetingRelation) => {
              let friendShipStatus: string;
              let isMainAgent;

              const friendShip = await this.friendShipRepo.findFriendshipByIds(userId, userMeetingRelation.user.id);

              if (!friendShip) {
                friendShipStatus = 'NONE';
                isMainAgent = 'NONE';
              } else {
                friendShipStatus = friendShip.status;
                isMainAgent = userId == friendShip.source.id;
              }

              return {
                id: userMeetingRelation.user.id,
                status: userMeetingRelation.status,
                userId: userMeetingRelation.user.userId,
                name: userMeetingRelation.user.name,
                profileUrl: userMeetingRelation.user.profileUrl,
                friendShipStatus,
                isMainAgent,
              };
            }),
          ),
        };
      }),
    );
  }

  async getPendingMeetingList(userId: string) {
    const meetings = await this.meetingRepo.getPendingMeetings(userId);
    return await Promise.all(
      meetings.map(async (meeting) => {
        return {
          id: meeting.id,
          title: meeting.title,
          content: meeting.content,
          hostId: meeting.hostId,
          location: meeting.location,
          address: meeting.address,
          detailAddress: meeting.detailAddress,
          date: meeting.date,
          createdAt: meeting.createdAt,
          groupName: meeting.groupName,
          lat: meeting.lat,
          lng: meeting.lng,
          user: await Promise.all(
            meeting.userMeetingRelations.map(async (userMeetingRelation) => {
              let friendShipStatus: string;
              let isMainAgent;

              const friendShip = await this.friendShipRepo.findFriendshipByIds(userId, userMeetingRelation.user.id);

              if (!friendShip) {
                friendShipStatus = 'NONE';
                isMainAgent = 'NONE';
              } else {
                friendShipStatus = friendShip.status;
                isMainAgent = userId == friendShip.source.id;
              }

              return {
                id: userMeetingRelation.user.id,
                status: userMeetingRelation.status,
                userId: userMeetingRelation.user.userId,
                name: userMeetingRelation.user.name,
                profileUrl: userMeetingRelation.user.profileUrl,
                friendShipStatus,
                isMainAgent,
              };
            }),
          ),
        };
      }),
    );
  }

  async getOneMeeting(meetingId: string, userId: string) {
    const meeting = await this.meetingRepo.getOneMeeting(meetingId);

    return {
      id: meeting.id,
      title: meeting.title,
      content: meeting.content,
      hostId: meeting.hostId,
      location: meeting.location,
      address: meeting.address,
      detailAddress: meeting.detailAddress,
      date: meeting.date,
      groupName: meeting.groupName,
      lat: meeting.lat,
      lng: meeting.lng,
      user: await Promise.all(
        meeting.userMeetingRelations.map(async (userMeetingRelation) => {
          let friendShipStatus: string;
          let isMainAgent;

          const friendShip = await this.friendShipRepo.findFriendshipByIds(userId, userMeetingRelation.user.id);

          if (!friendShip) {
            friendShipStatus = 'NONE';
            isMainAgent = 'NONE';
          } else {
            friendShipStatus = friendShip.status;
            isMainAgent = userId == friendShip.source.id;
          }

          return {
            id: userMeetingRelation.user.id,
            status: userMeetingRelation.status,
            userId: userMeetingRelation.user.userId,
            name: userMeetingRelation.user.name,
            profileUrl: userMeetingRelation.user.profileUrl,
            friendShipStatus,
            isMainAgent,
          };
        }),
      ),
    };
  }

  //TODO: 미팅 취소할떄 호스트에게만 알람 보내기 (알람 모듈에서 구현하고 여기서는 호출만 -> 여기서 로직짜면 너무 길어져서 가독성 떨어짐, 책임분리 필요)
  async cancelMeeting(userId: string, meetingId: string) {
    const userMeeting = await this.meetingRepo.findUserMeeting(userId, meetingId);

    if (!userMeeting) {
      throw new NotFoundException('미팅을 찾을 수 없습니다.');
    }

    if (userMeeting.status !== MeetingStatus.ACCEPTED) {
      throw new ForbiddenException('수락한 미팅만 취소 가능합니다.');
    }

    userMeeting.status = MeetingStatus.REJECTED;
    await this.meetingRepo.cancelMeeting(userMeeting);
  }

  //TODO: 미팅 삭제할때 전체 참여자들에게 취소 알람 보내기 (알람 모듈에서 구현하고 여기서는 호출만 -> 여기서 로직짜면 너무 길어져서 가독성 떨어짐 ,책임분리 필요)
  async deleteMeeting(userId: string, meetingId: string) {
    const meeting = await this.meetingRepo.findOne({ where: { id: meetingId } });

    if (meeting.hostId !== userId) {
      throw new Error('호스트만 미팅을 삭제 가능합니다.');
    }

    await this.meetingRepo.delete({ id: meetingId });
  }
}
