import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from '../common/decorators/current-user.decorator';
export declare class DocumentsService {
    private prisma;
    private uploadDir;
    constructor(prisma: PrismaService);
    uploadDocument(user: AuthUser, profileId: string, type: string, file: any): Promise<{
        id: string;
        status: import("database").$Enums.DocStatus;
        type: string;
        profileId: string;
        url: string;
        expiryDate: Date | null;
        verifiedAt: Date | null;
    }>;
    verifyDocument(id: string, status: 'APPROVED' | 'REJECTED'): Promise<{
        id: string;
        status: import("database").$Enums.DocStatus;
        type: string;
        profileId: string;
        url: string;
        expiryDate: Date | null;
        verifiedAt: Date | null;
    }>;
    getDocuments(user: AuthUser, profileId?: string): Promise<{
        id: string;
        status: import("database").$Enums.DocStatus;
        type: string;
        profileId: string;
        url: string;
        expiryDate: Date | null;
        verifiedAt: Date | null;
    }[]>;
    getDocumentFile(id: string, user: AuthUser): Promise<{
        filepath: string;
        filename: string;
    }>;
}
