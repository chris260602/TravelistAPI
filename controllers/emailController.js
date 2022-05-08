const nodemailer = require("nodemailer");
var gmailNode = require("gmail-node");
const { google, drive_v3, Auth, Common } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

var clientSecret = {
  installed: {
    client_id: process.env.CLIENT_ID,
    project_id: "travelist-345505",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_secret: process.env.CLIENT_SECRET,
    redirect_uris: ["https://developers.google.com/oauthplayground"],
  },
};
gmailNode.init(clientSecret, "./token.json", initComplete);
function initComplete(err, dataObject) {
  if (err) {
    console.log("Error ", err);
  }
}
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
    port: 80,
    secure: true,
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL,
      accessToken,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
    },
    tls: {
      secureProtocol: "TLSv1_method",
    },
  });

  return transporter;
};

exports.sendEmail = async (emailOptions) => {
  // let emailTransporter = await createTransporter();
  // await emailTransporter.sendMail(emailOptions);

  var testMessage = {
    to: "christoperlim20@gmail.com",
    subject: "Test Subject",
    message: "<h1>Test Email</h1>",
  };

  // ClientSecret:

  gmailNode.send(testMessage, function (err, data) {
    console.log(err, data);
  });
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
  let emailTransporter = await createTransporter();
  await emailTransporter.sendMail(config);
};
