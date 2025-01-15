import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { initializeApp } from 'firebase-admin/app';

@Injectable()
export class FcmService {
  constructor() {
    if (!admin.apps.length) {
      const serviceAccount = JSON.parse(readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS, 'utf8'));
      initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
    }
  }

  async sendPushNotification(
    tokens: string[],
    payload: { title: string; body: string; data?: Record<string, string> },
  ): Promise<void> {
    try {
      for (const token of tokens) {
        console.log(`토큰목록록록록록록: ${tokens}`);
        const message = {
          notification: {
            title: payload.title,
            body: payload.body,
          },
          data: payload.data || {},
          token,
        };

        try {
          // 개별 토큰에 대해 메시지 전송
          await admin.messaging().send(message);
          console.log(`FCM Notification sent to token: ${token}`);
        } catch (error) {
          // 유효하지 않은 토큰일 경우
          if (error.code === 'messaging/registration-token-not-registered') {
            console.log(`Invalid token: ${token}. Skipping.`);
          } else {
            // 다른 오류 처리
            console.error(`Error sending to token ${token}:`, error);
          }
        }
      }

      console.log('FCM Notifications processed successfully!');
    } catch (error) {
      console.error('Error processing FCM Notifications:', error);
    }
  }
}
