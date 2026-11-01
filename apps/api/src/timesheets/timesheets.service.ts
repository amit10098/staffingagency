import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TimesheetsService {
  constructor(private prisma: PrismaService) {}

  async generateFromShifts(workerId: string, startDate: Date, endDate: Date) {
    const shifts = await this.prisma.shift.findMany({
      where: {
        workerId,
        startTime: { gte: startDate, lte: endDate },
        status: 'COMPLETED',
      },
      include: { attendance: true, job: true },
    });

    // logic to aggregate hours worked
    return shifts.map(shift => ({
      shiftId: shift.id,
      jobTitle: shift.job.title,
      hoursWorked: this.calculateHours(shift.attendance),
      payRate: shift.job.payRate,
    }));
  }

  private calculateHours(attendance: any) {
    if (!attendance || !attendance.clockInTime || !attendance.clockOutTime) return 0;
    const diff = attendance.clockOutTime.getTime() - attendance.clockInTime.getTime();
    return diff / (1000 * 60 * 60);
  }
}
