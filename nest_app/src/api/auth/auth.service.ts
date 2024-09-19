import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {}

    // initiate a jwtToken for handle the API access
    async login(body: { email: string; password: string }): Promise<object> {
        console.log(typeof body, ':', body);
        const user = await this.prisma.user.findUnique({
            where: {
                email: body.email,
            },
        });
        const secret = process.env.JWT_SECRET_KEY;
        console.log(secret);
        if (!user) {
            return { error: 'User not found' };
        }
        const isPasswordValid = await bcrypt.compare(
            body.password,
            user.password,
        );
        if (!isPasswordValid) {
            return { error: 'Authentification failed' };
        }
        const payload = { userId: user.id, email: user.email };
        const jwtToken = await this.jwtService.signAsync(payload, {
            expiresIn: '1h',
        });
        console.log(jwtToken);
        return { sessionToken: jwtToken };
    }
}
