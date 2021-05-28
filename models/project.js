const mongoose = require('mongoose')
const Schema = mongoose.Schema

const projectSchema = new Schema({
  ref_no: String,
  award_date: Date,
  description: String,
  company_name: String,
  agency: Object,
  location: String,
  award_amount: Number,
  brief_of_summary: {
    description: String,
    file_path: String
  },
  deductables: Array,
  available_balance: {
    type: String,
    default: 0
  },
  actual_inflow: {
    type: String,
    default: 0
  }
}, { timestamps: true });

projectSchema.index({'$**': 'text'});

const Project = mongoose.model("project", projectSchema);
module.exports = Project;