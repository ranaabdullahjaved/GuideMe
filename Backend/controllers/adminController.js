const Mentor = require('../models/Mentor');
const Mentee = require('../models/Mentee');

exports.getPendingUsers = async (req, res) => {
    try {
        // For mentors, only get those with verified emails
        const pendingMentors = await Mentor.find({ 
            isApproved: false,
            isEmailVerified: true 
        });
        
        // For mentees, get all pending users since they don't need email verification
        const pendingMentees = await Mentee.find({ isApproved: false });
        
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
        res.status(200).json({ message: "User deleted", user: deletedUser });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
