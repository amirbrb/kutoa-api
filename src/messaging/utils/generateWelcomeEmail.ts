function generateWelcomeEmail(firstName: string, email: string, token: string, host: string) {
  const verificationLink = `${host}/verify-email?email=${email}&token=${token}`;
  return `
  <!DOCTYPE html>
  <html>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
      <img src="${host}/logo.png" alt="Kutoa Logo" style="width: 120px; height: 120px; margin-bottom: 20px;">
      <h1 style="color: #2c5282;">Welcome to the Kutoa Community! 🎉</h1>
    </div>
    
    <p style="font-size: 16px;">Dear <strong>${firstName}</strong>,</p>
    
    <p style="font-size: 16px;">We're <em>thrilled</em> to welcome you to the Kutoa community! Thank you for joining us on this journey. Your account has been successfully created, and we're excited to have you as part of our growing family.</p>
    
    <div style="background-color: #f7fafc; border-left: 4px solid #2c5282; padding: 15px; margin: 20px 0;">
      <p style="font-size: 16px; margin: 0;">At Kutoa, we believe in making a difference together, and we're looking forward to seeing how you'll contribute to our community.</p>
    </div>
  
    <div style="text-align: center; margin: 30px 0;">
      <p style="font-size: 16px; margin-bottom: 20px;">To start using your account, please verify your email address by clicking the button below:</p>
      <a href="${verificationLink}" style="background-color: #2c5282; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email Address</a>
    </div>
    
    <p style="font-size: 16px;">If you have any questions or need assistance getting started, please don't hesitate to reach out to our support team.</p>
    
    <p style="font-size: 18px; font-weight: bold; text-align: center; margin: 30px 0;">Welcome aboard! 🚀</p>
    
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
      <p style="font-size: 14px; color: #666;">Best regards,<br>The Kutoa Team</p>
      <p style="font-size: 12px; color: #666;">If the button doesn't work, copy and paste this link into your browser: ${verificationLink}</p>
    </div>
  </body>
  </html>`;
}

export default generateWelcomeEmail;
