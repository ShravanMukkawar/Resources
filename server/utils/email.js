const nodemailer = require('nodemailer');

const sendEmail = async options => {
  const auth = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    port: 465,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const receiver = {
    from: "Will-Rename <arbajshaikh2004@gmail.com>",
    to: options.email,
    subject: options.subject,
    html: options.html
  };

  auth.sendMail(receiver, (error, emailResponse) => {
    if (error)
      throw error;
    console.log("success!");
    response.end();
  });


  // 2) Define the email options
  // const mailOptions = {
  //   from: 'Jonas Schmedtmann <hello@jonas.io>',
  //   to: options.email,
  //   subject: options.subject,
  //   text: options.message
  //   // html:
  // };

  // 3) Actually send the email
  // await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
