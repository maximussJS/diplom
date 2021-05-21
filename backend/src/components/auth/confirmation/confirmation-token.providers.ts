import { Connection } from 'mongoose'

import { ConfirmationTokenSchema } from './confirmation-token.schema'
import { MONGODB_CONNECTION, CONFIRMATION_TOKEN_MODEL } from '../../../constants'


export const ConfirmationTokenProviders = [
	{
		provide: CONFIRMATION_TOKEN_MODEL,
		useFactory: (connection: Connection) => connection.model('ConfirmationToken', ConfirmationTokenSchema),
		inject: [MONGODB_CONNECTION]
	}
]