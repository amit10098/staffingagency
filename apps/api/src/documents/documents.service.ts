import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from '../common/decorators/current-user.decorator';
import { UserRole } from 'database';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DocumentsService {
  private uploadDir = path.join(process.cwd(), 'uploads', 'documents');

  constructor(private prisma: PrismaService) {
    fs.mkdirSync(this.uploadDir, { recursive: true });
  }

  async uploadDocument(
    user: AuthUser,
    profileId: string,
    type: string,
    file: any,
  ) {
    if (user.role === UserRole.EMPLOYEE) {
      const profile = await this.prisma.profile.findUnique({
        where: { userId: user.userId },
      });
      if (!profile || profile.id !== profileId) {
        throw new ForbiddenException('You can only upload documents to your own profile');
      }
    }

    const filename = `${profileId}-${Date.now()}-${file.originalname}`;
    const filepath = path.join(this.uploadDir, filename);
    fs.writeFileSync(filepath, file.buffer);
    const url = `/uploads/documents/${filename}`;

    return this.prisma.document.create({
      data: {
        profileId,
        type,
        url,
        status: 'PENDING',
      },
    });
  }

  async verifyDocument(id: string, status: 'APPROVED' | 'REJECTED') {
    return this.prisma.document.update({
      where: { id },
      data: {
        status,
        verifiedAt: status === 'APPROVED' ? new Date() : null,
      },
    });
  }

  async getDocuments(user: AuthUser, profileId?: string) {
    if (user.role === UserRole.EMPLOYEE) {
      const profile = await this.prisma.profile.findUnique({
        where: { userId: user.userId },
      });
      if (!profile) return [];
      return this.prisma.document.findMany({
        where: { profileId: profile.id },
        orderBy: { id: 'desc' },
      });
    }

    if (profileId) {
      return this.prisma.document.findMany({
        where: { profileId },
        include: { profile: { select: { firstName: true, lastName: true } } },
        orderBy: { id: 'desc' },
      });
    }

    return this.prisma.document.findMany({
      include: { profile: { select: { firstName: true, lastName: true } } },
      orderBy: { id: 'desc' },
    });
  }

  async getDocumentFile(id: string, user: AuthUser) {
    const document = await this.prisma.document.findUnique({
      where: { id },
      include: { profile: true },
    });
    if (!document) throw new NotFoundException('Document not found');

    if (user.role === UserRole.EMPLOYEE) {
      const profile = await this.prisma.profile.findUnique({
        where: { userId: user.userId },
      });
      if (!profile || document.profileId !== profile.id) {
        throw new ForbiddenException('Access denied');
      }
    }

    const filename = path.basename(document.url);
    const filepath = path.join(this.uploadDir, filename);
    if (!fs.existsSync(filepath)) throw new NotFoundException('File not found on disk');

    return { filepath, filename };
  }
}
