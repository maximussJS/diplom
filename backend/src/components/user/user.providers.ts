import { Connection } from 'mongoose'

import { UserSchema } from './user.schema'
import { MONGODB_CONNECTION, USER_MODEL } from '../../constants'


export const UserProviders = [
	{
		provide: USER_MODEL,
		useFactory: (connection: Connection) => connection.model('User', UserSchema),
		inject: [MONGODB_CONNECTION]
	}
]