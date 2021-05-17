const jwt = require('jsonwebtoken');

const validateToken = async (req, res, next)=> {
  if(req.headers.authorization) {
    const options = { 
      expiresIn: '2d', 
      issuer: 'action-energy' 
    };

    try {
      result = await jwt.verify(req.headers.authorization, process.env.JWT_SECRET, options);
  
      req.decoded = result;
      next();
    } catch (err) {
      throw new Error(err);
    }
  }else {
    res.status(401).send({
      success: false,
      messsage: "Authentication error. Token required.",
      data: []
    });
  }
};

module.exports = validateToken;