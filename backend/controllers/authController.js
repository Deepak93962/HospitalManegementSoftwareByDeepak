const User = require('../models/User');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const crypto = require('crypto');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, age, contact, gender } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please fill all required fields" });
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || "Patient",
    age,
    contact,
    gender,
    isVerified: false 
  });

  // Generate Email Verification Token using crypto natively
  const verifyToken = crypto.randomBytes(20).toString('hex');
  user.verificationToken = crypto.createHash('sha256').update(verifyToken).digest('hex');
  user.verificationTokenExpire = Date.now() + 15 * 60 * 1000; // Exact 15 minutes expiry constraint
  
  // NOTE: Pre-save hook hashes password, but only triggers if modified.
  await user.save();

  const verificationUrl = `http://localhost:5173/verify-email/${verifyToken}`;
  const message = `
    <h2>Welcome to Clinify HMS</h2>
    <p>Please verify your email address by clicking the link below:</p>
    <a href="${verificationUrl}" target="_blank">${verificationUrl}</a>
    <p>This verification link will expire in 15 minutes.</p>
    <br/>
    <p>If you did not request this, please ignore this email.</p>
  `;

  const sendEmail = require('../utils/sendEmail');
  try {
    const emailSent = await sendEmail({
      email: user.email,
      subject: 'Clinify HMS - Action Required: Email Verification',
      message
    });

    if (!emailSent) {
      console.log(`\n\n[DEV-ONLY FALLBACK] VERIFICATION LINK FOR ${user.email}:\n${verificationUrl}\n\n`);
    }
  } catch (error) {
    console.log(`\n\n[DEV-ONLY FALLBACK] VERIFICATION LINK FOR ${user.email}:\n${verificationUrl}\n\n`);
  }

  res.status(201).json({ message: "Verification link sent to your email" });
});

const verifyEmail = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    verificationToken: hashedToken,
    verificationTokenExpire: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired verification token" });
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpire = undefined;
  await user.save();

  res.status(200).json({ message: "Email successfully verified. You can now log in." });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    
    // Check verification actively ONLY IF it is strictly false (legacy DB mappings pass as undefined gracefully)
    if (user.isVerified === false) {
      return res.status(403).json({ message: "Please verify your email before login" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "No user found with this email" });
  }

  if (user.isVerified === false) {
    return res.status(403).json({ message: "Please verify your email first" });
  }

  const resetUrl = `http://localhost:5173/reset-password/mock-token`; // Standard mocked link for now

  const message = `
    <h2>Clinify HMS - Password Reset</h2>
    <p>You requested a password reset. Please click the link below to set a new password:</p>
    <a href="${resetUrl}" target="_blank">Reset Password</a>
    <p>If you did not request this, please ignore this email.</p>
  `;

  const sendEmail = require('../utils/sendEmail');
  try {
    const emailSent = await sendEmail({
      email: user.email,
      subject: 'Clinify HMS - Password Reset Request',
      message
    });

    if (!emailSent) {
      console.log(`\n\n[DEV-ONLY FALLBACK] RESET LINK FOR ${user.email}:\n${resetUrl}\n\n`);
    }
  } catch (error) {
    console.log(`\n\n[DEV-ONLY FALLBACK] RESET LINK FOR ${user.email}:\n${resetUrl}\n\n`);
  }

  res.status(200).json({ message: "Password reset link sent to your email" });
});

module.exports = { registerUser, loginUser, verifyEmail, forgotPassword };