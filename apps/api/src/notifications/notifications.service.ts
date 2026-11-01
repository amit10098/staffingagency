import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private prisma: PrismaService) {}

  async createInApp(
    userId: string,
    title: string,
    message: string,
    type = 'info',
    metadata?: Record<string, unknown>,
  ) {
    return this.prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        metadata: metadata ? (metadata as object) : undefined,
      },
    });
  }

  async createRotaAssignmentNotifications(
    workerUserIds: { userId: string; profileId: string }[],
    details: {
      companyName: string;
      shiftDate: string;
      shiftTime: string;
      location?: string;
    },
  ) {
    const notifications = await Promise.all(
      workerUserIds.map(({ userId }) =>
        this.createInApp(
          userId,
          'New Rota Assigned',
          `You have been assigned a shift at ${details.companyName} on ${details.shiftDate} (${details.shiftTime})${details.location ? ` at ${details.location}` : ''}.`,
          'info',
          details,
        ),
      ),
    );

    for (const { userId } of workerUserIds) {
      await this.sendPush(userId, 'New Rota Assigned', `Shift at ${details.companyName} on ${details.shiftDate}`);
    }

    return notifications;
  }

  async getForUser(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(id: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async sendEmail(to: string, subject: string, content: string) {
    this.logger.log(`[EMAIL MOCK] To: ${to} | Subject: ${subject}`);
    return { success: true, messageId: `msg-${Date.now()}` };
  }

  async sendSms(to: string, message: string) {
    this.logger.log(`[SMS MOCK] To: ${to} | Content: ${message}`);
    return { success: true, sid: `sid-${Date.now()}` };
  }

  async sendPush(userId: string, title: string, body: string) {
    this.logger.log(`[PUSH MOCK] User: ${userId} | Title: ${title}`);
    return { success: true };
  }
}
