require('dotenv').config();
const express = require('express');
const compression = require('compression');
const path = require('path');

// Importation de la configuration et des middlewares
const { configureHelmet, configureCors } = require('./config/security');
const { globalLimiter } = require('./middleware/rateLimiter');
const apiRoutes = require('./routes/api');
const pagesRoutes = require('./routes/pages');

const app = express();
const PORT = process.env.PORT || 3000;

// Confiance au proxy (nécessaire sur Railway/Heroku pour le rate limiter et les IPs)
app.set('trust proxy', 1);

// Application des middlewares de sécurité
app.use(configureHelmet());
app.use(configureCors());

// Compression des réponses HTTP (Gzip)
app.use(compression());

// Limiteur de requêtes global
app.use(globalLimiter);

// Parseurs pour le corps des requêtes (avec limite de taille de 10kb)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Fichiers statiques (dossier 'public') avec cache headers (1 jour en production)
const staticOptions = {
  maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0
};
app.use(express.static(path.join(__dirname, 'public'), staticOptions));

// Montage des routes
app.use('/api', apiRoutes);
app.use('/', pagesRoutes);

// Gestionnaire 404
app.use((req, res, next) => {
  res.status(404).send('Page non trouvée');
});

// Gestionnaire global d'erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Une erreur serveur inattendue s\'est produite.'
  });
});

// Démarrage du serveur
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[SERVEUR] Serveur démarré en mode ${process.env.NODE_ENV || 'development'}`);
  console.log(`[SERVEUR] Écoute sur le port ${PORT}`);
});
