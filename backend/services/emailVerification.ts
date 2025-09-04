import nodemailer from "nodemailer"
import { config } from "../config/config.ts";
export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.VERIFICATION_EMAIL,
        pass: config.VERIFICATION_PASSWORD,
    }
})
export const emailVerification = async () => {
    transporter.verify((error, success) => {
        if (error) throw new Error(`An error occured while email verify, ${error}`);
        console.log("Ready for send verification code")
    })
}
export const sendVerificationCode = async (email: string, verificationCode: string,) => {
    await transporter.sendMail({
        from: config.VERIFICATION_EMAIL,
        to: email,
        subject: "Your Blog App Verification Code",
        html: `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Email Verification</title>
  </head>
  <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f4f7;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f7; padding:40px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
            <tr>
              <td align="center" style="background-color:#4f46e5; padding:20px;">
                <h1 style="color:#ffffff; margin:0; font-size:24px;">Blog App</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:30px; color:#333333;">
                <h2 style="margin-top:0;">Verify your email</h2>
                <p style="font-size:15px; line-height:22px; color:#555555;">
                  Thank you for joining to <strong>Blog App</strong>!<br/>
                  Use the code below to verify your email address:
                </p>
                <div style="text-align:center; margin:30px 0;">
                  <span style="display:inline-block; font-size:32px; letter-spacing:8px; font-weight:bold; color:#4f46e5; background:#f4f4f7; padding:15px 25px; border-radius:8px;">
                    ${verificationCode}
                  </span>
                </div>
                <p style="font-size:13px; color:#999999;">
                  This code will expire in <strong>10 minutes</strong>. 
                  If you didn’t create a Blog App account, please ignore this email.
                </p>
              </td>
            </tr>
            <tr>
              <td align="center" style="background:#f9f9f9; padding:20px; font-size:12px; color:#aaaaaa;">
                © ${new Date().getFullYear()} Blog App. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `
    })
}