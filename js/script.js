document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav-links');

  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  if (toggle && nav) {
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();

      nav.classList.toggle('open');
      overlay.classList.toggle('open');

      if (nav.classList.contains('open')) {
        toggle.innerHTML = '&times;';
        toggle.setAttribute('aria-label', 'Close navigation');
      } else {
        toggle.innerHTML = '&#9776;';
        toggle.setAttribute('aria-label', 'Open navigation');
      }
    });

    overlay.addEventListener('click', function () {
      nav.classList.remove('open');
      overlay.classList.remove('open');
      toggle.innerHTML = '&#9776;';
      toggle.setAttribute('aria-label', 'Open navigation');
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        overlay.classList.remove('open');
        toggle.innerHTML = '&#9776;';
        toggle.setAttribute('aria-label', 'Open navigation');
      });
    });
  }


  const form = document.getElementById('newsletterForm');
  if (form) {
    const successMsg = document.getElementById('successMessage');
    const failMsg = document.getElementById('failMessage');

    function showError(id, msg) {
      const el = document.getElementById(id);
      if (el) el.textContent = msg;
    }
    function clearError(id) {
      const el = document.getElementById(id);
      if (el) el.textContent = '';
    }

    function validateFullName(value) {
      if (value.trim().length === 0) return 'Full name is required.';
      if (value.trim().length < 3) return 'Name must be at least 3 characters.';
      const parts = value.trim().split(' ').filter(function (p) { return p.length > 0; });
      if (parts.length < 2) return 'Please enter your full name (first and last).';
      return '';
    }

    function validateEmail(value) {
      if (value.trim().length === 0) return 'Email is required.';
      const atIndex = value.indexOf('@');
      if (atIndex < 1) return 'Email must contain an @ symbol.';
      if (value.indexOf('@') !== value.lastIndexOf('@')) return 'Email must contain only one @ symbol.';
      const domain = value.slice(atIndex + 1);
      if (domain.length < 3) return 'Email domain appears too short.';
      const dotIndex = domain.indexOf('.');
      if (dotIndex < 1) return 'Email domain must include a valid extension.';
      if (dotIndex === domain.length - 1) return 'Email extension cannot end with a dot.';
      return '';
    }

    function validatePhone(value) {
      if (value.trim().length === 0) return 'Phone number is required.';
      let cleaned = value.trim();
      if (cleaned.charAt(0) === '+') { cleaned = cleaned.slice(1); }
      if (cleaned.length < 6) return 'Phone number is too short.';
      for (let i = 0; i < cleaned.length; i++) {
        const code = cleaned.charCodeAt(i);
        if (code < 48 || code > 57) return 'Phone number may only contain digits or a leading +.';
      }
      return '';
    }

    function validateSelect(value, label) {
      if (!value || value === '') return 'Please select a ' + label + '.';
      return '';
    }

    ['fullName', 'email', 'phone', 'topic', 'frequency'].forEach(function (id) {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', function () { clearError(id + 'Error'); });
      }
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      successMsg.style.display = 'none';
      failMsg.style.display = 'none';

      const fullNameVal = document.getElementById('fullName').value;
      const emailVal = document.getElementById('email').value;
      const phoneVal = document.getElementById('phone').value;
      const topicVal = document.getElementById('topic').value;
      const freqVal = document.getElementById('frequency').value;

      const nameErr = validateFullName(fullNameVal);
      const emailErr = validateEmail(emailVal);
      const phoneErr = validatePhone(phoneVal);
      const topicErr = validateSelect(topicVal, 'topic');
      const freqErr = validateSelect(freqVal, 'update preference');

      showError('fullNameError', nameErr);
      showError('emailError', emailErr);
      showError('phoneError', phoneErr);
      showError('topicError', topicErr);
      showError('frequencyError', freqErr);

      const hasError = nameErr || emailErr || phoneErr || topicErr || freqErr;
      if (hasError) {
        failMsg.style.display = 'block';
      } else {
        successMsg.style.display = 'block';
        form.reset();
      }
    });
  }

  const cards = document.querySelectorAll('.info-card, .tenant-card, .event-card, .timeline-card');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    cards.forEach(function (card, i) {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.5s ease ' + (i * 0.08) + 's, transform 0.5s ease ' + (i * 0.08) + 's, border-color 0.3s, box-shadow 0.3s, background 0.3s';
      obs.observe(card);
    });
  }
});