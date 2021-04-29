// importation des plugins
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 

const User = require('../models/User'); // récupération du model

exports.signup = (request, response, next) => {
  bcrypt.hash(request.body.password, 10) // hashage *10 du password
    .then(hash => {              
      const user = new User({
        email: request.body.email,
        password: hash
      })
      user.save()                    
        .then(() => response.status(201).json({ message: 'Utilisateur crée!' }))
        .catch(error => response.status(400).json({ error }))
    })
    .catch(error => response.status(500).json({ error }))
}
exports.login = (request, response, next) => {
  User.findOne({ email: request.body.email })
    .then(user => {
      if (!user) {
        return response.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(request.body.password, user.password) // on compare le password entrez et celui dans la base de donnée 
        .then(valid => {
          if (!valid) {
            return response.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          response.status(200).json({
            userId: user._id,
            token: jwt.sign(  // ".sign" permet d'encoder un nouveau token
              { userId: user._id, },
                process.env.TOKEN, // encodage
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => response.status(500).json({ error }));
    })
    .catch(error => response.status(500).json({ error }));
};