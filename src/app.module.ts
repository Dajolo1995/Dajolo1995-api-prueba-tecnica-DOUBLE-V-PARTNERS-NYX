import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { enviroments } from './enviroments';
import * as Joi from 'joi';
import config from './config';
import { PrismaModule } from './prisma/prisma.module';
import { ErrorModule } from './error/error.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { join } from 'path';

import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { AppResolver } from './graphql/app.resolver';
import { DebtModule } from './debt/debt.module';
import { DebtParticipantModule } from './debtParticipant/debt-participants.module';
import { EmailModule } from './emails/email.module';
import { CacheModule } from '@nestjs/cache-manager';

const nodeEnv =
  (process.env.NODE_ENV as keyof typeof enviroments) ?? 'development';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      ttl: 60,
      max: 100,
    }),
    ConfigModule.forRoot({
      envFilePath: enviroments[nodeEnv] ?? '.env',
      load: [config],
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        NODEMAILER_HOST: Joi.string().required(),
        NODEMAILER_PORT: Joi.number().required(),
        NODEMAILER_SECURE: Joi.boolean().required(),
        NODEMAILER_USER: Joi.string().required(),
        NODEMAILER_PASSWORD: Joi.string().required(),
      }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),

    PrismaModule,
    ErrorModule,
    UserModule,
    AuthModule,
    DebtModule,
    DebtParticipantModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
