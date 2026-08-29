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
    origin: (origin, callback) => {
      // Autoriser les requêtes sans origine (comme les navigateurs qui chargent l'HTML)
      if (!origin) return callback(null, true);

      // En développement, on autorise localhost
      if (process.env.NODE_ENV !== 'production') {
        if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
          return callback(null, true);
        }
      }

      // En production, on autorise dynamiquement le domaine de l'app ou n'importe quel sous-domaine railway
      const isRailway = origin.endsWith('.railway.app');
      const isCustomAllowed = process.env.ALLOWED_ORIGIN && origin === process.env.ALLOWED_ORIGIN;

      if (isRailway || isCustomAllowed) {
        return callback(null, true);
      }

      // Par défaut, bloquer mais de manière propre pour le CORS
      callback(new Error('CORS: origine non autorisée'));
    },
    optionsSuccessStatus: 200
  });
};

module.exports = {
  configureHelmet,
  configureCors
};
