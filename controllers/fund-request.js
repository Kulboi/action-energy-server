const FundRequestModel = require("../models/fund-request");
const { Validator } = require('node-input-validator');

class FundRequestController {
  async add(req, res) {
    try {
      const v = new Validator(req.body, {
        date: 'required',
        requester: 'required',
        approver: 'required',
        company: 'required',
        ministry: 'required',
        project: 'required|object',
        location: 'required',
        description: 'required',
        amount: 'required',
      });
      const validate = await v.check();
      if(!validate) {
        return res.status(400).json({
          success: false,
          message: "Invalid or incomplete inputs",
          data: v.errors
        });
      }

      const addRequest = await FundRequestModel.create(req.body);
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

  async all(req, res) {
    try {
      const { limit, page } = req.query;
      const requests = await FundRequestModel
      .find()
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

      res.status(200).json({
        success: true,
        message: "Recorded requests",
        data: { 
          payload: requests, 
          count: await FundRequestModel.countDocuments({}) 
        }
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

  async search(req, res) {
    try {
      const { query, limit } = req.query;
      const results = await FundRequestModel
      .find({$text: {$search: query}})
      .limit(parseInt(limit))

      res.status(200).json({
        success: true,
        message: `Results for search query: ${query}`,
        data: {
          payload: results,
          count: results.length
        }
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

  async update(req, res) {
    try {
      await FundRequestModel.findByIdAndUpdate({ _id: req.query.id }, req.body);
      res.status(200).json({
        success: true,
        message: "Record successfully updated",
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

  async remove(req, res) {
    try {
      await FundRequestModel.deleteOne({ _id: req.query.id });
      res.status(200).json({
        success: true,
        message: "Request deleted",
        data: []
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