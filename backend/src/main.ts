import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'

import * as cookieParser from 'cookie-parser'

import { HttpExceptionFilter } from './filters'
import { AppModule } from './components/app/app.module'


const bootstrap = async () => {
	const app = await NestFactory.create(AppModule)
	
	const configService = app.get<ConfigService>(ConfigService)
	
	app.use(cookieParser());
	
	app.useGlobalPipes(new ValidationPipe())
	
	app.useGlobalFilters(new HttpExceptionFilter())
	
	const port = configService.get('port')
	
	await app.listen(port)
}

bootstrap().catch(console.error)
