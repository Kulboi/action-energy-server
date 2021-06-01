const ProjectModel = require("./../models/project");

const validateDisbursement = async (req, res, next) => {
  try {
    const project = await ProjectModel.find({ _id: req.body.project._id });
    if(req.body.amount > project.available_balance) {
      return res.status(400).json({
        success: false,
        message: "Amount greater than available balance",
        data: v.errors
      });
    }

    next();
  }catch(error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      data: []
    });
    throw new Error(error);
  }
};

module.exports = validateDisbursement;