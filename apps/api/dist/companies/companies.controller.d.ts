import { CompaniesService } from './companies.service';
import type { AuthUser } from '../common/decorators/current-user.decorator';
export declare class CompaniesController {
    private readonly companiesService;
    constructor(companiesService: CompaniesService);
    create(data: any): Promise<{
        id: string;
        email: string | null;
        name: string;
        address: string | null;
        description: string | null;
        logoUrl: string | null;
        industry: string;
        website: string | null;
        isActive: boolean;
        contactPerson: string | null;
        contactNumber: string | null;
    }>;
    findAll(user: AuthUser): Promise<({
        users: {
            id: string;
            email: string;
            password: string;
            role: import("database").$Enums.UserRole;
            isVerified: boolean;
            mfaEnabled: boolean;
            mfaSecret: string | null;
            createdAt: Date;
            updatedAt: Date;
            companyId: string | null;
        }[];
        jobs: {
            id: string;
            companyId: string;
            description: string;
            title: string;
            requirements: string;
            payRate: number;
            location: string;
            workersNeeded: number;
            status: import("database").$Enums.JobStatus;
            sectorId: string;
        }[];
    } & {
        id: string;
        email: string | null;
        name: string;
        address: string | null;
        description: string | null;
        logoUrl: string | null;
        industry: string;
        website: string | null;
        isActive: boolean;
        contactPerson: string | null;
        contactNumber: string | null;
    })[]>;
    findOne(id: string): Promise<{
        users: {
            id: string;
            email: string;
            password: string;
            role: import("database").$Enums.UserRole;
            isVerified: boolean;
            mfaEnabled: boolean;
            mfaSecret: string | null;
            createdAt: Date;
            updatedAt: Date;
            companyId: string | null;
        }[];
        jobs: {
            id: string;
            companyId: string;
            description: string;
            title: string;
            requirements: string;
            payRate: number;
            location: string;
            workersNeeded: number;
            status: import("database").$Enums.JobStatus;
            sectorId: string;
        }[];
    } & {
        id: string;
        email: string | null;
        name: string;
        address: string | null;
        description: string | null;
        logoUrl: string | null;
        industry: string;
        website: string | null;
        isActive: boolean;
        contactPerson: string | null;
        contactNumber: string | null;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        email: string | null;
        name: string;
        address: string | null;
        description: string | null;
        logoUrl: string | null;
        industry: string;
        website: string | null;
        isActive: boolean;
        contactPerson: string | null;
        contactNumber: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        email: string | null;
        name: string;
        address: string | null;
        description: string | null;
        logoUrl: string | null;
        industry: string;
        website: string | null;
        isActive: boolean;
        contactPerson: string | null;
        contactNumber: string | null;
    }>;
}
