const customerSchema = require('./../models/customer');

const saveAgency = async (req, res, next)=> {
	try {
		const { agency } = req.body;
		const findAgency = await customerSchema.find({ fullname: agency });
		if(!findAgency) await customerSchema.create({ fullname: agency });
		next();
	}catch(error) {
		res.status(500).json({
      success: false,
      message: "Internal server error",
      data: []
    });
		console.log(error);
	}
};

module.exports = saveAgency;