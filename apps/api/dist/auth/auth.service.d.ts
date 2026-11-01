import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            role: any;
            companyId: any;
            profile: {
                id: string;
                firstName: string;
                lastName: string;
                position: string | null;
            } | null;
        };
    }>;
    register(data: any): Promise<{
        id: string;
        email: string;
        password: string;
        role: import("database").$Enums.UserRole;
        isVerified: boolean;
        mfaEnabled: boolean;
        mfaSecret: string | null;
        createdAt: Date;
        updatedAt: Date;
        companyId: string | null;
    }>;
}
