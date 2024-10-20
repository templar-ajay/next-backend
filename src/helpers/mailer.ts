import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";
import User from "@/models/userModel";

const emailSubject = {
  forgotPassword: "Reset Your Password",
  verifyEmail: "Verify Your Email",
};

const emailBody = (
  emailType: "forgotPassword" | "verifyEmail",
  hashedToken: string
) => {
  if (emailType === "forgotPassword") {
    return `<p>
  <a href="${process.env.DOMAIN}/set-new-password?token=${hashedToken}">
  Click Here
  </a> or copy and paste the below link in your browser ${process.env.DOMAIN}/set-new-password?token=${hashedToken}
  </p>`;
  } else if (emailType == "verifyEmail") {
    return `<p>
  <a href="${process.env.DOMAIN}/verify-email?token=${hashedToken}">
  Click Here
  </a> or copy and paste the below link in your browser ${process.env.DOMAIN}/verify-email?token=${hashedToken}
  </p>`;
  }
};

export const sendEmail = async ({ email, emailType, userId }) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailType == "verifyEmail") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          verifyToken: hashedToken,
          verifyTokenExpiry: Date.now() + 1000 * 60 * 60,
        },
      });
    } else if (emailType == "forgotPassword") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpiry: Date.now() + 1000 * 60 * 60,
        },
      });
    }
    // todo: configure mail for usage
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: "templar.ajay@gmail.com", // sender address
      to: email, // list of receivers
      subject: emailSubject[emailType], // Subject line
      html: emailBody(emailType, hashedToken), // html body
    };

    const mailResponse = await transporter.sendMail(mailOptions);
    return mailResponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
