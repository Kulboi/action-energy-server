const mongoose = require('mongoose')
const Schema = mongoose.Schema

const customerSchema = new Schema({
	fullname: String,
	email: String,
	phone: String,
	address: String,
	tin: String,
  website: String,
  active: {
    type: String,
    default: true
  }
}, { timestamps: true });

const Customer = mongoose.model("customer", customerSchema);
module.exports = Customer;