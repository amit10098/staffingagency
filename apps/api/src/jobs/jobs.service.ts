import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from '../common/decorators/current-user.decorator';
import { UserRole } from 'database';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    // Resolve or create sector by name
    let sectorId = data.sectorId;
    if (!sectorId && data.sector) {
      const sectorName = String(data.sector).trim();
      const existing = await this.prisma.sector.findFirst({ where: { name: { equals: sectorName, mode: 'insensitive' } } });
      if (existing) {
        sectorId = existing.id;
      } else {
        const created = await this.prisma.sector.create({ data: { name: sectorName } });
        sectorId = created.id;
      }
    }

    // Resolve companyId — fall back to first company if not supplied
    let companyId = data.companyId;
    if (!companyId) {
      const firstCompany = await this.prisma.company.findFirst();
      if (!firstCompany) throw new Error('No company found. Please create a company first.');
      companyId = firstCompany.id;
    }

    // Resolve sectorId — fall back to first sector if still not resolved
    if (!sectorId) {
      const firstSector = await this.prisma.sector.findFirst();
      if (!firstSector) {
        const fallback = await this.prisma.sector.create({ data: { name: 'General' } });
        sectorId = fallback.id;
      } else {
        sectorId = firstSector.id;
      }
    }

    return this.prisma.job.create({
      data: {
        title: data.title,
        description: data.description || '',
        requirements: data.requirements || '',
        payRate: typeof data.payRate === 'number' ? data.payRate : parseFloat(data.payRate) || 12.21,
        location: data.location || 'TBC',
        workersNeeded: data.workersNeeded || 1,
        sectorId,
        companyId,
        status: 'OPEN',
      },
      include: { sector: true, company: true },
    });
  }

  async findAll(user: AuthUser) {
    if (user.role === UserRole.EMPLOYEE) {
      const profile = await this.prisma.profile.findUnique({
        where: { userId: user.userId },
      });
      if (!profile) return [];

      const shifts = await this.prisma.shift.findMany({
        where: { workerId: profile.id },
        select: { jobId: true },
      });
      const jobIds = [...new Set(shifts.map((s) => s.jobId))];
      if (!jobIds.length) return [];

      return this.prisma.job.findMany({
        where: { id: { in: jobIds } },
        include: { sector: true, company: true, shifts: { where: { workerId: profile.id } } },
      });
    }

    if (user.role === UserRole.EMPLOYER) {
      const employer = await this.prisma.user.findUnique({
        where: { id: user.userId },
        select: { companyId: true },
      });
      if (!employer?.companyId) return [];
      return this.prisma.job.findMany({
        where: { companyId: employer.companyId },
        include: { sector: true, company: true },
      });
    }

    return this.prisma.job.findMany({ include: { sector: true, company: true } });
  }

  async findOne(id: string, user: AuthUser) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: { sector: true, company: true, shifts: true },
    });
    if (!job) throw new NotFoundException('Job not found');

    if (user.role === UserRole.EMPLOYEE) {
      const profile = await this.prisma.profile.findUnique({
        where: { userId: user.userId },
      });
      const hasShift = job.shifts.some((s) => s.workerId === profile?.id);
      if (!hasShift) throw new ForbiddenException('Access denied');
    }

    if (user.role === UserRole.EMPLOYER) {
      const employer = await this.prisma.user.findUnique({
        where: { id: user.userId },
        select: { companyId: true },
      });
      if (employer?.companyId !== job.companyId) {
        throw new ForbiddenException('Access denied');
      }
    }

    return job;
  }

  async update(id: string, data: any) {
    const updateData: any = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.requirements !== undefined) updateData.requirements = data.requirements;
    if (data.payRate !== undefined) updateData.payRate = typeof data.payRate === 'number' ? data.payRate : parseFloat(data.payRate);
    if (data.location !== undefined) updateData.location = data.location;
    if (data.workersNeeded !== undefined) updateData.workersNeeded = data.workersNeeded;

    // Resolve sector by name if provided
    if (data.sector && !data.sectorId) {
      const sectorName = String(data.sector).trim();
      const existing = await this.prisma.sector.findFirst({
        where: { name: { equals: sectorName, mode: 'insensitive' } },
      });
      if (existing) {
        updateData.sectorId = existing.id;
      } else {
        const created = await this.prisma.sector.create({ data: { name: sectorName } });
        updateData.sectorId = created.id;
      }
    } else if (data.sectorId) {
      updateData.sectorId = data.sectorId;
    }

    return this.prisma.job.update({
      where: { id },
      data: updateData,
      include: { sector: true, company: true },
    });
  }

  async remove(id: string) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        // 1. Find all shift IDs belonging to this job
        const shifts = await tx.shift.findMany({
          where: { jobId: id },
          select: { id: true },
        });
        const shiftIds = shifts.map((s) => s.id);

        // 2. Delete Attendance records for those shifts (no cascade in schema)
        if (shiftIds.length > 0) {
          await tx.attendance.deleteMany({ where: { shiftId: { in: shiftIds } } });
        }

        // 3. Delete Shifts belonging to this job
        await tx.shift.deleteMany({ where: { jobId: id } });

        // 4. Finally delete the Job itself
        return tx.job.delete({ where: { id } });
      });
    } catch (err: any) {
      // P2025 = record not found in Prisma
      if (err?.code === 'P2025') {
        throw new NotFoundException(`Job with id "${id}" not found`);
      }
      throw err;
    }
  }
}
