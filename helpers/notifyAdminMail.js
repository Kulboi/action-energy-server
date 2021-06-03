const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const adminMail = 'habeeb.maciver@aiesec.net';

const notifyAdminMail = async ({ type, payload }) => {
  switch (type) {
    case 'project':
      handleProjectMail(payload);
      break;
    case 'disbursement':
      handleDisbursementMail(payload);
      break;
  
    default:
      break;
  }
};

const handleProjectMail = async (payload)=> {
  const { 
    ref_no,
    company,
    agency,
    award_amount,
    award_date
  } = payload;
  const mailPayload = {
    to: adminMail,
    from: 'mail@geefto.com',
    subject: 'NEW PROJECT CREATED',
    body: `
      <h3>A new project has been created with the following details:</h3>
      <br /><br />
      <ul>
        <li>Ref No: ${ref_no}</li>
        <li>Company: ${company}</li>
        <li>Agency: ${agency}</li>
        <li>Award Amount: ${award_amount}</li>
        <li>Award Date: ${award_date}</li>
      </ul>
    `,
  }

  await sgMail
  .send(mailPayload)
  .catch((error) => {
    console.error(error.response.body)
  })
};

const handleDisbursementMail = async (payload)=> {
  const { 
    project,
    requester,
    approver,
    reason,
    date
  } = payload;
  const mailPayload = {
    to: adminMail,
    from: 'mail@geefto.com',
    subject: 'NEW DISBURSEMENT RECORDED',
    html: `
      <h3>A new disbursement has been created with the following details:</h3>
      <br /><br />
      <ul>
        <li>Project: ${project.ref_no}</li>
        <li>Requester: ${requester}</li>
        <li>Approver: ${approver}</li>
        <li>Reason: ${reason}</li>
        <li>Date: ${date}</li>
      </ul>
    `,
  }

  await sgMail
  .send(mailPayload)
  .catch((error) => {
    console.error(error.response.body)
  })
};

module.exports = notifyAdminMail;