import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { UserDto } from './dto/user.dto';
import { promises } from 'dns';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('init-session')
    async initApiSession(@Body() dto: AuthDto): Promise<object> {
        return await this.authService.initSession(dto);
    }

    @Post('sign-in')
    async signUp(@Body() dto: UserDto): Promise<object> {
        return await this.authService.signUp(dto);
    }

    @Post('login')
    async logIn(@Body() dto: AuthDto): Promise<object> {
        return await this.authService.logIn(dto);
        // define data need by the front
    }
}
