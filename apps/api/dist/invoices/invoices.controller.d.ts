import { InvoicesService } from './invoices.service';
export declare class InvoicesController {
    private readonly invoicesService;
    constructor(invoicesService: InvoicesService);
    generate(companyId: string, startDate: string, endDate: string): Promise<{
        invoiceNumber: string;
        companyId: string;
        totalAmount: number;
        vatAmount: number;
        status: string;
    }>;
}
