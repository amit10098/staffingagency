import { TimesheetsService } from './timesheets.service';
export declare class TimesheetsController {
    private readonly timesheetsService;
    constructor(timesheetsService: TimesheetsService);
    generate(workerId: string, startDate: string, endDate: string): Promise<{
        shiftId: string;
        jobTitle: string;
        hoursWorked: number;
        payRate: number;
    }[]>;
}
