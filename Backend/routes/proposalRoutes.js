const express = require('express');
const router = express.Router();
const { applyToProject, getProposalsForProject, getMySubmittedProposals, approveProposal, deleteProposal } = require('../controllers/proposalController');

router.post('/', applyToProject);
router.get('/project/:projectId', getProposalsForProject);
router.get('/my', getMySubmittedProposals);
router.put('/:proposalId/approve', approveProposal);
router.delete('/:proposalId', deleteProposal);

module.exports = router;
