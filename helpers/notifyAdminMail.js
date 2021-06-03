const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const adminMail = "habeeb.maciver@aiesec.net";

const notifyAdminMail = async ({ type, payload }) => {
  switch (type) {
    case "customer":
      handleCustomerMail(payload);
      break;
    case "project":
      handleProjectMail(payload);
      break;
    case "disbursement":
      handleDisbursementMail(payload);
      break;
    case "payment-request":
      handlePaymentMail(payload);
      break;
    case "purchase-request":
      handlePurchaseMail(payload);
      break;
    case "fund-request":
      handleFundMail(payload);
      break;

    default:
      break;
  }
};

const sendMail = async (mailPayload) => {
  await sgMail.send(mailPayload).catch((error) => {
    console.error(error.response.body);
  });
};

const handleCustomerMail = async (payload) => {
  const { fullname, email, phone, address } = payload;

  sendMail({
    to: adminMail,
    from: "mail@geefto.com",
    subject: "NEW CUSTOMER REGISTERED",
    body: `
      <h3>A new customer has been registered with the following details:</h3>
      <br /><br />
      <ul>
        <li>Fullname: ${fullname}</li>
        <li>Email: ${email}</li>
        <li>Phone: ${phone}</li>
        <li>Address: ${address}</li>
      </ul>
    `,
  });
};

const handleProjectMail = async (payload) => {
  const { ref_no, company, agency, award_amount, award_date } = payload;

  sendMail({
    to: adminMail,
    from: "mail@geefto.com",
    subject: "NEW PROJECT CREATED",
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
  });
};

const handleDisbursementMail = async (payload) => {
  const { project, requester, approver, reason, date } = payload;

  sendMail({
    to: adminMail,
    from: "mail@geefto.com",
    subject: "NEW DISBURSEMENT RECORDED",
    html: `
      <h3>A new disbursement has been recorded with the following details:</h3>
      <br /><br />
      <ul>
        <li>Project: ${project.ref_no}</li>
        <li>Requester: ${requester}</li>
        <li>Approver: ${approver}</li>
        <li>Reason: ${reason}</li>
        <li>Date: ${date}</li>
      </ul>
    `,
  });
};

const handlePaymentMail = async (payload) => {
  const { date, payee, site_number, amount, type } = payload;

  sendMail({
    to: adminMail,
    from: "mail@geefto.com",
    subject: "NEW PAYMENT REQUEST RECORDED",
    html: `
      <h3>A new payment request has been recorded with the following details:</h3>
      <br /><br />
      <ul>
        <li>Date: ${date}</li>
        <li>Payee: ${payee}</li>
        <li>Site Number: ${site_number}</li>
        <li>Amount: ${amount}</li>
        <li>Type: ${type}</li>
      </ul>
    `,
  });
};

const handlePurchaseMail = async (payload) => {
  const { 
    date,
    site_number,
    location,
    recipient,
    amount,
    project,
    payee,
    type
  } = payload;

  sendMail({
    to: adminMail,
    from: "mail@geefto.com",
    subject: "NEW SITE PURCHASE REQUEST RECORDED",
    html: `
      <h3>A new payment request has been recorded with the following details:</h3>
      <br /><br />
      <ul>
        <li>Date: ${date}</li>
        <li>Site Number: ${site_number}</li>
        <li>Location: ${location}</li>
        <li>Recipient: ${recipient}</li>
        <li>Amount: ${amount}</li>
        <li>Project: ${project}</li>
        <li>Payee: ${payee}</li>
        <li>Type: ${type}</li>
      </ul>
    `,
  });
};

const handleFundMail = async (payload) => {
  const { 
    date,
    requester,
    approver,
    company,
    ministry,
    project,
    location,
    description,
    amount
  } = payload;

  sendMail({
    to: adminMail,
    from: "mail@geefto.com",
    subject: "NEW PAYMENT REQUEST RECORDED",
    html: `
      <h3>A new payment request has been recorded with the following details:</h3>
      <br /><br />
      <ul>
        <li>Date: ${date}</li>
        <li>Requester: ${requester}</li>
        <li>Approver: ${approver}</li>
        <li>Company: ${company}</li>
        <li>Ministry: ${ministry}</li>
        <li>Project: ${project.ref_no}</li>
        <li>Location: ${location}</li>
        <li>Description: ${description}</li>
        <li>Amount: ${amount}</li>
      </ul>
    `,
  });
};

module.exports = notifyAdminMail;
