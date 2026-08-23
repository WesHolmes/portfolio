/* Westley Holmes — portfolio
   1. Hero lattice (diagonal segments, cursor glow, click ripple, cycling patterns)
   2. Scroll reveal
   3. Nav scroll-spy
   4. Contact form validation
   ------------------------------------------------------------------ */

/* ---------- 1. hero lattice ---------- */
(function lattice() {
  var cv = document.getElementById('lattice');
  if (!cv || !cv.getContext) return;
  var ctx = cv.getContext('2d');
  var host = cv.parentElement;
  var stage = host.parentElement;

  var BLUE = [110, 190, 255];   // segment colour — change for a different lattice hue
  var S = 78;                   // cell size
  var CR = 240;                 // cursor light radius (manhattan)
  var PATTERN_LEN = 7;          // seconds per idle pattern
  var FADE = 1.6;               // crossfade between patterns

  var w = 0, h = 0, dpr = 1, time = 0, cx = 0, cy = 0, maxR = 1;
  var mx = -99999, my = -99999, tx = -99999, ty = -99999;
  var segs = [];
  var ripples = [];

  function build() {
    var r = host.getBoundingClientRect();
    w = r.width; h = r.height;
    if (!w || !h) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(w * dpr);
    cv.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = 'round';
    segs = [];
    cx = w / 2; cy = h / 2;
    maxR = Math.max(w, h) * 0.62;
    var cols = Math.ceil(w / S) + 2, rows = Math.ceil(h / S) + 2;
    var ox = (w - cols * S) / 2, oy = (h - rows * S) / 2;
    var inset = S * 0.155;
    for (var i = 0; i < cols; i++) {
      for (var j = 0; j < rows; j++) {
        var x = ox + i * S, y = oy + j * S;
        for (var k = 0; k < 2; k++) {
          var ax = k === 0 ? x : x + S, ay = y;
          var bx = k === 0 ? x + S : x, by = y + S;
          var dx = bx - ax, dy = by - ay;
          var len = Math.sqrt(dx * dx + dy * dy);
          var ux = dx / len, uy = dy / len;
          segs.push({
            x1: ax + ux * inset, y1: ay + uy * inset,
            x2: bx - ux * inset, y2: by - uy * inset,
            px: (ax + bx) / 2, py: (ay + by) / 2,
            par: (i + j + k) % 2,
            rnd: ((i * 73856093) ^ (j * 19349663) ^ (k * 83492791)) % 1000 / 1000,
            a: 0
          });
        }
      }
    }
  }

  // idle light-up patterns — they cycle every PATTERN_LEN seconds
  function pattern(idx, sg, T) {
    var dx = sg.px - cx, dy = sg.py - cy, v;
    if (idx === 0) {                                  // concentric diamond rings
      var md = Math.abs(dx) + Math.abs(dy);
      v = Math.sin(md * 0.026 - T * 2.1);
      return v > 0 ? v * v * v : 0;
    }
    if (idx === 1) {                                  // diagonal sweep
      v = Math.sin((sg.px + sg.py) * 0.011 - T * 1.7);
      return v > 0 ? Math.pow(v, 4) : 0;
    }
    if (idx === 2) {                                  // scattered twinkle
      v = Math.sin(T * 1.5 + sg.rnd * 6.283);
      return v > 0 ? Math.pow(v, 7) : 0;
    }
    v = Math.sin(T * 1.35 + sg.par * Math.PI);        // alternating breathe
    return v > 0 ? v * v * 0.85 : 0;
  }

  function onMove(ev) { var r = cv.getBoundingClientRect(); tx = ev.clientX - r.left; ty = ev.clientY - r.top; }
  function onLeave() { tx = -99999; ty = -99999; }
  function onDown(ev) { var r = cv.getBoundingClientRect(); ripples.push({ x: ev.clientX - r.left, y: ev.clientY - r.top, t: 0 }); }

  var last = performance.now();
  function frame(now) {
    var dt = Math.min((now - last) / 1000, 0.05); last = now;
    time += dt;
    mx += (tx - mx) * 0.18; my += (ty - my) * 0.18;
    var a = BLUE;
    ctx.clearRect(0, 0, w, h);

    for (var k = ripples.length - 1; k >= 0; k--) {
      ripples[k].t += dt;
      if (ripples[k].t > 2.4) ripples.splice(k, 1);
    }

    var slot = time / PATTERN_LEN;
    var pIdx = Math.floor(slot) % 4;
    var nIdx = (pIdx + 1) % 4;
    var intoSlot = (slot - Math.floor(slot)) * PATTERN_LEN;
    var blend = intoSlot > PATTERN_LEN - FADE ? (intoSlot - (PATTERN_LEN - FADE)) / FADE : 0;
    var cursorOn = mx > -10000;

    for (var i = 0; i < segs.length; i++) {
      var sg = segs[i];
      var vig = Math.max(0, 1 - Math.sqrt((sg.px - cx) * (sg.px - cx) + (sg.py - cy) * (sg.py - cy)) / maxR);
      var idle = pattern(pIdx, sg, time);
      if (blend > 0) idle = idle * (1 - blend) + pattern(nIdx, sg, time) * blend;
      var target = idle * vig * 0.42;

      if (cursorOn) {
        var cd = Math.abs(sg.px - mx) + Math.abs(sg.py - my);
        if (cd < CR) { var f = 1 - cd / CR; var cvv = f * f; if (cvv > target) target = cvv; }
      }
      for (var r2 = 0; r2 < ripples.length; r2++) {
        var rp = ripples[r2];
        var rd = Math.abs((Math.abs(sg.px - rp.x) + Math.abs(sg.py - rp.y)) - rp.t * 620);
        if (rd < 95) {
          var rf = (1 - rd / 95) * Math.max(0, 1 - rp.t / 2.4);
          var rv = rf * rf * 1.25;
          if (rv > target) target = Math.min(rv, 1);
        }
      }
      sg.a += (target - sg.a) * (target > sg.a ? 0.34 : 0.11);
    }

    // halo pass
    ctx.lineWidth = 17;
    for (i = 0; i < segs.length; i++) {
      sg = segs[i];
      if (sg.a < 0.12) continue;
      ctx.strokeStyle = 'rgba(' + a[0] + ',' + a[1] + ',' + a[2] + ',' + (sg.a * sg.a * 0.2).toFixed(3) + ')';
      ctx.beginPath(); ctx.moveTo(sg.x1, sg.y1); ctx.lineTo(sg.x2, sg.y2); ctx.stroke();
    }

    // core pass
    ctx.lineWidth = 5.6;
    for (i = 0; i < segs.length; i++) {
      sg = segs[i];
      var v = sg.a, t2 = v * v, m = Math.min(v * 1.6, 1);
      var cr = Math.round(32 + (a[0] - 32) * m + (245 - a[0]) * t2 * 0.85);
      var cg = Math.round(36 + (a[1] - 36) * m + (247 - a[1]) * t2 * 0.85);
      var cb = Math.round(42 + (a[2] - 42) * m + (250 - a[2]) * t2 * 0.85);
      ctx.strokeStyle = 'rgba(' + cr + ',' + cg + ',' + cb + ',' + (0.24 + v * 0.76).toFixed(3) + ')';
      ctx.beginPath(); ctx.moveTo(sg.x1, sg.y1); ctx.lineTo(sg.x2, sg.y2); ctx.stroke();
    }

    requestAnimationFrame(frame);
  }

  build();
  window.addEventListener('resize', build);
  stage.addEventListener('pointermove', onMove);
  stage.addEventListener('pointerleave', onLeave);
  stage.addEventListener('pointerdown', onDown);
  requestAnimationFrame(frame);
})();

