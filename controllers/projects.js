const ProjectModel = require("./../models/project");
const { Validator } = require('node-input-validator');

class ProjectController {
  async add(req, res) {
    try {
      const v = new Validator(req.body, {
        ref_no: 'required',
        agency: 'required|object',
        date_of_creation: 'required',
        description: 'required',
        due_date: 'required',
        award_date: 'required',
        balance: 'required',
        dynamicExpenses: 'required|array'
      });
      const validate = await v.check();
      if(!validate) {
        return res.status(400).json({
          success: false,
          message: "Invalid or incomplete inputs",
          data: v.errors
        });
      }

      const { ref_no } = req.body;
      const existing = await ProjectModel.find({ ref_no });
      if(existing.length) {
        return res.status(409).json({
          success: false,
          message: "Project already created",
          data: []
        })
      }

      const addProject = await ProjectModel.create(req.body);
      res.status(201).json({
        success: true,
        message: "Project creation successful",
        data: addProject
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
      const projects = await ProjectModel
      .find()
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

      res.status(200).json({
        success: true,
        message: "Registered projects",
        data: projects
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
      await ProjectModel.updateOne({ _id: req.query.id }, req.body);
      res.status(200).json({
        success: true,
        message: "Updated project's details",
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

module.exports = ProjectController;