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
        return await this.authService.initSession(dto);
    }

    @Post('sign-in')
    async signUp(@Body() dto: UserDto): Promise<object> {
        return await this.authService.signUp(dto);
    }

    @Post('login')
    async logIn(
        @Body() dto: AuthDto,
        @Res() response: Response,
    ): Promise<object> {
        console.log('in controller');
        const logInResult = await this.authService.logIn(dto);
        if (!logInResult.token) {
            return response
                .status(HttpStatus.UNAUTHORIZED)
                .json({ message: logInResult.message });
        }
        response.cookie('jwt', logInResult.token, {
            httpOnly: true,
            maxAge: 3600000,
        });

        return response
            .status(HttpStatus.OK)
            .json({ message: logInResult.message });
        // define data need by the front
    }

    @Get('test-role')
    @Roles('ADMIN')
    async testRole(): Promise<object> {
        return {'toto': 'toto'}
    }
}
