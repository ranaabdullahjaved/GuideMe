const bcrypt = require('bcryptjs');
const Mentee = require('../models/Mentee');
const Mentor = require('../models/Mentor');
const Admin = require('../models/Admin');

exports.updatePassword = async (req, res) => {
    const { id, role, currentPassword, newPassword, confirmNewPassword } = req.body;
    if (!currentPassword || !newPassword || !confirmNewPassword) {
        return res.status(400).json({ message: "All password fields are required." });
    }
    if (newPassword !== confirmNewPassword) {
        return res.status(400).json({ message: "New password and confirmation do not match." });
    }
    try {
        let user;
        if (role === 'mentee') {
            user = await Mentee.findById(id);
        } else if (role === 'mentor') {
            user = await Mentor.findById(id);
        } else if (role === 'admin') {
            user = await Admin.findById(id);
        } else {
            return res.status(400).json({ message: "Invalid role." });
        }
        if (!user) return res.status(404).json({ message: "User not found." });
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Current password is incorrect." });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        return res.status(200).json({ message: "Password updated successfully." });
    } catch (error) {
        console.error("Error updating password:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
