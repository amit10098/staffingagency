import { PrismaService } from '../prisma/prisma.service';
export declare class TimesheetsService {
    private prisma;
    constructor(prisma: PrismaService);
    generateFromShifts(workerId: string, startDate: Date, endDate: Date): Promise<{
        shiftId: string;
        jobTitle: string;
        hoursWorked: number;
        payRate: number;
    }[]>;
    private calculateHours;
}
