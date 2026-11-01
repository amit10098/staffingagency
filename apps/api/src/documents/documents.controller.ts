import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/decorators/current-user.decorator';
import { UserRole } from 'database';

@Controller('documents')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @CurrentUser() user: AuthUser,
    @Body('profileId') profileId: string,
    @Body('type') type: string,
    @UploadedFile() file: any,
  ) {
    return this.documentsService.uploadDocument(user, profileId, type, file);
  }

  @Get('me')
  @Roles(UserRole.EMPLOYEE)
  getMyDocuments(@CurrentUser() user: AuthUser) {
    return this.documentsService.getDocuments(user);
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.EMPLOYER)
  getAllDocuments(@Query('profileId') profileId?: string) {
    return this.documentsService.getDocuments(
      { userId: '', email: '', role: UserRole.SUPER_ADMIN },
      profileId,
    );
  }

  @Get('profile/:profileId')
  @Roles(UserRole.SUPER_ADMIN, UserRole.EMPLOYER)
  getProfileDocuments(@Param('profileId') profileId: string) {
    return this.documentsService.getDocuments(
      { userId: '', email: '', role: UserRole.SUPER_ADMIN },
      profileId,
    );
  }

  @Get(':id/download')
  async downloadDocument(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
    @Res() res: Response,
  ) {
    const { filepath, filename } = await this.documentsService.getDocumentFile(id, user);
    return res.download(filepath, filename);
  }

  @Post(':id/verify')
  @Roles(UserRole.SUPER_ADMIN)
  verifyDocument(@Param('id') id: string, @Body('status') status: 'APPROVED' | 'REJECTED') {
    return this.documentsService.verifyDocument(id, status);
  }
}
