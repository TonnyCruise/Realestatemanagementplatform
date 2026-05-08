import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

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

  async markAllRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async sendSms(phone: string, message: string): Promise<void> {
    // TODO: Integrate Africa's Talking SMS API
    // const AT = require('africastalking')({ apiKey: process.env.AT_API_KEY, username: process.env.AT_USERNAME });
    // await AT.SMS.send({ to: [phone], message, from: process.env.AT_SENDER_ID });
    console.log(`[SMS] To: ${phone} | Message: ${message}`);
  }

  async sendPush(userId: string, title: string, body: string): Promise<void> {
    // TODO: Integrate Firebase Cloud Messaging (FCM) push notifications
    // Use FCM Admin SDK: admin.messaging().send({ notification: { title, body }, topic: userId });
    console.log(`[PUSH] userId=${userId} | title=${title} | body=${body}`);
  }
}
