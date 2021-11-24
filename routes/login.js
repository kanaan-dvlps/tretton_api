const router = require('express').Router();
const Joi = require('joi');
const Token = require('../helpers/token');

router.post('/login', async (req, res, next) => {
  try {
    const { username } = req.body;
    const validateBody = Joi.object().keys({ username: Joi.string().required() });

    if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
      res.status(406).send({
        codeMessage: `Not Acceptable`,
        response: `body can't be empty`
      });
    } else if (validateBody.validate(req.body).error !== undefined || null) {
      res.status(406).json({
        codeMessage: 'Not Acceptable',
        errorMessage: validateBody.validate(req.body).error.message
      });
    } else {
      const token = await Token(username);
      res.status(200).send(token);
    }
  } catch (error) {
    res.status(500).json({
      codeMessage: 'Internal Error',
      errorMessage: error.message
    });
  }
})

module.exports = router;