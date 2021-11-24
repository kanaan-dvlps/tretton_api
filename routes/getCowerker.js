const router = require('express').Router();
const CoworkerModel = require('../Models/CoworkerSchema');
const ensureAuthenticated = require('../middleware/JWT');

router.get('/coworker', ensureAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.query;
    const coworker = await CoworkerModel.findOne({ _id: id }, { _id: 0, name: 1, text: 1, imagePortraitUrl: 1 });
    res.status(200).send(coworker);

  } catch (error) {
    res.status(500).send({
      codeMessage: 'Internal Error',
      response: error.message
    });
  }
});

module.exports = router;