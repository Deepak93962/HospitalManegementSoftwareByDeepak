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
  // Wait, saving here triggers the password pre-save a SECOND time if we don't handle it properly. 
  // Good thing our pre-save has `!this.isModified('password') return next();` logic protecting it!
  await user.save();

  // MOCK EMAIL SEND OVER CONSOLE DEPLOYMENT
  const verificationUrl = `http://localhost:5173/verify-email/${verifyToken}`;
  console.log(`\n\n[DEV-ONLY] VERIFICATION LINK FOR ${user.email}:\n${verificationUrl}\n\n`);

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

  // Allow through natively and mock reset token
  res.status(200).json({ message: "Password reset link sent to your email (Mocked)" });
});

module.exports = { registerUser, loginUser, verifyEmail, forgotPassword };