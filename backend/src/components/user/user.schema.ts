import { Schema } from 'mongoose'

import { ROLES } from '../../constants'

export const UserSchema = new Schema({
	id: {
		type: String,
		required: true,
		unique: true
	},
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	image: {
		type: String,
		default: 'image'
	},
	role: {
		type: String,
		required: true,
		enum: ROLES
	},
	active: {
		type: Boolean,
		default: false
	},
	age: {
		type: Number,
		required: true
	}
}, {
	timestamps: true
})