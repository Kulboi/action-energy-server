const mongoose = require('mongoose')
const Schema = mongoose.Schema

const sitePurchaseSchema = new Schema({
  date: Date,
  site_number: String,
  location: String,
  recipient: String,
  amount: Number,
  project: Object,
  payee: String,
  type: String,
  status: {
    type: String,
    default: 'pending'
  },
  approval_details: Array,
  created_by: Object
}, 
{ timestamps: true });

sitePurchaseSchema.index({'$**': 'text'});

const SitePurchase = mongoose.model("site-purchase", sitePurchaseSchema);
module.exports = SitePurchase;