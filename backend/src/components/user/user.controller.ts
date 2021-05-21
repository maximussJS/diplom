import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';

import { Observable } from 'rxjs'

import { AuthGuard } from '../../guards'
import { UserService } from './user.service'
import { CreateUserDto, UserDto } from './dto'


@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
	constructor(
		private readonly userService: UserService
	) {}
	
	@Post()
	create(@Body() data: CreateUserDto): Observable<UserDto> {
		return this.userService.create(data)
	}
	
	@Get()
	findAll(): Observable<UserDto[]> {
		return this.userService.findAll()
	}
}
