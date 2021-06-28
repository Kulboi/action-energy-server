const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
	fullname: String,
	email: String,
	phone: String,
	location: String,
	password: String,
	role: {
		type: String,
		enum: ['USER', 'PROJECT_MANAGER', 'AUDITOR', 'CFO', 'MD', 'ADMIN'],
		default: 'USER'
	},
	department: String
});

const User = mongoose.model("user", userSchema);
module.exports = User;