import { Injectable, NestMiddleware, Logger, LoggerService, Inject } from '@nestjs/common'

import { Request, Response, NextFunction } from 'express'


@Injectable()
export class LoggerMiddleware implements NestMiddleware {
	constructor(
		@Inject(Logger) private readonly logger: LoggerService
	) {}
	
	use(req: Request, res: Response, next: NextFunction) {
		const { ip, method, path: url } = req
		const userAgent = req.get('user-agent') || ''
		
		res.on('finish', () => {
			const { statusCode } = res
			const contentLength = res.get('content-length')
			this.logger.log(`${method} ${url} ${statusCode} ${contentLength} - ${userAgent} ${ip}`)
		})
		
		next()
	}
}