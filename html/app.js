const IS_GAME = typeof GetParentResourceName === 'function';
const RES = IS_GAME ? GetParentResourceName() : 'vexxd_hud';

const L = {
  mph: 'MPH', kmh: 'KM/H', kts: 'KTS', rpm: 'RPM', power: 'POWER', regen: 'REGEN', cruise: 'CRUISE',
  heading: 'HDG', airspeed: 'IAS', altitude: 'ALT', gear_down: 'GEAR DN', gear_up: 'GEAR UP', throttle: 'THROTTLE', id: 'ID',
  mi: 'mi', km: 'km', ft: 'ft', m: 'm', min: 'min', arrive: 'Arriving', then: 'then',
  buckle: 'Buckle up', fwd: 'FWD', rev: 'REV', postal: 'Postal', odo: 'ODO', launch: 'LAUNCH', reload: 'RELOAD', zero60: '0-60', zero100: '0-100', top_speed: 'New top speed',
};

const STATS = ['health', 'armor', 'hunger', 'thirst', 'stress', 'stamina', 'oxygen'];
const STAT_ICON = { health: 'heart', armor: 'shield', hunger: 'meat', thirst: 'droplet', stress: 'brain', stamina: 'run', oxygen: 'lungs' };
const VEH_TYPES = ['car', 'ev', 'bike'];

const DEFAULTS = {
  theme: 'instrument',
  uiScale: 1,
  ultrawide: 'spread',
  vitalsOnMap: true,
  speedo: 'dial',
  vehicle: { car: { speedo: 'dial' }, ev: { speedo: 'dial' }, bike: { speedo: 'linear' } },
  unit: 'mph',
  fuelDisplay: 'percent',
  statusStyle: 'gauges',
  mapShape: 'square',
  mapOnFoot: true,
  compass: true,
  street: true,
  postal: true,
  nav: true,
  tripPops: true,
  odometer: true,
  shiftLight: true,
  weaponHud: true,
  crashPulse: true,
  autoHide: true,
  streamer: false,
  cinematicBars: true,
  show: { id: true, job: true, cash: true, bank: true, time: true, voice: true },
  colors: { accent: '#ef4444' },
  layout: {
    compass: { ax: .5, ay: 0, dx: 0, dy: 16, s: 1, o: 1 },
    street: { ax: .5, ay: 0, dx: 0, dy: 84, s: 1, o: 1 },
    nav: { ax: .5, ay: 0, dx: 0, dy: 138, s: 1, o: 1 },
    info: { ax: 1, ay: 0, dx: -24, dy: 24, s: 1, o: 1 },
    map: { ax: 0, ay: 1, dx: 28, dy: -36, s: 1, o: 1 },
    status: { ax: 0, ay: 1, dx: 334, dy: -36, s: 1, o: 1 },
    voice: { ax: 0, ay: 1, dx: 334, dy: -140, s: 1, o: 1 },
    speedo: { ax: 1, ay: 1, dx: -32, dy: -78, s: 1, o: 1 },
    trip: { ax: 1, ay: 1, dx: -32, dy: -330, s: 1, o: 1 },
    wind: { ax: .5, ay: 1, dx: 0, dy: -96, s: 1, o: 1 },
    weapon: { ax: 1, ay: 1, dx: -36, dy: -32, s: 1, o: 1 },
    belt: { ax: 1, ay: 1, dx: -412, dy: -48, s: 1, o: 1 },
  },
  layoutByType: {},
};

const state = {
  settings: null,
  status: { health: 100, armor: 0, hunger: 100, thirst: 100, stress: 0, stamina: 100, oxygen: 100, underwater: false, sprinting: false },
  custom: {},
  voice: { talking: false, range: 2, radio: 0, radioTalking: false },
  info: { id: 0, job: '', grade: '', cash: 0, bank: 0, time: '', date: '' },
  loc: { heading: 0, street: '', cross: '', zone: '', postal: null, postalDist: 0 },
  nav: null,
  veh: null,
  weapon: null,
  features: {},
  locks: {},
  mapFixed: false,
  onFoot: true,
};

const $ = (s, r = document) => r.querySelector(s);
const ico = (n, cls = '') => `<span class="ico ${cls}">${ICONS[n] || ''}</span>`;
const el = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const deep = (o) => JSON.parse(JSON.stringify(o));

function setText(n, v) { if (n && n._t !== v) { n._t = v; n.textContent = v; } }
function setHTML(n, v) { if (n && n._h !== v) { n._h = v; n.innerHTML = v; } }
function setCls(n, c, on) { if (n && n.classList.contains(c) !== !!on) n.classList.toggle(c, !!on); }
function setStyle(n, p, v) { if (n && n['_s' + p] !== v) { n['_s' + p] = v; n.style[p] = v; } }

function merge(base, over) {
  const out = deep(base);
  for (const k in over || {}) {
    if (over[k] && typeof over[k] === 'object' && !Array.isArray(over[k]) && out[k] && typeof out[k] === 'object') out[k] = merge(out[k], over[k]);
    else out[k] = over[k];
  }
  return out;
}

