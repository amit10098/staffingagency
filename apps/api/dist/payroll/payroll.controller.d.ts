import type { Response } from 'express';
import { PayrollService } from './payroll.service';
import type { AuthUser } from '../common/decorators/current-user.decorator';
export declare class PayrollController {
    private readonly payrollService;
    constructor(payrollService: PayrollService);
    getMyPayslips(user: AuthUser): Promise<{
        id: string;
        createdAt: Date;
        year: number;
        status: string;
        month: number;
        profileId: string;
        period: string;
        grossPay: number;
        netPay: number;
        hoursWorked: number;
        fileUrl: string | null;
        uploadedBy: string | null;
    }[]>;
    getAllPayslips(workerId?: string): Promise<{
        id: string;
        createdAt: Date;
        year: number;
        status: string;
        month: number;
        profileId: string;
        period: string;
        grossPay: number;
        netPay: number;
        hoursWorked: number;
        fileUrl: string | null;
        uploadedBy: string | null;
    }[]>;
    uploadPayslip(user: AuthUser, data: any, file?: any): Promise<{
        id: string;
        createdAt: Date;
        year: number;
        status: string;
        month: number;
        profileId: string;
        period: string;
        grossPay: number;
        netPay: number;
        hoursWorked: number;
        fileUrl: string | null;
        uploadedBy: string | null;
    }>;
    downloadPayslip(id: string, user: AuthUser, res: Response): Promise<void>;
    getPayroll(workerId: string, user: AuthUser, month: number, year: number): Promise<{
        id: string;
        createdAt: Date;
        year: number;
        status: string;
        month: number;
        profileId: string;
        period: string;
        grossPay: number;
        netPay: number;
        hoursWorked: number;
        fileUrl: string | null;
        uploadedBy: string | null;
    }[]> | Promise<{
        workerId: string;
        period: string;
        totalGross: number;
        holidayPay: number;
        netPay: number;
        payslips: {
            id: string;
            createdAt: Date;
            year: number;
            status: string;
            month: number;
            profileId: string;
            period: string;
            grossPay: number;
            netPay: number;
            hoursWorked: number;
            fileUrl: string | null;
            uploadedBy: string | null;
        }[];
        totalHours?: undefined;
    } | {
        workerId: string;
        period: string;
        totalGross: number;
        holidayPay: number;
        netPay: number;
        totalHours: number;
        payslips?: undefined;
    }>;
}
