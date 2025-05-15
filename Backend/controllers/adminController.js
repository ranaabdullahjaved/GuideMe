const Mentor = require('../models/Mentor');
const Mentee = require('../models/Mentee');
const nodemailer = require('nodemailer');
const Conversation = require('../models/Conversation');

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

exports.getStatistics = async (req, res) => {
    try {
        // Count total approved mentors
        const mentorCount = await Mentor.countDocuments({ isApproved: true });
        
        // Count total conversations (matches)
        const matchesCount = await Conversation.countDocuments();
        
        // Since we don't have country fields in our models,
        // we'll provide a static count for countries
        const countriesCount = 130; // Static count as a placeholder
        
        res.status(200).json({
            mentorCount,
            matchesCount,
            countriesCount
        });
    } catch (error) {
        console.error("Error fetching statistics:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getPendingUsers = async (req, res) => {
    try {
        // For mentors, only get those with verified emails
        const pendingMentors = await Mentor.find({ 
            isApproved: false,
            isEmailVerified: true 
        });
        
        // For mentees, get all pending users since they don't need email verification
        const pendingMentees = await Mentee.find({ isApproved: false });
        
        // Include all user details for both mentors and mentees
        const pendingUsers = [
            ...pendingMentees.map(u => ({ ...u.toObject(), role: "mentee" })),
            ...pendingMentors.map(u => ({ ...u.toObject(), role: "mentor" })),
        ];
        res.status(200).json(pendingUsers);
    } catch (error) {
        console.error("Error fetching pending users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.approveUser = async (req, res) => {
    const { id, role } = req.body;
    try {
        let updatedUser;
        if (role === 'mentee') {
            updatedUser = await Mentee.findByIdAndUpdate(id, { isApproved: true }, { new: true });
        } else if (role === 'mentor') {
            updatedUser = await Mentor.findByIdAndUpdate(id, { isApproved: true }, { new: true });
        } else {
            return res.status(400).json({ message: "Invalid role" });
        }
        if (!updatedUser) return res.status(404).json({ message: "User not found" });

        // Send approval email
        try {
            const mailOptions = {
                from: `"GuideMe" <${process.env.SMTP_USER}>`,
                to: updatedUser.email,
                subject: 'Your GuideMe Account Has Been Approved!',
                html: `
                  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #007b5e;">Congratulations!</h1>
                    <p>Hello ${updatedUser.name},</p>
                    <p>Your account has been approved by the GuideMe admin team. You can now log in and start using the platform.</p>
                    <p>Best regards,<br>The GuideMe Team</p>
                  </div>
                `
            };
            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.error('Error sending approval email:', emailError);
        }

        res.status(200).json({ message: "User approved", user: updatedUser });
    } catch (error) {
        console.error("Error approving user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.deleteUser = async (req, res) => {
    const { id, role } = req.body;
    try {
        let deletedUser;
        if (role === 'mentee') {
            deletedUser = await Mentee.findByIdAndDelete(id);
        } else if (role === 'mentor') {
            deletedUser = await Mentor.findByIdAndDelete(id);
        } else {
            return res.status(400).json({ message: "Invalid role" });
        }
        if (!deletedUser) return res.status(404).json({ message: "User not found" });

        // Send rejection email
        try {
            const mailOptions = {
                from: `"GuideMe" <${process.env.SMTP_USER}>`,
                to: deletedUser.email,
                subject: 'Your GuideMe Account Application',
                html: `
                  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #d32f2f;">Account Application Update</h1>
                    <p>Hello ${deletedUser.name},</p>
                    <p>We regret to inform you that your account application has been rejected or deleted by the GuideMe admin team. If you believe this was a mistake or would like more information, please contact support.</p>
                    <p>Best regards,<br>The GuideMe Team</p>
                  </div>
                `
            };
            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.error('Error sending rejection email:', emailError);
        }

        res.status(200).json({ message: "User deleted", user: deletedUser });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
