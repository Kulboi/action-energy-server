const CustomerModel = require("./../models/customer");
const { Validator } = require('node-input-validator');

class CustomerController {
  async add(req, res) {
    try {
      const { email } = req.body;

      const existing = await CustomerModel.find({ email });
      if(existing.length) {
        return res.status(409).json({
          success: false,
          message: "Customer already registered",
          data: []
        })
      }

      const v = new Validator(req.body, {
        fullname: 'required',
        email: 'required|email',
        phone: 'required',
        address: 'required',
        tin: 'required'
      });
      const validate = await v.check();
      if(!validate) {
        return res.status(400).json({
          success: false,
          message: "Invalid or incomplete inputs",
          data: v.errors
        });
      }

      const addCustomer = await CustomerModel.create(req.body);
      res.status(201).json({
        success: true,
        message: "Customer registeration successful",
        data: addCustomer
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
      const customers = await CustomerModel
      .find()
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

      res.status(200).json({
        success: true,
        message: "Registered customers",
        data: customers
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
      await CustomerModel.updateOne({ _id: req.query.id }, req.body);
      res.status(200).json({
        success: true,
        message: "Updated customer's record",
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

  async disable(req, res) {
    try {
      await CustomerModel.updateOne({ _id: req.query.id }, { active: false });
      res.status(200).json({
        success: true,
        message: "Customer deactivated",
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

  async reactivate(req, res) {
    try {
      await CustomerModel.updateOne({ _id: req.query.id }, { active: true });
      res.status(200).json({
        success: true,
        message: "Customer Activated",
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

module.exports = CustomerController;