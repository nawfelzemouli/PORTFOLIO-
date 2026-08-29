const rateLimit = require('express-rate-limit');

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  standardHeaders: true, 
  legacyHeaders: false, 
  message: {
    error: 'Trop de requêtes depuis cette IP, veuillez réessayer après 15 minutes.'
  }
});

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Trop de demandes de contact, veuillez réessayer plus tard.'
  }
});

const githubLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Trop de requêtes vers l\'API GitHub, veuillez réessayer après 15 minutes.'
  }
});

module.exports = {
  globalLimiter,
  contactLimiter,
  githubLimiter
};
