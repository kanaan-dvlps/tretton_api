const router = require('express').Router();
const CoworkerModel = require('../Models/CoworkerSchema');
// const scraper = require('../helpers/scraper');
const { fetcher } = require('../helpers/scraper');

router.get('/coworkers', async (req, res, next) => {
  try {
    const { start, end, filter } = req.query;
    let SKIP = Number(start);
    let LIMIT = Number(end);
    // await scraper();
    // await fetcher();
    await fetcher();

    const count = await CoworkerModel.find({}).count();
    if (Object.keys(req.query).length === 0) {
      const allCoworkers = await CoworkerModel.find();
      res.status(200).send({
        data: allCoworkers,
        totalLength: allCoworkers.length
      });
    } else if (filter) {
      // ? new RegExp("^" + filter, "i") is for an case insensitive search
      const filteredCoworkersList = await CoworkerModel.find(
          { $or: [{ name: { $regex: new RegExp("^" + filter, "i") } }, { country: { $regex: new RegExp("^" + filter, "i") } }, { city: { $regex: new RegExp("^" + filter, "i") } }] }        
      ).skip(SKIP).limit(LIMIT).lean();
      const coworkersCount = await CoworkerModel.find().count();
      res.status(200).send({
        data: filteredCoworkersList,
        totalLength: coworkersCount
      });
    } else {
      const coworkersList = await CoworkerModel.find().skip(SKIP).limit(LIMIT);
      const coworkersCount = await CoworkerModel.find().count();
      res.status(200).send({
        data: coworkersList,
        totalLength: coworkersCount
      });
    }
  } catch (error) {
    res.status(500).send({
      codeMessage: 'Get Coworkers Internal Error',
      response: error
    });
  }

});

module.exports = router;