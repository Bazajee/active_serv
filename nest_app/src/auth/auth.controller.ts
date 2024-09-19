import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';



@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    @Post('init-session')
    async logIn(@Body() dto: AuthDto): Promise<object> {
        return await this.authService.login(dto)
    }
}

