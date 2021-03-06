// importation des plugins
const express = require('express');
const app = express();
const bodyParser = require('body-parser');//Rend les données du corps de la requête exploitable
const mongoose = require('mongoose');
const path = require('path');
const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauces');
const helmet = require('helmet')//aide à sécuriser les appli Express
require('dotenv').config()//Cache les infos sensible dans le dossier ".env"
 
//mongoose.connect('mongodb+srv://user:<PASSWORD>@cluster0-pme76.mongodb.net/test?retryWrites=true&w=majority',
mongoose.connect(process.env.mongodb,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

app.use((request, response, next) => {
    response.setHeader('Access-Control-Allow-Origin', '*'); //qui peux faire une requête
    response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); //quoi
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); //comment
    next();
  });

app.use(helmet())//securisation HTTP headers
app.use(bodyParser.json());
app.use('/images',express.static(path.join(__dirname,'images')));
app.use('/api/auth', userRoutes);
app.use('/api/sauces', saucesRoutes);

module.exports = app;