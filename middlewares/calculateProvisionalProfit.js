const calculateProvisionalProfit = (req, res, next)=> {
  try {
    const dynamicExpenses = req.body.dynamicExpenses;
    const balance = parseFloat(req.body.balance);
    if(req.body.dynamicExpenses) {
      let percentages = [];
      dynamicExpenses.forEach(expense => {
        percentages.push(parseFloat(expense.percentage));
      })
      
      let dynamicExpPercentage = percentages.reduce((a, b) => {
        return a + b;
      }, 0);

      let dynamicExpTotal = parseFloat(dynamicExpPercentage)/100 * balance;
      let initialGross = balance - parseFloat(dynamicExpTotal);

      req.body.provisionalProfit = 25/100 * parseFloat(initialGross);
      req.body.balance = initialGross - parseFloat(req.body.provisionalProfit);

      next();
    }else {
      return res.status(400).json({
        success: false,
        message: "Dynamic expenses must be inputed",
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
};

module.exports = calculateProvisionalProfit;