export async function initGitHub() {
  const grid = document.getElementById('projects-grid');
  const filtersContainer = document.getElementById('project-filters');
  
  if (!grid) return;
  
  const languageColors = {
    'JavaScript': '#f1e05a',
    'Python': '#3572A5',
    'HTML': '#e34c26',
    'CSS': '#563d7c',
    'TypeScript': '#3178c6',
    'Java': '#b07219',
    'C++': '#f34b7d',
    'C#': '#178600',
    'PHP': '#4F5D95',
    'Ruby': '#701516',
    'Go': '#00ADD8'
  };

  try {
    let repos = [];
    try {
      const response = await fetch('/api/github/repos');
      if (response.ok) {
        repos = await response.json();
      } else {
        throw new Error('API unavailable');
      }
    } catch (e) {
      console.warn("Using mock demonstration data:", e);
      repos = getMockRepos();
    }
    
    if (repos.length === 0) {
      grid.innerHTML = '<p class="error-message">No projects found.</p>';
      return;
    }

    grid.innerHTML = '';
    
    const languages = new Set();
    
    repos.forEach((repo, index) => {
      if (repo.language) languages.add(repo.language);
      
      const delay = index * 100;
      const langColor = languageColors[repo.language] || '#00f0ff';
      const description = repo.description || 'Project under active development.';
      
      const card = document.createElement('div');
      card.className = `project-card reveal reveal-active`;
      card.style.animationDelay = `${delay}ms`;
      card.setAttribute('data-language', repo.language || 'Other');
      
      card.innerHTML = `
        <div class="card-header">
          <h3>
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${repo.name}</a>
          </h3>
        </div>
        <div class="card-body">
          <p style="font-size: 0.9rem; color: var(--text-secondary); margin: 0; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">${description}</p>
        </div>
        <div class="card-footer">
          <div style="display: flex; align-items: center; font-size: 0.85rem; color: var(--text-primary);">
            <span class="card-language-dot" style="background-color: ${langColor}; color: ${langColor};"></span>
            ${repo.language || 'Other'}
          </div>
          <div class="card-stats">
            <span title="Stars">⭐ ${repo.stargazers_count}</span>
            <span title="Forks">🔄 ${repo.forks_count}</span>
          </div>
        </div>
      `;
      
      grid.appendChild(card);
    });

    // Generate filters
    if (filtersContainer) {
      Array.from(languages).sort().forEach(lang => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.setAttribute('data-filter', lang);
        btn.textContent = lang;
        filtersContainer.appendChild(btn);
      });
      
      // Filter functionality
      const filterBtns = document.querySelectorAll('.filter-btn');
      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          filterBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          
          const filter = btn.getAttribute('data-filter');
          const cards = document.querySelectorAll('.project-card');
          
          cards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-language') === filter) {
              card.style.display = 'flex';
              setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
              }, 50);
            } else {
              card.style.opacity = '0';
              card.style.transform = 'translateY(20px)';
              setTimeout(() => {
                card.style.display = 'none';
              }, 300);
            }
          });
        });
      });
    }
    
  } catch (error) {
    console.error('Error fetching repos:', error);
    grid.innerHTML = '<p class="error-message">Unable to load projects. Please try again later.</p>';
  }
}

function getMockRepos() {
  return [
    {
      name: 'quantum-neural-dashboard',
      description: 'Real-time telemetry and AI metrics visualizer for high-performance distributed systems.',
      language: 'JavaScript',
      html_url: '#',
      stargazers_count: 38,
      forks_count: 9,
      updated_at: new Date().toISOString()
    },
    {
      name: 'cyber-sec-gateway',
      description: 'High-throughput microservices gateway featuring OAuth2, JWT authentication, and token bucket rate limiting.',
      language: 'Python',
      html_url: '#',
      stargazers_count: 27,
      forks_count: 4,
      updated_at: new Date(Date.now() - 864000000).toISOString()
    },
    {
      name: 'cinematic-portfolio',
      description: 'Personal tech portfolio showcasing modern UI/UX design, custom glassmorphism, and live GitHub integration.',
      language: 'HTML',
      html_url: '#',
      stargazers_count: 15,
      forks_count: 3,
      updated_at: new Date(Date.now() - 1728000000).toISOString()
    },
    {
      name: 'cloud-devops-pipeline',
      description: 'Automated CI/CD workflow configurations for Dockerized web applications on Kubernetes clusters.',
      language: 'TypeScript',
      html_url: '#',
      stargazers_count: 52,
      forks_count: 14,
      updated_at: new Date(Date.now() - 2592000000).toISOString()
    },
    {
      name: 'algo-data-structures',
      description: 'Comprehensive collection of computer science algorithms and optimized data structure implementations.',
      language: 'C++',
      html_url: '#',
      stargazers_count: 41,
      forks_count: 11,
      updated_at: new Date(Date.now() - 3456000000).toISOString()
    },
    {
      name: 'smart-vision-ai',
      description: 'Computer vision pipeline utilizing deep neural networks for real-time object detection and tracking.',
      language: 'Python',
      html_url: '#',
      stargazers_count: 64,
      forks_count: 18,
      updated_at: new Date(Date.now() - 4320000000).toISOString()
    }
  ];
}
