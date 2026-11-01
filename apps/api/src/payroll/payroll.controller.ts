import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Query,
  Res,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { PayrollService } from './payroll.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/decorators/current-user.decorator';
import { UserRole } from 'database';

@Controller('payroll')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Get('me')
  @Roles(UserRole.EMPLOYEE)
  getMyPayslips(@CurrentUser() user: AuthUser) {
    return this.payrollService.getPayslips(user);
  }

  @Get('payslips')
  @Roles(UserRole.SUPER_ADMIN, UserRole.EMPLOYER)
  getAllPayslips(@Query('workerId') workerId?: string) {
    return this.payrollService.getPayslips({ userId: '', email: '', role: UserRole.SUPER_ADMIN }, workerId);
  }

  @Post('upload')
  @Roles(UserRole.SUPER_ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  uploadPayslip(
    @CurrentUser() user: AuthUser,
    @Body() data: any,
    @UploadedFile() file?: any,
  ) {
    return this.payrollService.uploadPayslip(
      user,
      {
        profileId: data.profileId,
        period: data.period,
        month: Number(data.month),
        year: Number(data.year),
        grossPay: Number(data.grossPay),
        netPay: Number(data.netPay),
        hoursWorked: data.hoursWorked ? Number(data.hoursWorked) : undefined,
      },
      file,
    );
  }

  @Get('payslips/:id/download')
  async downloadPayslip(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
    @Res() res: Response,
  ) {
    const { filepath, filename } = await this.payrollService.getPayslipFile(id, user);
    return res.download(filepath, filename);
  }

  @Get(':workerId')
  @Roles(UserRole.SUPER_ADMIN, UserRole.EMPLOYEE)
  getPayroll(
    @Param('workerId') workerId: string,
    @CurrentUser() user: AuthUser,
    @Query('month') month: number,
    @Query('year') year: number,
  ) {
    if (user.role === UserRole.EMPLOYEE) {
      return this.payrollService.getPayslips(user);
    }
    return this.payrollService.calculatePayroll(workerId, month, year);
  }
}
