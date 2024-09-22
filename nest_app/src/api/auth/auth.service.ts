import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/core/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {}

    // initiate a jwtToken for handle the API access
    async initSession(body: { email: string; password: string }): Promise<object> {
        console.log(typeof body, ':', body);
        const user = await this.prisma.user.findUnique({
            where: {
                email: body.email,
            },
        });
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
        return { sessionToken: jwtToken };
    }

    async signUp (body: { email:string; username: string; password: string }) {
        console.log(body)
        const newUser = await this.usersService.createUser(body)
        return newUser
    }


    async logIn (body: { email: string; password: string }): Promise<Object> {
        console.log(typeof body, ':', body);
        const user = await this.usersService.getUserByEmail(body.email)
        console.log(user)
        return {tptp: 'tototo'}
    }


}
