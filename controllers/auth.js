const UserModel = require("./../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Validator } = require('node-input-validator');

class UserController {
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
      res.status(500).json({
        success: false,
        message: "Internal server error",
        data: []
      })
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const v = new Validator({ email, password }, {
        email: 'required|email',
        password: 'required'
      });

      const validate = await v.check();
      if(validate) {
        const user = await UserModel.findOne({ email });
        if (user) {
          // check user password with hashed password stored in the database
          const validPassword = await bcrypt.compare(password, user.password);
          if (validPassword) {
            // Create a token
            const payload = { 
              id: user._id,
              user: user.fullname,
              email: user.email 
            };
            const options = { 
              expiresIn: '2d', 
              issuer: 'action-energy' 
            };
            const secret = process.env.JWT_SECRET;
            const token = jwt.sign(payload, secret, options);

            res.status(200).json({ 
              success: true,
              message: "User login successful",
              data: {  
                token,
                fullname: user.fullname,
                email: user.email,
                role: user.role,
                id: user._id
              }
            });
          } else {
            res.status(400).json({
              success: false, 
              message: "Invalid Password",
              data: []
            });
          }
        } else {
          res.status(401).json({ 
            success: false,
            message: "User does not exist",
            data: [] 
          });
        }
      }else {
        res.status(400).json({
          success: false,
          message: "Invalid or incomplete inputs",
          data: v.errors
        })
      }
    }catch (error) {
      console.log(error)
      res.status(500).json({
        success: false,
        message: "Internal server error",
        data: []
      })
    }
  }

  async changePassword(req, res) {
    try {
      const { userId } = req.params.id;
      const { oldPassword, newPassword } = req.body;
      const v = new Validator(req.body, {
        oldPassword: 'required',
        newPassword: 'required',
      });
      const validate = await v.check();
      if(!validate) {
        return res.status(400).json({
          success: false,
          message: "Invalid or incomplete inputs",
          data: v.errors
        });
      }

      const user = await UserModel.findById(userId);
      const compare_old = await bcrypt.compare(oldPassword, user.password);

      if(!compare_old) {
        return res.status(400).json({
          success: false,
          message: "Invalid old password",
          data: []
        });
      }

      await UserModel.findByIdAndUpdate(userId, { password: newPassword });
      res.status(200).json({
        success: true,
        message: "Updated user's password",
        data: []
      });
    }catch (error) {
      console.log(error)
      res.status(500).json({
        success: false,
        message: "Internal server error",
        data: []
      })
    }
  }
}

module.exports = UserController;