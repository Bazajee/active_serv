import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { promises } from 'dns';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}

    async login (body: {username: string; password: string }) : Promise<string> {

        console.log(typeof(body),':', body)
        const user =  await this.prisma.user.findUnique({
            where: {
              email: body.username,  
            },
          });
        console.log(user)
        // // 
        // init session
        // return session token

        return 'do login'
    }


}