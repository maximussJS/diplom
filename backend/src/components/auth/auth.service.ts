import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { Injectable, HttpException, HttpStatus } from '@nestjs/common'

import { createHash } from 'crypto'
import { from, Observable, of } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'
import { MailerService } from '@nestjs-modules/mailer'

import { ROLES } from '../../constants'
import { User } from '../user/user.interface'
import { LoginDto, AccessTokenDto } from './dto'
import { UserService } from '../user/user.service'
import { CreateUserDto, UserDto } from '../user/dto'
import { ConfirmationTokenRepository } from './confirmation/confirmation-token.repository'


@Injectable()
export class AuthService {
	private readonly confirmationLink: string;
	
	constructor(
		private readonly jwtService: JwtService,
		private readonly userService: UserService,
		private readonly mailerService: MailerService,
		private readonly configService: ConfigService,
		private readonly confirmationTokenRepository: ConfirmationTokenRepository
	) {
		this.confirmationLink = this.configService.get('confirmationLink')
	}
	
	login(data: LoginDto): Observable<AccessTokenDto> {
		const { email, password } = data
		
		return this.userService.findByEmail(email)
			.pipe(
				switchMap(user => {
					if (!user || user.password !== this.createSha256Digest(password)) {
						throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST)
					}
					
					const payload = {
						user: this.exposeUserData(user),
						sub: user.id,
					}
					
					return of(new AccessTokenDto(this.jwtService.sign(payload)))
				})
			)
	}
	
	registration(data: CreateUserDto): Observable<UserDto> {
		const { email, password } = data
		
		return this.userService.isUserExists(email)
			.pipe(
				switchMap(isUserExists => {
					if (isUserExists) {
						throw new HttpException(`User with email '${email}' already exists`, HttpStatus.BAD_REQUEST)
					}
					
					const passwordHash = this.createSha256Digest(password)
					
					return this.userService.create(Object.assign(data, {
						password: passwordHash,
						role: ROLES.ADMIN
					}))
				}),
				switchMap(user =>
					this.confirmationTokenRepository.create(user.id)
						.pipe(
							map(token => this.sendConfirmationMail(user, token)),
							map(() => this.exposeUserData(user))
					)
				)
			)
	}
	
	confirmation(confirmationToken: string): Observable<unknown> {
		return this.confirmationTokenRepository.get(confirmationToken)
			.pipe(
				switchMap(tokenRecord => {
					console.log(tokenRecord)
					if (!tokenRecord) {
						throw new HttpException(`Invalid token ${confirmationToken}`, HttpStatus.BAD_REQUEST)
					}
					
					return this.userService.updateUserStatus(tokenRecord.userId, true)
				}),
				switchMap(() => this.confirmationTokenRepository.delete(confirmationToken))
			)
	}
	
	sendConfirmationMail(user: UserDto, token: string): Observable<unknown> {
		return from(this.mailerService.sendMail({
			to: user.email,
			subject: `Dear ${user.firstName} ${user.lastName}! Confirm Your Email For WebClinic`,
			text: `Click the link to confirm your email ${this.confirmationLink.concat('?confirmationToken=', token)}`
		}))
	}
	
	createSha256Digest(data: string): string {
		return createHash('sha256').update(data).digest().toString('hex')
	}
	
	exposeUserData(user: User): UserDto {
		return {
			id: user.id,
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			age: user.age,
			role: user.role,
			createdAt: user.createdAt,
			image: user.image,
		}
	}
}
