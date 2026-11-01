import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId: user.id },
      select: { id: true, firstName: true, lastName: true, position: true },
    });

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
        profile,
      },
    };
  }

  async register(data: any) {
    const { email, password, role, ...profileData } = data;
    
    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new Error('User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user and profile in a transaction
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role,
          mfaSecret: 'PLACEHOLDER_MFA_SECRET', // Placeholder for MFA implementation
        },
      });

      if (role === 'EMPLOYEE') {
        await tx.profile.create({
          data: {
            userId: user.id,
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            dob: new Date(profileData.dob),
            gender: profileData.gender,
            niNumber: profileData.niNumber,
            phone: profileData.phone,
            address: profileData.address,
            postcode: profileData.postcode,
            city: profileData.city,
            country: profileData.country,
            emergencyContact: profileData.emergencyContact,
            emergencyPhone: profileData.emergencyPhone,
            relationship: profileData.relationship,
            bankAccountName: profileData.bankAccountName,
            bankSortCode: profileData.bankSortCode,
            bankAccountNumber: profileData.bankAccountNumber,
            rtwStatus: profileData.rtwStatus,
            visaType: profileData.visaType,
            visaExpiry: profileData.visaExpiry ? new Date(profileData.visaExpiry) : null,
          },
        });
      }
      
      return user;
    });
  }
}
