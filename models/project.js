const mongoose = require('mongoose')
const Schema = mongoose.Schema

const projectSchema = new Schema({
  date_of_creation: Date,
	agency_name: Object,
	ref_no: String,
	description: String,
	due_date: String,
	inflow: Number,
  balance: Number,
  status: {
    type: String,
    default: 'active'
  },
}, { timestamps: true });

const Project = mongoose.model("project", projectSchema);
module.exports = Project;