import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from 'database';

@Controller('ai')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('parse-cv')
  @Roles(UserRole.SUPER_ADMIN, UserRole.EMPLOYEE)
  parseCV(@Body('text') text: string) {
    return this.aiService.parseCV(text);
  }

  @Post('match')
  @Roles(UserRole.SUPER_ADMIN, UserRole.EMPLOYER)
  match(@Body() data: any) {
    return this.aiService.matchCandidate(data.profile, data.requirements);
  }
}
