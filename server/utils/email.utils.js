import nodemailer from "nodemailer";

const sendEmail = async function (email, subject, message) {
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
    from: '"Snacky" <snacky@gmail.com>',
    to: email,
    subject: subject,
    html: message,
  });

  console.log(message);
};

export default sendEmail;
