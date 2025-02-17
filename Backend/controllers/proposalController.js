// controllers/proposalController.js
const Proposal = require('../models/Proposal');
const Mentee = require('../models/Mentee');
const Mentor = require('../models/Mentor');

exports.applyToProject = async (req, res) => {
    const { projectId, applicantId, applicantRole, proposalText, proposedBudget, timeline } = req.body;
    try {
        const existingProposal = await Proposal.findOne({ projectId, "applicant.id": applicantId });
        if (existingProposal) {
            return res.status(400).json({ message: "You have already applied to this project." });
        }
        const proposal = new Proposal({
            projectId,
            applicant: {
                id: applicantId,
                role: applicantRole
            },
            proposalText,
            proposedBudget,
            timeline,
        });
        await proposal.save();
        res.status(201).json({ message: "Proposal submitted successfully", proposal });
    } catch (error) {
        console.error("Error applying to project:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getProposalsForProject = async (req, res) => {
    const { projectId } = req.params;
    try {
        let proposals = await Proposal.find({ projectId }).sort({ createdAt: -1 });
        // For each proposal, attach applicant info (name and avatar)
        const augmentedProposals = await Promise.all(
            proposals.map(async (proposal) => {
                let applicantInfo = {};
                if (proposal.applicant.role === 'mentee') {
                    const mentee = await Mentee.findById(proposal.applicant.id).select("name avatar");
                    if (mentee) {
                        applicantInfo = mentee.toObject();
                    }
                } else if (proposal.applicant.role === 'mentor') {
                    const mentor = await Mentor.findById(proposal.applicant.id).select("name avatar");
                    if (mentor) {
                        applicantInfo = mentor.toObject();
                    }
                }
                return { ...proposal.toObject(), applicantInfo };
            })
        );
        res.status(200).json(augmentedProposals);
    } catch (error) {
        console.error("Error fetching proposals:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getMySubmittedProposals = async (req, res) => {
    const { applicantId, applicantRole } = req.query;
    try {
        const proposals = await Proposal.find({ "applicant.id": applicantId, "applicant.role": applicantRole }).sort({ createdAt: -1 });
        res.status(200).json(proposals);
    } catch (error) {
        console.error("Error fetching my proposals:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.approveProposal = async (req, res) => {
    const { proposalId } = req.params;
    try {
        const proposal = await Proposal.findByIdAndUpdate(proposalId, { status: "accepted" }, { new: true });
        if (!proposal) return res.status(404).json({ message: "Proposal not found" });
        res.status(200).json({ message: "Proposal approved", proposal });
    } catch (error) {
        console.error("Error approving proposal:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.deleteProposal = async (req, res) => {
    const { proposalId } = req.params;
    try {
        const proposal = await Proposal.findByIdAndDelete(proposalId);
        if (!proposal) return res.status(404).json({ message: "Proposal not found" });
        res.status(200).json({ message: "Proposal deleted" });
    } catch (error) {
        console.error("Error deleting proposal:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
