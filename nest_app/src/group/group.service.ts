import { Injectable } from '@nestjs/common';
import { Prisma, UserGroup } from '@prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class GroupService {
    constructor(private prisma: PrismaService) {}

    getGroupById(id: number) {
        return this.prisma.userGroup.findUnique({
            where: { id },
        });
    }
}
