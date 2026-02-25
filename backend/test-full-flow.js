require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./server/models/User');

async function testFullFlow() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Create a test user
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
    
    // Now test verification
    const user = await User.findOne({ email: 'test@example.com' });
    
    if (user) {
      console.log('User verification status:', {
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
        console.log('Final verification status:', user.isVerified);
      } else {
        console.log('❌ Verification code does not match');
      }
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Test error:', error);
  }
}

testFullFlow();
