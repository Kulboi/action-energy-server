const FundManagementModel = require("../models/fund-management");
const ProjectModel = require("./../models/project");
const { Validator } = require('node-input-validator');

class FundRequestController {
  async request(req, res) {
    try {
      const v = new Validator(req.body, {
        bank: 'required',
        project: 'required|object',
        agency: 'required|object',
        amount: 'required',
        requested_by: 'required|object'
      });
      const validate = await v.check();
      if(!validate) {
        return res.status(400).json({
          success: false,
          message: "Invalid or incomplete inputs",
          data: v.errors
        });
      }

      const addRequest = await FundManagementModel.create(req.body);
      res.status(201).json({
        success: true,
        message: "Fund request recorded",
        data: addRequest
      })
    }catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
        data: []
      });
      throw new Error(error);
    }
  }

  async approve(req, res) {
    try {
      const request = await FundManagementModel.find({ _id: req.params.id });
      const project = await ProjectModel.find({ _id: request.project.id });
      const projectFundBal = parseFloat(project.balance) - parseFloat(request.amount);
      await ProjectModel.findByIdAndUpdate(request.project.id, { 
        balance: projectFundBal 
      });
      await FundManagementModel.findByIdAndUpdate(req.params.id, { 
        status: 'approved' 
      });

      res.status(200).json({
        success: true,
        message: "Fund request approved successfully",
        data: []
      })
    }catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
        data: []
      });
      throw new Error(error);
    }
  }


  async reject(req, res) {
    try {
      await FundManagementModel.findByIdAndUpdate(req.params.id, { 
        status: 'rejected' 
      });

      res.status(200).json({
        success: true,
        message: "Fund request rejected",
        data: []
      })
    }catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
        data: []
      });
      throw new Error(error);
    }
  }

  async all(req, res) {
    try {
      const { limit, page } = req.query;
      const requests = await FundManagementModel
      .find()
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

      res.status(200).json({
        success: true,
        message: "Fund requests",
        data: requests
      });
    }catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
        data: []
      });
      throw new Error(error);
    }
  }

  async disbursements(req, res) {
    try {
      const { limit, page } = req.query;
      const disbursements = await FundManagementModel
      .find({ status: 'approved' })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

      res.status(200).json({
        success: true,
        message: "Fund disbursements",
        data: disbursements
      });
    }catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
        data: []
      });
      throw new Error(error);
    }
  }

  async update(req, res) {
    try {
      await FundManagementModel.updateOne({ _id: req.query.id }, req.body);
      res.status(200).json({
        success: true,
        message: "Fund request updated",
        data: req.body
      });
    }catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
        data: []
      });
      throw new Error(error);
    }
  }
}

module.exports = FundRequestController;