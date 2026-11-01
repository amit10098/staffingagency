import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { AuthUser } from '../common/decorators/current-user.decorator';
import { UserRole } from 'database';

function formatDate(date: Date) {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
}

@Injectable()
export class ShiftsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async create(data: any) {
    return this.prisma.shift.create({ data });
  }

  async findByCompany(companyId: string) {
    return this.prisma.shift.findMany({
      where: { job: { companyId } },
      include: {
        job: { include: { company: true, sector: true } },
        worker: { include: { user: true } },
        attendance: true,
      },
      orderBy: { startTime: 'asc' },
    });
  }

  async updateShift(id: string, data: { startTime?: string; endTime?: string; notes?: string; breakTime?: number; status?: string }) {
    const update: any = {};
    if (data.startTime) update.startTime = new Date(data.startTime);
    if (data.endTime) update.endTime = new Date(data.endTime);
    if (data.notes !== undefined) update.notes = data.notes;
    if (data.breakTime !== undefined) update.breakTime = data.breakTime;
    if (data.status) update.status = data.status;
    return this.prisma.shift.update({
      where: { id },
      data: update,
      include: { job: { include: { company: true } }, worker: { include: { user: true } } },
    });
  }

  async deleteShift(id: string) {
    // Delete attendance record first (FK constraint)
    await this.prisma.attendance.deleteMany({ where: { shiftId: id } });
    return this.prisma.shift.delete({ where: { id } });
  }

  async findAll(user: AuthUser) {
    if (user.role === UserRole.EMPLOYEE) {
      return this.findForEmployee(user.userId);
    }
    if (user.role === UserRole.EMPLOYER) {
      const employer = await this.prisma.user.findUnique({
        where: { id: user.userId },
        select: { companyId: true },
      });
      if (!employer?.companyId) return [];
      return this.prisma.shift.findMany({
        where: { job: { companyId: employer.companyId } },
        include: {
          job: { include: { company: true, sector: true } },
          worker: { include: { user: true } },
          attendance: true,
        },
        orderBy: { startTime: 'asc' },
      });
    }
    return this.prisma.shift.findMany({
      include: {
        job: { include: { company: true, sector: true } },
        worker: { include: { user: true } },
        attendance: true,
      },
      orderBy: { startTime: 'asc' },
    });
  }

  async findForEmployee(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });
    if (!profile) return [];

    return this.prisma.shift.findMany({
      where: { workerId: profile.id },
      include: {
        job: { include: { company: true, sector: true } },
        attendance: true,
      },
      orderBy: { startTime: 'asc' },
    });
  }

  async assignWorker(shiftId: string, workerId: string) {
    const shift = await this.prisma.shift.findUnique({
      where: { id: shiftId },
      include: { job: { include: { company: true } } },
    });
    if (!shift) throw new NotFoundException('Shift not found');

    const updated = await this.prisma.shift.update({
      where: { id: shiftId },
      data: { workerId, status: 'ASSIGNED' },
      include: { worker: { include: { user: true } }, job: { include: { company: true } } },
    });

    if (updated.worker?.user) {
      await this.notificationsService.createRotaAssignmentNotifications(
        [{ userId: updated.worker.user.id, profileId: workerId }],
        {
          companyName: updated.job.company.name,
          shiftDate: formatDate(updated.startTime),
          shiftTime: `${formatTime(updated.startTime)}–${formatTime(updated.endTime)}`,
          location: updated.job.location,
        },
      );
    }

    return updated;
  }

  async publishRota(data: {
    companyId: string;
    date: string;
    startTime: string;
    endTime: string;
    workerIds: string[];
    breakTime?: number;
    notes?: string;
    location?: string;
    title?: string;
  }) {
    const { companyId, date, startTime, endTime, workerIds, breakTime, notes, location, title } =
      data;

    if (!workerIds?.length) {
      throw new BadRequestException('At least one worker must be selected');
    }

    const company = await this.prisma.company.findUnique({ where: { id: companyId } });
    if (!company) throw new NotFoundException('Company not found');

    const sector = await this.prisma.sector.findFirst();
    if (!sector) throw new BadRequestException('No sector configured. Run database seed.');

    const startDateTime = new Date(`${date}T${startTime}:00`);
    const endDateTime = new Date(`${date}T${endTime}:00`);

    const job = await this.prisma.job.create({
      data: {
        title: title || `Rota - ${company.name}`,
        description: notes || `Shift at ${company.name}`,
        requirements: 'As assigned',
        payRate: 12.21,
        location: location || company.address || company.name,
        workersNeeded: workerIds.length,
        sectorId: sector.id,
        companyId,
      },
    });

    const shifts = await Promise.all(
      workerIds.map((workerId) =>
        this.prisma.shift.create({
          data: {
            jobId: job.id,
            startTime: startDateTime,
            endTime: endDateTime,
            workerId,
            status: 'ASSIGNED',
            breakTime: breakTime ?? 0,
            notes,
          },
          include: { worker: { include: { user: true } } },
        }),
      ),
    );

    const workerUsers = await this.prisma.profile.findMany({
      where: { id: { in: workerIds } },
      select: { id: true, userId: true },
    });

    await this.notificationsService.createRotaAssignmentNotifications(
      workerUsers.map((w) => ({ userId: w.userId, profileId: w.id })),
      {
        companyName: company.name,
        shiftDate: formatDate(startDateTime),
        shiftTime: `${startTime}–${endTime}`,
        location: location || company.address || undefined,
      },
    );

    return { job, shifts };
  }

  async clockIn(shiftId: string, userId: string, gps: string, deviceInfo: string) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) throw new ForbiddenException('Employee profile not found');

    const shift = await this.prisma.shift.findUnique({ where: { id: shiftId } });
    if (!shift || shift.workerId !== profile.id) {
      throw new ForbiddenException('You can only clock in to your own shifts');
    }

    const existing = await this.prisma.attendance.findUnique({ where: { shiftId } });
    if (existing?.clockInTime) {
      throw new BadRequestException('Already clocked in');
    }

    return this.prisma.attendance.upsert({
      where: { shiftId },
      create: {
        shiftId,
        clockInTime: new Date(),
        clockInGps: gps,
        deviceInfo,
      },
      update: {
        clockInTime: new Date(),
        clockInGps: gps,
        deviceInfo,
      },
    });
  }

  async clockOut(shiftId: string, userId: string, gps: string) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) throw new ForbiddenException('Employee profile not found');

    const shift = await this.prisma.shift.findUnique({ where: { id: shiftId } });
    if (!shift || shift.workerId !== profile.id) {
      throw new ForbiddenException('You can only clock out of your own shifts');
    }

    const attendance = await this.prisma.attendance.findUnique({ where: { shiftId } });
    if (!attendance?.clockInTime) {
      throw new BadRequestException('Must clock in before clocking out');
    }

    return this.prisma.attendance.update({
      where: { shiftId },
      data: {
        clockOutTime: new Date(),
        clockOutGps: gps,
      },
    });
  }

  // ─── Attendance Approval ─────────────────────────────────────────────────────

  async getAttendanceByCompany(companyId?: string) {
    const where = companyId
      ? { shift: { job: { companyId } } }
      : {};

    return this.prisma.attendance.findMany({
      where,
      include: {
        shift: {
          include: {
            job: { include: { company: true } },
            worker: { include: { user: true } },
          },
        },
      },
      orderBy: { shift: { startTime: 'desc' } },
    });
  }

  async approveAttendance(id: string) {
    return this.prisma.attendance.update({
      where: { id },
      data: { approvalStatus: 'APPROVED' },
    });
  }

  async flagAttendance(id: string) {
    return this.prisma.attendance.update({
      where: { id },
      data: { approvalStatus: 'FLAGGED' },
    });
  }

  async updateAttendanceTimes(
    id: string,
    data: { clockInTime?: string; clockOutTime?: string },
  ) {
    const update: any = { approvalStatus: 'MODIFIED' };
    if (data.clockInTime) update.clockInTime = new Date(data.clockInTime);
    if (data.clockOutTime) update.clockOutTime = new Date(data.clockOutTime);
    return this.prisma.attendance.update({ where: { id }, data: update });
  }
}
