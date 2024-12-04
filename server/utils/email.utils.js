import nodemailer from "nodemailer";

const sendEmail = async function (userEmail, subject, message) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMPT_USERNAME,
      pass: process.env.SMPT_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: '"Refer Biz" <referbiz@gmail.com>',
    to: userEmail,
    subject: subject,
    html: message,
  });
};

export default sendEmail;
