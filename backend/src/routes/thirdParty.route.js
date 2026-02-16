const express = require('express');
const { protect } = require('../middlewares/user.middleware');
const thirdPartyController = require('../controllers/thirdParty.controller');

const router = express.Router();

router.use(protect);
router.get('/companion-spark', thirdPartyController.getCompanionSpark);

module.exports = router;
