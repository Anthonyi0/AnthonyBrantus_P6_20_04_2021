const express = require('express');
const router = express.Router();
const sauceControl = require('../controllers/sauce');// ont crée la variable sauceControl pour utiliser le fichier sauces
const auth = require("../middleware/auth"); //Pour autorisée l'utilisateur
const multer = require("../middleware/multer-config"); //utilisé pour télécharger des fichiers

//on crée les routes
router.get("/", auth, sauceControl.getAllSauce);
router.post("/", auth, multer, sauceControl.createSauce);
router.get("/:id", auth, sauceControl.getOneSauce);
router.put("/:id", auth, multer, sauceControl.modifySauce);
router.delete("/:id", auth, sauceControl.deleteSauce);
router.post("/:id/like", auth, sauceControl.likeSauce);

module.exports = router;