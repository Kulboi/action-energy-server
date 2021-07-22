const mongoose = require('mongoose')
const Schema = mongoose.Schema

const disbursementSchema = new Schema({
  project: Object,
  requester: String,
  approver: String,
  reason: String,
  date: Date,
  amount: String,
  approval_doc_url: String,
  status: String
}, 
{ timestamps: true });

disbursementSchema.index({'$**': 'text'});

const Disbursement = mongoose.model("disbursement", disbursementSchema);
module.exports = Disbursement;