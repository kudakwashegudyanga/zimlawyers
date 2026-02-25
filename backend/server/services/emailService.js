const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendVerificationEmail = async (email, code) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Verify Your ZimLayers Legal Account',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>ZimLayers Email Verification</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f4f4f4;
            }
            .container {
              background-color: #ffffff;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 2px solid #1e40af;
            }
            .logo {
              font-size: 28px;
              font-weight: bold;
              color: #1e40af;
              margin-bottom: 10px;
            }
            .code {
              background-color: #1e40af;
              color: white;
              font-size: 32px;
              font-weight: bold;
              padding: 20px;
              text-align: center;
              border-radius: 8px;
              margin: 30px 0;
              letter-spacing: 5px;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              color: #666;
              font-size: 14px;
            }
            .button {
              display: inline-block;
              background-color: #1e40af;
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">⚖️ ZimLayers Legal</div>
              <h2>Email Verification</h2>
            </div>
            
            <p>Thank you for registering with ZimLayers Legal, Zimbabwe's premier legal practice management platform.</p>
            
            <p>Please use the verification code below to complete your registration:</p>
            
            <div class="code">${code}</div>
            
            <p><strong>This code will expire in 10 minutes.</strong></p>
            
            <p>If you didn't request this verification, please ignore this email.</p>
            
            <div class="footer">
              <p>ZimLayers Legal - Empowering Zimbabwe's Legal Professionals</p>
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully: ' + info.messageId);
    
    return {
      success: true,
      message: 'Verification email sent successfully'
    };
  } catch (error) {
    console.error('Email sending error:', error);
    
    // Fallback: Log the code to console for development
    console.log(`\n=== EMAIL VERIFICATION CODE ===`);
    console.log(`Email: ${email}`);
    console.log(`Code: ${code}`);
    console.log(`===============================\n`);
    
    return {
      success: false,
      message: 'Failed to send verification email (code logged to console for development)'
    };
  }
};

module.exports = {
  sendVerificationEmail
};
