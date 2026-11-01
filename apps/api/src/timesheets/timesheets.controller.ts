import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { TimesheetsService } from './timesheets.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from 'database';

@Controller('timesheets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TimesheetsController {
  constructor(private readonly timesheetsService: TimesheetsService) {}

  @Get('generate')
  @Roles(UserRole.SUPER_ADMIN, UserRole.EMPLOYER)
  generate(
    @Query('workerId') workerId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.timesheetsService.generateFromShifts(workerId, new Date(startDate), new Date(endDate));
  }
}
