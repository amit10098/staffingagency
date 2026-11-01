import { ConfigService } from '@nestjs/config';
export declare class AiService {
    private configService;
    private openai;
    private readonly logger;
    constructor(configService: ConfigService);
    parseCV(text: string): Promise<string | null>;
    matchCandidate(profileData: any, jobRequirements: string): Promise<string | null>;
}
