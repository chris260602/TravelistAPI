const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        reject(err);
      }
      resolve(token);
    });
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    // secure: true,
    port: 587,
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL,
      accessToken,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  return transporter;
};

exports.sendEmailVerification = async (emailOptions) => {
  const config = {
    subject: "Account Verification for " + emailOptions.email,
    text:
      "I am sending an account verification from travelist! " +
      process.env.BACKEND_URL +
      "/email/verifyaccount/" +
      emailOptions.confirmationCode,
    html: `<p>I am sending an account verification from travelist!</p>
     </br>
    <a href=${process.env.BACKEND_URL}/email/verifyaccount/${emailOptions.confirmationCode}>Verify</a>
    </br>
    <p>If this is not you, please ignore this message.</p>`,
    to: emailOptions.email,
    from: process.env.EMAIL,
  };
  try {
    let emailTransporter = await createTransporter();
    await emailTransporter.sendMail(config);
  } catch (e) {
    console.log(e);
  }
};
exports.sendPasswordReset = async (emailOptions) => {
  const config = {
    subject: "password reset for " + emailOptions.email,
    text:
      "I am sending an password reset link from travelist! " +
      process.env.BACKEND_URL +
      "/email/verifyaccount/" +
      emailOptions.confirmationCode,
    html: `<p>I am sending an password reset link from travelist!</p>
     </br>
    <a href=${process.env.BACKEND_URL}/user/validateforgetpasswordcode/${emailOptions.confirmationCode}>Reset Password</a>
    </br>
    <p>If this is not you, please ignore this message.</p>`,
    to: emailOptions.email,
    from: process.env.EMAIL,
  };
  try {
    let emailTransporter = await createTransporter();
    await emailTransporter.sendMail(config);
  } catch (e) {
    console.log(e);
  }
};
