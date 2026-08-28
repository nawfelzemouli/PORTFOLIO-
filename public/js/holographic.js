/**
 * 3D Holographic Card Tilt & Cursor Aura Effects
 */

export function initHolographicEffects() {
  initCursorAura();
  initCardTilt();
}

function initCursorAura() {
  const aura = document.getElementById('cursor-aura');
  if (!aura) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let auraX = mouseX;
  let auraY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateAura() {
    // Smooth lerp following mouse
    auraX += (mouseX - auraX) * 0.08;
    auraY += (mouseY - auraY) * 0.08;

    aura.style.left = `${auraX}px`;
    aura.style.top = `${auraY}px`;

    requestAnimationFrame(animateAura);
  }

  animateAura();
}

function initCardTilt() {
  // Delegate event to handle dynamically rendered project cards
  document.addEventListener('mousemove', (e) => {
    const card = e.target.closest('.project-card, .contact-card, .about-card');
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation (-10 to 10 deg)
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  });

  document.addEventListener('mouseout', (e) => {
    const card = e.target.closest('.project-card, .contact-card, .about-card');
    if (card && !card.contains(e.relatedTarget)) {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    }
  });
}
