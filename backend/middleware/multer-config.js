// importation des plugins
const multer = require('multer');

//création du dictionnaire pour extention photo 
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
};

const storage = multer.diskStorage({
  destination: (request, file, callback) => {  //indique à multer de placer les fichiers dans le dossier images
    callback(null, 'images');
  },
  filename: (request, file, callback) => {    
    const name = file.originalname.split(' ').join('_');// utiliser le nom d'origine, remplacer les espace par des underscor
    const extension = MIME_TYPES[file.mimetype]; // utilise le dictionnaire MIME pour trouver la bonne extension
    if(extension === undefined){
      throw new Error("extention du fichier invalide")
    }
    callback(null, name + Date.now() + '.' + extension);// on definie les parametres du call back
  }
});

// on exporte multer en lui passant notre constante storage
module.exports = multer({ storage: storage }).single('image');//".single" indique que l'on va gérer uniquement le téléchargement d'image