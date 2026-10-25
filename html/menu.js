(() => {
  const H = window.HUD;
  const S = () => H.state.settings;
  const T = Object.assign({
    title: 'HUD', subtitle: 'Settings', close: 'Close', esc: 'ESC',
    s_speedo: 'Speedometer', s_speedo_d: 'Pick a style for each vehicle type.',
    s_status: 'Look & status', s_status_d: 'Theme, status style and what shows up.',
    s_map: 'Map & navigation', s_map_d: 'Minimap, compass, street names and directions.',
    s_info: 'Player info', s_info_d: 'Choose what shows in the top corner.',
    s_colors: 'Colors', s_colors_d: 'Accent and status colors.',
    s_layout: 'Layout', s_layout_d: 'Move, resize and fade every part of the HUD.',
    s_profiles: 'Profiles', s_profiles_d: 'Save layouts and share them with a code.',
    s_modes: 'Modes', s_modes_d: 'Streamer and cinematic options.',
    locked: 'Set by server', car: 'Car', ev: 'Electric', bike: 'Motorcycle',
    tech: 'Tech panel', analog: 'Analog', cluster: 'Cluster', apex: 'Apex', linear: 'Linear', hud: 'Windshield',
    units: 'Units', fuel_display: 'Fuel readout', percent: 'Percent', range: 'Range left',
    trip: 'Trip pops', trip_d: '0-60 times and new top speeds', odo: 'Odometer', odo_d: 'Mileage from jg-vehiclemileage',
    shift: 'Shift light', shift_d: 'Rev lights and launch indicator', crash: 'Crash pulse', crash_d: 'Screen flash and damage view on hard hits',
    theme: 'Theme', instrument: 'Instrument', float: 'Float', panel: 'Panel', status_style: 'Status style', gauges: 'Gauges', dial: 'Instrument',
    slim: 'Slim', rings: 'Rings', bars_style: 'Bars', minimal: 'Minimal',
    vitals: 'Health & armor on map', vitals_d: 'Thin bars under the minimap',
    autohide: 'Auto-hide full stats', autohide_d: 'Stats show as soon as they drop below full',
    voice: 'Voice indicator', voice_d: 'Mic, range and radio channel',
    weapon: 'Weapon', weapon_d: 'Weapon name and ammo when armed',
    shape: 'Minimap shape', square: 'Square', circle: 'Circle',
    onfoot: 'Map on foot', onfoot_d: 'Show the minimap when walking',
    compass: 'Compass', compass_d: 'Heading strip at the top',
    street: 'Street names', street_d: 'Street, crossing and area',
    postal: 'Nearest postal', postal_d: 'Postal code and distance under the street name',
    navi: 'Navigation', navi_d: 'Next turn and distance to waypoint',
    auto: 'Auto', always: 'Always', off: 'Off',
    show_id: 'Server ID', show_job: 'Job', show_time: 'Time & date', show_cash: 'Cash', show_bank: 'Bank',
    accent: 'Accent color', stat_colors: 'Status colors',
    health: 'Health', armor: 'Armor', hunger: 'Hunger', thirst: 'Thirst', stress: 'Stress', stamina: 'Stamina', oxygen: 'Oxygen',
    edit_layout: 'Edit layout', edit_layout_d: 'Drag to move, scroll to resize. Changes save when you press Done.',
    ultrawide: 'Ultrawide screens', spread: 'Use full width', center: 'Keep centered',
    ui_scale: 'HUD size', reset_layout: 'Reset layout', reset_colors: 'Reset colors',
    profile_name: 'Profile name', save: 'Save', load: 'Load', delete: 'Delete', no_profiles: 'No saved profiles yet.',
    share: 'Share code', share_d: 'Anyone can import your current HUD setup with this code.',
    generate: 'Get code', copy: 'Copy', copied: 'Copied', import: 'Import a code', import_ph: 'Enter a code', apply: 'Apply',
    bad_code: 'That code was not found.', imported: 'Profile imported',
    streamer: 'Streamer mode', streamer_d: 'Blur money and server ID',
    cinematic: 'Cinematic mode', cinematic_d: 'Hide the HUD for clips', bars: 'Letterbox bars', bars_d: 'Black bars in cinematic mode',
    toggle_cine: 'Toggle cinematic now', done: 'Done', reset_widget: 'Reset', snap: 'Snap', scale: 'Size', opacity: 'Opacity',
    w_compass: 'Compass', w_street: 'Street', w_nav: 'Navigation', w_info: 'Player info', w_map: 'Minimap', w_status: 'Status',
    w_voice: 'Voice', w_speedo: 'Speedometer', w_wind: 'Windshield', w_weapon: 'Weapon', w_belt: 'Seatbelt warning', w_trip: 'Trip pops',
  }, window.HUD_LOCALE_MENU || {});

  const ico = (n) => `<span class="ico">${ICONS[n] || ''}</span>`;
  const el = (h) => { const t = document.createElement('template'); t.innerHTML = h.trim(); return t.content.firstElementChild; };
  const IS_GAME = typeof GetParentResourceName === 'function';
  const post = (n, d = {}) => IS_GAME ? fetch(`https://${GetParentResourceName()}/${n}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) }).then(r => r.json()).catch(() => null) : Promise.resolve(null);

  let locks = {}, section = 'speedo', vtab = 'car', profiles = [], code = '';
  const locked = (k) => Array.isArray(k) ? k.some(x => !!locks[x]) : !!locks[k];

  const SECTIONS = [
    ['speedo', 'gauge'], ['status', 'heart'], ['map', 'map'], ['info', 'user-circle'],
    ['colors', 'palette'], ['layout', 'layout'], ['profiles', 'device-floppy'], ['modes', 'movie'],
  ];

  const root = el(`<div id="menu"><div class="shade"></div><div class="mw">
    <div class="rail"><div class="brand"><i class="mk">${ico('gauge')}</i><b>${T.title}</b></div><div class="navs"></div><div class="grow"></div>
      <div class="foot"><span>${T.close}</span><kbd>${T.esc}</kbd></div></div>
    <div class="body"><div class="head"><div><h2></h2><p></p></div><button class="x" type="button" aria-label="${T.close}">${ico('x')}</button></div><div class="scroll"></div></div>
  </div></div>`);
  document.getElementById('host').appendChild(root);
  const navs = root.querySelector('.navs'), scroll = root.querySelector('.scroll');
  for (const [k, i] of SECTIONS) {
    const b = el(`<button type="button" class="nav-i" data-s="${k}">${ico(i)}<span>${T['s_' + k]}</span></button>`);
    b.onclick = () => { section = k; render(); };
    navs.appendChild(b);
  }
  root.querySelector('.x').onclick = () => close();
  root.querySelector('.shade').onclick = () => close();

  let saveT;
  function set(patch) {
    H.applySettings(H.merge(S(), patch));
    clearTimeout(saveT);
    saveT = setTimeout(save, 350);
    render();
  }
  function save() {
    if (IS_GAME) post('saveSettings', { settings: S() });
    else try { localStorage.setItem('vexxd_hud_settings', JSON.stringify(S())); } catch (e) {}
  }

  const lockTag = (k) => locked(k) ? `<span class="lock">${ico('lock')}${T.locked}</span>` : '';

  function opts(key, list, cur, onPick, lockKey) {
    const g = el(`<div class="row-opts"></div>`);
    for (const [v, label, icn] of list) {
      const b = el(`<button type="button" class="opt ${cur === v ? 'on' : ''}" ${locked(lockKey || key) ? 'disabled' : ''}>${icn ? ico(icn) : ''}${label}</button>`);
      b.onclick = () => onPick(v);
      g.appendChild(b);
    }
    return g;
  }

  function group(label, content, lockKey) {
    const g = el(`<div class="mg"><div class="lbl">${label}${lockKey ? lockTag(lockKey) : ''}</div></div>`);
    if (Array.isArray(content)) content.forEach(c => g.appendChild(c)); else g.appendChild(content);
    return g;
  }

  function toggles(items) {
    const box = el(`<div class="tgl-list"></div>`);
    for (const [label, desc, get, setv, lockKey] of items) {
      const dis = locked(lockKey);
      const t = el(`<div class="tgl ${get() ? 'on' : ''} ${dis ? 'dis' : ''}" role="switch" tabindex="0" aria-checked="${!!get()}"><div class="t"><b>${label}</b><span>${[].concat(lockKey || []).some(k => k.startsWith('f_') && locks[k]) ? T.locked : desc || ''}</span></div><span class="sw"></span></div>`);
      const go = () => { if (!dis) setv(!get()); };
      t.onclick = go;
      t.onkeydown = (e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); go(); } };
      box.appendChild(t);
    }
    return box;
  }

  function slider(label, min, max, step, val, fmt, onInput) {
    const s = el(`<div class="sl"><input type="range" min="${min}" max="${max}" step="${step}" value="${val}" aria-label="${label}"><span class="v">${fmt(val)}</span></div>`);
    const i = s.querySelector('input');
    i.oninput = () => { s.querySelector('.v').textContent = fmt(+i.value); onInput(+i.value); };
    return s;
  }

  function paintThumb(r, kind) {
    r.querySelectorAll('.num.sp').forEach(n => n.innerHTML = kind === 'linear' || kind === 'analog' || kind === 'cluster' || kind === 'hud' || kind === 'dial' ? '88' : '<span class="dim">0</span>88');
    r.querySelectorAll('.unit').forEach(n => n.textContent = 'MPH');
    r.querySelectorAll('.gear').forEach(n => n.textContent = '3');
    r.querySelectorAll('.pct').forEach(n => n.textContent = '64%');
    r.querySelectorAll('.seg i').forEach((s, i) => s.classList.toggle('on', i < 22));
    r.querySelectorAll('.fuel .fb i').forEach((s, i) => s.classList.toggle('on', i < 7));
    const nd = r.querySelectorAll('.needle');
    if (kind === 'analog') nd[0].style.transform = 'rotate(254deg)';
    if (kind === 'cluster') { nd[0].style.transform = 'rotate(290deg)'; nd[1].style.transform = 'rotate(254deg)'; }
    const rf = r.querySelector('.rpmfill'); if (rf) rf.style.strokeDashoffset = 35;
    const af = r.querySelector('.fill'); if (af) af.style.strokeDashoffset = 32;
    const sf = r.querySelector('.spf'); if (sf) { sf.style.strokeDashoffset = 56; r.querySelector('.rpmf').style.strokeDashoffset = 40; }
    const rl = r.querySelector('.rl i, .hrpm i'); if (rl) rl.style.width = '66%';
    r.querySelectorAll('.hnav').forEach(n => { n.querySelector('.turn').innerHTML = ico('corner-up-right'); n.querySelector('.nd').textContent = '250 ft'; });
    const fb = r.querySelector('.fl .fb i, .fuelline i'); if (fb) fb.style.width = '64%';
    r.querySelectorAll('.lamp.belt').forEach(n => n.classList.add('ok'));
    r.querySelectorAll('.lamp.lights, .lamp.engine').forEach(n => n.classList.add('on'));
  }

  const THUMB_SCALE = { dial: .36, tech: .44, analog: .36, cluster: .3, apex: .34, linear: .4, hud: .36 };
  function speedoCards() {
    const box = el(`<div class="cards"></div>`);
    const cur = S().vehicle?.[vtab]?.speedo || S().speedo;
    for (const k of ['dial', 'tech', 'analog', 'cluster', 'apex', 'linear', 'hud']) {
      const c = el(`<div class="card ${cur === k ? 'on' : ''} ${locked('speedo') ? 'dis' : ''}" tabindex="0" role="radio" aria-checked="${cur === k}">
        <div class="thumb"><div class="inner ${S().theme !== 'panel' ? 'theme-float' : ''} ${S().theme === 'instrument' ? 'theme-inst' : ''}"></div></div><div class="cap"><span>${T[k]}</span>${ico('check')}</div></div>`);
      const inner = c.querySelector('.inner');
      inner.innerHTML = H.SPEEDOS[k](200, 'mph');
      inner.style.transform = `translate(-50%, -50%) scale(${THUMB_SCALE[k]})`;
      paintThumb(inner.firstElementChild, k);
      const pick = () => { if (!locked('speedo')) set({ vehicle: { [vtab]: { speedo: k } } }); };
      c.onclick = pick;
      c.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } };
      box.appendChild(c);
    }
    return box;
  }

  const ACCENTS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f3f4f6'];
  const STATC = { health: '#f87171', armor: '#60a5fa', hunger: '#fbbf24', thirst: '#38bdf8', stress: '#a78bfa', stamina: '#34d399', oxygen: '#67e8f9' };
  const STATI = { health: 'heart', armor: 'shield', hunger: 'meat', thirst: 'droplet', stress: 'brain', stamina: 'run', oxygen: 'lungs' };

  const VIEWS = {
    speedo() {
      return [
        group('', opts('vtab', [['car', T.car, 'car'], ['ev', T.ev, 'bolt'], ['bike', T.bike, 'motorbike']], vtab, v => { vtab = v; render(); }, '_none')),
        group(T.s_speedo, speedoCards(), 'speedo'),
        group(T.units, opts('unit', [['mph', 'MPH'], ['kmh', 'KM/H']], S().unit, v => set({ unit: v })), 'unit'),
        group(T.fuel_display, opts('fuelDisplay', [['percent', T.percent], ['range', T.range]], S().fuelDisplay, v => set({ fuelDisplay: v }))),
        toggles([
          [T.shift, T.shift_d, () => S().shiftLight, v => set({ shiftLight: v })],
          [T.crash, T.crash_d, () => S().crashPulse, v => set({ crashPulse: v })],
          [T.trip, T.trip_d, () => S().tripPops, v => set({ tripPops: v })],
        ].concat(H.state.features?.mileage ? [[T.odo, T.odo_d, () => S().odometer, v => set({ odometer: v })]] : [])),
      ];
    },
    status() {
      return [
        group(T.theme, opts('theme', [['instrument', T.instrument], ['float', T.float], ['panel', T.panel]], S().theme, v => set({ theme: v })), 'theme'),
        group(T.status_style, opts('statusStyle', [['gauges', T.gauges], ['slim', T.slim], ['rings', T.rings], ['bars', T.bars_style], ['minimal', T.minimal]], S().statusStyle, v => set({ statusStyle: v })), 'statusStyle'),
        toggles([
          [T.vitals, T.vitals_d, () => S().vitalsOnMap, v => set({ vitalsOnMap: v }), 'statusStyle'],
          [T.autohide, T.autohide_d, () => S().autoHide, v => set({ autoHide: v })],
          [T.voice, T.voice_d, () => S().show.voice, v => set({ show: { voice: v } }), 'f_voice'],
          [T.weapon, T.weapon_d, () => S().weaponHud, v => set({ weaponHud: v }), 'f_weapon'],
        ]),
      ];
    },
    map() {
      return [
        group(T.shape, (() => { const g = opts('mapShape', [['square', T.square], ['circle', T.circle]], S().mapShape, v => set({ mapShape: v })); if (H.state.features?.circle === false) g.lastElementChild.disabled = true; return g; })(), 'map'),
        toggles([
          [T.onfoot, T.onfoot_d, () => S().mapOnFoot, v => set({ mapOnFoot: v }), 'map'],
          [T.compass, T.compass_d, () => S().compass, v => set({ compass: v }), 'f_compass'],
          [T.street, T.street_d, () => S().street, v => set({ street: v }), 'f_street'],
          [T.postal, T.postal_d, () => S().postal, v => set({ postal: v }), 'f_postal'],
          [T.navi, T.navi_d, () => S().nav, v => set({ nav: v }), 'f_navigation'],
        ]),
      ];
    },
    info() {
      const sh = S().show;
      return [toggles([
        [T.show_cash, '', () => sh.cash, v => set({ show: { cash: v } }), ['info', 'f_cash']],
        [T.show_bank, '', () => sh.bank, v => set({ show: { bank: v } }), ['info', 'f_bank']],
        [T.show_job, '', () => sh.job, v => set({ show: { job: v } }), ['info', 'f_job']],
        [T.show_id, '', () => sh.id, v => set({ show: { id: v } }), ['info', 'f_id']],
        [T.show_time, '', () => sh.time, v => set({ show: { time: v } }), ['info', 'f_time']],
      ])];
    },
    colors() {
      const cur = S().colors.accent;
      const sw = el(`<div class="swatches"></div>`);
      for (const c of ACCENTS) {
        const b = el(`<button type="button" class="${c === cur ? 'on' : ''}" style="--c:${c}" aria-label="${c}" ${locked('colors') ? 'disabled' : ''}></button>`);
        b.onclick = () => set({ colors: { accent: c } });
        sw.appendChild(b);
      }
      const pick = el(`<input type="color" value="${cur}" aria-label="${T.accent}" ${locked('colors') ? 'disabled' : ''}>`);
      pick.onchange = () => set({ colors: { accent: pick.value } });
      const hex = el(`<input class="hex" value="${cur}" maxlength="7" aria-label="${T.accent}" ${locked('colors') ? 'disabled' : ''}>`);
      hex.onchange = () => { if (/^#[0-9a-f]{6}$/i.test(hex.value)) set({ colors: { accent: hex.value } }); };
      sw.append(pick, hex);
      const grid = el(`<div class="stat-colors"></div>`);
      for (const k in STATC) {
        const v = S().colors[k] || STATC[k];
        const r = el(`<label class="sc" style="--c:${v}">${ico(STATI[k])}<span>${T[k]}</span><input type="color" value="${v}" aria-label="${T[k]}" ${locked('colors') ? 'disabled' : ''}></label>`);
        r.querySelector('input').onchange = (e) => set({ colors: { [k]: e.target.value } });
        grid.appendChild(r);
      }
      const reset = el(`<button type="button" class="opt" ${locked('colors') ? 'disabled' : ''}>${ico('refresh')}${T.reset_colors}</button>`);
      reset.onclick = () => { const c = { accent: H.DEFAULTS.colors.accent }; for (const k in STATC) c[k] = STATC[k]; set({ colors: c }); };
      return [group(T.accent, sw, 'colors'), group(T.stat_colors, grid), el('<div></div>').appendChild(reset).parentElement];
    },
    layout() {
      const edit = el(`<button type="button" class="opt primary" ${locked('layout') ? 'disabled' : ''}>${ico('arrows-move')}${T.edit_layout}</button>`);
      edit.onclick = () => Editor.enter();
      const reset = el(`<button type="button" class="opt danger" ${locked('layout') ? 'disabled' : ''}>${ico('refresh')}${T.reset_layout}</button>`);
      reset.onclick = () => set({ layout: H.DEFAULTS.layout, uiScale: 1 });
      return [
        group(T.edit_layout, [el(`<p class="hint">${T.edit_layout_d}</p>`), el('<div class="inline"></div>')], 'layout'),
        group(T.ultrawide, opts('ultrawide', [['spread', T.spread], ['center', T.center]], S().ultrawide, v => set({ ultrawide: v })), 'layout'),
        group(T.ui_scale, slider(T.ui_scale, .7, 1.4, .05, S().uiScale || 1, v => Math.round(v * 100) + '%', v => {
          H.applySettings(H.merge(S(), { uiScale: v })); clearTimeout(saveT); saveT = setTimeout(save, 350);
        }), 'layout'),
      ].map((g, i) => { if (i === 0) g.querySelector('.inline').append(edit, reset); return g; });
    },
    profiles() {
      const name = el(`<input class="input" maxlength="24" placeholder="${T.profile_name}" aria-label="${T.profile_name}">`);
      const sv = el(`<button type="button" class="opt primary">${ico('device-floppy')}${T.save}</button>`);
      sv.onclick = async () => {
        const n = name.value.trim(); if (!n) return name.focus();
        profiles = profiles.filter(p => p.name !== n);
        profiles.unshift({ name: n, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), settings: S() });
        await storeProfiles({ op: 'save', name: n, date: profiles[0].date, settings: S() });
        render();
      };
      const row = el('<div class="inline"></div>'); row.append(name, sv);
      const list = el(`<div class="plist"></div>`);
      if (!profiles.length) list.appendChild(el(`<div class="empty">${T.no_profiles}</div>`));
      for (const p of profiles) {
        const it = el(`<div class="pitem">${ico('layout-dashboard')}<span class="n"></span><span class="d">${p.date || ''}</span><button type="button" class="opt">${T.load}</button><button type="button" class="opt danger" aria-label="${T.delete}">${ico('trash')}</button></div>`);
        it.querySelector('.n').textContent = p.name;
        const [ld, del] = it.querySelectorAll('button');
        ld.onclick = async () => {
          // Apply the selected profile locally, then explicitly persist it as active
          // so Lua/MySQL restores the same HUD on the next connection.
          set(p.settings);
          if (IS_GAME) {
            const r = await post('profiles', { op: 'load', name: p.name });
            if (r?.list) { profiles = r.list; render(); }
          } else {
            try { localStorage.setItem('vexxd_hud_settings', JSON.stringify(S())); } catch (e) {}
            const idx = profiles.findIndex(x => x.name === p.name);
            if (idx > 0) profiles.unshift(profiles.splice(idx, 1)[0]);
            try { localStorage.setItem('vexxd_hud_profiles', JSON.stringify(profiles)); } catch (e) {}
          }
        };
        del.onclick = async () => { profiles = profiles.filter(x => x !== p); await storeProfiles({ op: 'delete', name: p.name }); render(); };
        list.appendChild(it);
      }
      const codeBox = el(`<div class="code"><span class="cv">${code || '— — — — — —'}</span><span class="inline"></span></div>`);
      const gen = el(`<button type="button" class="opt">${ico('share')}${T.generate}</button>`);
      gen.onclick = async () => {
        if (IS_GAME) { const r = await post('shareCode', { settings: S() }); code = r?.code || ''; }
        else { code = 'VX-' + Math.random().toString(36).slice(2, 8).toUpperCase(); try { localStorage.setItem('vexxd_code_' + code, JSON.stringify(S())); } catch (e) {} }
        render();
      };
      const cp = el(`<button type="button" class="opt" ${code ? '' : 'disabled'}>${ico('copy')}${T.copy}</button>`);
      cp.onclick = () => {
        const done = () => { cp.innerHTML = ico('check') + T.copied; };
        if (navigator.clipboard) navigator.clipboard.writeText(code).then(done).catch(() => { const r = document.createRange(); r.selectNodeContents(codeBox.querySelector('.cv')); getSelection().removeAllRanges(); getSelection().addRange(r); });
        if (IS_GAME) post('copy', { text: code });
      };
      codeBox.querySelector('.inline').append(gen, cp);
      const imp = el(`<input class="input" maxlength="12" placeholder="${T.import_ph}" aria-label="${T.import}">`);
      const ap = el(`<button type="button" class="opt">${ico('download')}${T.apply}</button>`);
      const msg = el(`<p class="hint" aria-live="polite"></p>`);
      ap.onclick = async () => {
        const c = imp.value.trim().toUpperCase(); if (!c) return;
        let st = null;
        if (IS_GAME) st = (await post('importCode', { code: c }))?.settings;
        else try { st = JSON.parse(localStorage.getItem('vexxd_code_' + c) || 'null'); } catch (e) {}
        if (!st) { msg.textContent = T.bad_code; return; }
        set(st); msg.textContent = T.imported;
      };
      const irow = el('<div class="inline"></div>'); irow.append(imp, ap);
      const out = [group(T.profile_name, row), list];
      if (H.state.features?.shareCodes !== false) out.push(group(T.share, [el(`<p class="hint">${T.share_d}</p>`), codeBox]), group(T.import, [irow, msg]));
      return out;
    },
    modes() {
      const cine = el(`<button type="button" class="opt">${ico('movie')}${T.toggle_cine}</button>`);
      cine.onclick = () => { close(); H.setCinematic(!document.getElementById('stage').classList.contains('cinematic')); };
      return [
        toggles([
          [T.streamer, T.streamer_d, () => S().streamer, v => set({ streamer: v })],
          [T.bars, T.bars_d, () => S().cinematicBars, v => set({ cinematicBars: v })],
        ]),
        group(T.cinematic, [el(`<p class="hint">${T.cinematic_d}</p>`), el('<div></div>').appendChild(cine).parentElement]),
      ];
    },
  };

  async function storeProfiles(op) {
    if (IS_GAME) { const r = await post('profiles', op); if (r?.list) profiles = r.list; return; }
    try { localStorage.setItem('vexxd_hud_profiles', JSON.stringify(profiles)); } catch (e) {}
  }

  function render() {
    navs.querySelectorAll('.nav-i').forEach(b => b.classList.toggle('on', b.dataset.s === section));
    root.querySelector('.head h2').textContent = T['s_' + section];
    root.querySelector('.head p').textContent = T['s_' + section + '_d'];
    const top = scroll.scrollTop;
    scroll.innerHTML = '';
    for (const n of VIEWS[section]()) scroll.appendChild(n);
    scroll.scrollTop = top;
  }

  async function open(data) {
    if (data?.locks) locks = data.locks;
    if (IS_GAME) { const r = await post('profiles', { op: 'list' }); profiles = r?.list || []; }
    else try { profiles = JSON.parse(localStorage.getItem('vexxd_hud_profiles') || '[]'); } catch (e) { profiles = []; }
    if (['car', 'ev', 'bike'].includes(H.state.veh?.type)) vtab = H.state.veh.type;
    root.classList.add('open');
    render();
  }

  function close() {
    if (!root.classList.contains('open')) return;
    root.classList.remove('open');
    clearTimeout(saveT); save();
    post('close');
  }
  const Editor = (() => {
    const stage = document.getElementById('stage');
    const tool = el(`<div class="etool">
      <div class="nm"><small>${T.s_layout}</small><span class="wn">—</span></div><span class="sep"></span>
      <div class="sl"><span class="k">${T.scale}</span><input type="range" class="es" min=".5" max="1.6" step=".05" aria-label="${T.scale}"></div>
      <div class="sl"><span class="k">${T.opacity}</span><input type="range" class="eo" min=".2" max="1" step=".05" aria-label="${T.opacity}"></div><span class="sep"></span>
      <button type="button" class="opt esnap">${ico('grid-dots')}${T.snap}</button>
      <button type="button" class="opt eres">${ico('arrow-back-up')}${T.reset_widget}</button>
      <button type="button" class="opt primary edone">${ico('check')}${T.done}</button>
    </div>`);
    const grid = el(`<div class="grid"></div>`);
    stage.append(grid, tool);
    let on = false, sel = null, snap = true, drag = null, backup = null;

    const lay = (n) => S().layout[n];
    const k = () => stage.getBoundingClientRect().height / 1080;

    function select(n) {
      sel = n;
      stage.querySelectorAll('.w[data-w]').forEach(w => w.classList.toggle('sel', w.dataset.w === n));
      tool.querySelector('.wn').textContent = n ? T['w_' + n] : '—';
      const l = n && lay(n);
      tool.querySelector('.es').value = l ? l.s : 1;
      tool.querySelector('.eo').value = l ? l.o : 1;
    }

    function write(n, patch) {
      const cur = Object.assign({}, lay(n), patch);
      H.applySettings(H.merge(S(), { layout: { [n]: cur } }));
    }

    function enter() {
      root.classList.remove('open');
      on = true;
      backup = { veh: H.state.veh, nav: H.state.nav };
      if (!H.state.veh) H.handlers.vehicle({ data: { type: 'car', speed: 22, rpm: .5, gear: '3', fuel: 64, battery: 80, seatbelt: true, lights: 1, engineOn: true, engineHealth: 1000 } });
      if (!H.state.nav) H.handlers.nav({ data: { dir: 'right', next: 320, total: 2400 } });
      backup.weapon = H.state.weapon;
      if (!H.state.weapon) H.handlers.weapon({ data: { label: 'Pistol', clip: 9, max: 12, total: 48 } });
      stage.classList.add('editing');
      H.relayout();
      stage.querySelectorAll('.w[data-w]').forEach(w => { w.dataset.label = T['w_' + w.dataset.w] || w.dataset.w; });
      stage.style.setProperty('--sc', '1');
      select(null);
      tool.querySelector('.esnap').classList.toggle('on', snap);
    }

    function exit() {
      on = false;
      stage.classList.remove('editing');
      H.relayout();
      select(null);
      if (!backup.veh) H.handlers.vehicle({ data: null });
      if (!backup.nav) H.handlers.nav({ data: null });
      if (!backup.weapon) H.handlers.weapon({ data: null });
      clearTimeout(saveT); save();
      section = 'layout';
      root.classList.add('open');
      render();
    }

    stage.addEventListener('pointerdown', (e) => {
      if (!on) return;
      const w = e.target.closest('.w[data-w]');
      if (!w || w.classList.contains('lockedw') || e.target.closest('.etool')) return;
      e.preventDefault();
      const n = w.dataset.w;
      select(n);
      const sr = stage.getBoundingClientRect(), r = w.getBoundingClientRect(), kk = k();
      drag = { n, w, sx: e.clientX, sy: e.clientY, x: (r.left - sr.left) / kk, y: (r.top - sr.top) / kk, wd: r.width / kk, ht: r.height / kk };
      w.classList.add('dragging');
      w.setPointerCapture(e.pointerId);
    });

    stage.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const kk = k(), SW = stage.offsetWidth, SH = 1080;
      let x = drag.x + (e.clientX - drag.sx) / kk, y = drag.y + (e.clientY - drag.sy) / kk;
      x = Math.max(0, Math.min(SW - drag.wd, x)); y = Math.max(0, Math.min(SH - drag.ht, y));
      if (snap) { x = Math.round(x / 8) * 8; y = Math.round(y / 8) * 8; }
      const cx = x + drag.wd / 2, cy = y + drag.ht / 2;
      const ax = cx < SW / 3 ? 0 : cx > SW * 2 / 3 ? 1 : .5, ay = cy < SH / 3 ? 0 : cy > SH * 2 / 3 ? 1 : .5;
      write(drag.n, { ax, ay, dx: Math.round(x + ax * drag.wd - ax * SW), dy: Math.round(y + ay * drag.ht - ay * SH) });
    });

    const end = () => { if (!drag) return; drag.w.classList.remove('dragging'); drag = null; };
    stage.addEventListener('pointerup', end);
    stage.addEventListener('pointercancel', end);

    stage.addEventListener('wheel', (e) => {
      if (!on) return;
      const w = e.target.closest('.w[data-w]');
      if (!w || w.classList.contains('lockedw')) return;
      e.preventDefault();
      select(w.dataset.w);
      const s = Math.max(.5, Math.min(1.6, Math.round((lay(sel).s + (e.deltaY < 0 ? .05 : -.05)) * 100) / 100));
      write(sel, { s });
      tool.querySelector('.es').value = s;
    }, { passive: false });

    tool.querySelector('.es').oninput = (e) => { if (sel) write(sel, { s: +e.target.value }); };
    tool.querySelector('.eo').oninput = (e) => { if (sel) write(sel, { o: +e.target.value }); };
    tool.querySelector('.esnap').onclick = (e) => { snap = !snap; e.currentTarget.classList.toggle('on', snap); };
    tool.querySelector('.eres').onclick = () => { if (sel) write(sel, H.DEFAULTS.layout[sel]); };
    tool.querySelector('.edone').onclick = exit;

    return { enter, exit, get on() { return on; } };
  })();

  window.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (Editor.on) Editor.exit();
    else close();
  });

  function relabel() {
    root.querySelector('.brand b').textContent = T.title;
    root.querySelector('.foot span').textContent = T.close;
    navs.querySelectorAll('.nav-i').forEach(b => { b.querySelector('span:last-child').textContent = T['s_' + b.dataset.s]; });
    if (root.classList.contains('open')) render();
  }

  H.MenuT = T;
  H.handlers.openMenu = (d) => open(d.data || {});
  H.handlers.closeMenu = () => close();
  H.Menu = { open, close, Editor, relabel };
})();
