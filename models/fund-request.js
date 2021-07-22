const mongoose = require('mongoose')
const Schema = mongoose.Schema

const fundRequestSchema = new Schema({
  requester: Object,
  project: Object,
  date: Date,
  amount_requested: Number,
  bank: String,
  account_name: String,
  account_number: String,
  payments: Array,
  attachement: String,
  approval_details: Array,
}, { timestamps: true });

const FundRequest = mongoose.model("fundRequest", fundRequestSchema);
module.exports = FundRequest;