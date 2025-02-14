const Mentor = require('../models/Mentor');
const Mentee = require('../models/Mentee');
const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// SIGNUP: Only for mentor and mentee (no admin signup)
exports.signup = async (req, res) => {
  const { name, email, password, skill, role } = req.body;

  try {
    if (role === 'mentor') {
      const { education, yearsExperience, linkedin } = req.body;

      // Check if the email is already in use for mentors
      const existingMentor = await Mentor.findOne({ email });
      if (existingMentor) {
        return res.status(400).json({ message: 'Email already in use' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newMentor = new Mentor({
        name,
        email,
        password: hashedPassword,
        skill,
        education,
        yearsExperience,
        linkedin,
      });
      await newMentor.save();
      return res.status(201).json({ message: 'Mentor created successfully' });

    } else if (role === 'mentee') {
      // Check if the email is already in use for mentees
      const existingMentee = await Mentee.findOne({ email });
      if (existingMentee) {
        return res.status(400).json({ message: 'Email already in use' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newMentee = new Mentee({
        name,
        email,
        password: hashedPassword,
        skill,
      });
      await newMentee.save();
      return res.status(201).json({ message: 'Mentee created successfully' });

    } else {
      return res.status(400).json({ message: 'Invalid role for signup' });
    }
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// LOGIN: For mentor, mentee, and admin
exports.login = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    let user;
    if (role === 'mentor') {
      user = await Mentor.findOne({ email });
    } else if (role === 'mentee') {
      user = await Mentee.findOne({ email });
    } else if (role === 'admin') {
      user = await Admin.findOne({ email });
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, role },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// SEARCH MENTORS: Only searching in the mentor collection
exports.searchMentors = async (req, res) => {
  const { searchTerm } = req.query;

  try {
    const mentors = await Mentor.find({
      $or: [
        { name: { $regex: searchTerm, $options: "i" } },
        { skill: { $regex: searchTerm, $options: "i" } },
        { education: { $regex: searchTerm, $options: "i" } }
      ]
    });

    // Exclude sensitive data (password)
    const sanitizedMentors = mentors.map(({ name, skill, email, education, yearsExperience, linkedin }) => ({
      name,
      skill,
      email,
      education,
      yearsExperience,
      linkedin,
    }));

    res.status(200).json(sanitizedMentors);
  } catch (error) {
    console.error("Error searching mentors:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
