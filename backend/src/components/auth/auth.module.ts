import { JwtModule } from '@nestjs/jwt'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { UserModule } from '../user/user.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { DatabaseModule } from '../../database/database.module'
import { ConfirmationTokenProviders } from './confirmation/confirmation-token.providers'
import { ConfirmationTokenRepository } from './confirmation/confirmation-token.repository'


@Module({
	imports: [
		ConfigModule,
		DatabaseModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				secret: configService.get('jwtSecret'),
				signOptions: {
					expiresIn: configService.get('jwtTtl')
				}
			}),
			inject: [ConfigService]
		}),
		UserModule
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		ConfirmationTokenRepository,
		...ConfirmationTokenProviders
	]
})
export class AuthModule {
}
