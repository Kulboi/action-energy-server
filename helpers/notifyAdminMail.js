const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const notifyAdminMail = async (email) => {
  const mailPayload = {
    to: "george@geefto.com",
    from: 'mail@geefto.com',
    subject: 'NEW WAITLIST USER ON geefto.com',
    text: `${email} just signed up on geefto.com`,
  }

  await sgMail
  .send(mailPayload)
  .catch((error) => {
    console.error(error.response.body)
  })
};

module.exports = notifyAdminMail;