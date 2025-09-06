import Dotenv  from "dotenv";
import { createTransport } from "nodemailer";
Dotenv.config()

const transporter = createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
        user: process.env.NODE_MAILLER_AUTH_EMAIL,
        pass: process.env.NODE_MAILLER_PASSWORD,
    },
});

// async..await is not allowed in global scope, must use a wrapper
async function main(email,html,subject,attachments=[]) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `"fares" <${process.env.NODE_MAILLER_AUTH_EMAIL}>` ,
    to: email, // list of receivers
    subject , // Subject line
    html, // html body,
    attachments

  });

}


export default main
