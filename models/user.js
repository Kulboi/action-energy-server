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
		default: 'ADMIN',
		enum: ['ADMIN', 'MD', 'PROJECT_MANAGER', 'AUDITOR', 'USER']
	}
});

const User = mongoose.model("user", userSchema);
module.exports = User;