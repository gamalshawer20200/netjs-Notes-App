import '../.env'

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express'

const port = process.env.PORT || 3070

async function bootstrap() {
    // const app = await NestFactory.create(AppModule);
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    await app.listen(port);
    console.log('Server started on port',port)
  }
bootstrap();
