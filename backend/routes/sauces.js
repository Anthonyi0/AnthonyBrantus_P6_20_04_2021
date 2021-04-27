const express = require('express');
const router = express.Router();
const sauceControl = require('../controllers/sauces');// ont crée la variable sauceControl pour utiliser le fichier sauces
const Authorization = require("../middleware/auth"); //Pour autorisée l'utilisateur
const multer = require("../middleware/multer-config"); //utilisé pour télécharger des fichiers

//on crée les routes
router.get("/", Authorization, sauceControl.getAllSauce);
router.post("/", Authorization, multer, sauceControl.createSauce);
router.get("/:id", Authorization, sauceControl.getOneSauce);
router.put("/:id", Authorization, multer, sauceControl.modifySauce);
router.delete("/:id", Authorization, sauceControl.deleteSauce);
router.post("/:id/like", Authorization, sauceControl.likeSauce);

module.exports = router;