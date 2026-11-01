import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiService {
  private openai: OpenAI | null = null;
  private readonly logger = new Logger(AiService.name);

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
    } else {
      this.logger.warn('OPENAI_API_KEY not set — AI features will return mock responses.');
    }
  }

  async parseCV(text: string) {
    if (!this.openai) {
      return JSON.stringify({ skills: [], experience: [], certifications: [], note: 'AI unavailable — OPENAI_API_KEY not configured.' });
    }
    const response = await this.openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "Extract skills, experience, and certifications from the following CV text. Return as JSON." },
        { role: "user", content: text }
      ],
    });
    return response.choices[0].message.content;
  }

  async matchCandidate(profileData: any, jobRequirements: string) {
    if (!this.openai) {
      return '0';
    }
    const response = await this.openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "Score the candidate against the job requirements on a scale of 0-100. Return only the number." },
        { role: "user", content: `Candidate: ${JSON.stringify(profileData)}\nRequirements: ${jobRequirements}` }
      ],
    });
    return response.choices[0].message.content;
  }
}
