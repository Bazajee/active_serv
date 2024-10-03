import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './api/auth/auth.module';
import { UsersModule } from './core/user/users.module';
import { PrismaModule } from './core/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { GroupModule } from './group/group.module';

@Module({
    imports: [UsersModule, PrismaModule, AuthModule, GroupModule],
    controllers: [AppController],
    providers: [AppService],
    exports: [],
})
export class AppModule {}
