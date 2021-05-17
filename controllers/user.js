const UserModel = require("./../models/user");

class UserController {
  async profile(req, res) {
    try {
      const userId = req.params.id;

      const user = await UserModel.findById(userId);
      if(user) {
        res.status(200).json({
          success: true,
          message: "User's details",
          data: user
        });
      }else {
        res.status(404).json({
          success: false,
          message: "No user data found",
          data: []
        });
      }
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
      const userId = req.params.id;

      await UserModel.findByIdAndUpdate(userId, req.body);
      res.status(200).json({
        success: true,
        message: "Updated user's details",
        data: req.body
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
}

module.exports = UserController;