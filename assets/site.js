
/* ============================================================
   A. THEME
   ============================================================ */
(function () {
  var root = document.documentElement, btn = document.getElementById('theme');
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  function isDark(){ var t = root.getAttribute('data-theme');
    if (t === 'dark') return true; if (t === 'light') return false; return !!(mq && mq.matches); }
  function label(){ btn.textContent = isDark() ? 'Light' : 'Dark'; }
  try { var s = localStorage.getItem('cms-theme');
        if (s === 'dark' || s === 'light') root.setAttribute('data-theme', s); } catch (e) {}
  label();
  btn.addEventListener('click', function () {
    var n = isDark() ? 'light' : 'dark';
    root.setAttribute('data-theme', n);
    try { localStorage.setItem('cms-theme', n); } catch (e) {}
    label(); window.dispatchEvent(new Event('cms-theme'));
  });
  if (mq && mq.addEventListener) mq.addEventListener('change', function(){ label();
    window.dispatchEvent(new Event('cms-theme')); });
})();

/* ============================================================
   B. NAV: drawer, scroll spy, reveal
   ============================================================ */
(function () {
  var burger = document.getElementById('burger'), drawer = document.getElementById('drawer');
  burger.addEventListener('click', function () {
    var open = drawer.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  drawer.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { drawer.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false'); }
  });

  var reveal = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); reveal.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -12% 0px', threshold: .12 });
  document.querySelectorAll('.rv, .trend').forEach(function (n) { reveal.observe(n); });

  var links = [].slice.call(document.querySelectorAll('.nav > a[href^="#"]'));
  var spy = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      links.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id); });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['installation', 'service', 'maintenance', 'why', 'company', 'contact'].forEach(function (id) {
    var n = document.getElementById(id); if (n) spy.observe(n);
  });
})();

