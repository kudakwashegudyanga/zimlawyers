require('dotenv').config();
const { sendVerificationEmail } = require('./server/services/emailService');

async function testEmail() {
  console.log('Testing email sending...');
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
  console.log('EMAIL_PORT:', process.env.EMAIL_PORT);
  
  try {
    const result = await sendVerificationEmail('test@example.com', '123456');
    console.log('Email result:', result);
  } catch (error) {
    console.error('Email test failed:', error);
  }
}

testEmail();
