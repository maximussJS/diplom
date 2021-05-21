import { JwtService } from '@nestjs/jwt'
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

import { Observable } from 'rxjs';

import { UserService } from '../components/user/user.service'


@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private readonly jwtService: JwtService,
		private readonly userService: UserService
	) {}
	
	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest()

		const accessToken = request.cookies.token
		
		if (!accessToken || !this.jwtService.verify(accessToken)) {
			throw new UnauthorizedException('Invalid Access Token')
		}
		
		const decoded = this.jwtService.decode(accessToken)
		
		request['user'] = decoded['user']
		
		return true
	}
}