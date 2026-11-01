import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from '../common/decorators/current-user.decorator';
import { UserRole } from 'database';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PayrollService {
  private uploadDir = path.join(process.cwd(), 'uploads', 'payslips');

  constructor(private prisma: PrismaService) {
    fs.mkdirSync(this.uploadDir, { recursive: true });
  }

  async getPayslips(user: AuthUser, workerId?: string) {
    if (user.role === UserRole.EMPLOYEE) {
      const profile = await this.prisma.profile.findUnique({
        where: { userId: user.userId },
      });
      if (!profile) return [];
      return this.prisma.payslip.findMany({
        where: { profileId: profile.id },
        orderBy: [{ year: 'desc' }, { month: 'desc' }],
      });
    }

    if (workerId) {
      return this.prisma.payslip.findMany({
        where: { profileId: workerId },
        include: { profile: { select: { firstName: true, lastName: true } } },
        orderBy: [{ year: 'desc' }, { month: 'desc' }],
      });
    }

    return this.prisma.payslip.findMany({
      include: { profile: { select: { firstName: true, lastName: true } } },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });
  }

  async uploadPayslip(
    adminUser: AuthUser,
    data: {
      profileId: string;
      period: string;
      month: number;
      year: number;
      grossPay: number;
      netPay: number;
      hoursWorked?: number;
    },
    file?: any,
  ) {
    let fileUrl: string | undefined;
    if (file) {
      const filename = `${data.profileId}-${Date.now()}-${file.originalname}`;
      const filepath = path.join(this.uploadDir, filename);
      fs.writeFileSync(filepath, file.buffer);
      fileUrl = `/uploads/payslips/${filename}`;
    }

    return this.prisma.payslip.create({
      data: {
        profileId: data.profileId,
        period: data.period,
        month: data.month,
        year: data.year,
        grossPay: data.grossPay,
        netPay: data.netPay,
        hoursWorked: data.hoursWorked ?? 0,
        fileUrl,
        uploadedBy: adminUser.userId,
      },
    });
  }

  async getPayslipFile(id: string, user: AuthUser) {
    const payslip = await this.prisma.payslip.findUnique({
      where: { id },
      include: { profile: true },
    });
    if (!payslip) throw new NotFoundException('Payslip not found');

    if (user.role === UserRole.EMPLOYEE) {
      const profile = await this.prisma.profile.findUnique({
        where: { userId: user.userId },
      });
      if (!profile || payslip.profileId !== profile.id) {
        throw new ForbiddenException('Access denied');
      }
    }

    if (!payslip.fileUrl) throw new NotFoundException('No file attached');

    const filename = path.basename(payslip.fileUrl);
    const filepath = path.join(this.uploadDir, filename);
    if (!fs.existsSync(filepath)) throw new NotFoundException('File not found on disk');

    return { filepath, filename };
  }

  async calculatePayroll(workerId: string, month: number, year: number) {
    const payslips = await this.prisma.payslip.findMany({
      where: { profileId: workerId, month, year },
    });

    if (payslips.length) {
      const totalGross = payslips.reduce((sum, p) => sum + p.grossPay, 0);
      const totalNet = payslips.reduce((sum, p) => sum + p.netPay, 0);
      return {
        workerId,
        period: `${month}/${year}`,
        totalGross,
        holidayPay: totalGross * 0.1207,
        netPay: totalNet,
        payslips,
      };
    }

    const shifts = await this.prisma.shift.findMany({
      where: {
        workerId,
        status: 'COMPLETED',
        startTime: {
          gte: new Date(year, month - 1, 1),
          lt: new Date(year, month, 1),
        },
      },
      include: { job: true },
    });

    const totalHours = shifts.reduce((sum, shift) => {
      const hours = (shift.endTime.getTime() - shift.startTime.getTime()) / 3600000;
      return sum + hours;
    }, 0);

    const totalGross = shifts.reduce((sum, shift) => {
      const hours = (shift.endTime.getTime() - shift.startTime.getTime()) / 3600000;
      return sum + hours * shift.job.payRate;
    }, 0);

    return {
      workerId,
      period: `${month}/${year}`,
      totalGross: Math.round(totalGross * 100) / 100,
      holidayPay: Math.round(totalGross * 0.1207 * 100) / 100,
      netPay: Math.round(totalGross * 0.87 * 100) / 100,
      totalHours: Math.round(totalHours * 10) / 10,
    };
  }
}
