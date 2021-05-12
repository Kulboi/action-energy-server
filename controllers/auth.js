const UserModel = require("./../models/user");
const bcrypt = require('bcrypt');

class UserController {
  constructor() {}

  async register(req, res) {
    try {
      let { fullname, email, password } = req.body;

      const existing = await UserModel.find({ email });
      if(!existing.length) {
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);
        
        const register = await UserModel.create({ fullname, email, password });
        res.status(201).json({
          success: true,
          message: "User registeration successful",
          data: register
        })
      }else {
        res.status(409).json({
          success: false,
          message: "User already exists",
          data: []
        })
      }
    }catch (error) {
      console.log(error)
    }
  }

  login(req, res) {
    console.log(req.body)
  }

  forgotPassword() {}

  resetPassword() {}
}

module.exports = UserController;