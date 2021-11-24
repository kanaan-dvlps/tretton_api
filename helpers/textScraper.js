// TODO: Create the text scraper here 
// profileURLs.forEach(async endpoint => {
//   const textAPI = await axios({
//     method: 'get',
//     url: encodeURI('https://tretton37.com' + endpoint)
//   });
//   const { data } = textAPI;
//   console.log(data);
// })

/*
  TODO: [] turn the urls into smaller chunks
  TODO: [] call the urls
  TODO: [] push the text into an array
*/
const axios = require('axios');
function textGetter (URLs) {
  const chunkSize = 5;
  const arrays = [];
  const axiosData = [];
  for (let i = 0; i < URLs.length; i += chunkSize) {
    arrays.push(URLs.slice(i, i + chunkSize));
  }
  arrays.forEach(items => {
    items.forEach(url => {
      setTimeout(async () => {
        const api = await axios({
          method: 'get',
          url: encodeURI('https://tretton37.com' + url)
        });
        const { data } = api;
        axiosData.push(data);
        console.log(axiosData);
      }, 3000);
    });
  });
}

module.exports = textGetter;