import { CacheModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as redisStore from 'cache-manager-redis-store';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import configuration from './config';
import { UsersModule } from './users/users.module';
import { ImageUploadModule } from './imageUpload/imageUpload.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { AppointmentModule } from './appointment/appointment.module';
import { CompanyModule } from './company/company.module';
import { CustomerModule } from './customer/customer.module';
import { BreakModule } from './break/break.module';
import { PaymentModule } from './payments/payment.module';
import { ServiceModule } from './service/service.module';
import { StaffModule } from './staff/staff.module';
import { ContactModule } from './contact/contact.module';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        // Type cast important to specify which variant of TypeOrmModuleOptions useFactory() should return
        type: configService.get<string>('database.provider', 'postgres') as 'postgres',
        host: configService.get<string>('database.host', 'localhost'),
        port: configService.get<number>('database.port', 5432),
        username: configService.get<string>('database.user', 'postgres'),
        password: configService.get<string>('database.password', ''),
        database: configService.get<string>('database.name'),
        synchronize: configService.get<boolean>('database.synchronize'),
        autoLoadEntities: true,
        logging: true,
        keepConnectionAlive: true,
      }),
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: 'redis_container',
        port: configService.get<string>('cache.port'),
        ttl: configService.get<string>('cache.ttl'),
      }),
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('email.host'),
          port: configService.get<number>('email.port'),
          secure: false,
          auth: {
            user: configService.get<string>('email.user'),
            pass: configService.get<string>('email.pass'),
          },
        },
        defaults: {
          from: '"Frizerrose" <' + configService.get<string>('email.default') + '>',
        },
        template: {
          dir: process.cwd() + '/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    CommonModule,
    ImageUploadModule,
    AuthModule,
    UsersModule,
    CompanyModule,
    ServiceModule,
    StaffModule,
    CustomerModule,
    BreakModule,
    PaymentModule,
    AppointmentModule,
    ContactModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [
    CommonModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: 'redis',
        port: configService.get<string>('cache.port'),
        ttl: configService.get<string>('cache.ttl'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
