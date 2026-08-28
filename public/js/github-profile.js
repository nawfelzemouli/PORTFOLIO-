/**
 * GitHub Profile Card — Loads real profile from /api/github/profile
 * Nawfel Zemouli Portfolio
 */

export async function initGitHubProfile() {
  const card = document.getElementById('github-profile-card');
  if (!card) return;

  try {
    const res = await fetch('/api/github/profile');
    const profile = await res.json();

    card.innerHTML = `
      <div class="gh-card-inner">
        <a href="${profile.html_url}" target="_blank" rel="noopener noreferrer" class="gh-avatar-link">
          <img src="${profile.avatar_url}" alt="${profile.name}" class="gh-avatar" />
        </a>
        <div class="gh-info">
          <h3 class="gh-name">${profile.name}</h3>
          <span class="gh-login">@${profile.login}</span>
          ${profile.location ? `<p class="gh-location"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> ${profile.location}</p>` : ''}
          ${profile.bio ? `<p class="gh-bio">${profile.bio}</p>` : ''}
          <div class="gh-stats">
            <div class="gh-stat">
              <span class="gh-stat-num">${profile.public_repos}</span>
              <span class="gh-stat-label">Repos</span>
            </div>
            <div class="gh-stat">
              <span class="gh-stat-num">${profile.followers}</span>
              <span class="gh-stat-label">Followers</span>
            </div>
            <div class="gh-stat">
              <span class="gh-stat-num">${profile.following}</span>
              <span class="gh-stat-label">Following</span>
            </div>
          </div>
          <a href="${profile.html_url}" target="_blank" rel="noopener noreferrer" class="gh-profile-btn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            View GitHub Profile
          </a>
        </div>
      </div>
    `;
    card.classList.add('loaded');
  } catch (err) {
    card.innerHTML = `
      <div class="gh-card-inner">
        <div class="gh-avatar-placeholder">NZ</div>
        <div class="gh-info">
          <h3 class="gh-name">Nawfel Zemouli</h3>
          <span class="gh-login">@nawfelzemouli</span>
          <a href="https://github.com/nawfelzemouli" target="_blank" rel="noopener noreferrer" class="gh-profile-btn">View GitHub Profile</a>
        </div>
      </div>
    `;
    card.classList.add('loaded');
  }
}
