require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./server/models/User');

async function testVerification() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Find a user to check verification status
    const user = await User.findOne({ email: 'test@example.com' });
    
    if (user) {
      console.log('User found:', {
        id: user._id,
        email: user.email,
        isVerified: user.isVerified,
        verificationCode: user.verificationCode,
        verificationExpires: user.verificationExpires
      });
      
      // Check if verification code matches
      if (user.verificationCode === '000000') {
        console.log('✅ Verification code MATCHES!');
        
        // Update user to verified
        user.isVerified = true;
        user.verificationCode = undefined;
        user.verificationExpires = undefined;
        await user.save();
        
        console.log('✅ User updated to verified status');
      } else {
        console.log('❌ Verification code does not match');
        console.log('Expected: 000000');
        console.log('Actual:', user.verificationCode);
      }
    } else {
      console.log('❌ No user found with email test@example.com');
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Test error:', error);
  }
}

testVerification();
