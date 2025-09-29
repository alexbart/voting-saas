const ipCapture = (req, res, next) => {
  req.clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
                 req.connection.remoteAddress ||
                 req.socket.remoteAddress ||
                 (req.connection.socket ? req.connection.socket.remoteAddress : null);
  next();
};
module.exports = ipCapture;