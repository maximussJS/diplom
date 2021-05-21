import { Document } from 'mongoose'

export interface ConfirmationToken extends Document {
	token: string;
	userId: string
}