function post(name, data = {}) {
  if (!IS_GAME) return Promise.resolve(null);
  return fetch(`https://${RES}/${name}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    .then(r => r.json()).catch(() => null);
}

function padNum(v, digits) {
  const s = String(Math.max(0, Math.round(v)));
  const pad = Math.max(0, digits - s.length);
  return pad ? `<span class="dim">${'0'.repeat(pad)}</span>${s}` : s;
}

const money = (v) => '$' + Math.round(v).toLocaleString('en-US');
const metric = () => state.settings.unit === 'kmh';

function fmtDist(m) {
  if (metric()) return m < 950 ? `${Math.round(m / 10) * 10} ${L.m}` : `${(m / 1000).toFixed(1)} ${L.km}`;
  const ft = m * 3.28084;
  return ft < 900 ? `${Math.round(ft / 10) * 10} ${L.ft}` : `${(m / 1609.34).toFixed(1)} ${L.mi}`;
}

function polar(cx, cy, r, deg) { const a = deg * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; }
function arc(cx, cy, r, a0, a1) {
  const [x0, y0] = polar(cx, cy, r, a0), [x1, y1] = polar(cx, cy, r, a1);
  return `M${x0.toFixed(2)} ${y0.toFixed(2)} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
}
const stage = $('#stage');
const W = {};

function fitStage() {
  const host = stage.parentElement;
  const hw = host.clientWidth, hh = host.clientHeight;
  if (!hh) return;
  const scale = hh / 1080, full = hw / scale;
  const center = state.settings?.ultrawide === 'center' && full > 1920 * 1.01;
  const width = center ? 1920 : full, left = center ? (hw - 1920 * scale) / 2 : 0;
  stage.style.width = width + 'px';
  stage.style.transform = `translateX(${left}px) scale(${scale})`;
  host.style.setProperty('--mscale', scale);
  reportMap();
}
window.addEventListener('resize', fitStage);

function layoutFor(name) {
  const t = state.veh?.type;
  return (t && state.settings.layoutByType?.[t]?.[name]) || state.settings.layout[name];
}

const TOP_STACK = ['compass', 'street', 'nav'];
function stackShift(name) {
  const i = TOP_STACK.indexOf(name);
  if (i < 1 || stage.classList.contains('editing')) return 0;
  const me = layoutFor(name), s = state.settings;
  if (me.ax !== .5 || me.ay !== 0) return 0;
  let shift = 0;
  for (let j = 0; j < i; j++) {
    const k = TOP_STACK[j], above = layoutFor(k), next = layoutFor(TOP_STACK[j + 1]);
    const off = k === 'compass' ? !s.compass : k === 'street' ? !s.street : false;
    if (off && above.ax === .5 && above.ay === 0 && above.dy < me.dy) shift += next.dy - above.dy;
  }
  return shift;
}

function weaponLift(name, l) {
  if (name !== 'weapon' || !state.veh || l.ax !== 1 || l.ay !== 1) return 0;
  const sp = layoutFor(R?.kind === 'hud' ? 'wind' : 'speedo');
  const host = R?.kind === 'hud' ? W.wind : W.speedo;
  if (!sp || sp.ax !== 1 || sp.ay !== 1 || !host) return 0;
  return host.offsetHeight * sp.s * (state.settings.uiScale || 1) + 24;
}

function applyLayout(name) {
  const w = W[name], l = layoutFor(name);
  if (!w || !l) return;
  w.style.left = `calc(${l.ax * 100}% + ${l.dx}px)`;
  w.style.top = `calc(${l.ay * 100}% + ${l.dy - stackShift(name) - weaponLift(name, l)}px)`;
  w.style.setProperty('--ox', `${l.ax * 100}%`);
  w.style.setProperty('--oy', `${l.ay * 100}%`);
  w.style.transform = `translate(${-l.ax * 100}%, ${-l.ay * 100}%) scale(${(l.s * (state.settings.uiScale || 1)).toFixed(3)})`;
  w.style.setProperty('--wo', l.o);
  if (name === 'map') reportMap();
}
function statNode(k, icon, color) {
  return el(`<div class="st cutp" data-k="${k}" style="--c: ${color}">
    <svg class="ring" viewBox="0 0 46 46"><circle class="bg" cx="23" cy="23" r="20"/><circle class="fg" cx="23" cy="23" r="20" pathLength="100" stroke-dasharray="100" stroke-dashoffset="0"/></svg>
    ${icon}<div class="bar"><i></i></div><span class="val tnum">100</span><div class="pill"><i></i></div>
  </div>`);
}

function buildStatus() {
  const w = el(`<div class="w status"></div>`);
  for (const k of STATS) w.appendChild(statNode(k, ico(STAT_ICON[k]), `var(--c-${k})`));
  return w;
}

function statVisible(k, v) {
  const s = state.status;
  if (k === 'armor' || k === 'stress') return v > 0;
  if (k === 'stamina') return v < 99 || s.sprinting;
  if (k === 'oxygen') return s.underwater || v < 99;
  if (state.settings.autoHide && v >= 100) return false;
  return true;
}

function paintStat(st, v, visible, low) {
  setCls(st, 'hide', !visible);
  setCls(st, 'low', low);
  if (st._v === v) return;
  st._v = v;
  st.querySelector('.fg').style.strokeDashoffset = 100 - v;
  st.querySelector('.bar i').style.width = v + '%';
  st.querySelector('.bar i').style.setProperty('--h', v + '%');
  st.querySelector('.pill i').style.width = v + '%';
  st.querySelector('.val').textContent = Math.round(v);
}

const vitalsOn = () => state.settings.theme !== 'panel' && state.settings.vitalsOnMap;

function renderVitals() {
  const vt = W.map.querySelector('.vitals');
  setCls(vt, 'gone', !vitalsOn());
  if (!vitalsOn()) return;
  const hp = clamp(state.status.health, 0, 100), ar = clamp(state.status.armor, 0, 100);
  setCls(vt, 'noarmor', ar <= 0);
  setStyle(vt.querySelector('.hp i'), 'width', hp + '%');
  setStyle(vt.querySelector('.ar i'), 'width', ar + '%');
  setCls(vt.querySelector('.hp'), 'low', hp < 20);
}

function renderStatus() {
  const w = W.status;
  const cls = `w status ${state.settings.statusStyle}`;
  if (w.className !== cls) w.className = cls;
  const vit = vitalsOn();
  for (const k of STATS) {
    const v = clamp(Math.round(state.status[k] ?? 0), 0, 100);
    const onMap = vit && (k === 'health' || k === 'armor');
    paintStat(w.querySelector(`[data-k="${k}"]`), v, !onMap && statVisible(k, v), k === 'stress' ? v > 80 : v < 20);
  }
  renderVitals();
  for (const id in state.custom) {
    const c = state.custom[id];
    let st = w.querySelector(`[data-k="x-${CSS.escape(id)}"]`);
    if (!st) {
      st = statNode('x-' + id, c.svg ? `<span class="ico">${c.svg}</span>` : ico(c.icon || 'info-circle'), c.color || 'var(--accent)');
      w.appendChild(st);
    }
    const v = clamp(Math.round(c.value ?? 100), 0, 100);
    paintStat(st, v, !c.hidden, c.lowAt != null && v <= c.lowAt);
  }
}
function buildVoice() {
  return el(`<div class="w voice">
    <div class="mic cutp">${ico('microphone')}<div class="rng"><b></b><b></b><b></b></div></div>
    <div class="radio cutp">${ico('broadcast')}<span class="ch"></span></div>
  </div>`);
}

function renderVoice() {
  const v = state.voice, w = W.voice;
  setCls(w, 'off', !state.settings.show.voice);
  setCls(w.querySelector('.mic'), 'talk', v.talking);
  w.querySelectorAll('.rng b').forEach((b, i) => setCls(b, 'on', i < v.range));
  const r = w.querySelector('.radio');
  setCls(r, 'gone', !v.radio);
  setCls(r, 'talk', v.radioTalking);
  setText(r.querySelector('.ch'), v.radio ? `${v.radio} MHz` : '');
}
function buildInfo() {
  return el(`<div class="w info">
    <div class="meta">
      <div class="chip cutp time">${ico('clock')}<span class="v tnum"></span><span class="sub"></span></div>
      <div class="chip cutp idc">${ico('id')}<span class="k">${L.id}</span><span class="v tnum"></span></div>
      <div class="chip cutp job">${ico('briefcase')}<span class="v"></span><span class="sub"></span></div>
    </div>
    <div class="money-wrap"><div class="chip cutp money cash">${ico('cash')}<span class="amt tnum"></span></div></div>
    <div class="money-wrap"><div class="chip cutp money bank">${ico('building-bank')}<span class="amt tnum"></span></div></div>
  </div>`);
}

const shownMoney = { cash: null, bank: null };
function tweenMoney(k, node, from, to) {
  const t0 = performance.now(), dur = 650;
  const step = (now) => {
    const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
    shownMoney[k] = from + (to - from) * e;
    setText(node, money(shownMoney[k]));
    if (p < 1 && state.info[k] === to) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function renderInfo() {
  const i = state.info, w = W.info, sh = state.settings.show;
  setCls(w, 'streamer', state.settings.streamer);
  setCls(w.querySelector('.idc'), 'gone', !sh.id);
  setText(w.querySelector('.idc .v'), String(i.id));
  setCls(w.querySelector('.time'), 'gone', !sh.time);
  setText(w.querySelector('.time .v'), i.time);
  setText(w.querySelector('.time .sub'), i.date || '');
  setCls(w.querySelector('.job'), 'gone', !(sh.job && i.job));
  setText(w.querySelector('.job .v'), i.job);
  setText(w.querySelector('.job .sub'), i.grade ? '· ' + i.grade : '');
  for (const k of ['cash', 'bank']) {
    const chip = w.querySelector('.' + k), amt = chip.querySelector('.amt');
    setCls(chip.parentElement, 'gone', !sh[k]);
    if (shownMoney[k] === null) { shownMoney[k] = i[k]; setText(amt, money(i[k])); continue; }
    if (Math.round(shownMoney[k]) === i[k]) continue;
    const d = i[k] - shownMoney[k];
    if (!state.settings.streamer) {
      const t = el(`<span class="delta ${d > 0 ? 'up' : 'down'}">${d > 0 ? '+' : '-'}${money(Math.abs(d))}</span>`);
      chip.parentElement.appendChild(t);
      setTimeout(() => t.remove(), 1700);
    }
    tweenMoney(k, amt, shownMoney[k], i[k]);
  }
}
const CARD = { 0: 'N', 45: 'NE', 90: 'E', 135: 'SE', 180: 'S', 225: 'SW', 270: 'W', 315: 'NW' };
function buildCompass() {
  let ticks = '';
  for (let r = 0; r < 3; r++) for (let d = 0; d < 360; d += 5) {
    const c = CARD[d];
    const lbl = c ? `<span class="${d === 0 ? 'n' : ''}">${c}</span>` : (d % 15 === 0 ? `<span class="ic">${d}</span>` : '');
    ticks += `<div class="tk ${d % 15 === 0 ? 'mj' : ''}">${lbl}</div>`;
  }
  return el(`<div class="w compass"><div class="tape"><div class="strip">${ticks}</div><div class="mark"></div></div><div class="deg cutp tnum">000°</div><div class="ihd"><b></b><span class="tnum"></span></div></div>`);
}

const heading = () => ((state.loc.heading % 360) + 360) % 360;

const cw = { cur: null, run: false, last: 0 };
function drawCompass() {
  const w = W.compass, h = cw.cur;
  setStyle(w.querySelector('.strip'), 'transform', `translateX(${-(1080 + h / 5 * 15 + 7.5).toFixed(1)}px)`);
  const hd = Math.round(heading()) % 360;
  setText(w.querySelector('.deg'), String(hd).padStart(3, '0') + '°');
  setText(w.querySelector('.ihd b'), CARD[Math.round(hd / 45) % 8 * 45]);
  setText(w.querySelector('.ihd span'), String(hd).padStart(3, '0') + '°');
}
function stepCompass(now) {
  const dt = Math.min(.1, (now - cw.last) / 1000);
  cw.last = now;
  const d = ((heading() - cw.cur + 540) % 360) - 180;
  if (Math.abs(d) < .05) { cw.cur = heading(); drawCompass(); cw.run = false; return; }
  cw.cur = (cw.cur + d * Math.min(1, dt * 12) + 360) % 360;
  drawCompass();
  requestAnimationFrame(stepCompass);
}
function renderCompass() {
  const w = W.compass;
  setCls(w, 'off', !state.settings.compass);
  if (!state.settings.compass) { cw.cur = null; return; }
  if (cw.cur === null) { cw.cur = heading(); drawCompass(); return; }
  if (cw.run) return;
  cw.run = true;
  cw.last = performance.now();
  requestAnimationFrame(stepCompass);
}

function buildStreet() { return el(`<div class="w street"><div class="s1"></div><div class="s2"><span class="zn"></span><span class="pc"><b></b><span></span></span></div></div>`); }

function renderStreet() {
  const w = W.street, l = state.loc;
  setCls(w, 'off', !state.settings.street);
  setHTML(w.querySelector('.s1'), l.street + (l.cross ? ` <em>· ${l.cross}</em>` : ''));
  setText(w.querySelector('.zn'), l.zone);
  const pc = w.querySelector('.pc'), showPc = state.settings.postal && l.postal;
  setCls(pc, 'gone', !showPc);
  if (showPc) { setText(pc.querySelector('b'), `${L.postal} ${l.postal}`); setText(pc.querySelector('span'), fmtDist(l.postalDist)); }
}

const NAV_ICON = { left: 'corner-up-left', right: 'corner-up-right', straight: 'arrow-up', keep_left: 'arrow-ramp-left', keep_right: 'arrow-ramp-right', uturn: 'arrow-back-up', arrive: 'flag' };
function buildNav() {
  return el(`<div class="w nav cutp"><span class="turn"></span><span class="nd tnum"></span><span class="sep"></span>${ico('route', 'ri')}<span class="tot tnum"></span><span class="eta tnum"></span></div>`);
}

function renderNav() {
  const w = W.nav, n = state.nav;
  setCls(w, 'off', !n || !state.settings.nav || (R?.kind === 'hud' && !!state.veh));
  if (R?.kind === 'hud') renderSpeedo();
  if (!n) return;
  setHTML(w.querySelector('.turn'), ico(NAV_ICON[n.dir] || 'arrow-up'));
  setText(w.querySelector('.nd'), n.dir === 'arrive' ? L.arrive : fmtDist(n.next));
  setText(w.querySelector('.tot'), fmtDist(n.total));
  const spd = state.veh?.speed || 0;
  const eta = spd > 2 ? Math.max(1, Math.round(n.total / spd / 60)) : null;
  setText(w.querySelector('.eta'), eta ? `${eta} ${L.min}` : '');
}
function buildMap() {
  return el(`<div class="w mapframe">${IS_GAME ? '' : '<canvas></canvas>'}<div class="box cutp"></div>${IS_GAME ? '' : '<div class="pip"></div>'}
    <div class="vitals"><div class="vb hp"><i></i></div><div class="vb ar"><i></i></div></div></div>`);
}

function renderMap() {
  const w = W.map;
  setCls(w, 'circle', state.mapCircle === true);
  setCls(w, 'off', state.onFoot && !state.settings.mapOnFoot);
  if (!IS_GAME) drawFakeMap();
  reportMap();
}

let mapTimer = null;
function reportMap() {
  if (!IS_GAME || !W.map) return;
  clearTimeout(mapTimer);
  mapTimer = setTimeout(() => {
    const r = W.map.getBoundingClientRect();
    post('mapRect', {
      x: r.left / innerWidth, y: r.top / innerHeight, w: r.width / innerWidth, h: r.height / innerHeight,
      shape: state.settings.mapShape, visible: !W.map.classList.contains('off'),
    });
  }, 60);
}

function drawFakeMap() {
  const c = W.map.querySelector('canvas');
  const w = c.clientWidth, h = c.clientHeight;
  if (!w || (c._w === w && c._h === h)) return;
  c._w = w; c._h = h;
  c.width = w * 2; c.height = h * 2;
  const g = c.getContext('2d');
  g.scale(2, 2);
  g.fillStyle = '#1c2a33'; g.fillRect(0, 0, w, h);
  g.fillStyle = '#22343f'; g.fillRect(w * .62, 0, w * .38, h * .45);
  g.strokeStyle = '#3a4a54'; g.lineWidth = 7; g.lineCap = 'round';
  const lines = [[-10, h * .55, w + 10, h * .38], [w * .3, -10, w * .42, h + 10], [w * .7, h + 10, w * .9, -10], [-10, h * .15, w * .5, h * .22]];
  for (const [a, b, c2, d] of lines) { g.beginPath(); g.moveTo(a, b); g.lineTo(c2, d); g.stroke(); }
  g.strokeStyle = '#4d5f6a'; g.lineWidth = 3;
  const pts = [[.1, .8, .5, .9], [.55, .1, .95, .3], [.2, .3, .35, .7], [.6, .6, .95, .85], [.05, .4, .25, .05], [.7, .4, .65, .95]];
  for (const [a, b, c2, d] of pts) { g.beginPath(); g.moveTo(a * w, b * h); g.lineTo(c2 * w, d * h); g.stroke(); }
  g.strokeStyle = '#d9a63a'; g.lineWidth = 3.5;
  g.beginPath(); g.moveTo(w / 2, h / 2); g.lineTo(w * .45, h * .2); g.lineTo(w * .62, h * .05); g.stroke();
}
function buildWeapon() {
  return el(`<div class="w weapon"><span class="wn"></span><div class="wa"><span class="clip num"></span><span class="tot tnum"></span></div><div class="wb"></div></div>`);
}

function renderWeapon() {
  const w = W.weapon, d = state.weapon;
  const noAmmo = d && (d.melee || !(d.max > 0) || d.max > 500 || d.clip > 500);
  setCls(w, 'off', !d || noAmmo || !state.settings.weaponHud);
  if (!d || noAmmo) return;
  setText(w.querySelector('.wn'), d.label || '');
  setCls(w, 'melee', !!d.melee);
  const max = Math.max(1, d.max || 1), low = !d.melee && d.clip <= Math.ceil(max * .25);
  setText(w.querySelector('.clip'), d.melee ? '' : d.clip === 0 && d.total > 0 ? L.reload : String(d.clip));
  setCls(w.querySelector('.clip'), 'low', low && d.clip > 0);
  setCls(w.querySelector('.clip'), 'empty', !d.melee && d.clip === 0);
  setText(w.querySelector('.tot'), d.melee ? '' : '/ ' + d.total);
  const segs = Math.min(max, 30), lit = Math.round(d.clip / max * segs), bar = w.querySelector('.wb');
  if (bar._n !== segs) { bar._n = segs; bar.innerHTML = '<i></i>'.repeat(d.melee ? 0 : segs); }
  [...bar.children].forEach((s, i) => setCls(s, 'on', i < lit));
  setCls(bar, 'low', low);
}

const Sfx = (() => {
  let ctx = null;
  const ac = () => { try { ctx = ctx || new (window.AudioContext || window.webkitAudioContext)(); if (ctx.state === 'suspended') ctx.resume(); } catch (e) { ctx = null; } return ctx; };
  function click(t, freq, gain) {
    const c = ac(); if (!c) return;
    const len = Math.floor(c.sampleRate * .03), buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 6);
    const src = c.createBufferSource(), bp = c.createBiquadFilter(), g = c.createGain();
    src.buffer = buf; bp.type = 'bandpass'; bp.frequency.value = freq; bp.Q.value = 4; g.gain.value = gain;
    src.connect(bp).connect(g).connect(c.destination); src.start(c.currentTime + t);
  }
  function ding() {
    const c = ac(); if (!c) return;
    const now = c.currentTime;
    for (const [f, v] of [[880, .12], [1760, .03]]) {
      const o = c.createOscillator(), g = c.createGain();
      o.type = 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(0, now); g.gain.linearRampToValueAtTime(v, now + .01); g.gain.exponentialRampToValueAtTime(.0001, now + .55);
      o.connect(g).connect(c.destination); o.start(now); o.stop(now + .6);
    }
  }
  return {
    belt(on) {
      const a = new Audio(`sounds/${on ? 'buckle' : 'unbuckle'}.ogg`);
      a.volume = .6;
      a.play().catch(() => this.synthBelt(on));
    },
    synthBelt(on) { if (on) { click(0, 2400, .9); click(.07, 1500, 1.1); } else { click(0, 1800, .8); click(.05, 1100, .5); } },
    ding,
  };
})();

let beltTimer = null, beltDings = 0;
function renderBelt() {
  const w = W.belt, v = state.veh, f = state.features;
  const car = v && (v.type === 'car' || v.type === 'ev');
  const warn = car && f.beltWarning !== false && !v.seatbelt && v.speed * 2.236936 > (f.beltWarnSpeed ?? 10);
  setCls(w, 'off', !warn);
  setText(w.querySelector('.bk'), state.beltKey || f.beltKey || 'B');
  setText(w.querySelector('.bt'), L.buckle);
  if (warn && !beltTimer) {
    beltDings = 0;
    Sfx.ding();
    beltTimer = setInterval(() => { if (++beltDings >= 20) { clearInterval(beltTimer); return; } Sfx.ding(); }, 1100);
  } else if (!warn && beltTimer) {
    clearInterval(beltTimer); beltTimer = null;
  }
  if (!v) beltDings = 0;
}

function buildTrip() { return el(`<div class="w trip"></div>`); }

function tripPop(kind, value) {
  if (!state.settings.tripPops) return;
  const label = kind === 'zero60' ? (metric() ? L.zero100 : L.zero60) : L.top_speed;
  const val = kind === 'top' ? `${Math.round(value * (metric() ? 3.6 : 2.236936))} ${L[state.settings.unit]}` : `${value.toFixed(2)}s`;
  const p = el(`<div class="pop cutp">${ico(kind === 'top' ? 'trophy' : 'stopwatch')}<span class="pl">${label}</span><b class="tnum">${val}</b></div>`);
  W.trip.appendChild(p);
  setTimeout(() => p.classList.add('out'), 3600);
  setTimeout(() => p.remove(), 4100);
}
const LAMPS = () => [['belt', 'seatbelt'], ['cruise', 'gauge'], ['lights', 'headlight'], ['engine', 'engine']]
  .map(([c, i]) => `<span class="lamp ico ${c}">${ICONS[i]}</span>`).join('');
const INDS = () => `<span class="ind l">${ico('arrow-big-left')}</span><span class="ind r">${ico('arrow-big-right')}</span>`;
const SHIFT = () => `<div class="shl"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><b>${L.launch}</b></div>`;
const ODO = () => `<span class="odo tnum"></span>`;
const FUEL = () => `<span class="ico ficon">${ICONS['gas-station']}</span>`;

const SPEEDOS = {
  tech() {
    let seg = '', fb = '';
    for (let i = 0; i < 32; i++) seg += `<i class="${i >= 26 ? 'r' : ''}"></i>`;
    for (let i = 0; i < 10; i++) fb += '<i></i>';
    return `<div class="spd tech cutp">${SHIFT()}
      <div class="inds">${INDS()}</div>
      <div class="top"><div class="num sp"></div><div class="rt"><div class="gearbox cutp"><span class="gear"></span></div><span class="unit"></span>${ODO()}</div></div>
      <div class="seg">${seg}</div>
      <div class="scale"><span>0</span><span>2</span><span>4</span><span>6</span><span class="rlbl"></span><span>8</span></div>
      <div class="bot"><div class="fuel">${FUEL()}<div class="fb">${fb}</div><span class="pct tnum"></span></div><span class="cruise-set"></span><div class="lamps">${LAMPS()}</div></div>
    </div>`;
  },
  analog(max) {
    const cx = 135, cy = 135, majors = 10;
    let t = '';
    for (let i = 0; i <= majors * 2; i++) {
      const a = 135 + i / (majors * 2) * 270, mj = i % 2 === 0;
      const [x0, y0] = polar(cx, cy, mj ? 104 : 109, a), [x1, y1] = polar(cx, cy, 118, a);
      t += `<line class="tick ${mj ? 'mj' : ''}" x1="${x0}" y1="${y0}" x2="${x1}" y2="${y1}"/>`;
      if (mj) { const [lx, ly] = polar(cx, cy, 88, a); t += `<text class="lbl" x="${lx}" y="${ly}">${max / majors * i / 2}</text>`; }
    }
    return `<div class="spd analog">${SHIFT()}
      <svg class="dial" viewBox="0 0 270 270">
        <circle class="face" cx="135" cy="135" r="128"/>${t}
        <path class="rpmtrack" d="${arc(cx, cy, 64, 150, 390)}"/>
        <path class="rpmfill" d="${arc(cx, cy, 64, 150, 390)}" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"/>
        <g class="needle"><path d="M135 131 L250 134.2 L250 135.8 L135 139 Z"/></g>
        <circle class="hub" cx="135" cy="135" r="10"/>
      </svg>
      <div class="inds">${INDS()}</div>
      <div class="read"><div class="num sp"></div><div class="row"><span class="unit"></span><span class="gear"></span></div><span class="cruise-set"></span>${ODO()}</div>
      <div class="fuelline"><i></i></div><span class="pct apct tnum"></span>
      <div class="lamps">${LAMPS()}</div>
    </div>`;
  },
  cluster(max) {
    const dial = (side, n, lab, red) => {
      let t = '';
      const steps = n * 2;
      for (let i = 0; i <= steps; i++) {
        const a = 135 + i / steps * 270, mj = i % 2 === 0, isRed = red && i / steps >= red;
        const [x0, y0] = polar(110, 110, mj ? 84 : 89, a), [x1, y1] = polar(110, 110, 97, a);
        t += `<line class="tick ${mj ? 'mj' : ''} ${isRed ? 'red' : ''}" x1="${x0}" y1="${y0}" x2="${x1}" y2="${y1}"/>`;
        if (mj) { const [lx, ly] = polar(110, 110, 70, a); t += `<text class="lbl" x="${lx}" y="${ly}">${lab(i / 2)}</text>`; }
      }
      const redArc = red ? `<path class="redarc" d="${arc(110, 110, 100, 135 + red * 270, 405)}"/>` : '';
      return `<svg class="dial ${side}" viewBox="0 0 220 220"><circle class="face" cx="110" cy="110" r="106"/>${redArc}${t}
        <text class="cap" x="110" y="150">${side === 'l' ? L.rpm + ' ×1000' : `<tspan class="ucap">${L[state.settings.unit]}</tspan>`}</text>
        <g class="needle"><path d="M110 106.5 L198 109.3 L198 110.7 L110 113.5 Z"/></g><circle class="hub" cx="110" cy="110" r="9"/></svg>`;
    };
    return `<div class="spd cluster"><div class="shell">${SHIFT()}
      ${dial('l', 8, v => v, 6.5 / 8)}${dial('r', 10, v => max / 10 * v, 0)}
      <div class="screen cutp"><span class="gear"></span><div class="num sp"></div><span class="unit"></span><span class="cruise-set"></span>${ODO()}
        <div class="fl">${FUEL()}<div class="fuelline"><i></i></div><span class="pct tnum"></span></div></div>
      <div class="inds">${INDS()}</div><div class="lamps">${LAMPS()}</div>
    </div></div>`;
  },
  apex() {
    const cx = 160, cy = 160;
    let t = '';
    for (let i = 0; i <= 8; i++) {
      const a = 135 + i / 8 * 270;
      const [x0, y0] = polar(cx, cy, 116, a), [x1, y1] = polar(cx, cy, 122, a), [lx, ly] = polar(cx, cy, 104, a);
      t += `<line class="tk" x1="${x0}" y1="${y0}" x2="${x1}" y2="${y1}"/><text class="tl" x="${lx}" y="${ly}">${i}</text>`;
    }
    return `<div class="spd apex">${SHIFT()}
      <svg class="arc" viewBox="0 0 320 300">
        <defs><linearGradient id="apexg" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#f3f4f6"/><stop offset=".72" stop-color="#f3f4f6"/><stop offset="1" stop-color="var(--accent)"/></linearGradient></defs>
        <path class="trk" d="${arc(cx, cy, 136, 135, 405)}"/><path class="trk2" d="${arc(cx, cy, 136, 135, 405)}"/>
        <path class="fill" d="${arc(cx, cy, 136, 135, 405)}" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"/>
        <path class="red" d="${arc(cx, cy, 150, 135 + .81 * 270, 405)}"/>${t}
        <path class="fuelarc" d="${arc(cx, cy, 150, 140, 200)}"/>
        <path class="fuelfill" d="${arc(cx, cy, 150, 140, 200)}" pathLength="100" stroke-dasharray="100" stroke-dashoffset="0"/>
      </svg>
      <div class="gbox cutp"><span class="gear"></span></div>
      <div class="mid"><div class="num sp"></div><span class="unit"></span><span class="cruise-set"></span>${ODO()}</div>
      <span class="pct apct tnum"></span>
      <div class="inds">${INDS()}</div><div class="lamps">${LAMPS()}</div>
    </div>`;
  },
  linear() {
    return `<div class="spd linear cutp">${SHIFT()}
      <span class="ind l">${ico('arrow-big-left')}</span>
      <div class="spw"><span class="num sp"></span></div>
      <div class="midc">
        <div class="rl"><i></i><b style="left:25%"></b><b style="left:50%"></b><b style="left:75%"></b></div>
        <div class="lo"><span class="unit"></span>${ODO()}<div class="fl">${FUEL()}<div class="fb"><i></i></div><span class="pct tnum"></span></div><span class="cruise-set"></span><div class="lamps">${LAMPS()}</div></div>
      </div>
      <div class="gb cutp"><span class="gear"></span></div>
      <span class="ind r">${ico('arrow-big-right')}</span>
    </div>`;
  },
  dial(max) {
    const cx = 180, cy = 170, r = 150;
    let t = '';
    for (let i = 0; i <= 20; i++) {
      const a = 150 + i / 20 * 240, mj = i % 2 === 0;
      const [x0, y0] = polar(cx, cy, r - (mj ? 15 : 9), a), [x1, y1] = polar(cx, cy, r - 4, a);
      t += `<line class="tk ${mj ? 'mj' : ''}" x1="${x0.toFixed(1)}" y1="${y0.toFixed(1)}" x2="${x1.toFixed(1)}" y2="${y1.toFixed(1)}"/>`;
      if (mj && i % 4 === 0) { const [lx, ly] = polar(cx, cy, r - 27, a); t += `<text class="tl" x="${lx.toFixed(1)}" y="${ly.toFixed(1)}">${Math.round(max * i / 20)}</text>`; }
    }
    return `<div class="spd dial">${SHIFT()}
      <svg class="d" viewBox="0 0 360 300">${t}
        <path class="trk" d="${arc(cx, cy, r, 150, 390)}"/>
        <path class="spf" d="${arc(cx, cy, r, 150, 390)}" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"/>
        <path class="red" d="${arc(cx, cy, r + 8, 150 + 240 * .82, 390)}"/>
        <path class="rtrk" d="${arc(cx, cy, 104, 165, 375)}"/>
        <path class="rpmf" d="${arc(cx, cy, 104, 165, 375)}" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"/>
      </svg>
      <span class="ind l">${ico('arrow-big-left')}</span><span class="ind r">${ico('arrow-big-right')}</span>
      <div class="gbx"><span class="gear"></span></div>
      <div class="mid"><div class="num sp"></div><span class="unit"></span><span class="cruise-set"></span></div>
      <div class="lamps">${LAMPS()}</div>
      <div class="foot">${FUEL()}<span class="pct tnum"></span><span class="grow"></span>${ODO()}</div>
    </div>`;
  },
  cycle() {
    return `<div class="spd cycle">
      <div class="cy-top"><div class="num sp"></div><span class="unit"></span></div>
      <div class="cy-row">${ico('route')}<b class="cy-d tnum"></b>${ico('stopwatch')}<b class="cy-t tnum"></b></div>
    </div>`;
  },
  train() {
    let t = '';
    for (let i = 0; i <= 10; i++) t += `<b style="left:${i * 10}%"></b>`;
    return `<div class="spd train">
      <div class="tr-top"><div class="num sp"></div><div class="tr-r"><span class="unit"></span><span class="tr-dir"></span></div></div>
      <div class="tr-bar"><i></i>${t}</div>
    </div>`;
  },
  hud() {
    return `<div class="spd hud">${SHIFT()}
      <div class="hrow">
        <div class="hside l"><span class="ind l">${ico('arrow-big-left')}</span><div class="hnav"><span class="turn"></span><span class="nd tnum"></span></div></div>
        <div class="hmid"><div class="num sp"></div><span class="unit"></span></div>
        <div class="hside r"><div class="hgear"><span class="gear"></span></div><span class="ind r">${ico('arrow-big-right')}</span></div>
      </div>
      <div class="hrpm"><i></i></div>
      <div class="hlo">${FUEL()}<span class="pct tnum"></span><span class="cruise-set"></span>${ODO()}<div class="lamps">${LAMPS()}</div></div>
    </div>`;
  },
  boat() {
    let ticks = '';
    for (let r = 0; r < 3; r++) for (let d = 0; d < 360; d += 10) ticks += `<div class="tk">${d % 90 === 0 ? `<span>${CARD[d]}</span>` : ''}</div>`;
    return `<div class="spd boat cutp">
      <div class="top"><div class="num sp"></div><div class="rcol"><span class="lamp ico anchor">${ICONS.anchor}</span><span class="unit"></span></div></div>
      <div class="hdg"><div class="strip">${ticks}</div><div class="mk"></div></div>
      <div class="bot"><span class="k">${L.throttle}</span><div class="thr"><i></i></div><span class="lamp ico engine">${ICONS.engine}</span>${FUEL()}<span class="k pct tnum"></span></div>
    </div>`;
  },
  air() {
    let as = '', alt = '';
    for (let v = 400; v >= 0; v -= 10) as += `<div>${v}</div>`;
    for (let v = 8000; v >= 0; v -= 100) alt += `<div>${v}</div>`;
    return `<div class="spd air cutp">
      <div class="tape l"><span class="tl">${L.airspeed} KTS</span><div class="rl">${as}</div><div class="box as"></div></div>
      <div class="ctr"><div class="ahdg"><small>${L.heading}</small><span class="hv">000</span></div><div class="vs"><span class="vsa"></span><span class="vsv tnum"></span></div>
        <span class="gearst cutp"></span><div class="lamps"><span class="lamp ico engine">${ICONS.engine}</span>${FUEL()}<span class="pct tnum mono apct2"></span></div></div>
      <div class="tape r"><span class="tl">${L.altitude} FT</span><div class="rl">${alt}</div><div class="box alt"></div></div>
    </div>`;
  },
};

let speedoKey = null, R = null;
const tw = { sp: 0, rpm: 0, tsp: 0, trpm: 0, run: false, last: 0 };
function speedoKind() {
  const t = state.veh?.type;
  if (t === 'boat') return 'boat';
  if (t === 'cycle') return 'cycle';
  if (t === 'train') return 'train';
  if (t === 'air' || t === 'heli') return 'air';
  return state.settings.vehicle?.[t]?.speedo || state.settings.speedo;
}

function buildSpeedo() {
  const kind = speedoKind(), unit = state.settings.unit;
  const key = kind + unit;
  if (key === speedoKey && R) return;
  speedoKey = key;
  const max = unit === 'kmh' ? 320 : 200;
  const host = kind === 'hud' ? W.wind : W.speedo, other = kind === 'hud' ? W.speedo : W.wind;
  other.innerHTML = '';
  setCls(other, 'off', true);
  host.innerHTML = SPEEDOS[kind](max, unit);
  const root = host.firstElementChild, q = (s) => [...root.querySelectorAll(s)];
  R = {
    kind, root, nums: q('.num.sp'), units: q('.unit'), gears: q('.gear'), pcts: q('.pct'), odos: q('.odo'), ficons: q('.ficon'),
    cruise: q('.cruise-set'), rlbl: root.querySelector('.rlbl'), indL: q('.ind.l'), indR: q('.ind.r'),
    lamps: { belt: q('.lamp.belt'), cruise: q('.lamp.cruise'), lights: q('.lamp.lights'), engine: q('.lamp.engine'), anchor: q('.lamp.anchor') },
    segs: q('.seg i'), seg: root.querySelector('.seg'), fbs: q('.fuel .fb i'), fuelBox: root.querySelector('.fuel'),
    needles: q('.needle'), rpmfill: root.querySelector('.rpmfill'), fuelline: root.querySelector('.fuelline'), apexFill: root.querySelector('.fill'),
    fuelfill: root.querySelector('.fuelfill'), rl: root.querySelector('.rl'), fbLine: root.querySelector('.fl .fb'), fl: root.querySelector('.fl'),
    hdg: root.querySelector('.hdg .strip'), thr: root.querySelector('.thr i'), boxAs: root.querySelector('.box.as'), boxAlt: root.querySelector('.box.alt'),
    tapeL: root.querySelector('.tape.l .rl'), tapeR: root.querySelector('.tape.r .rl'), hv: root.querySelector('.hv'),
    vsa: root.querySelector('.vsa'), vsv: root.querySelector('.vsv'), gearst: root.querySelector('.gearst'),
    host, shl: root.querySelector('.shl'), leds: q('.shl i'), hrpm: root.querySelector('.hrpm i'),
    cyD: root.querySelector('.cy-d'), cyT: root.querySelector('.cy-t'), trDir: root.querySelector('.tr-dir'), trBar: root.querySelector('.tr-bar i'),
    hnav: root.querySelector('.hnav'), spf: root.querySelector('.spf'), rpmf: root.querySelector('.rpmf'),
  };
  applyLayout('speedo'); applyLayout('wind');
}

function lamp(list, cls) { for (const n of list) { const c = 'lamp ico ' + n.classList[2] + (cls ? ' ' + cls : ''); if (n.className !== c) n.className = c; } }

function renderSpeedo() {
  const v = state.veh;
  if (!v) { setCls(W.speedo, 'off', true); setCls(W.wind, 'off', true); return; }
  buildSpeedo();
  setCls(R.host, 'off', false);
  const kind = R.kind, root = R.root;
  const ev = v.type === 'ev', unit = state.settings.unit;
  if (root.dataset.mode !== v.type) root.dataset.mode = v.type;
  const waterAir = kind === 'boat' || kind === 'air';
  const mult = waterAir ? 1.943844 : unit === 'kmh' ? 3.6 : 2.236936;
  tw.tsp = v.speed * mult;
  tw.trpm = clamp(Math.abs(v.rpm), 0, 1);
  if (R._fresh !== false) { tw.sp = tw.tsp; tw.rpm = tw.trpm; R._fresh = false; }
  startTween();
  const speed = tw.tsp, regen = ev && v.rpm < 0;
  R.regen = regen;
  const fuel = clamp(ev ? v.battery : v.fuel, 0, 100), low = fuel < 15;
  for (const n of R.units) setText(n, kind === 'boat' ? L.kts : L[unit]);
  for (const n of R.gears) setText(n, v.gear);
  const pct = state.settings.fuelDisplay === 'range' && v.range != null && !waterAir ? fmtDist(v.range) : Math.round(fuel) + '%';
  for (const n of R.pcts) setText(n, pct);
  const odo = state.settings.odometer && v.odo != null && !waterAir
    ? `${L.odo} ${Math.floor(v.odo * (unit === 'kmh' ? 1 : 0.621371)).toLocaleString('en-US')} ${unit === 'kmh' ? 'KM' : 'MI'}` : '';
  for (const n of R.odos) setText(n, odo);
  const fi = ICONS[ev ? 'battery-charging' : 'gas-station'];
  for (const n of R.ficons) { setHTML(n, fi); setCls(n, 'warn', low); }
  const cr = v.cruise ? `${L.cruise} ${Math.round(v.cruiseSpeed * mult)}` : '';
  for (const n of R.cruise) setText(n, cr);
  if (R.rlbl) setText(R.rlbl, ev ? (regen ? L.regen : L.power) : `${L.rpm} ×1000`);

  const blink = Math.floor(performance.now() / 400) % 2 === 0;
  const iL = (v.indicators === 'left' || v.indicators === 'hazard') && blink, iR = (v.indicators === 'right' || v.indicators === 'hazard') && blink;
  for (const n of R.indL) setCls(n, 'on', iL);
  for (const n of R.indR) setCls(n, 'on', iR);

  lamp(R.lamps.belt, v.type === 'bike' ? '' : v.seatbelt ? 'ok' : speed > 10 ? 'blink' : 'bad');
  lamp(R.lamps.cruise, v.cruise ? 'ok' : '');
  lamp(R.lamps.lights, v.lights === 2 ? 'hi' : v.lights === 1 ? 'on' : '');
  lamp(R.lamps.engine, !v.engineOn ? '' : v.engineHealth < 300 ? 'bad' : v.engineHealth < 650 ? 'warn' : 'on');
  lamp(R.lamps.anchor, v.anchor ? 'ok' : '');

  const low2 = low;
  if (kind === 'tech') {
    const f = Math.ceil(fuel / 10);
    if (R._f !== f) { R._f = f; R.fbs.forEach((s2, i) => setCls(s2, 'on', i < f)); }
    setCls(R.fuelBox, 'low', low2);
    setCls(R.seg, 'regen', regen);
  } else if (kind === 'analog' || kind === 'cluster') {
    setStyle(R.fuelline.firstElementChild, 'width', fuel.toFixed(0) + '%');
    setCls(R.fuelline, 'low', low2);
    if (R.rpmfill) setCls(R.rpmfill, 'regen', regen);
  } else if (kind === 'apex') {
    setCls(R.apexFill, 'regen', regen);
    setStyle(R.fuelfill, 'strokeDashoffset', (100 - fuel).toFixed(0));
    setCls(R.fuelfill, 'low', low2);
  } else if (kind === 'linear') {
    setCls(R.rl, 'regen', regen);
    setStyle(R.fbLine.firstElementChild, 'width', fuel.toFixed(0) + '%');
    setCls(R.fl, 'low', low2);
  } else if (kind === 'cycle') {
    setText(R.cyD, fmtDist(v.ride || 0));
    const s = v.rideTime || 0;
    setText(R.cyT, `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`);
  } else if (kind === 'train') {
    setText(R.trDir, v.reverse ? L.rev : L.fwd);
    setCls(R.trDir, 'rev', !!v.reverse);
  } else if (kind === 'hud') {
    const n = state.settings.nav && state.nav;
    setCls(R.hnav, 'gone', !n);
    if (n) {
      setHTML(R.hnav.querySelector('.turn'), ico(NAV_ICON[n.dir] || 'arrow-up'));
      setText(R.hnav.querySelector('.nd'), n.dir === 'arrive' ? L.arrive : fmtDist(n.next));
    }
    setCls(R.hrpm.parentElement, 'regen', regen);
  } else if (kind === 'boat') {
    setStyle(R.hdg, 'transform', `translateX(${-(432 + heading() / 10 * 12 + 6).toFixed(1)}px)`);
  } else if (kind === 'air') {
    const ft = Math.max(0, v.altitude * 3.28084);
    setText(R.boxAlt, String(Math.round(ft)));
    setStyle(R.tapeR, 'transform', `translateY(${(-((8000 - ft) / 100 * 20) - 10).toFixed(1)}px)`);
    setText(R.hv, String(Math.round(heading()) % 360).padStart(3, '0'));
    const vs = Math.round((v.vspeed || 0) * 196.85 / 10) * 10;
    setHTML(R.vsa, `<span class="ico">${ICONS[vs >= 0 ? 'arrow-big-up' : 'arrow-big-down']}</span>`);
    setText(R.vsv, `${vs > 0 ? '+' : ''}${vs} FPM`);
    setText(R.gearst, v.gearDown ? L.gear_down : L.gear_up);
    setCls(R.gearst, 'down', v.gearDown);
    setCls(R.gearst, 'up', !v.gearDown);
  }
  drawGauge();
}

function drawGauge() {
  if (!R || !state.veh) return;
  const kind = R.kind, ev = state.veh.type === 'ev';
  const speed = tw.sp, rpm = tw.rpm, max = state.settings.unit === 'kmh' ? 320 : 200;
  const digits = kind === 'tech' || kind === 'apex' || kind === 'boat' ? 3 : 0;
  const sp = padNum(speed, digits);
  for (const n of R.nums) setHTML(n, sp);
  drawShift(rpm);
  if (kind === 'tech') {
    const n = Math.round(rpm * 32);
    if (R._n !== n) { R._n = n; R.segs.forEach((s2, i) => setCls(s2, 'on', i < n)); }
  } else if (kind === 'analog') {
    setStyle(R.needles[0], 'transform', `rotate(${(clamp(speed / max, 0, 1.03) * 270 + 135).toFixed(1)}deg)`);
    setStyle(R.rpmfill, 'strokeDashoffset', (100 - rpm * 100).toFixed(1));
  } else if (kind === 'cluster') {
    setStyle(R.needles[0], 'transform', `rotate(${(rpm * 270 + 135).toFixed(1)}deg)`);
    setStyle(R.needles[1], 'transform', `rotate(${(clamp(speed / max, 0, 1.03) * 270 + 135).toFixed(1)}deg)`);
  } else if (kind === 'apex') {
    setStyle(R.apexFill, 'strokeDashoffset', (100 - rpm * 100).toFixed(1));
    setCls(R.root, 'shift', !ev && rpm > .93);
  } else if (kind === 'linear') {
    setStyle(R.rl.firstElementChild, 'width', (rpm * 100).toFixed(1) + '%');
  } else if (kind === 'dial') {
    setStyle(R.spf, 'strokeDashoffset', (100 - clamp(speed / max, 0, 1) * 100).toFixed(1));
    setStyle(R.rpmf, 'strokeDashoffset', (100 - rpm * 100).toFixed(1));
    setCls(R.rpmf, 'regen', ev && R.regen);
  } else if (kind === 'train') {
    setStyle(R.trBar, 'width', (clamp(speed / (state.settings.unit === 'kmh' ? 160 : 100), 0, 1) * 100).toFixed(1) + '%');
  } else if (kind === 'hud') {
    setStyle(R.hrpm, 'width', (rpm * 100).toFixed(1) + '%');
  } else if (kind === 'boat') {
    setStyle(R.thr, 'width', (rpm * 100).toFixed(0) + '%');
  } else if (kind === 'air') {
    setText(R.boxAs, String(Math.round(speed)));
    setStyle(R.tapeL, 'transform', `translateY(${(-((400 - speed) / 10 * 20) - 10).toFixed(1)}px)`);
  }
}

function drawShift(rpm) {
  if (!R.shl) return;
  const v = state.veh, combustion = v.type === 'car' || v.type === 'bike';
  const on = state.settings.shiftLight && combustion;
  const launch = on && v.speed < .5 && rpm > .55;
  const bar = R.kind === 'tech' || R.kind === 'linear' || R.kind === 'hud' || R.kind === 'dial';
  const n = 0;
  setCls(R.root, 'redline', on && !launch && rpm > .96);
  if (R._led !== n) { R._led = n; R.leds.forEach((l, i) => setCls(l, 'on', i < n)); }
  setCls(R.shl, 'show', n > 0 || launch);
  setCls(R.shl, 'launch', launch);
  setCls(R.shl, 'max', !launch && rpm > .96 && on);
}

function startTween() {
  if (tw.run) return;
  tw.run = true;
  tw.last = performance.now();
  requestAnimationFrame(stepTween);
}

function stepTween(now) {
  const dt = Math.min(.1, (now - tw.last) / 1000);
  tw.last = now;
  const k = Math.min(1, dt * 14);
  tw.sp += (tw.tsp - tw.sp) * k;
  tw.rpm += (tw.trpm - tw.rpm) * Math.min(1, dt * 18);
  drawGauge();
  if (!state.veh || (Math.abs(tw.tsp - tw.sp) < .05 && Math.abs(tw.trpm - tw.rpm) < .002)) {
    tw.sp = tw.tsp; tw.rpm = tw.trpm;
    drawGauge();
    tw.run = false;
    return;
  }
  requestAnimationFrame(stepTween);
}
function crashPulse(force) {
  if (!state.settings.crashPulse || stage.classList.contains('cinematic')) return;
  const c = $('#crash');
  c.style.setProperty('--f', clamp(force, .3, 1).toFixed(2));
  c.classList.remove('hit');
  void c.offsetWidth;
  c.classList.add('hit');
  for (const w of [W.speedo, W.wind]) {
    const inner = w.firstElementChild;
    if (!inner) continue;
    inner.classList.remove('shake');
    void inner.offsetWidth;
    inner.classList.add('shake');
  }
}

let flashTimer;
function flash(iconName, text) {
  const f = $('#flash');
  f.innerHTML = ico(iconName) + `<span>${text}</span>`;
  f.classList.add('show');
  clearTimeout(flashTimer);
  flashTimer = setTimeout(() => f.classList.remove('show'), 1600);
}

function setCinematic(on) {
  stage.classList.toggle('cinematic', on);
  stage.classList.toggle('bars', on && state.settings.cinematicBars);
  if (IS_GAME) post('cinematic', { on });
}
function hexA(hex, a) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || '');
  if (!m) return `rgba(239,68,68,${a})`;
  const n = parseInt(m[1], 16);
  return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`;
}
function applyForced(s) {
  for (const f of state.forced || []) {
    let t = s;
    for (let i = 0; i < f.path.length - 1; i++) {
      if (typeof t[f.path[i]] !== 'object' || !t[f.path[i]]) t[f.path[i]] = {};
      t = t[f.path[i]];
    }
    t[f.path[f.path.length - 1]] = f.value;
  }
  return s;
}
function applySettings(s) {
  state.settings = applyForced(merge(DEFAULTS, s));
  if (state.mapFixed && (!state.mapMovable || sameMap(state.settings.layout.map, JSON.parse(BUILTIN_MAP)))) state.settings.layout.map = deep(DEFAULTS.layout.map);
  const root = document.documentElement.style;
  root.setProperty('--accent', state.settings.colors.accent);
  root.setProperty('--accent-soft', hexA(state.settings.colors.accent, .14));
  root.setProperty('--accent-mid', hexA(state.settings.colors.accent, .3));
  stage.classList.toggle('theme-float', state.settings.theme !== 'panel');
  stage.classList.toggle('theme-inst', state.settings.theme === 'instrument');
  for (const k of STATS) { const c = state.settings.colors[k]; if (c) root.setProperty('--c-' + k, c); }
  speedoKey = null; R = null;
  fitStage();
  for (const n in W) applyLayout(n);
  renderAll();
}

function renderAll() {
  renderStatus(); renderVoice(); renderInfo(); renderCompass(); renderStreet(); renderMap(); renderSpeedo(); renderNav(); renderWeapon();
}

let blinkTimer = null;
function syncBlink() {
  const need = !!state.veh?.indicators;
  if (need && !blinkTimer) blinkTimer = setInterval(renderSpeedo, 200);
  if (!need && blinkTimer) { clearInterval(blinkTimer); blinkTimer = null; }
}

const BUILTIN_MAP = JSON.stringify(DEFAULTS.layout.map);
const sameMap = (a, b) => a && b && ['ax', 'ay', 'dx', 'dy', 's'].every(k => a[k] === b[k]);
function setMapFrame(f) {
  const prev = DEFAULTS.layout.map, cur = state.settings?.layout?.map;
  const untouched = !cur || sameMap(cur, prev) || sameMap(cur, JSON.parse(BUILTIN_MAP));
  DEFAULTS.layout.map = Object.assign({}, DEFAULTS.layout.map, { ax: 0, ay: 1, dx: f.dx, dy: f.dy, s: 1 });
  W.map.style.setProperty('--mw', f.w + 'px');
  W.map.style.setProperty('--mh', f.h + 'px');
  state.mapMovable = !!f.movable;
  state.mapCircle = !!f.circle;
  if (state.settings) renderMap();
  if (untouched && state.settings) state.settings.layout.map = deep(DEFAULTS.layout.map);
  W.map.classList.toggle('lockedw', !f.movable);
  state.mapFixed = true;
}

const handlers = {
  features(d) { Object.assign(state.features, d.data || {}); if (state.settings) renderMap(); },
  mapFrame(d) {
    setMapFrame(d.data);
    if (state.settings && !state.mapMovable) state.settings.layout.map = deep(DEFAULTS.layout.map);
    if (state.settings) applyLayout('map');
  },
  init(message) {
    const d = message.data || message;
    if (d.defaults) { const nd = merge(DEFAULTS, d.defaults); for (const k in nd) DEFAULTS[k] = nd[k]; }
    if (d.mapFrame) setMapFrame(d.mapFrame);
    if (d.locale) {
      Object.assign(L, d.locale.ui || {});
      if (window.HUD.MenuT) { Object.assign(window.HUD.MenuT, d.locale.menu || {}); window.HUD.Menu?.relabel(); }
    }
    state.features = d.features || {};
    state.locks = d.locks || {};
    state.forced = Array.isArray(d.forced) ? d.forced : [];
    document.body.style.display = '';
    applySettings(d.settings || {});
  },
  settings(message) { const d = message.data || message; applySettings(d.settings || {}); },
  status(d) { Object.assign(state.status, d.data); renderStatus(); },
  customStatus(d) {
    const c = d.data;
    if (c.remove) {
      delete state.custom[c.id];
      W.status.querySelector(`[data-k="x-${CSS.escape(c.id)}"]`)?.remove();
      return;
    }
    state.custom[c.id] = Object.assign(state.custom[c.id] || {}, c);
    renderStatus();
  },
  voice(d) { Object.assign(state.voice, d.data); renderVoice(); },
  info(d) { Object.assign(state.info, d.data); renderInfo(); },
  location(d) {
    Object.assign(state.loc, d.data);
    if ('heading' in d.data) renderCompass();
    if ('street' in d.data || 'zone' in d.data || 'postal' in d.data || 'postalDist' in d.data) renderStreet();
    if (R && (R.kind === 'boat' || R.kind === 'air')) renderSpeedo();
  },
  nav(d) { state.nav = d.data; renderNav(); },
  vehicle(d) {
    const prevType = state.veh?.type;
    state.veh = d.data;
    state.onFoot = !d.data;
    if (prevType !== d.data?.type) { speedoKey = null; R = null; for (const n in W) applyLayout(n); renderMap(); }
    renderSpeedo(); syncBlink(); renderBelt();
    applyLayout('weapon');
    if (state.nav) renderNav();
  },
  trip(d) { tripPop(d.data.kind, d.data.value); },
  crash(d) { crashPulse(d.data?.force ?? .6); },
  weapon(d) { state.weapon = d.data || null; renderWeapon(); applyLayout('weapon'); },
  flash(d) { const f = d.data || d; flash(f.icon || 'alert-triangle', f.text); },
  belt(d) {
    if (d.data?.key) state.beltKey = d.data.key;
    if (state.features.beltSounds !== false) Sfx.belt(!!d.data?.on);
  },
  cinematic(d) { setCinematic(d.on); },
  visible(d) { document.body.style.display = d.on ? '' : 'none'; },
};

function boot() {
  W.compass = buildCompass();
  W.street = buildStreet();
  W.nav = buildNav();
  W.info = buildInfo();
  W.map = buildMap();
  W.status = buildStatus();
  W.voice = buildVoice();
  W.trip = buildTrip();
  W.weapon = buildWeapon();
  W.belt = el(`<div class="w beltwarn off">${ico('seatbelt')}<span class="bk"></span><span class="bt"></span></div>`);
  W.speedo = el(`<div class="w spdwrap"></div>`);
  W.wind = el(`<div class="w spdwrap windwrap off"></div>`);
  for (const n in W) { W[n].dataset.w = n; stage.appendChild(W[n]); }
  stage.insertAdjacentHTML('afterbegin', '<div class="scrim bl"></div><div class="scrim br"></div><div class="scrim tr"></div><div class="scrim tc"></div>');
  stage.insertAdjacentHTML('beforeend', '<div class="letterbox top"></div><div class="letterbox bottom"></div><div id="flash" class="flash cutp"></div><div id="crash"></div>');
  applySettings({});
  fitStage();
  if (IS_GAME) { document.body.style.display = 'none'; post('ready'); }
}

window.addEventListener('message', (e) => { const d = e.data; if (d && handlers[d.action]) handlers[d.action](d); });
window.HUD = { state, handlers, applySettings, relayout: () => { for (const n in W) applyLayout(n); }, setCinematic, flash, DEFAULTS, W, merge, SPEEDOS };
boot();
