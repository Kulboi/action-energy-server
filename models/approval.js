const mongoose = require('mongoose')
const Schema = mongoose.Schema

const approvalSchema = new Schema({
  module: String,
  id: ObjectId,
  approved: Boolean,
  approver: Object
}, 
{ timestamps: true });

approvalSchema.index({'$**': 'text'});

const Approval = mongoose.model("approval", approvalSchema);
module.exports = Project;