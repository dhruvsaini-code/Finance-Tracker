const { v4: uuidv4 } = require('crypto');

const requestId = (req, res, next) => {
  req.id = req.headers['x-request-id'] || require('crypto').randomUUID();
  res.setHeader('X-Request-Id', req.id);
  next();
};

module.exports = requestId;
