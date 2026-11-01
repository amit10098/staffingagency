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
exports.CompaniesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CompaniesService = class CompaniesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.company.create({ data });
    }
    async findAll() {
        return this.prisma.company.findMany({ include: { users: true, jobs: true } });
    }
    async findForEmployer(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { companyId: true },
        });
        if (!user?.companyId)
            return [];
        const company = await this.prisma.company.findUnique({
            where: { id: user.companyId },
            include: { users: true, jobs: true },
        });
        return company ? [company] : [];
    }
    async findOne(id) {
        const company = await this.prisma.company.findUnique({
            where: { id },
            include: { users: true, jobs: true },
        });
        if (!company)
            throw new common_1.NotFoundException('Company not found');
        return company;
    }
    async update(id, data) {
        return this.prisma.company.update({ where: { id }, data });
    }
    async remove(id) {
        const company = await this.prisma.company.findUnique({ where: { id } });
        if (!company)
            throw new common_1.NotFoundException('Company not found');
        return this.prisma.$transaction(async (tx) => {
            const jobs = await tx.job.findMany({ where: { companyId: id }, select: { id: true } });
            const jobIds = jobs.map((j) => j.id);
            const shifts = await tx.shift.findMany({
                where: { jobId: { in: jobIds } },
                select: { id: true },
            });
            const shiftIds = shifts.map((s) => s.id);
            await tx.attendance.deleteMany({ where: { shiftId: { in: shiftIds } } });
            await tx.shift.deleteMany({ where: { id: { in: shiftIds } } });
            await tx.job.deleteMany({ where: { id: { in: jobIds } } });
            await tx.user.updateMany({ where: { companyId: id }, data: { companyId: null } });
            return tx.company.delete({ where: { id } });
        });
    }
};
exports.CompaniesService = CompaniesService;
exports.CompaniesService = CompaniesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CompaniesService);
//# sourceMappingURL=companies.service.js.map