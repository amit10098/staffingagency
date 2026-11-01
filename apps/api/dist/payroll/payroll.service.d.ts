import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from '../common/decorators/current-user.decorator';
export declare class PayrollService {
    private prisma;
    private uploadDir;
    constructor(prisma: PrismaService);
    getPayslips(user: AuthUser, workerId?: string): Promise<{
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
    uploadPayslip(adminUser: AuthUser, data: {
        profileId: string;
        period: string;
        month: number;
        year: number;
        grossPay: number;
        netPay: number;
        hoursWorked?: number;
    }, file?: any): Promise<{
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
    getPayslipFile(id: string, user: AuthUser): Promise<{
        filepath: string;
        filename: string;
    }>;
    calculatePayroll(workerId: string, month: number, year: number): Promise<{
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
