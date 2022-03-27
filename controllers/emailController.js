const nodemailer = require("nodemailer");

const user = process.env.EMAILUSERNAME;
const pass = process.env.EMAILPASSWORD;

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: user,
    pass: pass,
  },
});
