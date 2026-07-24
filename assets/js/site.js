function setLang(btn) {
  document.querySelectorAll('.lang-switcher button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

/* ─── SMOOTH SCROLL for internal anchor links ─────────────────────────────
   CSS `scroll-behavior: smooth` isn't reliably honoured in every browser/
   OS combination, so this drives the scroll manually and works everywhere.
   HEADER_OFFSET matches the sticky nav height (same value as the CSS
   `scroll-padding-top`). Respects prefers-reduced-motion: reduce — jumps
   instantly instead of animating for anyone with that OS setting on. */
(function () {
  var HEADER_OFFSET = 80;
  var DURATION = 500; // ms

  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  function animateScrollTo(targetY) {
    var startY = window.pageYOffset;
    var distance = targetY - startY;
    var startTime = null;

    function step(timestamp) {
      if (startTime === null) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / DURATION, 1);
      window.scrollTo(0, startY + distance * easeInOutQuad(progress));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    var hash = link.getAttribute('href');
    if (hash.length < 2) return; // ignore bare "#" placeholders

    link.addEventListener('click', function (e) {
      var target = document.getElementById(hash.slice(1));
      if (!target) return; // let the browser handle anything unexpected

      e.preventDefault();
      var targetY = target.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET;
      var reduceMotion = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (reduceMotion) {
        window.scrollTo(0, targetY);
      } else {
        animateScrollTo(targetY);
      }
      history.pushState(null, '', hash);
    });
  });
})();

/* ─── LEAD MAGNET: unlock the download once a valid address is entered ───────
   The email is POSTed to LEAD_FORM_ENDPOINT (a Google Form formResponse URL or
   any form handler). The download is revealed either way, so a network failure
   never leaves someone stuck without the file they were promised.
   NOTE: this is a client-side gate — it captures willing visitors, it does not
   hard-protect the PDF. That is normal and expected for a lead magnet. */
(function () {
  var LEAD_FORM_ENDPOINT = 'https://docs.google.com/forms/d/e/1FAIpQLSdmWImyahvRsaM1sAZZR8lbBbqaEZ6UumILToLjYBpVLIEzsQ/formResponse';
  var LEAD_FORM_FIELD    = 'entry.981259241';   // Google Form question: "Insert your email"

  var box = document.querySelector('.lead-magnet');
  if (!box) return;
  var form = box.querySelector('.lm-form');
  var success = box.querySelector('.lm-success');
  var input = box.querySelector('input[type="email"]');

  function unlock() {
    box.classList.add('unlocked');
    success.classList.add('show');
    try { localStorage.setItem('rnlmkt_checklist_unlocked', '1'); } catch (e) {}
  }

  // returning visitors skip the gate
  try {
    if (localStorage.getItem('rnlmkt_checklist_unlocked') === '1') unlock();
  } catch (e) {}

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    var email = input.value.trim();
    if (LEAD_FORM_ENDPOINT.indexOf('LEAD_FORM_ENDPOINT') === 0) {
      console.warn('[RNL-MKT] Lead form endpoint not configured — address was NOT recorded:', email);
    } else {
      var body = new FormData();
      body.append(LEAD_FORM_FIELD, email);
      // no-cors: Google Forms accepts the POST but returns an opaque response
      fetch(LEAD_FORM_ENDPOINT, { method: 'POST', mode: 'no-cors', body: body })
        .catch(function () { /* never block the download on a network error */ });
    }
    unlock();
    if (typeof gtag === 'function') gtag('event', 'lead_magnet_download', { language: document.documentElement.lang });
  });
})();

function toggleMenu(btn) {
  const nav = btn.closest('nav');
  const panel = nav.querySelector('.mobile-menu');
  const isOpen = nav.classList.contains('menu-open');
  nav.classList.toggle('menu-open', !isOpen);
  btn.setAttribute('aria-expanded', String(!isOpen));
  panel.style.maxHeight = isOpen ? '0' : panel.scrollHeight + 'px';
}

