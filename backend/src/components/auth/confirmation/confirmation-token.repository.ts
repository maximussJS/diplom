import { Injectable, Inject } from '@nestjs/common';

import { Model } from 'mongoose'
import { randomBytes } from 'crypto'
import { Observable, from, of } from 'rxjs'
import { switchMap } from 'rxjs/operators'

import { CONFIRMATION_TOKEN_MODEL } from '../../../constants'
import { ConfirmationToken } from './confirmation.token.interface'


@Injectable()
export class ConfirmationTokenRepository {
	private tokenLength = 128;
	
	constructor(
		@Inject(CONFIRMATION_TOKEN_MODEL) private readonly confirmationTokenModel: Model<ConfirmationToken>
	) {}
	
	create(userId: string): Observable<string> {
		const confirmationToken = new this.confirmationTokenModel({
			userId,
			token: this.generateToken()
		})
		
		return from(confirmationToken.save()).pipe(
			switchMap(result => of(result.token))
		)
	}
	
	delete(token: string): Observable<unknown> {
		return from(this.confirmationTokenModel.deleteOne({
			token
		}))
	}
	
	get(token: string): Observable<ConfirmationToken | undefined> {
		return from(this.confirmationTokenModel.findOne({
			token
		}))
	}
	
	generateToken(): string {
		return randomBytes(this.tokenLength).toString('hex')
	}
}