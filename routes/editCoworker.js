const router = require('express').Router();
const Joi = require('joi');
const CoworkerModel = require('../Models/CoworkerSchema');

router.post('/update/:id', async (req, res, next) => {
  try {
    const { name, city, text } = req.body;
    const { id } = req.params;

    const validateBody = Joi.object().keys({
      name: Joi.string().required(),
      city: Joi.string().required(),
      text: Joi.string().required(),
    });

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
      const updatedModel = await CoworkerModel.findOneAndUpdate({ _id: id }, {
        $set: {
          name: name,
          city: city,
          text: text
        },
      },
      {
        new: true
      });
      res.status(200).send({
        updatedModel
      });
    }
  } catch (error) {
    res.status(500).send({
      codeMessage: 'Internal Error',
      response: error.message
    })
  }
})

module.exports = router;