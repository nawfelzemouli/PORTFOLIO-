require('dotenv').config();
const express = require('express');
const compression = require('compression');
const path = require('path');

const { configureHelmet, configureCors } = require('./config/security');
const { globalLimiter } = require('./middleware/rateLimiter');
const apiRoutes = require('./routes/api');
const pagesRoutes = require('./routes/pages');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1);

app.use(configureHelmet());
app.use(configureCors());

app.use(compression());

app.use(globalLimiter);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

const staticOptions = {
  maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0
};
app.use(express.static(path.join(__dirname, 'public'), staticOptions));

app.use('/api', apiRoutes);
app.use('/', pagesRoutes);

app.use((req, res, next) => {
  res.status(404).send('Page non trouvée');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Une erreur serveur inattendue s\'est produite.'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[SERVEUR] Serveur démarré en mode ${process.env.NODE_ENV || 'development'}`);
  console.log(`[SERVEUR] Écoute sur le port ${PORT}`);
});
