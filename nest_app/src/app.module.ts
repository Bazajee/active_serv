import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './api/auth/auth.module';
import { UsersModule } from './core/users/users.module';
import { PrismaModule } from './core/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [UsersModule, PrismaModule, AuthModule],
    controllers: [AppController],
    providers: [AppService],
    exports: [],
})
export class AppModule {}
