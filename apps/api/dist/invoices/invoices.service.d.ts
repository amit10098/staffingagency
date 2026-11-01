import { PrismaService } from '../prisma/prisma.service';
export declare class InvoicesService {
    private prisma;
    constructor(prisma: PrismaService);
    generateInvoice(companyId: string, startDate: Date, endDate: Date): Promise<{
        invoiceNumber: string;
        companyId: string;
        totalAmount: number;
        vatAmount: number;
        status: string;
    }>;
}
