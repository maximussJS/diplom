import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Module, MiddlewareConsumer, Logger } from '@nestjs/common'

import * as cors from 'cors'
import * as helmet from 'helmet'
import { WinstonModule } from 'nest-winston'
import { MailerModule } from '@nestjs-modules/mailer'


import { AppService } from './app.service'
import { UserModule } from '../user/user.module'
import { AuthModule } from '../auth/auth.module'
import { AppController } from './app.controller'
import { UserController } from '../user/user.controller'
import { AuthController } from '../auth/auth.controller'
import { LoggerMiddleware } from '../../middlewares'
import { LoggerConfig, configuration } from '../../config'
import { AuthGuard } from '../../guards'

const logger = new LoggerConfig()


@Module({
	imports: [
		ConfigModule.forRoot({
			load: [configuration.default],
			envFilePath: ['.env'],
			expandVariables: true,
		}),
		WinstonModule.forRoot(logger.console()),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				secret: configService.get('jwtSecret'),
				signOptions: {
					expiresIn: configService.get('jwtTtl')
				}
			}),
			inject: [ConfigService],
		}),
		MailerModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				transport: {
					host: "smtp.gmail.com",
					port: 465,
					secure: true,
					auth: {
						user: configService.get('mailUserName'),
						pass: configService.get('mailPassword')
					}
				},
				defaults: {
					from: configService.get('mailUserName')
				}
			})
		}),
		UserModule,
		AuthModule
	],
	controllers: [AppController],
	providers: [AppService, Logger, AuthGuard],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(
				cors(),
				helmet(),
				LoggerMiddleware
			)
			.forRoutes(
				AppController,
				UserController,
				AuthController
			)
	}
}
