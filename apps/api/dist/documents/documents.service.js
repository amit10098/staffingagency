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
exports.DocumentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const database_1 = require("database");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let DocumentsService = class DocumentsService {
    prisma;
    uploadDir = path.join(process.cwd(), 'uploads', 'documents');
    constructor(prisma) {
        this.prisma = prisma;
        fs.mkdirSync(this.uploadDir, { recursive: true });
    }
    async uploadDocument(user, profileId, type, file) {
        if (user.role === database_1.UserRole.EMPLOYEE) {
            const profile = await this.prisma.profile.findUnique({
                where: { userId: user.userId },
            });
            if (!profile || profile.id !== profileId) {
                throw new common_1.ForbiddenException('You can only upload documents to your own profile');
            }
        }
        const filename = `${profileId}-${Date.now()}-${file.originalname}`;
        const filepath = path.join(this.uploadDir, filename);
        fs.writeFileSync(filepath, file.buffer);
        const url = `/uploads/documents/${filename}`;
        return this.prisma.document.create({
            data: {
                profileId,
                type,
                url,
                status: 'PENDING',
            },
        });
    }
    async verifyDocument(id, status) {
        return this.prisma.document.update({
            where: { id },
            data: {
                status,
                verifiedAt: status === 'APPROVED' ? new Date() : null,
            },
        });
    }
    async getDocuments(user, profileId) {
        if (user.role === database_1.UserRole.EMPLOYEE) {
            const profile = await this.prisma.profile.findUnique({
                where: { userId: user.userId },
            });
            if (!profile)
                return [];
            return this.prisma.document.findMany({
                where: { profileId: profile.id },
                orderBy: { id: 'desc' },
            });
        }
        if (profileId) {
            return this.prisma.document.findMany({
                where: { profileId },
                include: { profile: { select: { firstName: true, lastName: true } } },
                orderBy: { id: 'desc' },
            });
        }
        return this.prisma.document.findMany({
            include: { profile: { select: { firstName: true, lastName: true } } },
            orderBy: { id: 'desc' },
        });
    }
    async getDocumentFile(id, user) {
        const document = await this.prisma.document.findUnique({
            where: { id },
            include: { profile: true },
        });
        if (!document)
            throw new common_1.NotFoundException('Document not found');
        if (user.role === database_1.UserRole.EMPLOYEE) {
            const profile = await this.prisma.profile.findUnique({
                where: { userId: user.userId },
            });
            if (!profile || document.profileId !== profile.id) {
                throw new common_1.ForbiddenException('Access denied');
            }
        }
        const filename = path.basename(document.url);
        const filepath = path.join(this.uploadDir, filename);
        if (!fs.existsSync(filepath))
            throw new common_1.NotFoundException('File not found on disk');
        return { filepath, filename };
    }
};
exports.DocumentsService = DocumentsService;
exports.DocumentsService = DocumentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DocumentsService);
//# sourceMappingURL=documents.service.js.map