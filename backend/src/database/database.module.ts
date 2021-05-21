import { Module } from '@nestjs/common'

import { MongoDbProviders } from './mongodb.providers'


@Module({
	providers: [...MongoDbProviders],
	exports: [...MongoDbProviders]
})
export class DatabaseModule {}
