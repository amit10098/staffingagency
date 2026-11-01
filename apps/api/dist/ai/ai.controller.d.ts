import { AiService } from './ai.service';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    parseCV(text: string): Promise<string | null>;
    match(data: any): Promise<string | null>;
}
