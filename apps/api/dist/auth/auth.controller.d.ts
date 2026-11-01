import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: any): Promise<{
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
    login(loginDto: any): Promise<{
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
}
