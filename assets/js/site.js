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

  // Enquiry form: opens the visitor's email app with the details filled in.
  var form = document.getElementById('enquiry');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements;
      var subject = 'LIV NEXT Saudi 2027 - ' + f.interest.value;
      var body = 'Name: ' + f.name.value +
        '\nOrganisation: ' + f.org.value +
        '\nEmail: ' + f.email.value +
        '\nInterested in: ' + f.interest.value +
        '\n\n' + f.message.value;
      window.location.href = 'mailto:info@connectspotexhibitions.com?subject=' +
        encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      var status = document.getElementById('form-status');
      if (status) status.textContent = 'Your email app should open with your details ready to send. If it does not, write to info@connectspotexhibitions.com.';
    });
  }
})();
