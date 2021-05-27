const UserModel = require("./../models/user");

class UserController {
  async addUser(req, res) {
    try {
      const { email } = req.body;

      const existing = await UserModel.find({ email });
      if(existing.length) {
        return res.status(409).json({
          success: false,
          message: "User already registered",
          data: []
        })
      }

      const v = new Validator(req.body, {
        fullname: 'required',
        email: 'required|email',
        role: 'required',
      });
      const validate = await v.check();
      if(!validate) {
        return res.status(400).json({
          success: false,
          message: "Invalid or incomplete inputs",
          data: v.errors
        });
      }

      const addUser = await UserModel.create(req.body);
      res.status(201).json({
        success: true,
        message: "User registeration successful",
        data: addCustomer
      })
    }catch(error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
        data: []
      });
      throw new Error(error);
    }
  }

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

  async getUsers(req, res) {
    try {
      const { limit, page } = req.query;
      const users = await UserModel
      .find()
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

      res.status(200).json({
        success: true,
        message: "System user's",
        data: { 
          payload: users, 
          count: await UserModel.countDocuments({}) 
        }
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