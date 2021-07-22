const mongoose = require('mongoose')
const Schema = mongoose.Schema

const paymentRequestSchema = new Schema({
  site: String,
  site_number: String,
  purposes: Array,
  payee: String,
  bank: String,
  account_number: String,
  attachement: String,
  status: {
    type: String,
    default: 'pending'
  },
  approval_details: Array,
  created_by: Object
}, 
{ timestamps: true });

paymentRequestSchema.index({'$**': 'text'});

const PaymentRequest = mongoose.model("payment-request", paymentRequestSchema);
module.exports = PaymentRequest;