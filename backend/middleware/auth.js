// importation des plugins
const jwt = require('jsonwebtoken');

module.exports = async (request, response, next) => {
  try {
    const token = request.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token,process.env.TOKEN);
    const userId = decodedToken.userId;
    if (request.body.userId && request.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    response.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};