export function generateVerificationOtpEmailTemplate(otpcode) {
  return `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9; text-align: center;">
        
        <h2 style="color: #333;">🔐 Verify Your Email Address</h2>
  
        <p style="font-size: 16px; color: #555;">Dear User,</p>
        <p style="font-size: 16px; color: #555;">
          One Time Password (OTP) to verify youe email address is:
        </p>
  
        <div style="margin: 20px auto; padding: 15px; font-size: 24px; font-weight: bold; color: #fff; background-color: #007bff; display: inline-block; border-radius: 5px;">
          ${otpcode}
        </div>
  
        <p style="font-size: 14px; color: #888;">
          This code is valid for <strong>15 minutes</strong>. Please do not share this code with anyone.
        </p>
  
        <p style="font-size: 14px; color: #888;">
          If you did not request this code, you can safely ignore this email.
        </p>
  
        <hr style="border: none; height: 1px; background-color: #ddd; margin: 20px 0;">
  
        <footer>
          <p style="font-size: 12px; color: #999;">Thank you for using our service.<br>NIELIT Kurukshetra</p>
        </footer>
  
      </div>
    `;
}

export function generateForgotPasswordEmailTemplate(resetPasswordUrl) {

  return `<div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9; text-align: center;">
      
      <h2 style="color: #333;">🔒 Reset Your Password</h2>

      <p style="font-size: 16px; color: #555;">Dear User,</p>
      <p style="font-size: 16px; color: #555;">
        We received a request to reset your password. Click the button below to proceed:
      </p>

      <a href="${resetPasswordUrl}" 
         style="display: inline-block; margin: 20px auto; padding: 12px 20px; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px; font-weight: bold;">
         🔑 Reset Password
      </a>

      <p style="font-size: 14px; color: #888;">
        If the button doesn't work, you can also copy and paste this link into your browser:
      </p>
      <p style="font-size: 14px; color: #007bff; word-break: break-all;">
        ${resetPasswordUrl}
      </p>

      <p style="font-size: 14px; color: #888;">
        This link will expire in <strong>15 minutes</strong>. If you did not request this, please ignore this email.
      </p>

      <hr style="border: none; height: 1px; background-color: #ddd; margin: 20px 0;">

      <footer>
        <p style="font-size: 12px; color: #999;">Thank you for using our service.</p>
      </footer>

    </div>
  `


}