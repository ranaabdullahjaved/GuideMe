const Mentor = require('../models/Mentor');
const Mentee = require('../models/Mentee');
const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  const { name, email, password, skill, role, education, yearsExperience, linkedin } = req.body;
  const avatarFilename = req.file ? req.file.filename : null;

  try {
    if (role === 'mentor') {
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
        avatar: avatarFilename,
        isApproved: false  // pending approval
      });
      await newMentor.save();
      return res.status(201).json({ message: 'Mentor created successfully, pending admin approval' });
    } else if (role === 'mentee') {
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
        avatar: avatarFilename,
        isApproved: false  // pending approval
      });
      await newMentee.save();
      return res.status(201).json({ message: 'Mentee created successfully, pending admin approval' });
    } else {
      return res.status(400).json({ message: 'Invalid role for signup' });
    }
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

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
    // Check for approval for non-admin users
    if (role !== 'admin' && !user.isApproved) {
      return res.status(403).json({ message: "Your account is pending admin approval." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }
    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, role, avatar: user.avatar, skill: user.skill }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.searchMentors = async (req, res) => {
  const { searchTerm } = req.query;
  try {
    const mentors = await Mentor.find({
      $or: [
        { name: { $regex: searchTerm, $options: "i" } },
        { skill: { $regex: searchTerm, $options: "i" } },
        { education: { $regex: searchTerm, $options: "i" } },
      ],
    });
    const sanitizedMentors = mentors.map((mentor) => ({
      _id: mentor._id,
      name: mentor.name,
      skill: mentor.skill,
      email: mentor.email,
      education: mentor.education,
      yearsExperience: mentor.yearsExperience,
      linkedin: mentor.linkedin,
      avatar: mentor.avatar,
    }));
    res.status(200).json(sanitizedMentors);
  } catch (error) {
    console.error("Error searching mentors:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
