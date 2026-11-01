"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var NotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let NotificationsService = NotificationsService_1 = class NotificationsService {
    prisma;
    logger = new common_1.Logger(NotificationsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createInApp(userId, title, message, type = 'info', metadata) {
        return this.prisma.notification.create({
            data: {
                userId,
                title,
                message,
                type,
                metadata: metadata ? metadata : undefined,
            },
        });
    }
    async createRotaAssignmentNotifications(workerUserIds, details) {
        const notifications = await Promise.all(workerUserIds.map(({ userId }) => this.createInApp(userId, 'New Rota Assigned', `You have been assigned a shift at ${details.companyName} on ${details.shiftDate} (${details.shiftTime})${details.location ? ` at ${details.location}` : ''}.`, 'info', details)));
        for (const { userId } of workerUserIds) {
            await this.sendPush(userId, 'New Rota Assigned', `Shift at ${details.companyName} on ${details.shiftDate}`);
        }
        return notifications;
    }
    async getForUser(userId) {
        return this.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async markAsRead(id, userId) {
        return this.prisma.notification.updateMany({
            where: { id, userId },
            data: { isRead: true },
        });
    }
    async markAllAsRead(userId) {
        return this.prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true },
        });
    }
    async sendEmail(to, subject, content) {
        this.logger.log(`[EMAIL MOCK] To: ${to} | Subject: ${subject}`);
        return { success: true, messageId: `msg-${Date.now()}` };
    }
    async sendSms(to, message) {
        this.logger.log(`[SMS MOCK] To: ${to} | Content: ${message}`);
        return { success: true, sid: `sid-${Date.now()}` };
    }
    async sendPush(userId, title, body) {
        this.logger.log(`[PUSH MOCK] User: ${userId} | Title: ${title}`);
        return { success: true };
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map