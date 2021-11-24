const { MongoClient } = require('mongodb');
const { fetcher, scrapper, databaseManager } = require('./helpers/scraper');
const axios = require('axios');

jest.mock("axios");
jest.setTimeout(15000);
describe("Test Important Functions", () => {
  describe("when fetcher and cheerio call is successful", () => {
    it("should return HTML as response", async () => {
      // given the data
      const HTML = {
        data: `
        <div class="ninjas" data-bind="css: { 'grid': isActiveFilter(filters.grid) }">
          <div class="ninja-summary" data-aos="flip-up" data-aos-offset="-20">
            <div class="contact-info">
              <h1><a href="meet/agron-kabashi">Agron Kabashi<span>🇸🇪 Lund</span></a></h1>
              <nav class="ninja-nav"> <a href="/meet/agron-kabashi" class="btn-secondary btn-small"><span>Get to know me</span></a> </nav>
            </div> <a href="/meet/agron-kabashi" data-bind="click: isActiveFilter(filters.grid) ? selectNinja : null">
            <img class="portrait" src="https://i.1337co.de/profile/agron-kabashi-medium" alt="Agron Kabashi"> </a>
          </div>
          <div class="ninja-summary" data-aos="flip-up" data-aos-offset="-20">
            <div class="contact-info">
              <h1><a href="meet/ahmad-mirzaei">Ahmad Mirzaei<span>🇸🇪 Lund</span></a></h1>
              <nav class="ninja-nav"> <a href="/meet/ahmad-mirzaei" class="btn-secondary btn-small"><span>Get to know me</span></a> </nav>
            </div> <a href="/meet/ahmad-mirzaei" data-bind="click: isActiveFilter(filters.grid) ? selectNinja : null">
            <img class="portrait" src="https://i.1337co.de/profile/ahmad-mirzaei-medium" alt="Ahmad Mirzaei"> </a>
          </div>
        </div>`
      };
      // then call the mocked functions
      axios.mockResolvedValueOnce(HTML);
      await fetcher();
      const scrapper = jest.fn().mockReturnValueOnce(HTML.data);
      // check the response and arguments
      expect(axios).toBeCalledWith({
        method: 'get',
        url: 'https://tretton37.com/meet',
      });
      expect(axios).toHaveBeenCalledTimes(1);
      expect(scrapper).toHaveBeenCalledWith(scrapper(HTML.data));
      expect(scrapper.mock.calls[0][0]).toEqual(HTML.data);
      console.log('test', scrapper.mock.calls[0][0]);
    });
  });

  // ! Just to show there might be errors ( this type of error won't happen in Axios calls this is just to showcase the mindset of checking for errors as well )
  describe("when API call fails", () => {
    it("should return empty string as response", async () => {

      const HTML = ''
      axios.mockResolvedValueOnce(HTML);

      await fetcher();
      const scrapper = jest.fn().mockReturnValueOnce(HTML.data);

      expect(axios).toBeCalledWith({
        method: 'get',
        url: 'https://tretton37.com/meet',
      });
      expect(axios).toHaveBeenCalledTimes(1);
      expect(scrapper).toHaveBeenCalledWith(scrapper(HTML.data));
      expect(scrapper.mock.calls[0][0]).toEqual(HTML.data);
      console.log('test', scrapper.mock.calls[0][0]);
    });
  });
});

describe("Testing the database insertion", () => {
  let connection;
  let db;
  beforeAll(async () => {
    connection = await MongoClient.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
    });
    db = await connection.db(global.__MONGO_DB_NAME__);
  });

  afterAll(async () => {
    await connection.close();
    // await db.close();
  });
  it("should insert many in db", async () => {
    const arrayOfObjects = [{
      _id: 'some_id',
      id: "6",
      name: "Alexander Danson",
      country: "🇸🇪",
      city: "Stockholm",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
      imagePortraitUrl: "https://i.1337co.de/profile/alexander-danson-medium",
      imageFullUrl: "https://i.1337co.de/profile/alexander-danson-medium",
    },
    {
      _id: 'some',
      id: "7",
      name: "Kanaan Bahmani",
      country: "🇸🇪",
      city: "Stockholm",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
      imagePortraitUrl: "https://i.1337co.de/profile/kanaan-bahmani-medium",
      imageFullUrl: "https://i.1337co.de/profile/kanaan-bahmani-medium",
    }];


    const users = db.collection('coworkers');

    const mockUser = arrayOfObjects;
    await users.insertMany(mockUser);

    const insertedUser = await users.findOne({ name: "Kanaan Bahmani" });
    expect(insertedUser).toEqual({
      "_id": "some",
      "id": "7",
      "name": "Kanaan Bahmani",
      "country": "🇸🇪",
      "city": "Stockholm",
      "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
      "imagePortraitUrl": "https://i.1337co.de/profile/kanaan-bahmani-medium",
      "imageFullUrl": "https://i.1337co.de/profile/kanaan-bahmani-medium",
    });
  });
});
