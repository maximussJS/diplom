import { Injectable, Inject } from '@nestjs/common';

import { Model } from 'mongoose'
import { Observable, from } from 'rxjs'
import { v4 as generateId } from 'uuid'

import { User } from './user.interface'
import { USER_MODEL } from '../../constants'
import { CreateUserDto } from './dto'


@Injectable()
export class UserRepository {
	constructor(
		@Inject(USER_MODEL) private readonly userModel: Model<User>
	) {}
	
	create(data: CreateUserDto): Observable<User> {
		const user = new this.userModel({
			id: generateId(),
			...data
		})
		
		return from(user.save())
	}
	
	findAll(): Observable<User[]> {
		return from(this.userModel.find().exec())
	}
	
	findByEmail(email: string): Observable<User | undefined> {
		return from(this.userModel.findOne({
			email
		}).exec())
	}
	
	updateUserStatus(id: string, active: boolean): Observable<unknown> {
		return from(this.userModel.updateOne({
			id
		}, {
			active
		}))
	}
}