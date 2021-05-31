const mongoose = require('mongoose')
const Schema = mongoose.Schema

const paymentRequestSchema = new Schema({
  date: Date,
  payee: String,
  site_number: String,
  type: String,
}, 
{ timestamps: true });

paymentRequestSchema.index({'$**': 'text'});

const PaymentRequest = mongoose.model("payment-request", paymentRequestSchema);
module.exports = PaymentRequest;