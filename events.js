const events = require('events');
const ProjectModel = require("./models/project");
const DisbursementModel = require("./models/disbursement");

const notifyAdmin = require('./helpers/notifyAdminMail');

const eventsEmitter = new events.EventEmitter();

// On disbursement create
eventsEmitter.on('disbursements:create', async(payload)=> {
  const project = await ProjectModel.find({ _id: payload.project._id });

  const currentBalance = parseFloat(project[0].available_balance) - parseFloat(payload.amount);
  
  let total_expensed
  if(!project[0].total_expensed || project[0].total_expensed === 0) {
    total_expensed = parseFloat(payload.amount);
  }else {
    total_expensed = parseFloat(project[0].total_expensed) + parseFloat(payload.amount);
  }
  
  await ProjectModel.updateOne({ _id: payload.project._id }, { 
    available_balance: currentBalance,
    total_expensed
  });
});

// On disbursement delete
eventsEmitter.on('disbursements:delete', async(payload)=> {
  const disbursement = await DisbursementModel.findOne({ _id: payload.id });
  const project = await ProjectModel.findOne({ _id: disbursement.project._id });

  const available_balance = parseFloat(project.available_balance) + parseFloat(disbursement.amount);
  const total_expensed = parseFloat(project.total_expensed) - parseFloat(disbursement.amount);
  
  await ProjectModel.updateOne({ _id: project._id }, { 
    available_balance,
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