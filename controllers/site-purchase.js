const SitePurchaseModel = require("./../models/site-purchase");
const { Validator } = require('node-input-validator');

const json2csv = require('json2csv').parse;
const fs = require('fs');
const randomString = require('./../helpers/randomString');

class SitePurchaseController {
  async add(req, res) {
    try {
      const v = new Validator(req.body, {
        date: 'required',
        location: 'required',
        site_number: 'required',
        recipient: 'required',
        amount: 'required',
        project: 'required|object',
        payee: 'required',
        type: 'required'
      });
      const validate = await v.check();
      if(!validate) {
        return res.status(400).json({
          success: false,
          message: "Invalid or incomplete inputs",
          data: v.errors
        });
      }

      const addRecord = await SitePurchaseModel.create(req.body);
      res.status(201).json({
        success: true,
        message: "Recorded successfully",
        data: addRecord
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
      const requests = await SitePurchaseModel
      .find()
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

      console.log({ 
        payload: requests, 
        count: await SitePurchaseModel.countDocuments({}) 
      })

      res.status(200).json({
        success: true,
        message: "Records",
        data: { 
          payload: requests, 
          count: await SitePurchaseModel.countDocuments({}) 
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
      const results = await SitePurchaseModel
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
      await SitePurchaseModel.updateOne({ _id: req.query.id }, req.body);
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
      await SitePurchaseModel.deleteOne({ _id: req.query.id });
      res.status(200).json({
        success: true,
        message: "Record deleted",
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

  async downloadRecords(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const records = await SitePurchaseModel.find({
        createdAt: {
          $gte: new Date(new Date(startDate)),
          $lte: new Date(new Date(endDate))
        }
      })

      const fields = [
        'id',
        'date',
        'site_number',
        'location',
        'recipient',
        'amount',
        'project',
        'payee',
        'type',
        'createdAt',
        'updatedAt'
      ];
      
      const csv = json2csv(records, { fields });
      const randomStr = randomString();
      const filePath = `site-purchase-csv-${randomStr}.csv`;
      fs.writeFile(filePath, csv, function (err) {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: {
              message: err
            }
          });
        }

        // setTimeout(function () {
        //   fs.unlinkSync(filePath);
        // }, 500000)
        res.status(200).json({
          success: true,
          message: `Records for date range: ${startDate} - ${endDate}`,
          data: {
            link: filePath
          }
        });
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

module.exports = SitePurchaseController;