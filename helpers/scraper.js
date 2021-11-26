const axios = require('axios');
const CoworkerModel = require('../Models/CoworkerSchema');
const cheerio = require('cheerio');
const bluebird = require('bluebird');

/*
  TODO: [X] axios function
  TODO: [X] cheerio function
  TODO: [X] DB function
*/

async function fetcher() {
  try {
    const api = await axios({
      method: 'get',
      url: 'https://tretton37.com/meet',
    });
    const { data } = api;
    // console.log('axios', data);
    // console.log(typeof data);
    await scrapper(data);
  } catch (err) {
    if (err) {
      return err.message
    }
  }
}

async function scrapper(html) {
  // console.log('scrapper', html);
  const $ = cheerio.load(html);
  const people = [];
  await bluebird.each($('.ninjas').children(), async (item) => {
    // 🇸🇪
    const contact = $(item).find('h1 > a').html();
    const splitedContact = contact?.split('<span>');


    const name = splitedContact[0].trim();
    const countryAndCity = splitedContact[1]?.replace('</span>', '').trim().split(' ');
    const country = countryAndCity[0];
    const city = countryAndCity[1];
    const src = $(item).find('.contact-info').siblings('a').children('img').attr('src');

    if (name && country && city && src) {
      people.push({
        id: people.length + 1,
        name,
        city,
        country,
        text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam`,
        imagePortraitUrl: src,
        imageFullUrl: src,
      });
      // ? Create profile links
      // * / /g is a regexp to remove all the white spaces with dashes since there might be more than two words in a name only specifying the white space with ' ' sign as white space won't work!
      // const URLName = name.replace(/ /g, '-');
      // profileURL = `/meet/${URLName}`
      // profileURLs.push(profileURL);
    }
  });
  // console.log('people', people);
  await databaseManager(people);
  return people;
}

async function databaseManager(data) {
  const hasEntities = await CoworkerModel.find().count();
  // * here we can compare and return the existing changes to the HTML and already saved entities in the database and return them

  if (hasEntities === 0) {
    const newDatabase = await CoworkerModel.insertMany(data)
    console.log('updated the DB', newDatabase);
    return newDatabase;
  } else if (hasEntities < data.length){
    const updatedDatabase = await CoworkerModel.insertMany(data)
    console.log('updated the DB', updatedDatabase);
  } else {
    console.log(`DB is up_to_date`);
  }
}

module.exports = { 
  fetcher,
  scrapper,
  databaseManager
}