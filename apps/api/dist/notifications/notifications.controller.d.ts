import { NotificationsService } from './notifications.service';
import type { AuthUser } from '../common/decorators/current-user.decorator';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getMyNotifications(user: AuthUser): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        message: string;
        type: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        isRead: boolean;
    }[]>;
    markAsRead(id: string, user: AuthUser): Promise<import("database").Prisma.BatchPayload>;
    markAllAsRead(user: AuthUser): Promise<import("database").Prisma.BatchPayload>;
    sendEmail(data: {
        to: string;
        subject: string;
        content: string;
    }): Promise<{
        success: boolean;
        messageId: string;
    }>;
    sendSms(data: {
        to: string;
        message: string;
    }): Promise<{
        success: boolean;
        sid: string;
    }>;
    sendPush(data: {
        userId: string;
        title: string;
        body: string;
    }): Promise<{
        success: boolean;
    }>;
}
