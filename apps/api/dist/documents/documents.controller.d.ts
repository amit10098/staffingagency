import type { Response } from 'express';
import { DocumentsService } from './documents.service';
import type { AuthUser } from '../common/decorators/current-user.decorator';
export declare class DocumentsController {
    private readonly documentsService;
    constructor(documentsService: DocumentsService);
    uploadFile(user: AuthUser, profileId: string, type: string, file: any): Promise<{
        id: string;
        status: import("database").$Enums.DocStatus;
        type: string;
        profileId: string;
        url: string;
        expiryDate: Date | null;
        verifiedAt: Date | null;
    }>;
    getMyDocuments(user: AuthUser): Promise<{
        id: string;
        status: import("database").$Enums.DocStatus;
        type: string;
        profileId: string;
        url: string;
        expiryDate: Date | null;
        verifiedAt: Date | null;
    }[]>;
    getAllDocuments(profileId?: string): Promise<{
        id: string;
        status: import("database").$Enums.DocStatus;
        type: string;
        profileId: string;
        url: string;
        expiryDate: Date | null;
        verifiedAt: Date | null;
    }[]>;
    getProfileDocuments(profileId: string): Promise<{
        id: string;
        status: import("database").$Enums.DocStatus;
        type: string;
        profileId: string;
        url: string;
        expiryDate: Date | null;
        verifiedAt: Date | null;
    }[]>;
    downloadDocument(id: string, user: AuthUser, res: Response): Promise<void>;
    verifyDocument(id: string, status: 'APPROVED' | 'REJECTED'): Promise<{
        id: string;
        status: import("database").$Enums.DocStatus;
        type: string;
        profileId: string;
        url: string;
        expiryDate: Date | null;
        verifiedAt: Date | null;
    }>;
}
