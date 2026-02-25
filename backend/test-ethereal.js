require('dotenv').config();
const { sendVerificationEmail } = require('./server/services/etherealEmailService');

async function testEtherealEmail() {
  console.log('Testing Ethereal email service...');
  
  try {
    const result = await sendVerificationEmail('test@example.com', '123456');
    console.log('Ethereal result:', result);
    
    if (result.previewUrl) {
      console.log('\n🌐 View email in browser:');
      console.log(result.previewUrl);
    }
  } catch (error) {
    console.error('Ethereal test failed:', error);
  }
}

testEtherealEmail();
