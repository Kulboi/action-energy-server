const DisbursementModel = require("./../models/disbursement");
const ProjectModel = require("./../models/project");
const { Validator } = require("node-input-validator");

class DisbursementController {
  async add(req, res) {
    try {
      const v = new Validator(req.body, {
        project: 'required|object',
        requester: 'required',
        approver: 'required',
        reason: 'required',
        date: 'required',
        amount: 'required',
        approval_doc_url: 'required',
      });
      const validate = await v.check();
      if(!validate) {
        return res.status(400).json({
          success: false,
          message: "Invalid or incomplete inputs",
          data: v.errors
        });
      }

      const project = await ProjectModel.find({ _id: req.body.project._id });
      if(req.body.amount > project.available_balance) {
        return res.status(400).json({
          success: false,
          message: "Amount greater than available balance",
          data: v.errors
        });
      }

      const addItem = await DisbursementModel.create(req.body);
      const currentBalance = project.available_balance - req.body.amount;
      await ProjectModel.updateOne({ _id: req.body.project._id }, { available_balance: currentBalance });
      res.status(201).json({
        success: true,
        message: "Disbursement recorded successful",
        data: addItem
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
        data: [],
      });
      throw new Error(error);
    }
  }

  async all(req, res) {
    try {
      const { projectId, limit, page } = req.query;

      const project = await ProjectModel.find({ _id: projectId });
      console.log(project)
      if(project.actual_inflow === 0) {
        return res.status(200).json({
          success: true,
          message: "No actual inflow recorded",
          data: []
        });
      }


      const disbursements = await DisbursementModel
      .find({ 'project._id': projectId })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
      console.log(`project inflow: ${project.actual_inflow}`)
      console.log(`project inflow: ${project.available_balance}`)
      res.status(200).json({
        success: true,
        message: "Recorded disbursements",
        data: {
          payload: disbursements, 
          count: await DisbursementModel.countDocuments({}),
          actual_inflow: project.actual_inflow,
          available_balance: project.available_balance
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
        data: [],
      });
      throw new Error(error);
    }
  }

  async update(req, res) {
    try {
      await DisbursementModel.updateOne({ _id: req.query.id }, req.body);
      res.status(200).json({
        success: true,
        message: "Updated disbursement's details",
        data: req.body
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
        data: [],
      });
      throw new Error(error);
    }
  }

  async remove(req, res) {
    try {
      await DisbursementModel.deleteOne({ _id: req.query.id });
      res.status(200).json({
        success: true,
        message: "Disbursement record deleted",
        data: []
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
        data: [],
      });
      throw new Error(error);
    }
  }
}

module.exports = DisbursementController;
