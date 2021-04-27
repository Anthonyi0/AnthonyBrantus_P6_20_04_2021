// importation des plugins (pas oubliez npm install)
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')

//création du model user 
const userSchema = mongoose.Schema({  
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
})

//plugin qui ajoute une validation de pré-sauvegarde pour les champs uniques dans un schéma Mongoose.
userSchema.plugin(uniqueValidator)

//exportation pour utilisez sur les autres pages 
module.exports = mongoose.model("user", userSchema) 