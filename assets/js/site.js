/* LIV NEXT Saudi 2027: menu, scroll reveal and the enquiry form. */
(function () {
  var doc = document.documentElement;
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('site-nav');

  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        btn.focus();
      }
    });
  }

  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && items.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // Hero video: two silent clips, crossfaded in turn. Skipped for reduced motion and data saver.
  var media = document.querySelector('.hero-media');
  if (media) {
    var vids = [].slice.call(media.querySelectorAll('video'));
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var save = navigator.connection && navigator.connection.saveData;
    if (vids.length && !reduce && !save) {
      var small = window.matchMedia('(max-width: 760px)').matches;
      var cur = 0, paused = false, FADE = 1.3;
      var toggle = document.querySelector('.hero-toggle');
      var show = function (n) { vids.forEach(function (v, k) { v.classList.toggle('on', k === n); }); };
      var start = function (n) {
        var v = vids[n];
        cur = n;
        try { v.currentTime = 0; } catch (e) {}
        var p = v.play();
        if (p && p.then) { p.then(function () { if (cur === n) show(n); }).catch(function () {}); } else { show(n); }
      };
      vids.forEach(function (v, k) {
        v.muted = true;
        v.src = small ? v.getAttribute('data-m') : v.getAttribute('data-d');
        v.addEventListener('timeupdate', function () {
          if (k === cur && !paused && vids.length > 1 && v.duration && v.duration - v.currentTime < FADE) start((k + 1) % vids.length);
        });
        v.addEventListener('ended', function () { if (k === cur && !paused) start((k + 1) % vids.length); });
      });
      start(0);
      if (toggle) {
        toggle.hidden = false;
        toggle.addEventListener('click', function () {
          paused = !paused;
          toggle.setAttribute('aria-pressed', paused ? 'true' : 'false');
          toggle.textContent = paused ? 'Play video' : 'Pause video';
          var v = vids[cur];
          if (paused) { v.pause(); } else { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        });
      }
    }
  }

  // Enquiry form: saved to the organiser's enquiries sheet (Exhibitors / Visitors tabs).
  // If the sheet is not reachable, it falls back to opening the visitor's email app.
  var ENDPOINT = 'https://script.google.com/macros/s/AKfycbzyQC5TbBDTli1vWJhPXQb6TGWuj96xLzxyIwMcWDu0EQ26yf_6JgRdO0YbZvSgWVhI/exec';
  var form = document.getElementById('enquiry');
  if (form) {
    if (/[?&]enquiry=exhibiting/.test(location.search) && form.elements.interest) form.elements.interest.value = 'Exhibiting';
    if (/[?&]enquiry=sponsoring/.test(location.search) && form.elements.interest) form.elements.interest.value = 'Sponsoring';
    var status = document.getElementById('form-status');
    var say = function (t) { if (status) status.textContent = t; };
    var sendByEmail = function (f) {
      var subject = 'LIV NEXT Saudi 2027 - ' + f.interest.value;
      var body = 'Name: ' + f.name.value +
        '\nOrganisation: ' + f.org.value +
        '\nEmail: ' + f.email.value +
        '\nInterested in: ' + f.interest.value +
        '\n\n' + f.message.value;
      window.location.href = 'mailto:info@connectspotexhibitions.com?subject=' +
        encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      say('Your email app should open with your details ready to send. If it does not, write to info@connectspotexhibitions.com.');
    };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements;
      if (!ENDPOINT) { sendByEmail(f); return; }
      var btn = form.querySelector('button[type="submit"]');
      var data = new URLSearchParams();
      ['name', 'org', 'email', 'interest', 'message', 'website'].forEach(function (k) { data.append(k, f[k] ? f[k].value : ''); });
      if (btn) btn.disabled = true;
      say('Sending...');
      fetch(ENDPOINT, { method: 'POST', mode: 'no-cors', body: data })
        .then(function () {
          form.reset();
          if (btn) btn.disabled = false;
          say('Thank you. Your enquiry has been received and our team will reply by email.');
        })
        .catch(function () {
          if (btn) btn.disabled = false;
          sendByEmail(f);
        });
    });
  }
})();
