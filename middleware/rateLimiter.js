const rateLimit = require('express-rate-limit');

/**
 * Limiteur global pour toutes les requêtes (100 requêtes par 15 minutes)
 */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite chaque IP à 100 requêtes par windowMs
  standardHeaders: true, // Retourne les infos de limite dans les headers `RateLimit-*`
  legacyHeaders: false, // Désactive les headers `X-RateLimit-*`
  message: {
    error: 'Trop de requêtes depuis cette IP, veuillez réessayer après 15 minutes.'
  }
});

/**
 * Limiteur spécifique pour le formulaire de contact (5 requêtes par heure)
 */
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Trop de demandes de contact, veuillez réessayer plus tard.'
  }
});

/**
 * Limiteur spécifique pour l'API GitHub (30 requêtes par 15 minutes)
 */
const githubLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
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
