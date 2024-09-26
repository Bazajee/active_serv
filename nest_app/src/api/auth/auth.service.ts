import {
    Injectable,
    Res,
    Request,
    UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/core/users/users.service';
import { Response } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {}

    // async isAuth (@Request request: Request) {{
    //     const cookie = request.cookie
    //     if (!cookie) {
    //         throw new UnauthorizedException('You are not log-in');
    //     }
    //     try {
    //         // Verify the token using JwtService
    //         const payload = this.jwtService.verify(token);

    //         // You can perform additional checks on the payload if necessary
    //         return payload;
    //     } catch (err) {
    //         throw new UnauthorizedException('Invalid or expired JWT');
    //     }
    //     }

    // }

    private async validatePassword(
        plainPassword: string,
        hashedPassword: string,
    ): Promise<boolean> {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    // Handle REST API authentification with a jwtToken
    async initSession(body: {
        email: string;
        password: string;
    }): Promise<object> {
        const user = await this.usersService.getUserByEmail(body.email);
        if (!user) {
            return { error: 'User not found' };
        }
        const isPasswordValid = this.validatePassword(
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
        return { sessionToken: jwtToken };
    }

    async signUp(body: { email: string; username: string; password: string }) {
        const newUser = await this.usersService.createUser(body);
        return newUser;
    }

    // Handle front-end authentification with cookie and jwt-token
    async logIn(body: {
        email: string;
        password: string;
    }): Promise<{ message: string; token?: string }> {
        const user = await this.usersService.getUserByEmail(body.email);
        if (!user) {
            return { message: 'this email is not register.' };
        }
        const isPasswordValid = this.validatePassword(
            body.password,
            user.password,
        );
        if (!isPasswordValid) {
            return { message: 'Authentification failed' };
        }
        const jwtToken = await this.jwtService.signAsync(
            { email: user.email, username: user.name, group: user.groupId },
            { expiresIn: '1h' },
        );
        return { message: 'login succeed', token: jwtToken };
    }
}
