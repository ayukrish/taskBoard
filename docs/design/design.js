/* Mockup-only helpers (not app code): theme toggle, Viewer-role preview, overlays. */
(function () {
  var root = document.documentElement;
  var params = new URLSearchParams(location.search);
  var theme = params.get('theme') || localStorage.getItem('tb-theme');
  if (theme) root.setAttribute('data-theme', theme);
  if (params.get('role') === 'viewer')
    document.body.setAttribute('data-role', 'viewer');

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-action]');
    if (!t) return;
    var a = t.getAttribute('data-action');
    if (a === 'theme') {
      var dark = getComputedStyle(root).colorScheme.indexOf('dark') === 0;
      var next = dark ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('tb-theme', next);
    } else if (a === 'role') {
      var v = document.body.getAttribute('data-role') === 'viewer';
      if (v) document.body.removeAttribute('data-role');
      else document.body.setAttribute('data-role', 'viewer');
    } else if (a === 'open') {
      var el = document.getElementById(t.getAttribute('data-target'));
      if (el) el.hidden = false;
    } else if (a === 'close') {
      var o = t.closest('[data-overlay]');
      if (o) o.hidden = true;
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape')
      document.querySelectorAll('[data-overlay]').forEach(function (o) {
        o.hidden = true;
      });
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      var p = document.getElementById('palette');
      if (p) {
        e.preventDefault();
        p.hidden = false;
      }
    }
    if (
      e.key.toLowerCase() === 'c' &&
      !e.metaKey &&
      !e.ctrlKey &&
      !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) &&
      document.body.getAttribute('data-role') !== 'viewer'
    ) {
      var c = document.getElementById('create');
      if (c) c.hidden = false;
    }
    if (
      e.key === '?' &&
      !/INPUT|TEXTAREA/.test(document.activeElement.tagName)
    ) {
      var s = document.getElementById('shortcuts');
      if (s) s.hidden = false;
    }
  });
})();
