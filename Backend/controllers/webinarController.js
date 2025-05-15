// controllers/webinarController.js
const Webinar = require('../models/Webinar');

exports.addWebinar = async (req, res) => {
    const { title, description, hostName, date, duration, link, type, topic } = req.body;
    // Multer adds file info to req.file if an image is uploaded
    const imageFilename = req.file ? req.file.filename : null;

    if (!title || !description || !hostName || !date || !duration || !link || !type) {
        return res.status(400).json({ message: "Required fields missing" });
    }

    try {
        const webinar = new Webinar({
            title,
            description,
            hostName,
            date,
            duration: Number(duration),
            link,
            type,
            topic,
            image: imageFilename,
        });
        await webinar.save();
        res.status(201).json({ message: "Webinar added successfully", webinar });
    } catch (error) {
        console.error("Error adding webinar:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getWebinars = async (req, res) => {
    const { filter } = req.query; // filter can be "7days" or "6months". If empty, then upcoming.
    try {
        let webinars;
        const now = new Date();
        if (filter === "7days") {
            const sevenDaysAgo = new Date(now);
            sevenDaysAgo.setDate(now.getDate() - 7);
            webinars = await Webinar.find({ date: { $gte: sevenDaysAgo, $lte: now } }).sort({ date: -1 });
        } else if (filter === "6months") {
            const sixMonthsAgo = new Date(now);
            sixMonthsAgo.setMonth(now.getMonth() - 6);
            webinars = await Webinar.find({ date: { $gte: sixMonthsAgo, $lte: now } }).sort({ date: -1 });
        } else {
            // Default: upcoming webinars (date >= now)
            webinars = await Webinar.find({ date: { $gte: now } }).sort({ date: 1 });
        }
        res.status(200).json(webinars);
    } catch (error) {
        console.error("Error fetching webinars:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Add an endpoint to update a webinar
exports.updateWebinar = async (req, res) => {
    const { id } = req.params;
    const { title, description, hostName, date, duration, link, type, topic } = req.body;
    const imageFilename = req.file ? req.file.filename : undefined;

    try {
        const updateData = {
            title,
            description,
            hostName,
            date,
            duration: Number(duration),
            link,
            type,
            topic
        };

        // Only update the image if a new one was uploaded
        if (imageFilename) {
            updateData.image = imageFilename;
        }

        const webinar = await Webinar.findByIdAndUpdate(
            id, 
            updateData,
            { new: true, runValidators: true }
        );

        if (!webinar) {
            return res.status(404).json({ message: "Webinar not found" });
        }

        res.status(200).json({ message: "Webinar updated successfully", webinar });
    } catch (error) {
        console.error("Error updating webinar:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Add an endpoint to delete a webinar
exports.deleteWebinar = async (req, res) => {
    const { id } = req.params;

    try {
        const webinar = await Webinar.findByIdAndDelete(id);

        if (!webinar) {
            return res.status(404).json({ message: "Webinar not found" });
        }

        res.status(200).json({ message: "Webinar deleted successfully" });
    } catch (error) {
        console.error("Error deleting webinar:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
