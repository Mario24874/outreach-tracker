/*! MarioOS analytics tracker — sirve desde app.mariomoreno.work/track.js
 *  Cárgalo en el portfolio y en la app:  <script src="https://app.mariomoreno.work/track.js" defer></script>
 *  Demos:  window.mmTrackDemo('research', 'texto de entrada')
 */
(function () {
  var API = 'https://app.mariomoreno.work';
  var AREA = location.hostname.indexOf('app.') === 0 ? 'app' : 'portfolio';

  function anonId() {
    try {
      var m = document.cookie.match(/(?:^|;\s*)mm_visitor=([^;]+)/);
      if (m) return decodeURIComponent(m[1]);
      var id = (crypto.randomUUID && crypto.randomUUID()) ||
        (Date.now().toString(36) + Math.random().toString(36).slice(2));
      var exp = new Date(Date.now() + 365 * 864e5).toUTCString();
      document.cookie = 'mm_visitor=' + id + ';domain=.mariomoreno.work;path=/;expires=' + exp + ';SameSite=Lax;Secure';
      return id;
    } catch (e) {
      return 'anon';
    }
  }

  function post(path, data, keepalive) {
    try {
      return fetch(API + path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        keepalive: !!keepalive,
        mode: 'cors',
      });
    } catch (e) {}
  }

  var id = anonId();
  var t0 = Date.now();
  var viewId = null;

  post('/api/analytics/pageview', {
    anon_id: id,
    area: AREA,
    path: location.pathname || '/',
    section: document.title ? document.title.slice(0, 120) : null,
    referrer: document.referrer || null,
  })
    .then(function (r) { return r && r.json(); })
    .then(function (j) { if (j) viewId = j.id; })
    .catch(function () {});

  function flush() {
    if (!viewId) return;
    var dur = Math.round((Date.now() - t0) / 1000);
    if (dur < 1) return;
    var payload = JSON.stringify({ id: viewId, duration: dur });
    // sendBeacon no soporta PATCH; usamos fetch keepalive.
    try {
      fetch(API + '/api/analytics/pageview', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
        mode: 'cors',
      });
    } catch (e) {}
  }
  addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') flush(); });
  addEventListener('pagehide', flush);

  window.mmTrackDemo = function (demo, input) {
    if (!demo) return;
    post('/api/analytics/demo', { anon_id: id, demo: String(demo), input_preview: input ? String(input).slice(0, 280) : null });
  };
})();