(function () {
  const nav = document.querySelector('nav');
  const btn = nav.querySelector('.nav-toggle');
  const panel = nav.querySelector('.mobile-menu');

  function closeMenu(returnFocus) {
    if (!nav.classList.contains('menu-open')) return;
    nav.classList.remove('menu-open');
    btn.setAttribute('aria-expanded', 'false');
    panel.style.maxHeight = '0';
    if (returnFocus) btn.focus();
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu(nav.contains(document.activeElement));
  });

  // Every link is a same-page jump, so the panel has done its job once one is clicked
  panel.addEventListener('click', e => {
    if (e.target.closest('a')) closeMenu(false);
  });

  document.addEventListener('click', e => {
    if (!nav.contains(e.target)) closeMenu(false);
  });

  // Tabbing past the last link closes rather than stranding focus behind the panel
  nav.addEventListener('focusout', e => {
    if (e.relatedTarget && !nav.contains(e.relatedTarget)) closeMenu(false);
  });

  // Reading the button's own visibility keeps this in sync with the media query
  window.addEventListener('resize', () => {
    if (btn.offsetParent === null) closeMenu(false);
  });
})();

function toggleContact(btn) {
  const dd = btn.closest('.nav-dropdown');
  const open = dd.classList.toggle('open');
  btn.setAttribute('aria-expanded', String(open));
}

(function () {
  const dd = document.querySelector('.nav-dropdown');
  if (!dd) return;
  const trigger = dd.querySelector('.nav-dropdown-toggle');
  function close() {
    if (!dd.classList.contains('open')) return;
    dd.classList.remove('open');
    trigger.setAttribute('aria-expanded', 'false');
  }
  document.addEventListener('click', e => { if (!dd.contains(e.target)) close(); });
  // Tabbing out of the dropdown closes it rather than leaving it pinned open
  dd.addEventListener('focusout', e => { if (e.relatedTarget && !dd.contains(e.relatedTarget)) close(); });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    const inside = dd.contains(document.activeElement);
    close();
    if (inside) trigger.focus();
  });
  dd.querySelectorAll('.nav-dropdown-menu a').forEach(a => a.addEventListener('click', close));
})();

function toggleService(btn) {
  const card = btn.closest('.service-card');
  const panel = card.querySelector('.service-card-body');
  const isOpen = card.classList.contains('open');
  document.querySelectorAll('.service-card').forEach(c => {
    c.classList.remove('open');
    c.querySelector('.service-toggle').setAttribute('aria-expanded', 'false');
    c.querySelector('.service-card-body').style.maxHeight = '0';
  });
  if (!isOpen) {
    card.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    panel.style.maxHeight = panel.scrollHeight + 'px';
  }
}

function toggleTools(btn) {
  const panel = btn.nextElementSibling;
  const isOpen = btn.classList.contains('open');
  btn.classList.toggle('open', !isOpen);
  btn.setAttribute('aria-expanded', String(!isOpen));
  panel.style.maxHeight = isOpen ? '0' : panel.scrollHeight + 'px';
}

function togglePricing(btn) {
  const item = btn.closest('.pricing-item');
  const panel = item.querySelector('.pricing-panel');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.pricing-item').forEach(i => {
    i.classList.remove('open');
    i.querySelector('.pricing-panel').style.maxHeight = '0';
  });
  if (!isOpen) {
    item.classList.add('open');
    panel.style.maxHeight = panel.scrollHeight + 'px';
  }
}

(function(){function d(s){try{return atob(s)}catch(e){return""}}document.querySelectorAll("a.jmail").forEach(function(a){var e=d(a.getAttribute("data-e"));a.setAttribute("href","mailto:"+e);if(a.classList.contains("jmail-show"))a.textContent=e;});document.querySelectorAll("a.jtel").forEach(function(a){a.setAttribute("href","tel:"+d(a.getAttribute("data-t")));if(a.classList.contains("jtel-show"))a.textContent=d(a.getAttribute("data-d"));});})();
