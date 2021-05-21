import { Schema } from 'mongoose'

export const ConfirmationTokenSchema = new Schema({
	token: {
		type: String,
		required: true,
		unique: true
	},
	userId: {
		type: String,
		required: true
	}
})