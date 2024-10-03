import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    const port = parseInt(process.env.NEST_RUNNING_PORT);
    const app = await NestFactory.create(AppModule)
    app.use(cookieParser());
    await app.listen(port);
}
bootstrap();
