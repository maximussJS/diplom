import { Reflector } from '@nestjs/core'
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'

import { ROLES } from '../constants'


@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}
	
	canActivate(context: ExecutionContext): boolean {
		const roles = this.reflector.get<ROLES[]>('roles', context.getHandler())
		
		if (!roles) {
			return true
		}
		
		const request = context.switchToHttp().getRequest()
		
		const user = request.user
		
		return this.matchRoles(roles, user.role)
	}
	
	matchRoles(roles: ROLES[], userRole: ROLES): boolean {
		return roles.includes(userRole)
	}
}