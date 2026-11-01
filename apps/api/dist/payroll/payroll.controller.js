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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const payroll_service_1 = require("./payroll.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const database_1 = require("database");
let PayrollController = class PayrollController {
    payrollService;
    constructor(payrollService) {
        this.payrollService = payrollService;
    }
    getMyPayslips(user) {
        return this.payrollService.getPayslips(user);
    }
    getAllPayslips(workerId) {
        return this.payrollService.getPayslips({ userId: '', email: '', role: database_1.UserRole.SUPER_ADMIN }, workerId);
    }
    uploadPayslip(user, data, file) {
        return this.payrollService.uploadPayslip(user, {
            profileId: data.profileId,
            period: data.period,
            month: Number(data.month),
            year: Number(data.year),
            grossPay: Number(data.grossPay),
            netPay: Number(data.netPay),
            hoursWorked: data.hoursWorked ? Number(data.hoursWorked) : undefined,
        }, file);
    }
    async downloadPayslip(id, user, res) {
        const { filepath, filename } = await this.payrollService.getPayslipFile(id, user);
        return res.download(filepath, filename);
    }
    getPayroll(workerId, user, month, year) {
        if (user.role === database_1.UserRole.EMPLOYEE) {
            return this.payrollService.getPayslips(user);
        }
        return this.payrollService.calculatePayroll(workerId, month, year);
    }
};
exports.PayrollController = PayrollController;
__decorate([
    (0, common_1.Get)('me'),
    (0, roles_decorator_1.Roles)(database_1.UserRole.EMPLOYEE),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "getMyPayslips", null);
__decorate([
    (0, common_1.Get)('payslips'),
    (0, roles_decorator_1.Roles)(database_1.UserRole.SUPER_ADMIN, database_1.UserRole.EMPLOYER),
    __param(0, (0, common_1.Query)('workerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "getAllPayslips", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, roles_decorator_1.Roles)(database_1.UserRole.SUPER_ADMIN),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "uploadPayslip", null);
__decorate([
    (0, common_1.Get)('payslips/:id/download'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "downloadPayslip", null);
__decorate([
    (0, common_1.Get)(':workerId'),
    (0, roles_decorator_1.Roles)(database_1.UserRole.SUPER_ADMIN, database_1.UserRole.EMPLOYEE),
    __param(0, (0, common_1.Param)('workerId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Query)('month')),
    __param(3, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Number, Number]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "getPayroll", null);
exports.PayrollController = PayrollController = __decorate([
    (0, common_1.Controller)('payroll'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [payroll_service_1.PayrollService])
], PayrollController);
//# sourceMappingURL=payroll.controller.js.map