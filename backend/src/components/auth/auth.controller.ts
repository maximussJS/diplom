import { Controller, Post, Body, Get, Query, Redirect, Res } from '@nestjs/common'

import { Response } from 'express'
import { Observable, of } from 'rxjs'
import { switchMap } from 'rxjs/operators'

import { LoginDto } from './dto'
import { AuthService } from './auth.service'
import { CreateUserDto, UserDto } from '../user/dto'


@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
	) {}
	
	@Post('login')
	login(
		@Body() data: LoginDto,
		@Res({
			passthrough: true
		}) response: Response
	): Observable<string> {
		return this.authService.login(data).pipe(
			switchMap(result => {
				response.cookie('token', result.accessToken, {
					httpOnly: true
				})
				return of('OK')
			})
		)
	}
	
	@Post('registration')
	registration(@Body() data: CreateUserDto): Observable<UserDto> {
		return this.authService.registration(data)
	}
	
	@Get('confirmation')
	@Redirect(process.env.CONFIRMATION_REDIRECTION_LINK, 301)
	confirmation(@Query('confirmationToken') confirmationToken: string): Observable<unknown> {
		return this.authService.confirmation(confirmationToken)
	}
}
