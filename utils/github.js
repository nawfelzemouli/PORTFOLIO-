
let githubCache = {
  data: null,
  timestamp: null,
  ttl: 5 * 60 * 1000 
};

const fetchGitHubRepos = async (username) => {
  const now = Date.now();

  if (githubCache.data && githubCache.timestamp && (now - githubCache.timestamp < githubCache.ttl)) {
    return githubCache.data;
  }

  try {
    const headers = { 'User-Agent': 'portfolio-app' };
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
      headers
    });
    
    if (!response.ok) {
      throw new Error(`Erreur API GitHub: ${response.status} ${response.statusText}`);
    }

    const repos = await response.json();

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

    filteredRepos.sort((a, b) => {
      if (b.stargazers_count !== a.stargazers_count) {
        return b.stargazers_count - a.stargazers_count;
      }
      return new Date(b.updated_at) - new Date(a.updated_at);
    });

    githubCache = {
      data: filteredRepos,
      timestamp: now,
      ttl: 5 * 60 * 1000
    };

    return filteredRepos;
  } catch (error) {
    console.error('Erreur lors de la récupération des dépôts GitHub:', error);
    
    if (githubCache.data) {
      return githubCache.data;
    }
    throw error;
  }
};

module.exports = { fetchGitHubRepos };
