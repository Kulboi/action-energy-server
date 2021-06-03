const CustomerModel = require("./../models/customer");
const ProjectModel = require("./../models/project");

class DashboardController {
  async statistics(req, res) {
    try {
      const totalCustomers = CustomerModel.countDocuments({});
      const totalProjects = ProjectModel.countDocuments({});
      
      const totalInflow = await ProjectModel.aggregate([
        {
          $group: {
            _id: null,
            count: { $sum: "$award_amount" }
          }
        }
      ]);
      
      const projects = await ProjectModel.find({});
      const totalExpensed = projects.reduce((sum, current) => {
        return sum + parseFloat(current.total_expensed);
      }, 0);

      res.status(200).json({
        success: false,
        message: "Dashboard statistics",
        data: {
          totalCustomers,
          totalProjects,
          totalInflow: totalInflow[0].count,
          totalExpensed
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
}

module.exports = DashboardController;