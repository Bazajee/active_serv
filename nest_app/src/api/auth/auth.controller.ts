import { Controller, Get, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { UserDto } from './dto/user.dto';
import { Response } from 'express';
import { Roles } from './roles/roles.decorator';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('init-session')
    async initApiSession(@Body() dto: AuthDto): Promise<object> {
        return await this.authService.initSession(dto)
    }

    @Post('sign-up')
    async signUp(@Body() dto: UserDto): Promise<object> {
        return await this.authService.signUp(dto)
    }

    @Post('login')
    async logIn(
        @Body() dto: AuthDto,
        @Res() response: Response,
    ): Promise<object> {
        const logInResult = await this.authService.logIn(dto)
        if (!logInResult.token) {
            return response
                .status(HttpStatus.UNAUTHORIZED)
                .json({ message: logInResult.message });
        }
        response.cookie('jwt', logInResult.token, {
            // update for production 
            httpOnly: false,
            maxAge: 3600000,
            secure: false,  
            sameSite: 'lax',
            domain: 'localhost',
        });

        return response
            .status(HttpStatus.OK)
            .json({ 
                message: logInResult.message,
                userData: logInResult.userData
            });       
    }

    @Get('test-role')
    @Roles('ADMIN',) 
    async testRole(): Promise<object> {
        return {'toto': 'toto'}
    }
}
