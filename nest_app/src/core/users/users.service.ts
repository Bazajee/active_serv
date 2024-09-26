import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async createUser(requestData: {
        email: string;
        username: string;
        password: string;
    }) {
        const hash = await bcrypt.hash(requestData.password, 10);
        const userData = {
            email: requestData.email,
            password: hash,
            name: requestData.username,
        };
        const newUser = await this.prisma.user.create({
            data: userData,
        });
        return newUser;
    }

    async getUserById(id: number) {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    async getUserByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async updateUserName(requestData: {
        email: string;
        username: string;
        password: string;
    }) {
        const user = this.prisma.user.update({
            where: { email: requestData.email },
            data: {
                name: requestData.username,
            },
        });
        return user;
    }

    async updatePassword(requestData: {
        email: string;
        username: string;
        password: string;
    }) {
        const newHash = await bcrypt.hash(requestData.password, 10);
        const user = this.prisma.user.update({
            where: { email: requestData.email },
            data: {
                password: newHash,
            },
        });
        return user;
    }

    async updateUser(requestData: {
        email: string;
        username: string;
        password: string;
    }) {
        //  Update a User if new data is detect. Set only the field you want to be editable
        let changes = [];
        let newData = {};
        const user = await this.prisma.user.findUnique({
            where: { email: requestData.email },
        });
        if (user.name !== requestData.username) {
            newData['name'] = requestData.username;
            changes.push('User-name');
        }
        if (await bcrypt.compare(requestData.password, user.password)) {
            const newHash = await bcrypt.hash(requestData.password, 10);
            newData['password'] = newHash;
            changes.push('Password');
        }
        if (changes.length > 0) {
            await this.prisma.user.update({
                where: { email: requestData.email },
                data: newData,
            });
            return `The ${changes} update succeed`;
        }
        return 'No changes detect';
    }

    async deleteUser(email: string) {
        return this.prisma.user.delete({
            where: { email: email },
        });
    }
}
