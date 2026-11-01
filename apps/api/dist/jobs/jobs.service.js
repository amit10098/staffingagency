"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const database_1 = require("database");
let JobsService = class JobsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        let sectorId = data.sectorId;
        if (!sectorId && data.sector) {
            const sectorName = String(data.sector).trim();
            const existing = await this.prisma.sector.findFirst({ where: { name: { equals: sectorName, mode: 'insensitive' } } });
            if (existing) {
                sectorId = existing.id;
            }
            else {
                const created = await this.prisma.sector.create({ data: { name: sectorName } });
                sectorId = created.id;
            }
        }
        let companyId = data.companyId;
        if (!companyId) {
            const firstCompany = await this.prisma.company.findFirst();
            if (!firstCompany)
                throw new Error('No company found. Please create a company first.');
            companyId = firstCompany.id;
        }
        if (!sectorId) {
            const firstSector = await this.prisma.sector.findFirst();
            if (!firstSector) {
                const fallback = await this.prisma.sector.create({ data: { name: 'General' } });
                sectorId = fallback.id;
            }
            else {
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
    async findAll(user) {
        if (user.role === database_1.UserRole.EMPLOYEE) {
            const profile = await this.prisma.profile.findUnique({
                where: { userId: user.userId },
            });
            if (!profile)
                return [];
            const shifts = await this.prisma.shift.findMany({
                where: { workerId: profile.id },
                select: { jobId: true },
            });
            const jobIds = [...new Set(shifts.map((s) => s.jobId))];
            if (!jobIds.length)
                return [];
            return this.prisma.job.findMany({
                where: { id: { in: jobIds } },
                include: { sector: true, company: true, shifts: { where: { workerId: profile.id } } },
            });
        }
        if (user.role === database_1.UserRole.EMPLOYER) {
            const employer = await this.prisma.user.findUnique({
                where: { id: user.userId },
                select: { companyId: true },
            });
            if (!employer?.companyId)
                return [];
            return this.prisma.job.findMany({
                where: { companyId: employer.companyId },
                include: { sector: true, company: true },
            });
        }
        return this.prisma.job.findMany({ include: { sector: true, company: true } });
    }
    async findOne(id, user) {
        const job = await this.prisma.job.findUnique({
            where: { id },
            include: { sector: true, company: true, shifts: true },
        });
        if (!job)
            throw new common_1.NotFoundException('Job not found');
        if (user.role === database_1.UserRole.EMPLOYEE) {
            const profile = await this.prisma.profile.findUnique({
                where: { userId: user.userId },
            });
            const hasShift = job.shifts.some((s) => s.workerId === profile?.id);
            if (!hasShift)
                throw new common_1.ForbiddenException('Access denied');
        }
        if (user.role === database_1.UserRole.EMPLOYER) {
            const employer = await this.prisma.user.findUnique({
                where: { id: user.userId },
                select: { companyId: true },
            });
            if (employer?.companyId !== job.companyId) {
                throw new common_1.ForbiddenException('Access denied');
            }
        }
        return job;
    }
    async update(id, data) {
        const updateData = {};
        if (data.title !== undefined)
            updateData.title = data.title;
        if (data.description !== undefined)
            updateData.description = data.description;
        if (data.requirements !== undefined)
            updateData.requirements = data.requirements;
        if (data.payRate !== undefined)
            updateData.payRate = typeof data.payRate === 'number' ? data.payRate : parseFloat(data.payRate);
        if (data.location !== undefined)
            updateData.location = data.location;
        if (data.workersNeeded !== undefined)
            updateData.workersNeeded = data.workersNeeded;
        if (data.sector && !data.sectorId) {
            const sectorName = String(data.sector).trim();
            const existing = await this.prisma.sector.findFirst({
                where: { name: { equals: sectorName, mode: 'insensitive' } },
            });
            if (existing) {
                updateData.sectorId = existing.id;
            }
            else {
                const created = await this.prisma.sector.create({ data: { name: sectorName } });
                updateData.sectorId = created.id;
            }
        }
        else if (data.sectorId) {
            updateData.sectorId = data.sectorId;
        }
        return this.prisma.job.update({
            where: { id },
            data: updateData,
            include: { sector: true, company: true },
        });
    }
    async remove(id) {
        try {
            return await this.prisma.$transaction(async (tx) => {
                const shifts = await tx.shift.findMany({
                    where: { jobId: id },
                    select: { id: true },
                });
                const shiftIds = shifts.map((s) => s.id);
                if (shiftIds.length > 0) {
                    await tx.attendance.deleteMany({ where: { shiftId: { in: shiftIds } } });
                }
                await tx.shift.deleteMany({ where: { jobId: id } });
                return tx.job.delete({ where: { id } });
            });
        }
        catch (err) {
            if (err?.code === 'P2025') {
                throw new common_1.NotFoundException(`Job with id "${id}" not found`);
            }
            throw err;
        }
    }
};
exports.JobsService = JobsService;
exports.JobsService = JobsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], JobsService);
//# sourceMappingURL=jobs.service.js.map