const nodemailer = require("nodemailer");

const sendTeacherCredentials = async ({ toEmail, name, username, password }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const htmlTemplate = `
  <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #e5e7eb; padding:20px; border-radius:10px">
    <h2 style="color:#4f46e5">Welcome to Hawkings Maths Olympiad 🎓</h2>
    <p>Dear <strong>${name}</strong>,</p>

    <p>Your Teacher account has been successfully created.</p>

    <div style="background:#f9fafb; padding:15px; border-radius:8px">
      <p><strong>Login Credentials</strong></p>
      <p>Username: <strong>${username}</strong></p>
      <p>Password: <strong>${password}</strong></p>
    </div>

    <p>Please login and register students.</p>

    <a href="http://localhost:5173/login"
       style="display:inline-block;margin-top:15px;padding:10px 20px;
       background:#4f46e5;color:white;text-decoration:none;border-radius:6px">
       Login Now
    </a>

    <p style="margin-top:20px;font-size:12px;color:#6b7280">
      © Hawking Maths Olympiad. All rights reserved.
    </p>
  </div>
  `;

  await transporter.sendMail({
    from: `"Hawking Maths Olympiad" <${process.env.MAIL_USER}>`,
    to: toEmail,
    subject: "Teacher Account Credentials",
    html: htmlTemplate,
  });
};

module.exports = sendTeacherCredentials;
