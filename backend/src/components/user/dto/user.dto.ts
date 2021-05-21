import { ROLES } from '../../../constants'


export class UserDto {
	id: string;
	
	firstName: string;
	
	lastName: string;
	
	email: string;
	
	age: number;
	
	role: ROLES;
	
	image: string;
	
	createdAt: string;
}