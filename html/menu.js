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
    supercar: 'Supercar', retro: 'Retro LCD', race: 'Race wheel', muscle: 'Muscle twin', ev_screen: 'EV screen', moto: 'Moto TFT', neon: 'Neon',
    minimal_spd: 'Minimal', chrono: 'Chrono', fighter: 'Fighter', split: 'Split', euro: 'Euro', pixel: 'Pixel', orb: 'Orb', drift: 'Drift', vintage: 'Vintage chrome', truck: 'Big rig', jdm: 'JDM',
    variant: 'Speedometer finish', v_default: 'Default', v_dark: 'Dark', v_glass: 'Glass', v_light: 'Light',
    num_font: 'Number font', f_default: 'Default', f_condensed: 'Condensed', f_wide: 'Wide', f_rounded: 'Rounded', f_mono: 'Mono', f_digital: 'Digital', f_sport: 'Sport', f_block: 'Block',
    hex: 'Hexagons', pills: 'Pills', iconfill: 'Icon fill', numbers: 'Numbers',
    palettes: 'Color presets',
    p_ember: 'Ember', p_ice: 'Ice', p_toxic: 'Toxic', p_sunset: 'Sunset', p_royal: 'Royal', p_gold: 'Gold', p_ocean: 'Ocean', p_sakura: 'Sakura', p_mint: 'Mint', p_mono: 'Mono',
    s_presets: 'Presets', s_presets_d: 'One-click looks. Each sets the speedometer, status style, theme, font and colors.',
    hp_street: 'Street', hp_street_d: 'Clean instrument dial with gauges',
    hp_supercar: 'Supercar', hp_supercar_d: 'Big tach ring and wide numbers',
    hp_track: 'Track', hp_track_d: 'Race wheel display with bars',
    hp_clean: 'Clean', hp_clean_d: 'Just the numbers, nothing extra',
    hp_retro: 'Retro', hp_retro_d: '80s LCD dash in gold',
    hp_cyber: 'Cyber', hp_cyber_d: 'Neon glow with hexagon stats',
    hp_muscle: 'Muscle', hp_muscle_d: 'Chrome twin dials and pills',
    hp_luxury: 'Luxury', hp_luxury_d: 'Chrono watch face in glass',
    hp_arcade: 'Arcade', hp_arcade_d: 'Pixel speedometer and number stats',
    hp_drift: 'Drift', hp_drift_d: 'Tach first, huge gear',
    v_carbon: 'Carbon', v_brushed: 'Brushed metal', v_frosted: 'Frosted', v_neon: 'Neon edge', v_wood: 'Wood',
    parts: 'Speedometer parts', needle_style: 'Needle', n_default: 'Default', n_slim: 'Slim', n_bold: 'Bold', n_glow: 'Glow',
    ticks: 'Tick marks', t_all: 'All', t_major: 'Major only', t_none: 'None',
    show_rpm: 'RPM', show_rpm_d: 'Rev bars, rings and tach needles', show_fuel: 'Fuel', show_fuel_d: 'Fuel bars, gauges and percent',
    show_gear: 'Gear', show_gear_d: 'Gear number and gear boxes', show_lamps: 'Warning lights', show_lamps_d: 'Seatbelt, cruise, headlight and engine lights',
    glow: 'Glow effects', glow_d: 'Neon glows and light shadows on the speedometer',
    part_colors: 'Speedometer colors', part_colors_d: 'Leave a color on Auto to use the speedometer\'s own look.',
    pc_needle: 'Needle', pc_face: 'Face', pc_numbers: 'Numbers', pc_glow: 'Outer glow', auto_color: 'Auto',
    cells: 'Cells', arcs: 'Arcs', tiles: 'Tiles', dots: 'Dots',
    status_layout: 'Status layout', l_row: 'Row', l_column: 'Column', l_grid: 'Grid', l_map: 'Next to minimap',
    f_tech: 'Tech', f_racing: 'Racing', f_poster: 'Poster', f_extended: 'Extended', f_scifi: 'Sci-fi', f_terminal: 'Terminal',
    p_crimson: 'Crimson', p_cyber: 'Cyber', p_desert: 'Desert', p_forest: 'Forest', p_lava: 'Lava', p_steel: 'Steel', p_candy: 'Candy', p_midnight: 'Midnight',
    hp_cruiser: 'Cruiser', hp_cruiser_d: '50s chrome dial with arc stats',
    hp_trucker: 'Trucker', hp_trucker_d: 'Big rig dash in brushed metal',
    hp_touge: 'Touge', hp_touge_d: 'White-face tach and tile stats',
    hp_carbon: 'Carbon', hp_carbon_d: 'Apex ring on carbon fiber',
    hp_walnut: 'Walnut', hp_walnut_d: 'Chrono dial on a wood dash',
    hp_nightrun: 'Night run', hp_nightrun_d: 'Neon edges and dot stats',
    hp_frost: 'Frost', hp_frost_d: 'Frosted minimal with soft pills',
    hp_terminal: 'Terminal', hp_terminal_d: 'Green LCD with cell stats',
    hp_rally: 'Rally', hp_rally_d: 'Race wheel display on carbon',
    hp_stealth: 'Stealth', hp_stealth_d: 'Dark dial, quiet colors',
  }, window.HUD_LOCALE_MENU || {});

  const ico = (n) => `<span class="ico">${ICONS[n] || ''}</span>`;
  const el = (h) => { const t = document.createElement('template'); t.innerHTML = h.trim(); return t.content.firstElementChild; };
  const IS_GAME = typeof GetParentResourceName === 'function';
  const post = (n, d = {}) => IS_GAME ? fetch(`https://${GetParentResourceName()}/${n}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) }).then(r => r.json()).catch(() => null) : Promise.resolve(null);

  let locks = {}, section = 'speedo', vtab = 'car', profiles = [], code = '';
  const so = () => S().speedoOpts || {};
  const locked = (k) => Array.isArray(k) ? k.some(x => !!locks[x]) : !!locks[k];

  const SECTIONS = [
    ['presets', 'layout-dashboard'], ['speedo', 'gauge'], ['status', 'heart'], ['map', 'map'], ['info', 'user-circle'],
    ['colors', 'palette'], ['layout', 'layout'], ['profiles', 'device-floppy'], ['modes', 'movie'],
  ];

  const root = el(`<div id="menu"><div class="shade"></div><div class="mw">
    <div class="rail"><div class="brand"><i class="mk">${ico('gauge')}</i><b>${T.title}</b><span>${T.subtitle}</span></div><div class="navs"></div><div class="grow"></div>
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
    r.querySelectorAll('.num.sp').forEach(n => n.innerHTML = r.classList.contains('gx') || kind === 'linear' || kind === 'analog' || kind === 'cluster' || kind === 'hud' || kind === 'dial' ? '88' : '<span class="dim">0</span>88');
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
    r.querySelectorAll('.odo').forEach(n => { n.textContent = ''; });
    if (r.classList.contains('gx')) { r.dataset.mode = 'car'; if (r.dataset.digits) r.querySelectorAll('.num.sp').forEach(n => n.innerHTML = '<span class="dim">0</span>88'); H.previewSpeedo(r); }
  }

  const THUMB_SCALE = { dial: .36, tech: .44, analog: .36, cluster: .3, apex: .34, linear: .4, hud: .36 };
  const SIZES = { supercar: [380, 312], retro: [420, 200], race: [440, 220], muscle: [580, 250], ev: [420, 220], moto: [460, 210], neon: [340, 312], minimal: [300, 190],
    chrono: [300, 330], fighter: [400, 270], split: [420, 280], euro: [300, 330], pixel: [400, 200], orb: [260, 330], drift: [380, 312], vintage: [320, 352], truck: [640, 300], jdm: [360, 392] };
  for (const k in SIZES) THUMB_SCALE[k] = Math.min(220 / SIZES[k][0], 100 / SIZES[k][1]);
  const SPEEDO_LIST = ['dial', 'tech', 'analog', 'cluster', 'apex', 'linear', 'hud', 'supercar', 'retro', 'race', 'muscle', 'ev', 'moto', 'neon', 'minimal', 'chrono', 'fighter', 'split', 'euro', 'pixel', 'orb', 'drift', 'vintage', 'truck', 'jdm'];
  const SPEEDO_NAME = (k) => T[{ ev: 'ev_screen', minimal: 'minimal_spd' }[k] || k];
  function thumb(k, variant) {
    const look = variant ? { speedoVariant: variant, speedoOpts: {}, colors: {} } : S();
    const inner = el(`<div class="inner spdwrap${H.speedoClasses(look, k)} ${S().theme !== 'panel' ? 'theme-float' : ''} ${S().theme === 'instrument' ? 'theme-inst' : ''}"></div>`);
    inner.innerHTML = H.SPEEDOS[k](200, 'mph');
    inner.style.transform = `translate(-50%, -50%) scale(${THUMB_SCALE[k]})`;
    paintThumb(inner.firstElementChild, k);
    requestAnimationFrame(() => fitThumb(inner));
    return inner;
  }
  function fitThumb(inner) {
    const box = inner.parentElement;
    if (!box || !box.clientWidth) return;
    inner.style.transformOrigin = '0 0';
    inner.style.transform = 'none';
    const o = inner.getBoundingClientRect();
    let l = Infinity, t = Infinity, r = -Infinity, b = -Infinity;
    for (const n of inner.querySelectorAll('*')) {
      if (n.closest('defs, mask, clipPath')) continue;
      const q = n.getBoundingClientRect();
      if (!q.width && !q.height) continue;
      l = Math.min(l, q.left); t = Math.min(t, q.top); r = Math.max(r, q.right); b = Math.max(b, q.bottom);
    }
    const k = inner.offsetWidth ? o.width / inner.offsetWidth : 1;
    if (r <= l || b <= t || !k) return;
    const s = Math.min((box.clientWidth - 20) * k / (r - l), (box.clientHeight - 14) * k / (b - t), .6);
    const cx = ((l + r) / 2 - o.left) / k, cy = ((t + b) / 2 - o.top) / k;
    inner.style.transform = `translate(${(-cx * s).toFixed(1)}px, ${(-cy * s).toFixed(1)}px) scale(${s.toFixed(3)})`;
  }
  function speedoCards() {
    const box = el(`<div class="cards"></div>`);
    const cur = S().vehicle?.[vtab]?.speedo || S().speedo;
    for (const k of SPEEDO_LIST) {
      const c = el(`<div class="card ${cur === k ? 'on' : ''} ${locked('speedo') ? 'dis' : ''}" tabindex="0" role="radio" aria-checked="${cur === k}">
        <div class="thumb"></div><div class="cap"><span>${SPEEDO_NAME(k)}</span>${ico('check')}</div></div>`);
      c.querySelector('.thumb').appendChild(thumb(k));
      const pick = () => { if (!locked('speedo')) set({ vehicle: { [vtab]: { speedo: k } } }); };
      c.onclick = pick;
      c.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } };
      box.appendChild(c);
    }
    return box;
  }

  const FONTS = ['default', 'condensed', 'wide', 'rounded', 'mono', 'digital', 'sport', 'block', 'tech', 'racing', 'poster', 'extended', 'scifi', 'terminal'];
  const PALETTES = {
    ember: { accent: '#ef4444', health: '#f87171', armor: '#60a5fa', hunger: '#fbbf24', thirst: '#38bdf8', stress: '#a78bfa', stamina: '#34d399', oxygen: '#67e8f9' },
    ice: { accent: '#38bdf8', health: '#7dd3fc', armor: '#c7d2fe', hunger: '#e0f2fe', thirst: '#22d3ee', stress: '#a5b4fc', stamina: '#99f6e4', oxygen: '#bae6fd' },
    toxic: { accent: '#84cc16', health: '#a3e635', armor: '#4ade80', hunger: '#facc15', thirst: '#2dd4bf', stress: '#bef264', stamina: '#22c55e', oxygen: '#5eead4' },
    sunset: { accent: '#f97316', health: '#fb7185', armor: '#f472b6', hunger: '#fbbf24', thirst: '#fb923c', stress: '#c084fc', stamina: '#fdba74', oxygen: '#fda4af' },
    royal: { accent: '#8b5cf6', health: '#f472b6', armor: '#a78bfa', hunger: '#fcd34d', thirst: '#818cf8', stress: '#c084fc', stamina: '#5eead4', oxygen: '#93c5fd' },
    gold: { accent: '#eab308', health: '#fbbf24', armor: '#fde68a', hunger: '#f59e0b', thirst: '#fcd34d', stress: '#d6d3d1', stamina: '#facc15', oxygen: '#fef3c7' },
    ocean: { accent: '#3b82f6', health: '#60a5fa', armor: '#93c5fd', hunger: '#38bdf8', thirst: '#06b6d4', stress: '#818cf8', stamina: '#2dd4bf', oxygen: '#67e8f9' },
    sakura: { accent: '#ec4899', health: '#f9a8d4', armor: '#f0abfc', hunger: '#fda4af', thirst: '#fbcfe8', stress: '#e879f9', stamina: '#fecdd3', oxygen: '#f5d0fe' },
    mint: { accent: '#10b981', health: '#6ee7b7', armor: '#5eead4', hunger: '#bef264', thirst: '#67e8f9', stress: '#a7f3d0', stamina: '#34d399', oxygen: '#99f6e4' },
    mono: { accent: '#e5e7eb', health: '#f5f5f5', armor: '#d4d4d8', hunger: '#a1a1aa', thirst: '#e4e4e7', stress: '#71717a', stamina: '#d4d4d4', oxygen: '#fafafa' },
    crimson: { accent: '#dc2626', health: '#ef4444', armor: '#e5e7eb', hunger: '#f97316', thirst: '#fca5a5', stress: '#b91c1c', stamina: '#fda4af', oxygen: '#fecaca' },
    cyber: { accent: '#f0abfc', health: '#f472b6', armor: '#22d3ee', hunger: '#facc15', thirst: '#67e8f9', stress: '#c084fc', stamina: '#a3e635', oxygen: '#5eead4' },
    desert: { accent: '#d97706', health: '#f87171', armor: '#a8a29e', hunger: '#fbbf24', thirst: '#7dd3fc', stress: '#c2410c', stamina: '#fde68a', oxygen: '#bae6fd' },
    forest: { accent: '#16a34a', health: '#f87171', armor: '#86efac', hunger: '#ca8a04', thirst: '#5eead4', stress: '#65a30d', stamina: '#4ade80', oxygen: '#99f6e4' },
    lava: { accent: '#ff5a1f', health: '#ff3b30', armor: '#ffb020', hunger: '#ffd166', thirst: '#ff8a5b', stress: '#e11d48', stamina: '#fdba74', oxygen: '#fed7aa' },
    steel: { accent: '#94a3b8', health: '#f87171', armor: '#cbd5e1', hunger: '#fbbf24', thirst: '#7dd3fc', stress: '#a1a1aa', stamina: '#86efac', oxygen: '#e2e8f0' },
    candy: { accent: '#f472b6', health: '#fb7185', armor: '#a5b4fc', hunger: '#fcd34d', thirst: '#67e8f9', stress: '#c4b5fd', stamina: '#6ee7b7', oxygen: '#bae6fd' },
    midnight: { accent: '#6366f1', health: '#f87171', armor: '#818cf8', hunger: '#fbbf24', thirst: '#38bdf8', stress: '#a78bfa', stamina: '#34d399', oxygen: '#93c5fd' },
  };
  const PRESETS = {
    street: { theme: 'instrument', speedo: ['dial', 'dial', 'linear'], statusStyle: 'gauges', speedoVariant: 'default', numFont: 'default', palette: 'ember' },
    supercar: { theme: 'float', speedo: ['supercar', 'supercar', 'moto'], statusStyle: 'iconfill', speedoVariant: 'default', numFont: 'wide', palette: 'ember' },
    track: { theme: 'float', speedo: ['race', 'race', 'moto'], statusStyle: 'bars', speedoVariant: 'dark', numFont: 'sport', palette: 'toxic' },
    clean: { theme: 'float', speedo: ['minimal', 'minimal', 'minimal'], statusStyle: 'minimal', speedoVariant: 'default', numFont: 'rounded', palette: 'mono' },
    retro: { theme: 'panel', speedo: ['retro', 'retro', 'retro'], statusStyle: 'numbers', speedoVariant: 'dark', numFont: 'digital', palette: 'gold' },
    cyber: { theme: 'float', speedo: ['neon', 'neon', 'neon'], statusStyle: 'hex', speedoVariant: 'default', numFont: 'wide', palette: 'ice' },
    muscle: { theme: 'instrument', speedo: ['muscle', 'ev', 'moto'], statusStyle: 'pills', speedoVariant: 'default', numFont: 'block', palette: 'sunset' },
    luxury: { theme: 'instrument', speedo: ['chrono', 'ev', 'euro'], statusStyle: 'rings', speedoVariant: 'glass', numFont: 'condensed', palette: 'royal' },
    arcade: { theme: 'panel', speedo: ['pixel', 'pixel', 'pixel'], statusStyle: 'numbers', speedoVariant: 'default', numFont: 'default', palette: 'sakura' },
    drift: { theme: 'float', speedo: ['drift', 'split', 'moto'], statusStyle: 'slim', speedoVariant: 'dark', numFont: 'sport', palette: 'ember' },
    cruiser: { theme: 'instrument', speedo: ['vintage', 'ev', 'moto'], statusStyle: 'arcs', speedoVariant: 'default', numFont: 'condensed', palette: 'desert' },
    trucker: { theme: 'panel', speedo: ['truck', 'ev', 'linear'], statusStyle: 'cells', speedoVariant: 'brushed', numFont: 'tech', palette: 'steel' },
    touge: { theme: 'float', speedo: ['jdm', 'jdm', 'moto'], statusStyle: 'tiles', speedoVariant: 'default', numFont: 'tech', palette: 'lava' },
    carbon: { theme: 'float', speedo: ['apex', 'ev', 'moto'], statusStyle: 'slim', speedoVariant: 'carbon', numFont: 'scifi', palette: 'crimson' },
    walnut: { theme: 'instrument', speedo: ['chrono', 'ev', 'euro'], statusStyle: 'rings', speedoVariant: 'wood', numFont: 'condensed', palette: 'gold' },
    nightrun: { theme: 'float', speedo: ['split', 'ev', 'moto'], statusStyle: 'dots', speedoVariant: 'neon', numFont: 'racing', palette: 'cyber' },
    frost: { theme: 'float', speedo: ['minimal', 'ev', 'minimal'], statusStyle: 'pills', speedoVariant: 'frosted', numFont: 'rounded', palette: 'ice' },
    terminal: { theme: 'panel', speedo: ['retro', 'retro', 'pixel'], statusStyle: 'cells', speedoVariant: 'dark', numFont: 'terminal', palette: 'toxic' },
    rally: { theme: 'float', speedo: ['race', 'race', 'moto'], statusStyle: 'tiles', speedoVariant: 'carbon', numFont: 'poster', palette: 'sunset' },
    stealth: { theme: 'instrument', speedo: ['dial', 'ev', 'linear'], statusStyle: 'minimal', speedoVariant: 'dark', numFont: 'extended', palette: 'midnight' },
  };
  function presetPatch(p) {
    const out = {};
    if (!locked('theme')) out.theme = p.theme;
    if (!locked('speedo')) { out.vehicle = { car: { speedo: p.speedo[0] }, ev: { speedo: p.speedo[1] }, bike: { speedo: p.speedo[2] } }; out.speedoVariant = p.speedoVariant; }
    if (!locked('statusStyle')) out.statusStyle = p.statusStyle;
    if (!locked('font')) out.numFont = p.numFont;
    if (!locked('colors')) out.colors = Object.assign({ sp_needle: '', sp_face: '', sp_numbers: '', sp_glow: '' }, PALETTES[p.palette]);
    return out;
  }
  const ACCENTS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f3f4f6'];
  const STATC = { health: '#f87171', armor: '#60a5fa', hunger: '#fbbf24', thirst: '#38bdf8', stress: '#a78bfa', stamina: '#34d399', oxygen: '#67e8f9' };
  const STATI = { health: 'heart', armor: 'shield', hunger: 'meat', thirst: 'droplet', stress: 'brain', stamina: 'run', oxygen: 'lungs' };

  const VIEWS = {
    presets() {
      const box = el(`<div class="cards presets"></div>`);
      for (const k in PRESETS) {
        const p = PRESETS[k], P = PALETTES[p.palette];
        const c = el(`<div class="card hp" tabindex="0" role="button" style="--pc:${P.accent}">
          <div class="thumb"></div><div class="cap col"><span>${T['hp_' + k]}</span><small>${T['hp_' + k + '_d']}</small></div></div>`);
        const t = thumb(p.speedo[0], p.speedoVariant);
        t.style.setProperty('--accent', P.accent);
        t.style.setProperty('--f-num', H.NUM_FONTS[p.numFont]);
        c.querySelector('.thumb').appendChild(t);
        const go = () => set(presetPatch(p));
        c.onclick = go;
        c.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } };
        box.appendChild(c);
      }
      return [group('', box)];
    },
    speedo() {
      return [
        group('', opts('vtab', [['car', T.car, 'car'], ['ev', T.ev, 'bolt'], ['bike', T.bike, 'motorbike']], vtab, v => { vtab = v; render(); }, '_none')),
        group(T.s_speedo, speedoCards(), 'speedo'),
        group(T.variant, opts('speedoVariant', H.FINISHES.map(f => [f, T['v_' + f]]), S().speedoVariant, v => set({ speedoVariant: v }), 'speedo'), 'speedo'),
        group(T.needle_style, opts('needle', [['default', T.n_default], ['slim', T.n_slim], ['bold', T.n_bold], ['glow', T.n_glow]], so().needle || 'default', v => set({ speedoOpts: { needle: v } }), 'speedo'), 'speedo'),
        group(T.ticks, opts('ticks', [['all', T.t_all], ['major', T.t_major], ['none', T.t_none]], so().ticks || 'all', v => set({ speedoOpts: { ticks: v } }), 'speedo'), 'speedo'),
        group(T.parts, toggles([
          [T.show_rpm, T.show_rpm_d, () => so().rpm !== false, v => set({ speedoOpts: { rpm: v } }), 'speedo'],
          [T.show_fuel, T.show_fuel_d, () => so().fuel !== false, v => set({ speedoOpts: { fuel: v } }), 'speedo'],
          [T.show_gear, T.show_gear_d, () => so().gear !== false, v => set({ speedoOpts: { gear: v } }), 'speedo'],
          [T.show_lamps, T.show_lamps_d, () => so().lamps !== false, v => set({ speedoOpts: { lamps: v } }), 'speedo'],
          [T.glow, T.glow_d, () => so().glow !== false, v => set({ speedoOpts: { glow: v } }), 'speedo'],
        ]), 'speedo'),
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
        group(T.status_style, opts('statusStyle', [['gauges', T.gauges], ['slim', T.slim], ['rings', T.rings], ['bars', T.bars_style], ['minimal', T.minimal], ['hex', T.hex], ['pills', T.pills], ['iconfill', T.iconfill], ['numbers', T.numbers], ['cells', T.cells], ['arcs', T.arcs], ['tiles', T.tiles], ['dots', T.dots]], S().statusStyle, v => set({ statusStyle: v })), 'statusStyle'),
        group(T.status_layout, opts('statusLayout', H.STATUS_LAYOUTS.map(l => [l, T['l_' + l]]), S().statusLayout || 'row', v => set({ statusLayout: v }), 'statusStyle'), 'statusStyle'),
        group(T.num_font, (() => {
          const g = opts('numFont', FONTS.map(f => [f, T['f_' + f]]), S().numFont, v => set({ numFont: v }), 'font');
          [...g.children].forEach((b, i) => { b.style.fontFamily = H.NUM_FONTS[FONTS[i]]; b.style.fontSize = '15px'; });
          return g;
        })(), 'font'),
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
      reset.onclick = () => { const c = { accent: H.DEFAULTS.colors.accent, sp_needle: '', sp_face: '', sp_numbers: '', sp_glow: '' }; for (const k in STATC) c[k] = STATC[k]; set({ colors: c }); };
      const pal = el(`<div class="palettes"></div>`);
      for (const k in PALETTES) {
        const P = PALETTES[k], on = P.accent === cur && ['health', 'armor', 'hunger', 'thirst'].every(x => (S().colors[x] || STATC[x]) === P[x]);
        const b = el(`<button type="button" class="pal ${on ? 'on' : ''}" ${locked('colors') ? 'disabled' : ''}><span class="dots">${['accent', 'health', 'armor', 'hunger', 'thirst'].map(x => `<i style="background:${P[x]}"></i>`).join('')}</span><span>${T['p_' + k]}</span></button>`);
        b.onclick = () => set({ colors: Object.assign({}, P) });
        pal.appendChild(b);
      }
      const parts = el(`<div class="stat-colors parts"></div>`);
      for (const [k, icn] of [['needle', 'gauge'], ['face', 'steering-wheel'], ['numbers', 'typography'], ['glow', 'bolt']]) {
        const v = S().colors['sp_' + k] || '';
        const r = el(`<label class="sc ${v ? '' : 'auto'}" style="--c:${v || 'var(--faint, #636973)'}">${ico(icn)}<span>${T['pc_' + k]}</span><input type="color" value="${v || '#ffffff'}" aria-label="${T['pc_' + k]}" ${locked('colors') ? 'disabled' : ''}><button type="button" class="opt sm" ${locked('colors') || !v ? 'disabled' : ''}>${T.auto_color}</button></label>`);
        r.querySelector('input').onchange = (e) => set({ colors: { ['sp_' + k]: e.target.value } });
        r.querySelector('button').onclick = (e) => { e.preventDefault(); set({ colors: { ['sp_' + k]: '' } }); };
        parts.appendChild(r);
      }
      return [group(T.palettes, pal, 'colors'), group(T.accent, sw, 'colors'), group(T.stat_colors, grid), group(T.part_colors, [el(`<p class="hint">${T.part_colors_d}</p>`), parts], 'colors'), el('<div></div>').appendChild(reset).parentElement];
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
    root.querySelector('.brand > b').textContent = T.title;
    root.querySelector('.brand > span').textContent = T.subtitle;
    root.querySelector('.foot > span').textContent = T.close;
    root.querySelector('.foot > kbd').textContent = T.esc;
    navs.querySelectorAll('.nav-i').forEach(b => { b.querySelector('span:last-child').textContent = T['s_' + b.dataset.s]; });
    if (root.classList.contains('open')) render();
  }

  H.MenuT = T;
  H.handlers.openMenu = (d) => open(d.data || {});
  H.handlers.closeMenu = () => close();
  H.Menu = { open, close, Editor, relabel };
})();
