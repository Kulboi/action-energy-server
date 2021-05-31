const mongoose = require('mongoose')
const Schema = mongoose.Schema

const sitePurchaseSchema = new Schema({
  date: Date,
  site_number: String,
  location: String,
  bank: String,
  recipient: String,
  amount: Number,
  project: Object,
  payee: String,
  type: String,
}, 
{ timestamps: true });

sitePurchaseSchema.index({'$**': 'text'});

const SitePurchase = mongoose.model("site-purchase", sitePurchaseSchema);
module.exports = SitePurchase;