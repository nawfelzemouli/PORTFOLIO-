import { initNavigation } from './navigation.js';
import { initAnimations } from './animations.js';
import { initGitHub } from './github.js';
import { initGitHubProfile } from './github-profile.js';
import { initNeuralCanvas } from './neural.js';

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initAnimations();
  initGitHub();
  initGitHubProfile();
  initNeuralCanvas();

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
