const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  console.log(req.headers['authorization']);
  if (!token) {
    return res.status(403).send('Token is required');
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded;
  } catch (error) {
    return res.status(401).send({
      codeMessage: 'Unauthorized',
      response: error.message
    });
  }
  next();
}

module.exports = verifyToken;