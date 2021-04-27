// importation des plugins
const jwt = require('jsonwebtoken');
const modelsUser = require('../models/User');

module.exports = async (request, response, next) => {
  try {
    const token = request.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const user = await modelsUser.findOne({ where: { user_id: decodedToken.user_id } })
    if (!user) {
      throw 'Invalid user ID';
    } else {
      request.user = user
      next();
    }
  } catch {
    response.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};