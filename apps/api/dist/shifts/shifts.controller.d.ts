import { ShiftsService } from './shifts.service';
import type { AuthUser } from '../common/decorators/current-user.decorator';
export declare class ShiftsController {
    private readonly shiftsService;
    constructor(shiftsService: ShiftsService);
    create(data: any): Promise<{
        id: string;
        status: import("database").$Enums.ShiftStatus;
        jobId: string;
        startTime: Date;
        endTime: Date;
        workerId: string | null;
        breakTime: number | null;
        notes: string | null;
    }>;
    publishRota(data: any): Promise<{
        job: {
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
        };
        shifts: ({
            worker: ({
                user: {
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
                };
            } & {
                id: string;
                userId: string;
                niNumber: string;
                firstName: string;
                lastName: string;
                dob: Date;
                gender: string;
                phone: string;
                address: string;
                postcode: string;
                city: string;
                country: string;
                emergencyContact: string;
                emergencyPhone: string;
                relationship: string;
                bankAccountName: string;
                bankSortCode: string;
                bankAccountNumber: string;
                rtwStatus: string;
                visaType: string | null;
                visaExpiry: Date | null;
                skills: string[];
                position: string | null;
            }) | null;
        } & {
            id: string;
            status: import("database").$Enums.ShiftStatus;
            jobId: string;
            startTime: Date;
            endTime: Date;
            workerId: string | null;
            breakTime: number | null;
            notes: string | null;
        })[];
    }>;
    findAll(user: AuthUser, companyId?: string): Promise<({
        job: {
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
        };
        attendance: {
            id: string;
            shiftId: string;
            clockInTime: Date | null;
            clockInGps: string | null;
            clockOutTime: Date | null;
            clockOutGps: string | null;
            deviceInfo: string | null;
            latenessDetected: boolean;
            approvalStatus: string;
        } | null;
    } & {
        id: string;
        status: import("database").$Enums.ShiftStatus;
        jobId: string;
        startTime: Date;
        endTime: Date;
        workerId: string | null;
        breakTime: number | null;
        notes: string | null;
    })[]>;
    findMine(user: AuthUser): Promise<({
        job: {
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
        };
        attendance: {
            id: string;
            shiftId: string;
            clockInTime: Date | null;
            clockInGps: string | null;
            clockOutTime: Date | null;
            clockOutGps: string | null;
            deviceInfo: string | null;
            latenessDetected: boolean;
            approvalStatus: string;
        } | null;
    } & {
        id: string;
        status: import("database").$Enums.ShiftStatus;
        jobId: string;
        startTime: Date;
        endTime: Date;
        workerId: string | null;
        breakTime: number | null;
        notes: string | null;
    })[]>;
    getAttendance(companyId?: string): Promise<({
        shift: {
            job: {
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
            };
            worker: ({
                user: {
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
                };
            } & {
                id: string;
                userId: string;
                niNumber: string;
                firstName: string;
                lastName: string;
                dob: Date;
                gender: string;
                phone: string;
                address: string;
                postcode: string;
                city: string;
                country: string;
                emergencyContact: string;
                emergencyPhone: string;
                relationship: string;
                bankAccountName: string;
                bankSortCode: string;
                bankAccountNumber: string;
                rtwStatus: string;
                visaType: string | null;
                visaExpiry: Date | null;
                skills: string[];
                position: string | null;
            }) | null;
        } & {
            id: string;
            status: import("database").$Enums.ShiftStatus;
            jobId: string;
            startTime: Date;
            endTime: Date;
            workerId: string | null;
            breakTime: number | null;
            notes: string | null;
        };
    } & {
        id: string;
        shiftId: string;
        clockInTime: Date | null;
        clockInGps: string | null;
        clockOutTime: Date | null;
        clockOutGps: string | null;
        deviceInfo: string | null;
        latenessDetected: boolean;
        approvalStatus: string;
    })[]>;
    approveAttendance(id: string): Promise<{
        id: string;
        shiftId: string;
        clockInTime: Date | null;
        clockInGps: string | null;
        clockOutTime: Date | null;
        clockOutGps: string | null;
        deviceInfo: string | null;
        latenessDetected: boolean;
        approvalStatus: string;
    }>;
    flagAttendance(id: string): Promise<{
        id: string;
        shiftId: string;
        clockInTime: Date | null;
        clockInGps: string | null;
        clockOutTime: Date | null;
        clockOutGps: string | null;
        deviceInfo: string | null;
        latenessDetected: boolean;
        approvalStatus: string;
    }>;
    updateAttendanceTimes(id: string, data: {
        clockInTime?: string;
        clockOutTime?: string;
    }): Promise<{
        id: string;
        shiftId: string;
        clockInTime: Date | null;
        clockInGps: string | null;
        clockOutTime: Date | null;
        clockOutGps: string | null;
        deviceInfo: string | null;
        latenessDetected: boolean;
        approvalStatus: string;
    }>;
    updateShift(id: string, data: any): Promise<{
        job: {
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
        };
        worker: ({
            user: {
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
            };
        } & {
            id: string;
            userId: string;
            niNumber: string;
            firstName: string;
            lastName: string;
            dob: Date;
            gender: string;
            phone: string;
            address: string;
            postcode: string;
            city: string;
            country: string;
            emergencyContact: string;
            emergencyPhone: string;
            relationship: string;
            bankAccountName: string;
            bankSortCode: string;
            bankAccountNumber: string;
            rtwStatus: string;
            visaType: string | null;
            visaExpiry: Date | null;
            skills: string[];
            position: string | null;
        }) | null;
    } & {
        id: string;
        status: import("database").$Enums.ShiftStatus;
        jobId: string;
        startTime: Date;
        endTime: Date;
        workerId: string | null;
        breakTime: number | null;
        notes: string | null;
    }>;
    deleteShift(id: string): Promise<{
        id: string;
        status: import("database").$Enums.ShiftStatus;
        jobId: string;
        startTime: Date;
        endTime: Date;
        workerId: string | null;
        breakTime: number | null;
        notes: string | null;
    }>;
    assignWorker(id: string, workerId: string): Promise<{
        job: {
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
        };
        worker: ({
            user: {
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
            };
        } & {
            id: string;
            userId: string;
            niNumber: string;
            firstName: string;
            lastName: string;
            dob: Date;
            gender: string;
            phone: string;
            address: string;
            postcode: string;
            city: string;
            country: string;
            emergencyContact: string;
            emergencyPhone: string;
            relationship: string;
            bankAccountName: string;
            bankSortCode: string;
            bankAccountNumber: string;
            rtwStatus: string;
            visaType: string | null;
            visaExpiry: Date | null;
            skills: string[];
            position: string | null;
        }) | null;
    } & {
        id: string;
        status: import("database").$Enums.ShiftStatus;
        jobId: string;
        startTime: Date;
        endTime: Date;
        workerId: string | null;
        breakTime: number | null;
        notes: string | null;
    }>;
    clockIn(id: string, user: AuthUser, gps: string, deviceInfo: string): Promise<{
        id: string;
        shiftId: string;
        clockInTime: Date | null;
        clockInGps: string | null;
        clockOutTime: Date | null;
        clockOutGps: string | null;
        deviceInfo: string | null;
        latenessDetected: boolean;
        approvalStatus: string;
    }>;
    clockOut(id: string, user: AuthUser, gps: string): Promise<{
        id: string;
        shiftId: string;
        clockInTime: Date | null;
        clockInGps: string | null;
        clockOutTime: Date | null;
        clockOutGps: string | null;
        deviceInfo: string | null;
        latenessDetected: boolean;
        approvalStatus: string;
    }>;
}
