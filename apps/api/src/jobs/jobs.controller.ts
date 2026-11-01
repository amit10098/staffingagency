import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/decorators/current-user.decorator';
import { UserRole } from 'database';

@Controller('jobs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN)
  create(@Body() data: any) {
    return this.jobsService.create(data);
  }

  @Get()
  findAll(@CurrentUser() user: AuthUser) {
    return this.jobsService.findAll(user);
  }

  @Get('me')
  @Roles(UserRole.EMPLOYEE)
  findMine(@CurrentUser() user: AuthUser) {
    return this.jobsService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.jobsService.findOne(id, user);
  }

  @Put(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.EMPLOYER)
  update(@Param('id') id: string, @Body() data: any) {
    return this.jobsService.update(id, data);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.jobsService.remove(id);
  }
}
