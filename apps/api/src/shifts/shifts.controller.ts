import { Controller, Get, Post, Patch, Delete, Body, Param, Put, UseGuards, Query } from '@nestjs/common';
import { ShiftsService } from './shifts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/decorators/current-user.decorator';
import { UserRole } from 'database';

@Controller('shifts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.EMPLOYER)
  create(@Body() data: any) {
    return this.shiftsService.create(data);
  }

  @Post('rota')
  @Roles(UserRole.SUPER_ADMIN, UserRole.EMPLOYER)
  publishRota(@Body() data: any) {
    return this.shiftsService.publishRota(data);
  }

  @Get()
  findAll(@CurrentUser() user: AuthUser, @Query('companyId') companyId?: string) {
    if (companyId) return this.shiftsService.findByCompany(companyId);
    return this.shiftsService.findAll(user);
  }

  @Get('me')
  @Roles(UserRole.EMPLOYEE)
  findMine(@CurrentUser() user: AuthUser) {
    return this.shiftsService.findForEmployee(user.userId);
  }

  // ─── Attendance Approval Endpoints ─────────────────────────────────────────

  @Get('attendance')
  @Roles(UserRole.SUPER_ADMIN, UserRole.EMPLOYER)
  getAttendance(@Query('companyId') companyId?: string) {
    return this.shiftsService.getAttendanceByCompany(companyId);
  }

  @Patch('attendance/:id/approve')
  @Roles(UserRole.SUPER_ADMIN, UserRole.EMPLOYER)
  approveAttendance(@Param('id') id: string) {
    return this.shiftsService.approveAttendance(id);
  }

  @Patch('attendance/:id/flag')
  @Roles(UserRole.SUPER_ADMIN, UserRole.EMPLOYER)
  flagAttendance(@Param('id') id: string) {
    return this.shiftsService.flagAttendance(id);
  }

  @Patch('attendance/:id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.EMPLOYER)
  updateAttendanceTimes(
    @Param('id') id: string,
    @Body() data: { clockInTime?: string; clockOutTime?: string },
  ) {
    return this.shiftsService.updateAttendanceTimes(id, data);
  }

  // ─── Shift CRUD ─────────────────────────────────────────────────────────────

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.EMPLOYER)
  updateShift(@Param('id') id: string, @Body() data: any) {
    return this.shiftsService.updateShift(id, data);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.EMPLOYER)
  deleteShift(@Param('id') id: string) {
    return this.shiftsService.deleteShift(id);
  }

  @Put(':id/assign')
  @Roles(UserRole.SUPER_ADMIN, UserRole.EMPLOYER)
  assignWorker(@Param('id') id: string, @Body('workerId') workerId: string) {
    return this.shiftsService.assignWorker(id, workerId);
  }

  @Post(':id/clock-in')
  @Roles(UserRole.EMPLOYEE)
  clockIn(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
    @Body('gps') gps: string,
    @Body('deviceInfo') deviceInfo: string,
  ) {
    return this.shiftsService.clockIn(id, user.userId, gps, deviceInfo);
  }

  @Post(':id/clock-out')
  @Roles(UserRole.EMPLOYEE)
  clockOut(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
    @Body('gps') gps: string,
  ) {
    return this.shiftsService.clockOut(id, user.userId, gps);
  }
}
