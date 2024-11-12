import { Inject, Injectable } from '@nestjs/common';
import { MEETING_REPO, MeetingRepository } from '../repositories/meeting.repository';
import { CreateMeetingReqDto } from './dtos/create-meeting-req-dto';
import { Meeting } from 'src/common/db/entities/meeting.entity';
import { ChangeStatusMeetingReqDto } from './dtos/change-status-meeting-req-dto';
import { CreateMeetingGroupReqDto } from './dtos/create-meeting-group-req-dto';

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
    return await this.meetingRepo.acceptMeeting(acceptMeetingReqDto, userId);
  }

  async rejectMeeting(rejectMeetingReqDto: ChangeStatusMeetingReqDto, userId: string) {
    return await this.meetingRepo.rejectMeeting(rejectMeetingReqDto, userId);
  }

  async getHostMeetingList(userId: string) {
    return await this.meetingRepo.getHostMeetings(userId);
  }

  async getAcceptMeetingList(userId: string) {
    return await this.meetingRepo.getAcceptMeetingList(userId);
  }

  async getPendingMeetingList(userId: string) {
    return await this.meetingRepo.getPendingMeetings(userId);
  }

  async getOneMeeting(meetingId: string) {
    return await this.meetingRepo.getOneMeeting(meetingId);
  }
}
