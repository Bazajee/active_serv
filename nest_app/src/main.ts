import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    const port = parseInt(process.env.NEST_RUNNING_PORT);
    const app = await NestFactory.create(AppModule)
    app.enableCors({
        origin: 'http://localhost:5173', // Allow only your frontend origin
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Specify allowed methods
        credentials: true, // Include cookies in requests
      });
    app.use(cookieParser());
    await app.listen(port);

    
}
bootstrap();
