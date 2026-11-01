import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from '../common/decorators/current-user.decorator';
export declare class JobsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any): Promise<{
        company: {
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
        };
        sector: {
            id: string;
            name: string;
            description: string | null;
        };
    } & {
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
    }>;
    findAll(user: AuthUser): Promise<({
        company: {
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
        };
        sector: {
            id: string;
            name: string;
            description: string | null;
        };
    } & {
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
    })[]>;
    findOne(id: string, user: AuthUser): Promise<{
        company: {
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
        };
        sector: {
            id: string;
            name: string;
            description: string | null;
        };
        shifts: {
            id: string;
            status: import("database").$Enums.ShiftStatus;
            jobId: string;
            startTime: Date;
            endTime: Date;
            workerId: string | null;
            breakTime: number | null;
            notes: string | null;
        }[];
    } & {
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
    }>;
    update(id: string, data: any): Promise<{
        company: {
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
        };
        sector: {
            id: string;
            name: string;
            description: string | null;
        };
    } & {
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
    }>;
    remove(id: string): Promise<{
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
    }>;
}
