const mongoose = require('mongoose')
const Schema = mongoose.Schema

const fundRequestSchema = new Schema({
  bank: String,
	project: Object,
	agency: Object,
	requested_by: Object,
	signatory: Object,
  amount: Number,
  status: {
    type: String,
    default: 'pending'
  }
}, { timestamps: true });

const FundRequest = mongoose.model("fundRequest", fundRequestSchema);
module.exports = FundRequest;