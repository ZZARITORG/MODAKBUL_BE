import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MeetingService } from './meeting.service';
import { CreateMeetingReqDto } from './dtos/create-meeting-req-dto';
import { Meeting } from 'src/common/db/entities/meeting.entity';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ChangeStatusMeetingReqDto } from './dtos/change-status-meeting-req-dto';

@Controller('meeting')
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}

  @Get('host')
  async getHostMeetingList(@CurrentUser() userId: string): Promise<Meeting[]> {
    console.log(userId);
    return this.meetingService.getHostMeetingList(userId);
  }

  @Get('accept')
  async getAcceptMeetingList(@CurrentUser() userId: string): Promise<Meeting[]> {
    return this.meetingService.getAcceptMeetingList(userId);
  }

  @Get('pending')
  async getPendingMeetingList(@CurrentUser() userId: string): Promise<Meeting[]> {
    return this.meetingService.getPendingMeetingList(userId);
  }

  @Get(':meetingId')
  async getOneMeeting(@Param('meetingId') meetingId: string) {
    console.log(typeof meetingId);
    return this.meetingService.getOneMeeting(meetingId);
  }

  @Post()
  async createMeeting(@Body() createMeetingDto: CreateMeetingReqDto, @CurrentUser() userId: string): Promise<Meeting> {
    return this.meetingService.createMeeting(createMeetingDto, userId);
  }

  @Post('accept')
  async acceptMeeting(
    @Body() acceptMeetingReqDto: ChangeStatusMeetingReqDto,
    @CurrentUser() userId: string,
  ): Promise<Meeting> {
    return this.meetingService.acceptMeeting(acceptMeetingReqDto, userId);
  }

  @Post('reject')
  async rejectMeeting(
    @Body() rejectMeetingReqDto: ChangeStatusMeetingReqDto,
    @CurrentUser() userId: string,
  ): Promise<Meeting> {
    return this.meetingService.rejectMeeting(rejectMeetingReqDto, userId);
  }
}