/* ---------- 2. scroll reveal ---------- */
(function reveal() {
  var nodes = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  if (!nodes.length) return;
  if (!('IntersectionObserver' in window)) {
    nodes.forEach(function (n) { n.classList.add('is-in'); });
    return;
  }
  nodes.forEach(function (n, i) {
    var d = (i % 6) * 70;
    n.style.transitionDelay = d + 'ms, ' + d + 'ms';
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  nodes.forEach(function (n) { io.observe(n); });
})();

/* ---------- 3. nav scroll-spy ---------- */
(function spy() {
  var links = Array.prototype.slice.call(document.querySelectorAll('[data-navlink]'));
  if (!links.length) return;
  var ids = links.map(function (l) { return l.getAttribute('data-navlink'); });
  function update() {
    var cur = ids[0];
    ids.forEach(function (id) {
      var s = document.getElementById(id);
      if (s && window.scrollY >= s.offsetTop - 160) cur = id;
    });
    links.forEach(function (l) {
      l.classList.toggle('is-active', l.getAttribute('data-navlink') === cur);
    });
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ---------- 4. contact form ----------
   This form does NOT send anything — it validates and points people at email.
   To make it live: create a form at https://formspree.io, then replace the
   body of handleSubmit's success branch with a fetch() POST to your endpoint. */
(function contactForm() {
  var form = document.getElementById('contact-form');
  if (!form) return;
  var note = document.getElementById('form-note');

  function setErr(field, msg) {
    var el = form.querySelector('[data-err="' + field + '"]');
    if (el) el.textContent = msg || '';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.name.value.trim();
    var email = form.email.value.trim();
    var msg = form.message.value.trim();

    var errName = name ? '' : 'Please enter your name.';
    var errEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : 'Please enter a valid email.';
    var errMsg = msg ? '' : 'Please enter a message.';

    setErr('name', errName);
    setErr('email', errEmail);
    setErr('message', errMsg);

    if (errName || errEmail || errMsg) { note.hidden = true; return; }

    note.textContent = 'Looks good — but this form isn\u2019t wired to a backend yet. ' +
      'Email westleywholmes@gmail.com and I\u2019ll reply the same way.';
    note.hidden = false;
  });
})();
