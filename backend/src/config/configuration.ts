export default () => ({
	port: parseInt(process.env.PORT, 10) || 3001,
	mongoDbConnectionString: process.env.MONGODB_CONNECTION_STRING,
	mailUserName: process.env.MAIL_USERNAME,
	mailPassword: process.env.MAIL_PASSWORD,
	confirmationLink: process.env.CONFIRMATION_LINK || 'http://localhost:3001/auth/confirmation',
	confirmationRedirectionLink: process.env.CONFIRMATION_REDIRECTION_LINK || 'http://localhost:3000/login',
	jwtSecret: process.env.JWT_SECRET,
	jwtTtl: process.env.JWT_TTL || '1d',
	confirmationTokenLength: parseInt(process.env.CONFIRMATION_TOKEN_LENGTH, 10) || 128
});