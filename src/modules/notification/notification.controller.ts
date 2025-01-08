import { Controller, Get, Sse } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { SseService } from './sse.service';
import { map } from 'rxjs/operators';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('notification')
@ApiTags('NOTIFICATION')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly sseService: SseService,
  ) {}

  @ApiOperation({ summary: '알람 리스트 조회 API' })
  @ApiBearerAuth()
  @ApiResponse({})
  @Get('notification-list')
  async getFriends(@CurrentUser() sourceId: string) {
    return await this.notificationService.notificationList(sourceId);
  }

  @ApiOperation({ summary: 'SSE 알람구독' })
  @ApiBearerAuth()
  @Sse('sse')
  subscribe(@CurrentUser() id: string): Observable<MessageEvent> {
    return this.sseService.addClient(id).pipe(map((data) => ({ data }) as MessageEvent));
  }
}
