import { Controller, Get, Put, Body, Param, UseGuards, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/decorators/current-user.decorator';
import { UserRole } from 'database';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.SUPER_ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('workers')
  @Roles(UserRole.SUPER_ADMIN, UserRole.EMPLOYER)
  findWorkers() {
    return this.usersService.findWorkers();
  }

  @Get('me')
  getMe(@CurrentUser() user: AuthUser) {
    return this.usersService.findOne(user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    if (user.role !== UserRole.SUPER_ADMIN && user.userId !== id) {
      throw new ForbiddenException('Access denied');
    }
    return this.usersService.findOne(id);
  }

  @Put(':id/profile')
  updateProfile(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
    @Body() data: any,
  ) {
    if (user.role !== UserRole.SUPER_ADMIN && user.userId !== id) {
      throw new ForbiddenException('Access denied');
    }
    return this.usersService.updateProfile(id, data);
  }
}
