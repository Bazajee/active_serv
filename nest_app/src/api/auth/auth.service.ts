import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/core/user/users.service';
import { GroupService } from 'src/group/group.service';


@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private prisma: PrismaService,
        private jwtService: JwtService,
        private GroupService: GroupService

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
    }): Promise<{ message: string; token?: string, userData?: object  }> {
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
            { email: user.email, username: user.name, userId: user.id },
            { expiresIn: '7h' },
        );
        
        return { message: 'login succeed', token: jwtToken, userData: { mail: user.email, username: user.name, userId: user.id, userGroup: await this.GroupService.getGroupById(user.groupId) } };
    }
}
