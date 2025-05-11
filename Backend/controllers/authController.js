const Mentor = require('../models/Mentor');
const Mentee = require('../models/Mentee');
const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Configure nodemailer transporter with Gmail specific settings
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify transporter configuration with detailed logging
transporter.verify(function(error, success) {
  if (error) {
    console.error('SMTP configuration error:', error);
    console.error('SMTP settings:', {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      user: process.env.SMTP_USER,
      // Don't log the actual password
      pass: process.env.SMTP_PASS ? '****' : 'not set'
    });
  } else {
    console.log('SMTP server is ready to send emails');
  }
});

exports.signup = async (req, res) => {
  try {
    // Log the incoming request data
    console.log('Signup request body:', {
      ...req.body,
      references: req.body.references ? 'present' : 'missing',
      files: req.files ? Object.keys(req.files) : 'no files'
    });

    const { name, email, password, skill, role, education, yearsExperience, linkedin, github } = req.body;
    
    // Log parsed values
    console.log('Parsed values:', {
      name,
      email,
      skill,
      role,
      education,
      yearsExperience,
      linkedin,
      github
    });

    // Validate required fields
    const missingFields = [];
    if (!name) missingFields.push('name');
    if (!email) missingFields.push('email');
    if (!password) missingFields.push('password');
    if (!skill) missingFields.push('skill');
    if (!role) missingFields.push('role');

    if (missingFields.length > 0) {
      console.log('Missing required fields:', missingFields);
      return res.status(400).json({ 
        message: 'Missing required fields',
        details: {
          missingFields
        }
      });
    }

    // Validate role-specific fields for mentor
    if (role === 'mentor') {
      const missingMentorFields = [];
      if (!education) missingMentorFields.push('education');
      if (!yearsExperience) missingMentorFields.push('yearsExperience');
      if (!linkedin) missingMentorFields.push('linkedin');

      if (missingMentorFields.length > 0) {
        console.log('Missing mentor fields:', missingMentorFields);
        return res.status(400).json({ 
          message: 'Missing required mentor fields',
          details: {
            missingMentorFields
          }
        });
      }
    }

    let references = [];
    try {
      references = req.body.references ? JSON.parse(req.body.references) : [];
      console.log('Parsed references:', references);
    } catch (error) {
      console.error('Error parsing references:', error);
      return res.status(400).json({ message: 'Invalid references format' });
    }

    const avatarFilename = req.files && req.files.avatar ? req.files.avatar[0].filename : null;
    const educationCertificateFilename = req.files && req.files.educationCertificate ? req.files.educationCertificate[0].filename : null;
    const workExperienceLetterFilename = req.files && req.files.workExperienceLetter ? req.files.workExperienceLetter[0].filename : null;

    console.log('File information:', {
      avatar: avatarFilename,
      educationCertificate: educationCertificateFilename,
      workExperienceLetter: workExperienceLetterFilename
    });

    if (role === 'mentor') {
      const existingMentor = await Mentor.findOne({ email });
      if (existingMentor) {
        console.log('Email already in use:', email);
        return res.status(400).json({ message: 'Email already in use' });
      }

      try {
      const hashedPassword = await bcrypt.hash(password, 10);
        const emailVerificationToken = crypto.randomBytes(32).toString('hex');
        console.log('Generated verification token:', emailVerificationToken);
        
      const newMentor = new Mentor({
        name,
        email,
        password: hashedPassword,
        skill,
        education,
        yearsExperience,
        linkedin,
          github,
        avatar: avatarFilename,
          educationCertificate: educationCertificateFilename,
          workExperienceLetter: workExperienceLetterFilename,
          references,
          isApproved: false,
          isEmailVerified: false,
          emailVerificationToken,
          isLinkedinVerified: false
        });

      console.log('Attempting to save mentor with token:', {
        email,
        token: emailVerificationToken
      });

      const savedMentor = await newMentor.save();
      console.log('Mentor saved successfully:', {
        id: savedMentor._id,
        email: savedMentor.email,
        token: savedMentor.emailVerificationToken
      });

      // Verify the token was saved by querying the database
      const verifyMentor = await Mentor.findById(savedMentor._id);
      console.log('Verification of saved mentor:', {
        id: verifyMentor._id,
        email: verifyMentor.email,
        token: verifyMentor.emailVerificationToken
      });

        try {
          // Send verification email
          const verificationLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email/${emailVerificationToken}`;
          const mailOptions = {
            from: `"GuideMe" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Verify Your Email - GuideMe',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #007b5e;">Welcome to GuideMe!</h1>
                <p>Hello ${name},</p>
                <p>Thank you for signing up as a mentor. Please verify your email address by clicking the button below:</p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${verificationLink}" 
                     style="background-color: #007b5e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                    Verify Email Address
                  </a>
                </div>
                <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
                <p style="word-break: break-all;">${verificationLink}</p>
                <p>Best regards,<br>The GuideMe Team</p>
              </div>
            `
          };
          await transporter.sendMail(mailOptions);
          return res.status(201).json({ message: 'Mentor created successfully, please check your email to verify your account.' });
        } catch (emailError) {
          console.error('Error sending verification email:', emailError);
          return res.status(201).json({ 
            message: 'Mentor created successfully, but there was an error sending the verification email. Please contact support.',
            warning: 'Email verification failed'
          });
        }
      } catch (error) {
        console.error('Error creating mentor:', error);
        return res.status(500).json({ message: 'Error creating mentor account' });
      }
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

    // For mentors, check email verification first
    if (role === 'mentor') {
      if (!user.isEmailVerified) {
        return res.status(403).json({ 
          message: "Please verify your email first. Check your inbox for the verification link.",
          needsEmailVerification: true
        });
      }
      // Then check admin approval
      if (!user.isApproved) {
        return res.status(403).json({ 
          message: "Your account is pending admin approval. You will be notified once approved.",
          needsAdminApproval: true
        });
    }
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({
      message: 'Login successful',
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role, 
        avatar: user.avatar, 
        skill: user.skill,
        isEmailVerified: user.isEmailVerified,
        isApproved: user.isApproved
      }
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

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    console.log('Verification attempt with token:', token);
    
    // Find mentor with this verification token
    const mentor = await Mentor.findOne({ emailVerificationToken: token });
    console.log('Mentor found:', mentor ? {
      id: mentor._id,
      email: mentor.email,
      isEmailVerified: mentor.isEmailVerified,
      token: mentor.emailVerificationToken
    } : 'No mentor found with this token');
    
    if (!mentor) {
      console.log('No mentor found with token:', token);
      return res.status(400).json({ 
        success: false,
        message: 'Invalid verification token' 
      });
    }

    // Update mentor's email verification status
    mentor.isEmailVerified = true;
    mentor.emailVerificationToken = undefined;
    await mentor.save();
    console.log('Mentor email verified successfully:', {
      id: mentor._id,
      email: mentor.email,
      isEmailVerified: mentor.isEmailVerified
    });

    // Verify the changes were saved
    const verifyMentor = await Mentor.findById(mentor._id);
    console.log('Verification of updated mentor:', {
      id: verifyMentor._id,
      email: verifyMentor.email,
      isEmailVerified: verifyMentor.isEmailVerified,
      token: verifyMentor.emailVerificationToken
    });

    // Send success response with 200 status
    return res.status(200).json({ 
      success: true,
      message: 'Email verified successfully',
      mentor: {
        email: mentor.email,
        isEmailVerified: mentor.isEmailVerified
      }
    });
  } catch (error) {
    console.error('Error during email verification:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error'
    });
  }
};
