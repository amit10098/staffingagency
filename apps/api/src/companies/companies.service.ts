import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.company.create({ data });
  }

  async findAll() {
    return this.prisma.company.findMany({ include: { users: true, jobs: true } });
  }

  async findForEmployer(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { companyId: true },
    });
    if (!user?.companyId) return [];
    const company = await this.prisma.company.findUnique({
      where: { id: user.companyId },
      include: { users: true, jobs: true },
    });
    return company ? [company] : [];
  }

  async findOne(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: { users: true, jobs: true },
    });
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async update(id: string, data: any) {
    return this.prisma.company.update({ where: { id }, data });
  }

  async remove(id: string) {
    const company = await this.prisma.company.findUnique({ where: { id } });
    if (!company) throw new NotFoundException('Company not found');

    return this.prisma.$transaction(async (tx) => {
      // Get all jobs for this company
      const jobs = await tx.job.findMany({ where: { companyId: id }, select: { id: true } });
      const jobIds = jobs.map((j) => j.id);

      // Get all shifts for those jobs
      const shifts = await tx.shift.findMany({
        where: { jobId: { in: jobIds } },
        select: { id: true },
      });
      const shiftIds = shifts.map((s) => s.id);

      // Delete in dependency order
      await tx.attendance.deleteMany({ where: { shiftId: { in: shiftIds } } });
      await tx.shift.deleteMany({ where: { id: { in: shiftIds } } });
      await tx.job.deleteMany({ where: { id: { in: jobIds } } });

      // Unlink users from this company (don't delete the users)
      await tx.user.updateMany({ where: { companyId: id }, data: { companyId: null } });

      return tx.company.delete({ where: { id } });
    });
  }
}
