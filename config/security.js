const helmet = require('helmet');
const cors = require('cors');

/**
 * Configuration de Helmet avec une CSP (Content Security Policy) adaptée
 * Autorise les polices Google et les ressources locales
 */
const configureHelmet = () => {
  return helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https://api.github.com"]
      },
    },
    crossOriginEmbedderPolicy: false,
  });
};

/**
 * Configuration CORS
 * Autorise localhost en développement
 */
const configureCors = () => {
  return cors({
    origin: process.env.NODE_ENV === 'production' 
      ? false // Remplacez par votre domaine en production
      : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    optionsSuccessStatus: 200
  });
};

module.exports = {
  configureHelmet,
  configureCors
};
