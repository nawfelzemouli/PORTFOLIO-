/**
 * 3D Interactive Card & Modal Handlers
 * Nawfel Zemouli Portfolio
 */

export function initCardExperience() {
  init3DTilt();
  initModals();
}

function init3DTilt() {
  const devCard = document.getElementById('dev-card');
  if (!devCard) return;

  let windowWidth = window.innerWidth;
  let windowHeight = window.innerHeight;

  window.addEventListener('resize', () => {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
  });

  document.addEventListener('mousemove', (e) => {
    // Only tilt on desktop screens
    if (windowWidth < 768) return;

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const centerX = windowWidth / 2;
    const centerY = windowHeight / 2;

    // Smooth tilt calculation (-15 to 15 degrees)
    const rotateX = ((mouseY - centerY) / centerY) * -12;
    const rotateY = ((mouseX - centerX) / centerX) * 12;

    devCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  document.addEventListener('mouseleave', () => {
    devCard.style.transform = `rotateX(0deg) rotateY(0deg)`;
  });
}

function initModals() {
  const openGithub = document.getElementById('open-github-btn');
  const openTech = document.getElementById('open-tech-btn');
  const openContact = document.getElementById('open-contact-btn');

  const githubModal = document.getElementById('github-modal');
  const techModal = document.getElementById('tech-modal');
  const contactModal = document.getElementById('contact-modal');

  const closeBtns = document.querySelectorAll('.modal-close');
  const overlays = document.querySelectorAll('.modal-overlay');

  if (openGithub && githubModal) {
    openGithub.addEventListener('click', () => openModal(githubModal));
  }
  if (openTech && techModal) {
    openTech.addEventListener('click', () => openModal(techModal));
  }
  if (openContact && contactModal) {
    openContact.addEventListener('click', () => openModal(contactModal));
  }

  closeBtns.forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  overlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

function openModal(modal) {
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.classList.remove('active');
  });
  document.body.style.overflow = '';
}
