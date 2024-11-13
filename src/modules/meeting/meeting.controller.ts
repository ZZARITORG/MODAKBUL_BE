import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MeetingService } from './meeting.service';
import { CreateMeetingReqDto } from './dtos/create-meeting-req-dto';
import { Meeting } from 'src/common/db/entities/meeting.entity';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ChangeStatusMeetingReqDto } from './dtos/change-status-meeting-req-dto';
import { CreateMeetingGroupReqDto } from './dtos/create-meeting-group-req-dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('meeting')
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}

  @ApiOperation({ summary: '내가 호스트인 모닥불 리스트 조회 API' })
  @ApiResponse({})
  @Get('host')
  async getHostMeetingList(@CurrentUser() userId: string): Promise<Meeting[]> {
    console.log(userId);
    return this.meetingService.getHostMeetingList(userId);
  }

  @ApiOperation({ summary: '내가 수락한 모닥불 리스트 조회 API' })
  @ApiResponse({})
  @Get('accept')
  async getAcceptMeetingList(@CurrentUser() userId: string): Promise<Meeting[]> {
    return this.meetingService.getAcceptMeetingList(userId);
  }

  @ApiOperation({ summary: '내가 수락하지 않은 모닥불 리스트 조회 API' })
  @ApiResponse({})
  @Get('pending')
  async getPendingMeetingList(@CurrentUser() userId: string): Promise<Meeting[]> {
    return this.meetingService.getPendingMeetingList(userId);
  }

  @ApiOperation({ summary: '약속 상세 조회 API' })
  @ApiResponse({})
  @Get(':meetingId')
  async getOneMeeting(@Param('meetingId') meetingId: string) {
    console.log(typeof meetingId);
    return this.meetingService.getOneMeeting(meetingId);
  }

  @ApiOperation({ summary: 'USER ID로 미팅 생성 API' })
  @ApiResponse({})
  @Post('friendId')
  async createMeeting(@Body() createMeetingDto: CreateMeetingReqDto, @CurrentUser() userId: string): Promise<Meeting> {
    return this.meetingService.createMeeting(createMeetingDto, userId);
  }

  @ApiOperation({ summary: 'GROUP ID로 미팅 생성 API' })
  @ApiResponse({})
  @Post('groupId')
  async createMeetingGroup(
    @Body() createMeetingGroupDto: CreateMeetingGroupReqDto,
    @CurrentUser() userId: string,
  ): Promise<Meeting> {
    return this.meetingService.createMeetingGroup(createMeetingGroupDto, userId);
  }

  @ApiOperation({ summary: '미팅 수락 API' })
  @ApiResponse({})
  @Post('accept')
  async acceptMeeting(
    @Body() acceptMeetingReqDto: ChangeStatusMeetingReqDto,
    @CurrentUser() userId: string,
  ): Promise<Meeting> {
    return this.meetingService.acceptMeeting(acceptMeetingReqDto, userId);
  }

  @ApiOperation({ summary: '미팅 거절 API' })
  @ApiResponse({})
  @Post('reject')
  async rejectMeeting(
    @Body() rejectMeetingReqDto: ChangeStatusMeetingReqDto,
    @CurrentUser() userId: string,
  ): Promise<Meeting> {
    return this.meetingService.rejectMeeting(rejectMeetingReqDto, userId);
  }
}
