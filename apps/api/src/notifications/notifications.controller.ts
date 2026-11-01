import { Controller, Post, Get, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/decorators/current-user.decorator';
import { UserRole } from 'database';

@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('me')
  getMyNotifications(@CurrentUser() user: AuthUser) {
    return this.notificationsService.getForUser(user.userId);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.notificationsService.markAsRead(id, user.userId);
  }

  @Patch('read-all')
  markAllAsRead(@CurrentUser() user: AuthUser) {
    return this.notificationsService.markAllAsRead(user.userId);
  }

  @Post('email')
  @Roles(UserRole.SUPER_ADMIN)
  sendEmail(@Body() data: { to: string; subject: string; content: string }) {
    return this.notificationsService.sendEmail(data.to, data.subject, data.content);
  }

  @Post('sms')
  @Roles(UserRole.SUPER_ADMIN)
  sendSms(@Body() data: { to: string; message: string }) {
    return this.notificationsService.sendSms(data.to, data.message);
  }

  @Post('push')
  @Roles(UserRole.SUPER_ADMIN)
  sendPush(@Body() data: { userId: string; title: string; body: string }) {
    return this.notificationsService.sendPush(data.userId, data.title, data.body);
  }
}
