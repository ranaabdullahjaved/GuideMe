const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Handle user signup
exports.signup = async (req, res) => {
  const { name, email, password, skill, role } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      skill,
      role,
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Handle user login
exports.login = async (req, res) => {
  const { emailOrUsername, password, role } = req.body;

  try {
    // Find the user by email or username
    const user = await User.findOne({ email: emailOrUsername });
    if (!user || user.role !== role) {
      return res.status(400).json({ message: 'Invalid email, username, or role.' });
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password.' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
exports.searchMentors = async (req, res) => {
    const { searchTerm } = req.query;
  
    try {
      // Find users with role 'mentor' and matching name or skill
      const mentors = await User.find({
        role: 'mentor', // Only mentors
        $or: [
          { name: { $regex: searchTerm, $options: "i" } }, // Case-insensitive name match
          { skill: { $regex: searchTerm, $options: "i" } }, // Case-insensitive skill match
        ],
      });
  
      // Exclude sensitive information like passwords
      const sanitizedMentors = mentors.map(({ name, role, skill, email }) => ({
        name,
        role,
        skill,
        email,
      }));
  
      res.status(200).json(sanitizedMentors);
    } catch (error) {
      console.error("Error searching mentors:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };