import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async createUser(requestData: { email:string; username: string; password: string }) {
        const hash = await bcrypt.hash(requestData.password, 10)
        console.log(hash)
        const userData = {
            email: requestData.email,
            password: hash, 
            name: requestData.username,
        };
        console.log(userData)
        const newUser = await this.prisma.user.create({
            data: userData
        })
        console.log(newUser)
        return newUser
    }

    async getUsers() {
        return this.prisma.user.findMany();
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

    async updateUser(id: number, data: Prisma.UserUpdateInput) {
        return this.prisma.user.update({
            where: { id },
            data,
        });
    }

    async deleteUser(id: number) {
        return this.prisma.user.delete({
            where: { id },
        });
    }
}
