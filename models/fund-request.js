const mongoose = require('mongoose')
const Schema = mongoose.Schema

const fundRequestSchema = new Schema({
  date: Date,
	requester: String,
  approver: String,
	company: String,
	ministry: String,
	project: Object,
  location: String,
  description: String,
  amount: Number
}, { timestamps: true });

const FundRequest = mongoose.model("fundRequest", fundRequestSchema);
module.exports = FundRequest;