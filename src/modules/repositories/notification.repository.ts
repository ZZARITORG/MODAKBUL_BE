import { Injectable, Logger } from '@nestjs/common';
import { Meeting } from 'src/common/db/entities/meeting.entity';
import { Notification, NotificationType } from 'src/common/db/entities/notification.entitiy';
import { User } from 'src/common/db/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { NotificationInfoDto } from '../notification/dtos/notification-info-dto';
export const NOTIFICATION_REPO = 'NOTIFICATION_REPO';

@Injectable()
export class NotificationRepository extends Repository<Notification> {
  private readonly logger = new Logger(NotificationRepository.name);
  private readonly meetingRepo: Repository<Meeting>;

  constructor(private dataSource: DataSource) {
    super(Notification, dataSource.createEntityManager());
    this.meetingRepo = dataSource.getRepository(Meeting);
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

  async getNotification(userId: string): Promise<NotificationInfoDto[]> {
    const sourceUser = await this.dataSource.getRepository(User).findOne({ where: { id: userId } });

    const notifications = await this.find({
      where: { targetUser: { id: sourceUser.id } },
      relations: ['sourceUser'], // 알림을 보낸 사용자 정보도 가져오기
    });

    const notificationInfos = notifications.map((notification) => {
      return {
        id: notification.id,
        type: notification.type,
        sourceUserId: notification.sourceUser.userId,
        createdAt: notification.createdAt,
        sourceUserName: notification.sourceUser.name,
      };
    });

    return notificationInfos; // 친구 정보 반환
  }

  // 10분마다 30~40분 후 미팅 있는 유저들에게 알림전송
  // @Cron('*/20 * * * * *')
  // async comingMeetings() {
  //   const thirtyMinutesLater = new Date();
  //   const fortyMinutesLater = new Date();
  //   thirtyMinutesLater.setMinutes(thirtyMinutesLater.getMinutes() + 30);
  //   fortyMinutesLater.setMinutes(fortyMinutesLater.getMinutes() + 40);

  //   const meetings = await this.meetingRepo
  //     .createQueryBuilder('meeting')
  //     .leftJoinAndSelect(
  //       'meeting.userMeetingRelations',
  //       'userMeeting',
  //       'userMeeting.status = :status', // JOIN 조건에 status 추가
  //       { status: MeetingStatus.ACCEPTED },
  //     )
  //     .leftJoinAndSelect('userMeeting.user', 'user')
  //     .where('meeting.date >= :thirtyMinutesLater AND meeting.date < :fortyMinutesLater', {
  //       thirtyMinutesLater,
  //       fortyMinutesLater,
  //     })
  //     .select(['meeting.id', 'meeting.hostId', 'userMeeting.id', 'user.id'])
  //     .getMany();

  //   meetings.map((meeting) => {
  //     meeting.userMeetingRelations.map((userMeeting) => {
  //       this.save({
  //         type: NotificationType.MEETING_ALARM,
  //         sourceUser: { id: meeting.hostId },
  //         targetUser: { id: userMeeting.user.id },
  //         meetingId: meeting.id,
  //       });
  //     });
  //   });
  // }
}
