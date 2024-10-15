import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './roles/roles.guard';

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET_KEY,
            signOptions: { expiresIn: '1h' },
        }),
    ],
    providers: [AuthService, 
        {
            provide: APP_GUARD,
            useClass: RolesGuard,  
          },
    ],
    controllers: [AuthController],
})
export class AuthModule {}
