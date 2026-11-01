import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { profile: true, company: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(userId: string, data: any) {
    return this.prisma.profile.update({
      where: { userId },
      data,
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      include: { profile: true, company: true },
    });
  }

  async findWorkers() {
    return this.prisma.user.findMany({
      where: { role: 'EMPLOYEE' },
      include: {
        profile: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            position: true,
            phone: true,
            city: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
