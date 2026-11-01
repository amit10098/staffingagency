import { PrismaService } from '../prisma/prisma.service';
export declare class NotificationsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    createInApp(userId: string, title: string, message: string, type?: string, metadata?: Record<string, unknown>): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        message: string;
        type: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        isRead: boolean;
    }>;
    createRotaAssignmentNotifications(workerUserIds: {
        userId: string;
        profileId: string;
    }[], details: {
        companyName: string;
        shiftDate: string;
        shiftTime: string;
        location?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        message: string;
        type: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        isRead: boolean;
    }[]>;
    getForUser(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        message: string;
        type: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        isRead: boolean;
    }[]>;
    markAsRead(id: string, userId: string): Promise<import("database").Prisma.BatchPayload>;
    markAllAsRead(userId: string): Promise<import("database").Prisma.BatchPayload>;
    sendEmail(to: string, subject: string, content: string): Promise<{
        success: boolean;
        messageId: string;
    }>;
    sendSms(to: string, message: string): Promise<{
        success: boolean;
        sid: string;
    }>;
    sendPush(userId: string, title: string, body: string): Promise<{
        success: boolean;
    }>;
}
