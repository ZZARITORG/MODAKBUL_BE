import { Inject, Injectable } from '@nestjs/common';
import { MEETING_REPO, MeetingRepository } from '../repositories/meeting.repository';
import { CreateMeetingReqDto } from './dtos/request/create-meeting-req-dto';
import { Meeting } from 'src/common/db/entities/meeting.entity';
import { ChangeStatusMeetingReqDto } from './dtos/request/change-status-meeting-req-dto';
import { CreateMeetingGroupReqDto } from './dtos/request/create-meeting-group-req-dto';

@Injectable()
export class MeetingService {
  constructor(@Inject(MEETING_REPO) private readonly meetingRepo: MeetingRepository) {}

  async createMeeting(createMeetingReqDto: CreateMeetingReqDto, userId: string): Promise<Meeting> {
    return await this.meetingRepo.createMeeting(createMeetingReqDto, userId);
    // TODO 알림보내기
  }
  async createMeetingGroup(createMeetingGroupDto: CreateMeetingGroupReqDto, userId: string): Promise<Meeting> {
    return await this.meetingRepo.createMeetingGroup(createMeetingGroupDto, userId);
    // TODO 알림보내기
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
      },
    };
  }

  async getHostMeetingList(userId: string) {
    const meetings = await this.meetingRepo.getHostMeetings(userId);
    return meetings.map((meeting) => {
      return {
        id: meeting.id,
        title: meeting.title,
        content: meeting.content,
        hostId: meeting.hostId,
        location: meeting.location,
        address: meeting.address,
        detailAddress: meeting.detailAddress,
        date: meeting.date,
        user: meeting.userMeetingRelations.map((userMeetingRelation) => {
          return {
            id: userMeetingRelation.user.id,
            status: userMeetingRelation.status,
            userId: userMeetingRelation.user.userId,
            name: userMeetingRelation.user.name,
            profileUrl: userMeetingRelation.user.profileUrl,
          };
        }),
      };
    });
  }

  async getAcceptMeetingList(userId: string) {
    const meetings = await this.meetingRepo.getAcceptMeetingList(userId);
    return meetings.map((meeting) => {
      return {
        id: meeting.id,
        title: meeting.title,
        content: meeting.content,
        hostId: meeting.hostId,
        location: meeting.location,
        address: meeting.address,
        detailAddress: meeting.detailAddress,
        date: meeting.date,
        user: meeting.userMeetingRelations.map((userMeetingRelation) => {
          return {
            id: userMeetingRelation.user.id,
            status: userMeetingRelation.status,
            userId: userMeetingRelation.user.userId,
            name: userMeetingRelation.user.name,
            profileUrl: userMeetingRelation.user.profileUrl,
          };
        }),
      };
    });
  }

  async getPendingMeetingList(userId: string) {
    const meetings = await this.meetingRepo.getPendingMeetings(userId);
    return meetings.map((meeting) => {
      return {
        id: meeting.id,
        title: meeting.title,
        content: meeting.content,
        hostId: meeting.hostId,
        location: meeting.location,
        address: meeting.address,
        detailAddress: meeting.detailAddress,
        date: meeting.date,
        user: meeting.userMeetingRelations.map((userMeetingRelation) => {
          return {
            id: userMeetingRelation.user.id,
            status: userMeetingRelation.status,
            userId: userMeetingRelation.user.userId,
            name: userMeetingRelation.user.name,
            profileUrl: userMeetingRelation.user.profileUrl,
          };
        }),
      };
    });
  }

  async getOneMeeting(meetingId: string) {
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
      user: meeting.userMeetingRelations.map((userMeetingRelation) => {
        return {
          id: userMeetingRelation.user.id,
          status: userMeetingRelation.status,
          userId: userMeetingRelation.user.userId,
          name: userMeetingRelation.user.name,
          profileUrl: userMeetingRelation.user.profileUrl,
        };
      }),
    };
  }
}
