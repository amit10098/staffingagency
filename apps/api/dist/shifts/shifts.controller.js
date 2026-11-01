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
exports.ShiftsController = void 0;
const common_1 = require("@nestjs/common");
const shifts_service_1 = require("./shifts.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const database_1 = require("database");
let ShiftsController = class ShiftsController {
    shiftsService;
    constructor(shiftsService) {
        this.shiftsService = shiftsService;
    }
    create(data) {
        return this.shiftsService.create(data);
    }
    publishRota(data) {
        return this.shiftsService.publishRota(data);
    }
    findAll(user, companyId) {
        if (companyId)
            return this.shiftsService.findByCompany(companyId);
        return this.shiftsService.findAll(user);
    }
    findMine(user) {
        return this.shiftsService.findForEmployee(user.userId);
    }
    getAttendance(companyId) {
        return this.shiftsService.getAttendanceByCompany(companyId);
    }
    approveAttendance(id) {
        return this.shiftsService.approveAttendance(id);
    }
    flagAttendance(id) {
        return this.shiftsService.flagAttendance(id);
    }
    updateAttendanceTimes(id, data) {
        return this.shiftsService.updateAttendanceTimes(id, data);
    }
    updateShift(id, data) {
        return this.shiftsService.updateShift(id, data);
    }
    deleteShift(id) {
        return this.shiftsService.deleteShift(id);
    }
    assignWorker(id, workerId) {
        return this.shiftsService.assignWorker(id, workerId);
    }
    clockIn(id, user, gps, deviceInfo) {
        return this.shiftsService.clockIn(id, user.userId, gps, deviceInfo);
    }
    clockOut(id, user, gps) {
        return this.shiftsService.clockOut(id, user.userId, gps);
    }
};
exports.ShiftsController = ShiftsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(database_1.UserRole.SUPER_ADMIN, database_1.UserRole.EMPLOYER),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ShiftsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('rota'),
    (0, roles_decorator_1.Roles)(database_1.UserRole.SUPER_ADMIN, database_1.UserRole.EMPLOYER),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ShiftsController.prototype, "publishRota", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ShiftsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, roles_decorator_1.Roles)(database_1.UserRole.EMPLOYEE),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ShiftsController.prototype, "findMine", null);
__decorate([
    (0, common_1.Get)('attendance'),
    (0, roles_decorator_1.Roles)(database_1.UserRole.SUPER_ADMIN, database_1.UserRole.EMPLOYER),
    __param(0, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ShiftsController.prototype, "getAttendance", null);
__decorate([
    (0, common_1.Patch)('attendance/:id/approve'),
    (0, roles_decorator_1.Roles)(database_1.UserRole.SUPER_ADMIN, database_1.UserRole.EMPLOYER),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ShiftsController.prototype, "approveAttendance", null);
__decorate([
    (0, common_1.Patch)('attendance/:id/flag'),
    (0, roles_decorator_1.Roles)(database_1.UserRole.SUPER_ADMIN, database_1.UserRole.EMPLOYER),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ShiftsController.prototype, "flagAttendance", null);
__decorate([
    (0, common_1.Patch)('attendance/:id'),
    (0, roles_decorator_1.Roles)(database_1.UserRole.SUPER_ADMIN, database_1.UserRole.EMPLOYER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ShiftsController.prototype, "updateAttendanceTimes", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(database_1.UserRole.SUPER_ADMIN, database_1.UserRole.EMPLOYER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ShiftsController.prototype, "updateShift", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(database_1.UserRole.SUPER_ADMIN, database_1.UserRole.EMPLOYER),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ShiftsController.prototype, "deleteShift", null);
__decorate([
    (0, common_1.Put)(':id/assign'),
    (0, roles_decorator_1.Roles)(database_1.UserRole.SUPER_ADMIN, database_1.UserRole.EMPLOYER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('workerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ShiftsController.prototype, "assignWorker", null);
__decorate([
    (0, common_1.Post)(':id/clock-in'),
    (0, roles_decorator_1.Roles)(database_1.UserRole.EMPLOYEE),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)('gps')),
    __param(3, (0, common_1.Body)('deviceInfo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String, String]),
    __metadata("design:returntype", void 0)
], ShiftsController.prototype, "clockIn", null);
__decorate([
    (0, common_1.Post)(':id/clock-out'),
    (0, roles_decorator_1.Roles)(database_1.UserRole.EMPLOYEE),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)('gps')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", void 0)
], ShiftsController.prototype, "clockOut", null);
exports.ShiftsController = ShiftsController = __decorate([
    (0, common_1.Controller)('shifts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [shifts_service_1.ShiftsService])
], ShiftsController);
//# sourceMappingURL=shifts.controller.js.map