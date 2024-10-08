import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [UsersModule, PrismaModule, AuthModule],
    controllers: [AppController],
    providers: [AppService],
    exports: [],
})
export class AppModule {}
