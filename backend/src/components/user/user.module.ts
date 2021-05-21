import { JwtModule } from '@nestjs/jwt'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { UserService } from './user.service'
import { UserProviders } from './user.providers'
import { UserRepository } from './user.repository'
import { UserController } from './user.controller'
import { DatabaseModule } from '../../database/database.module'

@Module({
	imports: [
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
	],
	controllers: [UserController],
	providers: [
		UserService,
		UserRepository,
		...UserProviders
	],
	exports: [UserService]
})
export class UserModule {}
