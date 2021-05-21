import { Injectable } from '@nestjs/common';

import { Observable, from, of } from 'rxjs'
import { switchMap } from 'rxjs/operators'

import { User } from './user.interface'
import { UserRepository } from './user.repository'
import { CreateUserDto } from './dto'


@Injectable()
export class UserService {
	constructor(
		private readonly userRepository: UserRepository
	) {}
	
	create(data: CreateUserDto): Observable<User> {
		return this.userRepository.create(data)
	}
	
	findAll(): Observable<User[]> {
		return this.userRepository.findAll()
	}
	
	findByEmail(email: string): Observable<User | undefined> {
		return this.userRepository.findByEmail(email)
	}
	
	isUserExists(email: string): Observable<boolean> {
		return this.userRepository.findByEmail(email)
			.pipe(
				switchMap(user => user ? of(true) : of(false))
			)
	}
	
	updateUserStatus(id: string, active: boolean): Observable<unknown> {
		return this.userRepository.updateUserStatus(id, active)
	}
}
