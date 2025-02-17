const Project = require('../models/Project');

exports.createProject = async (req, res) => {
    const { title, description, duration, budget, requiredSkills, postedById, postedByRole } = req.body;
    try {
        const project = new Project({
            title,
            description,
            duration,
            budget,
            requiredSkills: requiredSkills.split(',').map(skill => skill.trim()),
            postedBy: {
                id: postedById,
                role: postedByRole
            }
        });
        await project.save();
        res.status(201).json({ message: "Project created successfully", project });
    } catch (error) {
        console.error("Error creating project:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.status(200).json(projects);
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: "Project not found" });
        res.status(200).json(project);
    } catch (error) {
        console.error("Error fetching project:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getMyPostedProjects = async (req, res) => {
    const { userId, role } = req.query;
    try {
        const projects = await Project.find({ "postedBy.id": userId, "postedBy.role": role }).sort({ createdAt: -1 });
        res.status(200).json(projects);
    } catch (error) {
        console.error("Error fetching my projects:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
