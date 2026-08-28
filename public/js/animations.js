export function initAnimations() {
  const typingTextElement = document.getElementById('typing-text');
  if (typingTextElement) {
    const textToType = "Computer Science Student";
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
