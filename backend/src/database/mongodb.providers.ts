import * as mongoose from 'mongoose'

import { MONGODB_CONNECTION } from '../constants'


const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING || 'mongodb://localhost:27017'

if (!MONGODB_CONNECTION_STRING) {
	throw new Error('INVALID MONGODB_CONNECTION_STRING environment variable.')
}

export const MongoDbProviders = [
	{
		provide: MONGODB_CONNECTION,
		useFactory: (): Promise<typeof mongoose> => mongoose.connect(MONGODB_CONNECTION_STRING, {
			useNewUrlParser: true
		})
	}
]