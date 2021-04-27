const Sauce = require('../models/Sauce');//Récupération du models sauces
const fs = require('fs');//Permet d'accéder au file-system.

exports.createSauce = (request, response, next) => {
    const sauceObject = JSON.parse(request.body.sauce);
    const sauce = new Sauce({
      ...sauceObject,//L'opérateur spread ... est utilisé pour faire une copie de tous les éléments de request.body
      imageUrl: `${request.protocol}://${request.get('host')}/images/${request.file.filename}`
    });
    sauce.save()
      .then(() => response.status(201).json({ message: 'Sauce crée!' }))
      .catch(error => response.status(400).json({ error }));
};
exports.modifySauce = (request, response, next) => {
    const sauceObject = request.file?
    {
      ...JSON.parse(request.body.sauce),
      imageUrl: `${request.protocol}://${request.get('host')}/images/${request.file.filename}`
    } : { ...request.body};
      Sauce.updateOne({ _id: request.params.id }, { ...sauceObject, _id: request.params.id })
        .then(() => response.status(200).json({ message: 'Sauce modifié !'}))
        .catch(error => response.status(400).json({ error }));
};
exports.deleteSauce = (request, response, next) => {
  Sauce.findOne({ _id: request.params.id})
    .then( sauce =>{
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`,()=>{
          Sauce.deleteOne({ _id: request.params.id })
          .then(() => response.status(200).json({ message: 'Sauce supprimé !'}))
          .catch(error => response.status(400).json({ error }));
      })
    })
    .catch(error => res.status(500).json({ error }));
};
exports.getOneSauce = (request, response, next) => {
    Sauce.findOne({ _id: request.params.id })
      .then(sauce => response.status(200).json(sauce))
      .catch(error => response.status(404).json({ error }));
};
exports.getAllSauce = (request, response, next) => {
    Sauce.find()
      .then((sauces) => {response.status(200).json(sauces);})  
      .catch(error => response.status(400).json({ error }));
};
// fonction d'évaluation des sauces (like ou dislike)
// 3 conditions possible la valeur du like est soit: 0, 1 ou -1
exports.likeSauce = (request, response, next) => {
    switch (request.body.like) { 
      case 0://cas: request.body.like = 0
        Sauce.findOne({ _id: request.params.id })
          .then((sauce) => {
            if (sauce.usersLiked.find( user => user === request.body.userId)) { // on cherche si l'utilisateur est déjà dans le tableau usersLiked
              Sauce.updateOne({ _id: request.params.id }, {// si oui, on va mettre à jour la sauce avec le _id présent dans la requête
                $inc: { likes: -1 },//on modifie la valeur des likes de -1 
                $pull: { usersLiked: request.body.userId }//on retire l'utilisateur du tableau.
              })
                .then(() => { response.status(201).json({ message: "vote enregistré."}); }) //code 201: created
                .catch((error) => { response.status(400).json({error}); });
            } 
            if (sauce.usersDisliked.find(user => user === request.body.userId)) { // on cherche si l'utilisateur est déjà dans le tableau usersDisliked
              Sauce.updateOne({ _id: request.params.id }, { // si oui, on va mettre à jour la sauce avec le _id présent dans la requête
                $inc: { dislikes: -1 },//on modifie la valeur des dislikes de -1
                $pull: { usersDisliked: request.body.userId }//on retire l'utilisateur du tableau.
              })
                .then(() => { response.status(201).json({ message: "vote enregistré." }); })
                .catch((error) => { response.status(400).json({error}); });
            }
          })
          .catch((error) => { response.status(404).json({error}); });
        break;
     case 1://cas: request.body.like = 1
        Sauce.updateOne({ _id: request.params.id }, {// on recherche la sauce avec le _id présent dans la requête
          $inc: { likes: 1 },// modification de la valeur de likes par 1.
          $push: { usersLiked: request.body.userId }// on ajoute l'utilisateur dans le array usersLiked.
        })
          .then(() => { response.status(201).json({ message: "vote enregistré." }); }) //code 201: created
          .catch((error) => { response.status(400).json({ error }); }); //code 400: bad request
        break;
      case -1://cas: request.body.like = 1
        Sauce.updateOne({ _id: request.params.id }, {// on recherche la sauce avec le _id présent dans la requête
          $inc: { dislikes: 1 },// on modifie de 1 la valeur de dislikes.
          $push: { usersDisliked: request.body.userId }// on rajoute l'utilisateur à l'array usersDiliked.
        })
          .then(() => { response.status(201).json({ message: "vote enregistré." }); }) // code 201: created
          .catch((error) => { response.status(400).json({ error }); }); // code 400: bad request
        break;
      default:
        console.error("bad request");
    }
  };