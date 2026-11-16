// Mobile navigation
const menuButton = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');
if (menuButton && navLinks) {
  menuButton.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.textContent = isOpen ? '✕' : '☰';
  });
}

// Contact form: opens the visitor's email app. Replace the email below with yours.
const contactForm = document.querySelector('#contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    const yourEmail = 'YOUR_EMAIL@example.com'; // TODO: add your email address
    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    const body = encodeURIComponent(`From: ${name} (${email})\\n\\n${message}`);
    document.querySelector('#formHint').textContent =
      'If your email app did not open, add your email address in script.js first.';
    window.location.href = `mailto:${yourEmail}?subject=${subject}&body=${body}`;
  });
}
