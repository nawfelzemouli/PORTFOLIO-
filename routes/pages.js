const express = require('express');
const router = express.Router();
const path = require('path');

/**
 * Route principale (Page d'accueil du portfolio)
 */
router.get('/', (req, res) => {
  // Renvoie le fichier HTML principal depuis le dossier 'views'
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

module.exports = router;
