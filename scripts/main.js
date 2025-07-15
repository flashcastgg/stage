// main.js

// -------------------------------
// Smooth Scroll with Header Offset + H2 Animation
// -------------------------------
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();

    const targetId = link.getAttribute('href').substring(1);
    const target = document.getElementById(targetId);
    if (!target) return;

    const headerHeight = document.querySelector('header').offsetHeight;
    const extraOffset = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--offset-extra')) || 0;

    const scrollPosition = target.offsetTop - headerHeight - extraOffset;
    window.scrollTo({
      top: Math.max(scrollPosition, 0),
      behavior: 'smooth'
    });

    // Highlight h2 on arrival
    const heading = target.querySelector('h2');
    if (heading) {
      heading.classList.remove('h2-highlight');
      void heading.offsetWidth; // force reflow for restart
      heading.classList.add('h2-highlight');
      setTimeout(() => heading.classList.remove('h2-highlight'), 1200);
    }
  });
});

// -------------------------------
// Modal Elements
// -------------------------------
const modal      = document.getElementById('email-modal');
const form       = document.getElementById('email-form');
const cta        = document.getElementById('email-cta');
const closeBtn   = modal.querySelector('.modal-close');
const notif      = document.getElementById('success-notif');
const notifClose = document.getElementById('notif-close');

// -------------------------------
// Open Modal on CTA Click
// -------------------------------
cta.addEventListener('click', () => {
  modal.hidden = false;
});

// -------------------------------
// Close Modal and Reset Form
// -------------------------------
closeBtn.addEventListener('click', () => {
  modal.hidden = true;
  clearForm();
});

// -------------------------------
// Close Notification Banner
// -------------------------------
notifClose.addEventListener('click', () => {
  notif.classList.remove('show', 'fadeout');
  notif.hidden = true;
});

// -------------------------------
// Form Validation and Submission
// -------------------------------
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearErrors();

  let valid = true;
  const requiredFields = ['subject', 'message', 'from'];

  // Validate required fields
  requiredFields.forEach(name => {
    const field = form.elements[name];
    const error = form.querySelector(`.error[data-for="${name}"]`);
    if (!field.value.trim()) {
      error.textContent = 'This field is required.';
      error.classList.add('visible');
      valid = false;
    }
  });

  // Optional: Uncomment below to enable email format validation
  /*
  const email = form.elements['from'].value.trim();
  const emailError = form.querySelector('.error[data-for="from"]');
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !pattern.test(email)) {
    emailError.textContent = 'Please enter a valid email address.';
    emailError.classList.add('visible');
    valid = false;
  }
  */

  if (!valid) return;

  try {
    await fetch('https://formspree.io/f/mzzvplly', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form)
    });

    // Success actions
    modal.hidden = true;
    clearForm();
    notif.hidden = false;
    notif.classList.add('show', 'fadeout');

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      notif.classList.remove('show', 'fadeout');
      notif.hidden = true;
    }, 5000);

  } catch (err) {
    console.error('Formspree submission failed:', err);
  }
});

// -------------------------------
// Helper Functions
// -------------------------------
function clearErrors() {
  form.querySelectorAll('.error').forEach(el => {
    el.textContent = '';
    el.classList.remove('visible');
  });
}

function clearForm() {
  clearErrors();
  form.reset();
}

// -------------------------------
// Scroll to Top Button
// -------------------------------
const scrollToTopBtn = document.getElementById('scrollToTopBtn');

window.addEventListener('scroll', () => {
  if (window.scrollY > 200) {
    scrollToTopBtn.classList.add('show');
  } else {
    scrollToTopBtn.classList.remove('show');
  }
});

scrollToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});
