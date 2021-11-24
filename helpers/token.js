const jwt = require('jsonwebtoken');

async function Token(payload) {
  const authToken = await jwt.sign({ payload }, process.env.SECRET, { expiresIn: '15d'});
  return authToken;
}

module.exports = Token;