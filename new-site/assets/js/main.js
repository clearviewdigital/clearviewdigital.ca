/* ==========================================================================
   Clearview Digital — Main JS
   --------------------------------------------------------------------------
   Contents:
   1) Mobile nav toggle (accessible button)
   2) Contact form: client-side validation + placeholder submit via fetch()
      - To connect Formspree or Netlify Forms, see CONTACT_ENDPOINT below.
   3) Progressive enhancement: mailto fallback if JS fails
   ========================================================================== */

(function () {
  'use strict';

  /* ----------------------------------
   * 1) Mobile navigation toggle
   * ---------------------------------- */
  var toggle = document.querySelector('.nav-toggle');
  var list = document.getElementById('primary-nav');
  if (toggle && list) {
    toggle.addEventListener('click', function () {
      var open = list.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* ----------------------------------
   * 2) Contact form handling
   * ---------------------------------- */
  var form = document.getElementById('contact-form');
  if (form) {
    // EDIT THIS: Replace with your real endpoint     
    // const CONTACT_ENDPOINT = ""; 
    // leave blank for demo

    var statusEl = document.getElementById('form-status');

    // Lightweight client-side validation
    function isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Collect fields
      var name = form.querySelector('#name').value.trim();
      var email = form.querySelector('#email').value.trim();
      var org = form.querySelector('#org').value.trim();
      var message = form.querySelector('#message').value.trim();

      // Validate
      if (!name || !email || !message) {
        statusEl.textContent = 'Please complete the required fields.';
        statusEl.classList.remove('ok');
        return;
      }
      if (!isValidEmail(email)) {
        statusEl.textContent = 'Please enter a valid email address.';
        statusEl.classList.remove('ok');
        return;
      }

      // If you provide an endpoint, this will try to POST JSON
      if (CONTACT_ENDPOINT) {
        statusEl.textContent = 'Sending...';
        fetch(CONTACT_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, org, message })
        })
          .then(function (res) {
            if (!res.ok) throw new Error('Network response was not ok');
            return res.json().catch(function(){ return {}; });
          })
          .then(function () {
            statusEl.textContent = 'Thanks — we\'ll be in touch shortly.';
            statusEl.classList.add('ok');
            form.reset();
          })
          .catch(function () {
            statusEl.textContent = 'Sorry, there was a problem. Try again or email us.';
            statusEl.classList.remove('ok');
          });
      } else {
        // No endpoint? Provide a friendly fallback:
        // 1) Pre-fill a mailto link so the user can send via their email client
        var subject = encodeURIComponent('Website inquiry from ' + name);
        var body = encodeURIComponent(message + '\n\nOrganization: ' + org + '\nEmail: ' + email);
        var mailto = 'mailto:hello@clearviewdigital.ca?subject=' + subject + '&body=' + body;
        window.location.href = mailto;
        statusEl.textContent = 'Opening your email client...';
        statusEl.classList.add('ok');
      }
    });
  }
})();
