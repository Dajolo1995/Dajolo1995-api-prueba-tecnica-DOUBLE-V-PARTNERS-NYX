import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { enviroments } from './enviroments';
import * as Joi from 'joi';
import config from './config';
import { PrismaModule } from './prisma/prisma.module'; 

const nodeEnv =
  (process.env.NODE_ENV as keyof typeof enviroments) ?? 'development';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: enviroments[nodeEnv] ?? '.env',
      load: [config],
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
      }),
    }),
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
