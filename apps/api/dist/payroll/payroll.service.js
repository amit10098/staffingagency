"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const database_1 = require("database");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let PayrollService = class PayrollService {
    prisma;
    uploadDir = path.join(process.cwd(), 'uploads', 'payslips');
    constructor(prisma) {
        this.prisma = prisma;
        fs.mkdirSync(this.uploadDir, { recursive: true });
    }
    async getPayslips(user, workerId) {
        if (user.role === database_1.UserRole.EMPLOYEE) {
            const profile = await this.prisma.profile.findUnique({
                where: { userId: user.userId },
            });
            if (!profile)
                return [];
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
    async uploadPayslip(adminUser, data, file) {
        let fileUrl;
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
    async getPayslipFile(id, user) {
        const payslip = await this.prisma.payslip.findUnique({
            where: { id },
            include: { profile: true },
        });
        if (!payslip)
            throw new common_1.NotFoundException('Payslip not found');
        if (user.role === database_1.UserRole.EMPLOYEE) {
            const profile = await this.prisma.profile.findUnique({
                where: { userId: user.userId },
            });
            if (!profile || payslip.profileId !== profile.id) {
                throw new common_1.ForbiddenException('Access denied');
            }
        }
        if (!payslip.fileUrl)
            throw new common_1.NotFoundException('No file attached');
        const filename = path.basename(payslip.fileUrl);
        const filepath = path.join(this.uploadDir, filename);
        if (!fs.existsSync(filepath))
            throw new common_1.NotFoundException('File not found on disk');
        return { filepath, filename };
    }
    async calculatePayroll(workerId, month, year) {
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
};
exports.PayrollService = PayrollService;
exports.PayrollService = PayrollService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PayrollService);
//# sourceMappingURL=payroll.service.js.map