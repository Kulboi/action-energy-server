const customerSchema = require('./../models/customer');

const saveAgency = async (req, res, next)=> {
	try {
		const { agency } = req.body;
		const findAgency = await customerSchema.find({$text: {$search: agency}});
		
		if(!findAgency) {
			const saveAgency = await customerSchema.create({ fullname: agency });
			req.body.agency = saveAgency._id;
			next();
		}else {
			req.body.agency = findAgency._id;
			next();
		}
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