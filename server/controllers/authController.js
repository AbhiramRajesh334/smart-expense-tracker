const User = require('../models/User');
const bcrypt = require('bcrypt'); // Or bcryptjs depending on what is installed, using bcrypt by default
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user to database
    const newUser = new User({
      email,
      password: hashedPassword,
    });
    
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during signup', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' } // You can adjust the expiration as needed
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

module.exports = {
  signup,
  login,
};
