import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Meeting } from 'src/common/db/entities/meeting.entity';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ChangeStatusMeetingReqDto } from './dtos/request/change-status-meeting-req-dto';
import { CreateMeetingGroupReqDto } from './dtos/request/create-meeting-group-req-dto';
import { CreateMeetingReqDto } from './dtos/request/create-meeting-req-dto';
import { AcceptMeetingResDto } from './dtos/response/accept-meeting-list-res-dto';
import { DetailMeetingResDto } from './dtos/response/detail-meeting-res-dto';
import { HostMeetingResDto } from './dtos/response/host-meeting-res-dto';
import { MeetingAcceptResDto } from './dtos/response/meeting-accept-res-dto';
import { MeetingRejectResDto } from './dtos/response/meeting-reject-res-dto';
import { PendingMeetingResDto } from './dtos/response/pending-meeting-res-dto';
import { MeetingService } from './meeting.service';

@Controller('meeting')
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}

  @ApiOperation({ summary: '내가 호스트인 모닥불 리스트 조회 API' })
  @ApiResponse({ type: [HostMeetingResDto] })
  @Get('host')
  async getHostMeetingList(@CurrentUser() userId: string) {
    console.log(userId);
    return this.meetingService.getHostMeetingList(userId);
  }

  @ApiOperation({ summary: '내가 수락한 모닥불 리스트 조회 API' })
  @ApiResponse({ type: [AcceptMeetingResDto] })
  @Get('accept')
  async getAcceptMeetingList(@CurrentUser() userId: string) {
    console.log(userId);
    return this.meetingService.getAcceptMeetingList(userId);
  }

  @ApiOperation({ summary: '내가 수락하지 않은 모닥불 리스트 조회 API' })
  @ApiResponse({ type: [PendingMeetingResDto] })
  @Get('pending')
  async getPendingMeetingList(@CurrentUser() userId: string) {
    return this.meetingService.getPendingMeetingList(userId);
  }

  @ApiOperation({ summary: '약속 상세 조회 API' })
  @ApiResponse({ type: DetailMeetingResDto })
  @Get(':meetingId')
  async getOneMeeting(@Param('meetingId') meetingId: string) {
    console.log(typeof meetingId);
    return this.meetingService.getOneMeeting(meetingId);
  }

  @ApiOperation({ summary: 'USER ID로 미팅 생성 API' })
  @Post('friendId')
  async createMeeting(@Body() createMeetingDto: CreateMeetingReqDto, @CurrentUser() userId: string): Promise<Meeting> {
    return this.meetingService.createMeeting(createMeetingDto, userId);
  }

  @ApiOperation({ summary: 'GROUP ID로 미팅 생성 API' })
  @Post('groupId')
  async createMeetingGroup(
    @Body() createMeetingGroupDto: CreateMeetingGroupReqDto,
    @CurrentUser() userId: string,
  ): Promise<Meeting> {
    return this.meetingService.createMeetingGroup(createMeetingGroupDto, userId);
  }

  @ApiOperation({ summary: '미팅 수락 API' })
  @ApiResponse({ type: MeetingAcceptResDto })
  @Post('accept')
  async acceptMeeting(@Body() acceptMeetingReqDto: ChangeStatusMeetingReqDto, @CurrentUser() userId: string) {
    return this.meetingService.acceptMeeting(acceptMeetingReqDto, userId);
  }

  @ApiOperation({ summary: '미팅 거절 API' })
  @ApiResponse({ type: MeetingRejectResDto })
  @Post('reject')
  async rejectMeeting(@Body() rejectMeetingReqDto: ChangeStatusMeetingReqDto, @CurrentUser() userId: string) {
    return this.meetingService.rejectMeeting(rejectMeetingReqDto, userId);
  }
}
