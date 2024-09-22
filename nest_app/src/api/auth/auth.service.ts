import { Injectable, Request, Response } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/core/users/users.service';
import { request } from 'http';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {}

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
        console.log(typeof body, ':', body);
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
    async logIn(
        body: { email: string; password: string },
        @Request() request,
        @Response({ passthrough: true }) response,
    ): Promise<Object> {
        const user = await this.usersService.getUserByEmail(body.email);
        if (!user) {
            return { message: 'this email is not register.' };
        }
        const isPasswordValid = this.validatePassword(
            body.password,
            user.password,
        );
        if (!isPasswordValid) {
            return { error: 'Authentification failed' };
        }
        const jwtToken = await this.jwtService.signAsync(
            { email: user.email, username: user.name, group: user.groupId },
            { expiresIn: '1h' },
        );
        response.cookie('jwt', jwtToken, {
            httpOnly: true,
            maxAge: 3600000,
            // add security (samesite, secure, ...)
        });
        return { message: 'login succeed' };
    }
}
