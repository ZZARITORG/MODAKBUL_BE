import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Meeting } from 'src/common/db/entities/meeting.entity';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ChangeStatusMeetingReqDto } from './dtos/request/change-status-meeting-req-dto';
import { CreateMeetingGroupReqDto } from './dtos/request/create-meeting-group-req-dto';
import { CreateMeetingReqDto } from './dtos/request/create-meeting-req-dto';
import { AcceptMeetingResDto } from './dtos/response/accept-meeting-list-res-dto';
import { DetailMeetingResDto } from './dtos/response/detail-meeting-res-dto';
import { HostMeetingResDto } from './dtos/response/host-meeting-res-dto';
import { MeetingAcceptResDto } from './dtos/response/meeting-accept-res-dto';
import { PendingMeetingResDto } from './dtos/response/pending-meeting-res-dto';
import { MeetingService } from './meeting.service';
import { MeetingIdReqDto } from './dtos/request/meeting-id-req-dto';

@Controller('meeting')
@ApiTags('MEETING')
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}

  @ApiOperation({ summary: '내가 호스트인 모닥불 리스트 조회 API' })
  @ApiBearerAuth()
  @ApiResponse({ type: [HostMeetingResDto] })
  @Get('host')
  async getHostMeetingList(@CurrentUser() userId: string) {
    return this.meetingService.getHostMeetingList(userId);
  }

  @ApiOperation({ summary: '내가 수락한 모닥불 리스트 조회 API' })
  @ApiBearerAuth()
  @ApiResponse({ type: [AcceptMeetingResDto] })
  @Get('accept')
  async getAcceptMeetingList(@CurrentUser() userId: string) {
    return this.meetingService.getAcceptMeetingList(userId);
  }

  @ApiOperation({ summary: '내가 수락하지 않은 모닥불 리스트 조회 API' })
  @ApiBearerAuth()
  @ApiResponse({ type: [PendingMeetingResDto] })
  @Get('pending')
  async getPendingMeetingList(@CurrentUser() userId: string) {
    return this.meetingService.getPendingMeetingList(userId);
  }

  @ApiOperation({ summary: '약속 상세 조회 API' })
  @ApiBearerAuth()
  @ApiResponse({ type: DetailMeetingResDto })
  @Get(':id')
  async getOneMeeting(@Param() param: MeetingIdReqDto, @CurrentUser() userId: string) {
    return this.meetingService.getOneMeeting(param.id, userId);
  }

  @ApiOperation({ summary: 'USER ID로 미팅 생성 API' })
  @ApiBearerAuth()
  @Post('friendId')
  async createMeeting(@Body() createMeetingDto: CreateMeetingReqDto, @CurrentUser() userId: string): Promise<Meeting> {
    return this.meetingService.createMeeting(createMeetingDto, userId);
  }

  @ApiOperation({ summary: 'GROUP ID로 미팅 생성 API' })
  @ApiBearerAuth()
  @Post('groupId')
  async createMeetingGroup(@Body() createMeetingGroupDto: CreateMeetingGroupReqDto, @CurrentUser() userId: string) {
    return this.meetingService.createMeetingGroup(createMeetingGroupDto, userId);
  }

  @ApiOperation({ summary: '미팅 수락 API' })
  @ApiBearerAuth()
  @ApiResponse({ type: MeetingAcceptResDto })
  @Post('accept')
  async acceptMeeting(@Body() acceptMeetingReqDto: ChangeStatusMeetingReqDto, @CurrentUser() userId: string) {
    return this.meetingService.acceptMeeting(acceptMeetingReqDto, userId);
  }

  @ApiOperation({ summary: '미팅 참여했다가  취소 API' })
  @ApiBearerAuth()
  @Post('cancel/:id')
  async cancelMeeting(@CurrentUser() userId: string, @Param() param: MeetingIdReqDto) {
    return this.meetingService.cancelMeeting(userId, param.id);
  }

  @ApiOperation({ summary: '호스트 미팅삭제 API' })
  @ApiBearerAuth()
  @Delete(':id')
  async deleteMeeting(@CurrentUser() userId: string, @Param() param: MeetingIdReqDto): Promise<void> {
    return this.meetingService.deleteMeeting(userId, param.id);
  }
}
