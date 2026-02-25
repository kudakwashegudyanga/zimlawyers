require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./server/models/User');

async function testVerifyAPI() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Create a test user (unverified)
    const hashedPassword = await bcrypt.hash('testpassword123', 12);
    const testUser = new User({
      fullName: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
      role: 'LAWYER',
      isVerified: false,
      verificationCode: '000000',
      verificationExpires: new Date(Date.now() + 10 * 60 * 1000)
    });
    
    await testUser.save();
    console.log('✅ Test user created with verification code: 000000');
    
    // Test the verification API call
    const response = await fetch('http://localhost:5000/api/auth/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@example.com',
        code: '000000'
      })
    });
    
    const result = await response.json();
    console.log('🔍 Verification API Response:', result);
    
    // Check final user status
    const finalUser = await User.findOne({ email: 'test@example.com' });
    console.log('📋 Final user status:', {
      isVerified: finalUser.isVerified,
      verificationCode: finalUser.verificationCode,
      verificationExpires: finalUser.verificationExpires
    });
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Test error:', error);
  }
}

testVerifyAPI();
