const events = require('events');
const ProjectModel = require("./models/project");

const notifyAdmin = require('./helpers/notifyAdminMail');

const eventsEmitter = new events.EventEmitter();

/*
  On disbursement creation;
  - Calculate available_balance
  - Calculate total_expensed
  - Update project details with the new details
*/
eventsEmitter.on('disbursements:create', async(payload)=> { 
  const project = await ProjectModel.find({ _id: payload.project._id });

  const currentBalance = parseFloat(project.available_balance) - parseFloat(payload.amount);
  
  let total_expensed
  if(project.total_expensed === 0) {
    total_expensed = parseFloat(payload.amount);
  }else {
    total_expensed = parseFloat(project.total_expensed) + parseFloat(payload.amount);
  }
  
  await ProjectModel.updateOne({ _id: payload.project._id }, { 
    available_balance: currentBalance,
    total_expensed
  });
});

// On record create event
eventsEmitter.on('record:create', async({ type, payload })=> {
  notifyAdmin({ type, payload });
});

const callEvent = ({ eventType, payload })=> {
  eventsEmitter.emit(eventType, payload);
}

module.exports = callEvent;