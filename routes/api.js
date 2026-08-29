const express = require('express');
const router = express.Router();
const { githubLimiter, contactLimiter } = require('../middleware/rateLimiter');
const { contactValidation, handleValidationErrors } = require('../middleware/validator');
const { fetchGitHubRepos } = require('../utils/github');

// Cache simple pour le profil GitHub
let profileCache = null;
let profileCacheTime = 0;
const PROFILE_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Route GET /api/github/profile
 * Récupère le profil GitHub de l'utilisateur
 */
router.get('/github/profile', githubLimiter, async (req, res) => {
  const username = process.env.GITHUB_USERNAME || 'nawfelzemouli';
  
  const fallbackProfile = {
    name: "Nawfel Zemouli",
    login: username,
    avatar_url: `https://github.com/${username}.png`, // URL d'avatar publique sans clé API
    bio: "Computer Science Student with a strong interest in Information Systems and Cybersecurity.",
    location: "Algeria",
    public_repos: 8,
    followers: 10,
    following: 12,
    html_url: `https://github.com/${username}`
  };

  try {
    const now = Date.now();
    if (profileCache && (now - profileCacheTime) < PROFILE_CACHE_TTL) {
      return res.json(profileCache);
    }

    // Préparer les headers, inclure un token si présent
    const headers = { 'User-Agent': 'portfolio-app' };
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(`https://api.github.com/users/${username}`, { headers });

    if (!response.ok) {
      console.warn(`GitHub API profile returned ${response.status}. Using fallback profile.`);
      return res.json(fallbackProfile);
    }

    const data = await response.json();
    profileCache = {
      name: data.name || username,
      login: data.login,
      avatar_url: data.avatar_url,
      bio: data.bio,
      location: data.location,
      public_repos: data.public_repos,
      followers: data.followers,
      following: data.following,
      html_url: data.html_url
    };
    profileCacheTime = now;
    res.json(profileCache);
  } catch (error) {
    console.error('Error fetching GitHub profile:', error);
    res.json(fallbackProfile);
  }
});

/**
 * Route GET /api/github/repos
 * Récupère les dépôts GitHub de l'utilisateur
 */
router.get('/github/repos', githubLimiter, async (req, res) => {
  try {
    const username = process.env.GITHUB_USERNAME;
    if (!username) {
      return res.status(500).json({ error: 'GITHUB_USERNAME non configuré' });
    }
    
    const repos = await fetchGitHubRepos(username);
    res.json(repos);
  } catch (error) {
    res.status(500).json({ error: 'Impossible de récupérer les projets depuis GitHub.' });
  }
});

/**
 * Route POST /api/contact
 * Gère l'envoi de messages depuis le formulaire de contact
 */
router.post('/contact', contactLimiter, contactValidation, handleValidationErrors, (req, res) => {
  const { name, email, message } = req.body;
  
  // Pour le moment, on affiche simplement le message dans la console
  // Facile d'ajouter l'envoi d'email via Nodemailer ou un service tiers plus tard
  console.log('--- Nouveau message de contact ---');
  console.log(`De: ${name} <${email}>`);
  console.log(`Message: \n${message}`);
  console.log('---------------------------------');

  res.json({ 
    success: true, 
    message: 'Votre message a été envoyé avec succès. Je vous répondrai dans les plus brefs délais.' 
  });
});

module.exports = router;
