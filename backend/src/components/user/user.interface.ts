import { Document } from 'mongoose'

import { ROLES } from '../../constants'


export class User extends Document {
	id: string;
	
	firstName: string;
	
	lastName: string;
	
	email: string;
	
	password: string;
	
	age: number;
	
	active: boolean;
	
	role: ROLES;
	
	image: string;
	
	createdAt: string;
	
	updatedAt: string;
}