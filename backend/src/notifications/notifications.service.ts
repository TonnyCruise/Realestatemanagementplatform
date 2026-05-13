import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createSign } from 'crypto';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async create(userId: string, dto: Omit<CreateNotificationDto, 'userId'>) {
    return this.prisma.notification.create({
      data: {
        userId,
        title: dto.title,
        body: dto.body,
        type: dto.type,
        data: dto.data ?? undefined,
      },
    });
  }

  async findByUser(userId: string, onlyUnread = false) {
    return this.prisma.notification.findMany({
      where: { userId, ...(onlyUnread && { isRead: false }) },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async markRead(notificationId: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true },
    });
  }

  async markAllRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async sendSms(phone: string, message: string): Promise<void> {
    const apiKey = this.config.get<string>('AT_API_KEY', '');
    const username = this.config.get<string>('AT_USERNAME', 'sandbox');
    const from = this.config.get<string>('AT_SENDER_ID', 'NestEA');

    if (!apiKey || apiKey === 'placeholder') {
      console.log(`[SMS stub] To: ${phone} | ${message}`);
      return;
    }

    try {
      await axios.post(
        'https://api.africastalking.com/version1/messaging',
        new URLSearchParams({ username, to: phone, message, from }).toString(),
        {
          headers: {
            apiKey,
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );
    } catch (err: any) {
      console.error('[SMS] Failed:', err?.message);
    }
  }

  async sendPush(userId: string, title: string, body: string): Promise<void> {
    const projectId = this.config.get<string>('FIREBASE_PROJECT_ID', '');
    const rawKey = this.config.get<string>('FIREBASE_PRIVATE_KEY', '');
    const clientEmail = this.config.get<string>('FIREBASE_CLIENT_EMAIL', '');

    if (!projectId || projectId === 'placeholder') {
      console.log(`[PUSH stub] userId=${userId} | ${title}`);
      return;
    }

    try {
      // Service account private key may have escaped newlines from .env
      const privateKey = rawKey.replace(/\\n/g, '\n');

      // Build service account JWT for FCM v1
      const now = Math.floor(Date.now() / 1000);
      const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
      const claims = {
        iss: clientEmail,
        sub: clientEmail,
        aud: 'https://oauth2.googleapis.com/token',
        iat: now,
        exp: now + 3600,
        scope: 'https://www.googleapis.com/auth/firebase.messaging',
      };
      const payload = Buffer.from(JSON.stringify(claims)).toString('base64url');
      const signer = createSign('RSA-SHA256');
      signer.update(`${header}.${payload}`);
      const signature = signer.sign(privateKey, 'base64url');
      const assertion = `${header}.${payload}.${signature}`;

      // Exchange assertion for OAuth2 access token
      const tokenRes = await axios.post(
        'https://oauth2.googleapis.com/token',
        new URLSearchParams({
          grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
          assertion,
        }).toString(),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );

      // Send FCM v1 message — subscribe device tokens via topic = userId
      await axios.post(
        `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
        { message: { topic: userId, notification: { title, body } } },
        { headers: { Authorization: `Bearer ${tokenRes.data.access_token}` } },
      );
    } catch (err: any) {
      console.error('[PUSH] Failed:', err?.message);
    }
  }
}
