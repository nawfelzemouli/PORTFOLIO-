/**
 * Cache en mémoire pour les données de l'API GitHub
 */
let githubCache = {
  data: null,
  timestamp: null,
  ttl: 5 * 60 * 1000 // 5 minutes en millisecondes
};

/**
 * Récupère les dépôts GitHub d'un utilisateur
 * Utilise un cache de 5 minutes
 * 
 * @param {string} username - Nom d'utilisateur GitHub
 * @returns {Promise<Array>} Tableau des dépôts filtrés
 */
const fetchGitHubRepos = async (username) => {
  const now = Date.now();
  
  // Retourne le cache s'il est valide
  if (githubCache.data && githubCache.timestamp && (now - githubCache.timestamp < githubCache.ttl)) {
    return githubCache.data;
  }

  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
    
    if (!response.ok) {
      throw new Error(`Erreur API GitHub: ${response.status} ${response.statusText}`);
    }

    const repos = await response.json();
    
    // Filtrage et mappage des champs nécessaires
    let filteredRepos = repos.map(repo => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      html_url: repo.html_url,
      homepage: repo.homepage,
      language: repo.language,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      updated_at: repo.updated_at,
      topics: repo.topics || []
    }));

    // Tri par étoiles puis date de mise à jour
    filteredRepos.sort((a, b) => {
      if (b.stargazers_count !== a.stargazers_count) {
        return b.stargazers_count - a.stargazers_count;
      }
      return new Date(b.updated_at) - new Date(a.updated_at);
    });

    // Mise à jour du cache
    githubCache = {
      data: filteredRepos,
      timestamp: now,
      ttl: 5 * 60 * 1000
    };

    return filteredRepos;
  } catch (error) {
    console.error('Erreur lors de la récupération des dépôts GitHub:', error);
    // Si on a d'anciennes données en cache, on les retourne en fallback malgré l'expiration
    if (githubCache.data) {
      return githubCache.data;
    }
    throw error;
  }
};

module.exports = { fetchGitHubRepos };
