const mongoose = require('mongoose')
const Schema = mongoose.Schema

const projectSchema = new Schema({
  ref_no: String,
  award_date: Date,
  description: String,
  company_name: String,
  agency: String,
  location: String,
  brief_of_summary: {
    description: String,
    file_path: String
  },
  statutory_deductions: Array,
  other_deductions: Array,
  available_balance: Number,
  award_amount: Number,
  actual_inflow: Number,
  total_statutory_deductions: Number,
  total_deductions: Number,
  anticipated_inflow: Number,
  anticipated_profit: Number,
  anticipated_profit_percentage: Number,
  status: {
    type: String,
    default: 'pending'
  },
  approval_details: Array,
  created_by: Object,
}, 
{ timestamps: true });

projectSchema.index({'$**': 'text'});

const Project = mongoose.model("project", projectSchema);
module.exports = Project;