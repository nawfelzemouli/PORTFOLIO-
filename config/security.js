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
  const allowedOrigins = process.env.NODE_ENV === 'production'
    ? [process.env.ALLOWED_ORIGIN].filter(Boolean)
    : ['http://localhost:3000', 'http://127.0.0.1:3000'];

  return cors({
    origin: (origin, callback) => {
      // Autoriser les requêtes sans origin (ex: appels directs, health checks)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      // En développement, tout autoriser si pas de ALLOWED_ORIGIN configuré
      if (process.env.NODE_ENV !== 'production') return callback(null, true);
      callback(new Error('CORS: origine non autorisée'));
    },
    optionsSuccessStatus: 200
  });
};

module.exports = {
  configureHelmet,
  configureCors
};
