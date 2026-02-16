const thirdPartyService = require('../services/thirdParty.service');

exports.getCompanionSpark = async (req, res) => {
  try {
    const payload = await thirdPartyService.getCompanionSpark();
    res.status(200).json(payload);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
