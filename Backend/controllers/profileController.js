const Mentee = require('../models/Mentee');
const Mentor = require('../models/Mentor');
const Admin = require('../models/Admin');

exports.getProfile = async (req, res) => {
    const { id, role } = req.params;
    try {
        let user;
        if (role === 'mentee') {
            user = await Mentee.findById(id);
        } else if (role === 'mentor') {
            user = await Mentor.findById(id);
        } else if (role === 'admin') {
            user = await Admin.findById(id);
        } else {
            return res.status(400).json({ message: "Invalid role" });
        }
        if (!user) return res.status(404).json({ message: "User not found" });
        user = user.toObject();
        user.role = role;
        res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.updateProfile = async (req, res) => {
    const { id, role, ...updates } = req.body;
    // If a new file is uploaded, Multer adds it to req.file
    if (req.file) {
        updates.avatar = req.file.filename;
    }
    try {
        let updatedUser;
        if (role === 'mentee') {
            const allowed = (({ name, email, skill, avatar }) => ({ name, email, skill, avatar }))(updates);
            updatedUser = await Mentee.findByIdAndUpdate(id, allowed, { new: true });
        } else if (role === 'mentor') {
            const allowed = (({ name, email, skill, education, yearsExperience, linkedin, avatar }) =>
                ({ name, email, skill, education, yearsExperience, linkedin, avatar }))(updates);
            updatedUser = await Mentor.findByIdAndUpdate(id, allowed, { new: true });
        } else if (role === 'admin') {
            const allowed = (({ name, email, avatar }) => ({ name, email, avatar }))(updates);
            updatedUser = await Admin.findByIdAndUpdate(id, allowed, { new: true });
        } else {
            return res.status(400).json({ message: "Invalid role" });
        }
        if (!updatedUser) return res.status(404).json({ message: "User not found" });
        updatedUser = updatedUser.toObject();
        updatedUser.role = role;
        res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
