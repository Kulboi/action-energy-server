const ProjectModel = require("./../models/project");
const { Validator } = require('node-input-validator');

// Events module
const callEvent = require('./../events');

class ProjectController {
  async add(req, res) {
    try {
      const v = new Validator(req.body, {
        ref_no: 'required',
        award_date: 'required',
        description: 'required',
        company_name: 'required',
        agency: 'required',
        location: 'required',
        brief_of_summary: 'required|object',
        statutory_deductions: 'required|array',
        other_deductions: 'required|array',
        award_amount: 'required',
        actual_inflow: 'required',
        total_statutory_deductions: 'required',
        total_deductions: 'required',
        anticipated_inflow: 'required',
        anticipated_profit: 'required',
        anticipated_profit_percentage: 'required',
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

      const addProject = await ProjectModel.create({
        ...req.body,
        created_by: req.user
      });
      await callEvent({
        eventType: 'record:create',
        payload: {
          type: 'project',
          payload: req.body
        }
      })
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
        data: {
          payload: projects, 
          count: await ProjectModel.countDocuments({})
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

  async single(req, res) {
    try {
      const { projectId } = req.params;
      const project = await ProjectModel.find({ _id: projectId });
    
      res.status(200).json({
        success: true,
        message: "Project details",
        data: project[0]
      });
    }catch(error) {
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
      const results = await ProjectModel
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

  async statistics(req, res) {
    try {
      const total_projects = await ProjectModel.countDocuments({});
      const total_inflow = await ProjectModel.aggregate([
        {
          $group: {
            _id: null,
            count: { $sum: "$award_amount" }
          }
        }
      ]);

      // Calculating total expensed
      const projects = await ProjectModel.find({});
      const total_expensed = projects.reduce((sum, current) => {
        return sum + parseFloat(current.total_expensed);
      }, 0);

      res.status(200).json({
        success: false,
        message: "Projects statistics",
        data: {
          total_projects,
          total_inflow: total_inflow[0]?.count,
          total_expensed
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

  async topProjects(req, res) {
    try {
      const top_ten = await ProjectModel
        .find()
        .sort({ available_balance: -1 })
        .limit(10)

      res.status(200).json({
        success: false,
        message: "Top 10 projects by available balance",
        data: top_ten
      });
    }catch(error) {
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