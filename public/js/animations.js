export function initAnimations() {
  
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');

        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  const typingTextElement = document.getElementById('typing-text');
  if (typingTextElement) {
    const textToType = "Cybersecurity & Information Systems";
    let charIndex = 0;
    
    function typeOnce() {
      if (charIndex < textToType.length) {
        typingTextElement.textContent += textToType.charAt(charIndex);
        charIndex++;
        setTimeout(typeOnce, 55);
      }
    }
    
    setTimeout(typeOnce, 300);
  }
}
