const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendVerificationEmail } = require('../services/etherealEmailService'); // Changed to Ethereal for testing

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Generate 6-digit verification code
const generateVerificationCode = () => {
  return '000000'; // Fixed code for easy testing
};

const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, role, firmName } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Full name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationCode = generateVerificationCode();
    const verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user but mark as unverified
    const user = new User({
      fullName,
      email,
      password: hashedPassword,
      role: role || 'LAWYER',
      firmName,
      isVerified: false, // Explicitly set to false
      verificationCode,
      verificationExpires
    });

    await user.save();

    // Send verification email
    const emailResult = await sendVerificationEmail(email, verificationCode);
    
    if (!emailResult.success) {
      // If email fails, delete the user and return error
      await User.findByIdAndDelete(user._id);
      return res.status(500).json({ 
        message: 'Failed to send verification email. Please try again.' 
      });
    }

    res.status(201).json({
      message: 'User registered successfully. Please check your email for verification code.',
      requiresVerification: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        firmName: user.firmName,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is verified (only for new signups)
    // If user has verificationCode, they're a new signup that needs verification
    if (user.verificationCode && !user.isVerified) {
      return res.status(401).json({ 
        message: 'Please verify your email before logging in',
        requiresVerification: true
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        firmName: user.firmName,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: 'Email and verification code are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    if (user.verificationExpires < Date.now()) {
      return res.status(400).json({ message: 'Verification code has expired' });
    }

    // Mark user as verified and clear verification fields
    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationExpires = undefined;
    await user.save();

    res.json({
      message: 'Email verified successfully. You can now log in.',
      verified: true
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ message: 'Server error during verification' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyEmail
};
