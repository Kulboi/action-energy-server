const jwt = require('jsonwebtoken');

const validateToken = async (req, res, next)=> {
  try {
    if(req.headers.authorization) {
      const options = { 
        expiresIn: '2d', 
        issuer: 'action-energy' 
      };
  
      result = await jwt.verify(req.headers.authorization, process.env.JWT_SECRET, options);
      
      if(!result) {
        return res.status(400).send({
          success: false,
          messsage: "Invalid token.",
          data: []
        });
      }

      req.user = {
        id: result.id,
        user: result.user,
        email: result.email,
        role: result.role,
        department: result.department
      };
      next();
    }else {
      res.status(401).send({
        success: false,
        messsage: "Authentication error. Token required.",
        data: []
      });
    }
  }catch(error) {
    if(error.name === "TokenExpiredError") {
      return res.status(400).json({
        success: false,
        message: "Token expired",
        data: { ...error }
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
      data: []
    });
    // throw new Error(error);
  }
};

module.exports = validateToken;