const DisbursementModel = require("./../models/disbursement");
const ProjectModel = require("./../models/project");
const { Validator } = require("node-input-validator");
const events = require('events'); 

class DisbursementController {
  constructor() {
    const eventsEmitter = new events.EventEmitter();
  }

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

      const addItem = await DisbursementModel.create(req.body);
      this.eventsEmitter.emit('disbursements:create', req.body);
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
      res.status(200).json({
        success: true,
        message: "Recorded disbursements",
        data: {
          payload: disbursements, 
          count: await DisbursementModel.countDocuments({ 'project._id': projectId }),
          actual_inflow: project[0].actual_inflow,
          available_balance: project[0].available_balance
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
