/**
 * Interactive Contact Form Handler for Nawfel Zemouli's Portfolio
 */

export function initContactForm() {
  const form = document.getElementById('contact-form');
  const statusMessage = document.getElementById('contact-status');

  if (!form || !statusMessage) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const messageInput = document.getElementById('contact-message');

    if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
      showStatus('Please fill in all required fields.', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = `Transmitting...`;

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: nameInput.value.trim(),
          email: emailInput.value.trim(),
          message: messageInput.value.trim()
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showStatus('Tactical Neuron Activated! Message transmitted successfully.', 'success');
        form.reset();
      } else {
        showStatus(data.error || 'Transmission failed. Please try again.', 'error');
      }
    } catch (error) {
      showStatus('An unexpected network error occurred. Please try again later.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `Tactical Neuron <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;
    }
  });

  function showStatus(msg, type) {
    statusMessage.textContent = msg;
    statusMessage.className = `contact-status ${type}`;
    statusMessage.style.display = 'block';

    setTimeout(() => {
      statusMessage.style.opacity = '1';
    }, 10);
  }
}
