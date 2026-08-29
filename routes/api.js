const express = require('express');
const router = express.Router();
const { githubLimiter, contactLimiter } = require('../middleware/rateLimiter');
const { contactValidation, handleValidationErrors } = require('../middleware/validator');
const { fetchGitHubRepos } = require('../utils/github');

let profileCache = null;
let profileCacheTime = 0;
const PROFILE_CACHE_TTL = 5 * 60 * 1000; 

router.get('/github/profile', githubLimiter, async (req, res) => {
  const username = process.env.GITHUB_USERNAME || 'nawfelzemouli';
  
  const fallbackProfile = {
    name: "Nawfel Zemouli",
    login: username,
    avatar_url: `https://github.com/${username}.png`, 
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

router.get('/github/repos', githubLimiter, async (req, res) => {
  const username = process.env.GITHUB_USERNAME || 'nawfelzemouli';
  
  const fallbackRepos = [
    {
      id: 1,
      name: 'secure-information-system',
      description: 'An enterprise-grade secure information system design featuring robust access control mechanisms, encryption, and role-based permissions.',
      html_url: `https://github.com/${username}/secure-information-system`,
      language: 'Java',
      stargazers_count: 5,
      forks_count: 1,
      updated_at: new Date().toISOString()
    },
    {
      id: 2,
      name: 'network-threat-detection',
      description: 'Intrusion detection system prototype that monitors network packets, analyzes traffic anomalies, and flags potential security threats.',
      html_url: `https://github.com/${username}/network-threat-detection`,
      language: 'Python',
      stargazers_count: 8,
      forks_count: 2,
      updated_at: new Date().toISOString()
    },
    {
      id: 3,
      name: 'cybersec-assessment-tool',
      description: 'A cybersecurity script suite designed to scan web application vulnerabilities, audit headers, and suggest security hardening actions.',
      html_url: `https://github.com/${username}/cybersec-assessment-tool`,
      language: 'JavaScript',
      stargazers_count: 12,
      forks_count: 3,
      updated_at: new Date().toISOString()
    }
  ];

  try {
    const repos = await fetchGitHubRepos(username);
    res.json(repos);
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    res.json(fallbackRepos);
  }
});

router.post('/contact', contactLimiter, contactValidation, handleValidationErrors, (req, res) => {
  const { name, email, message } = req.body;

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
