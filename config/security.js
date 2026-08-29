const helmet = require('helmet');
const cors = require('cors');

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

const configureCors = () => {
  return cors({
    origin: (origin, callback) => {
      
      if (!origin) return callback(null, true);

      if (process.env.NODE_ENV !== 'production') {
        if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
          return callback(null, true);
        }
      }

      const isRailway = origin.endsWith('.railway.app');
      const isCustomAllowed = process.env.ALLOWED_ORIGIN && origin === process.env.ALLOWED_ORIGIN;

      if (isRailway || isCustomAllowed) {
        return callback(null, true);
      }

      callback(new Error('CORS: origine non autorisée'));
    },
    optionsSuccessStatus: 200
  });
};

module.exports = {
  configureHelmet,
  configureCors
};
