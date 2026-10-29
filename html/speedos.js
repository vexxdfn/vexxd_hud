(() => {
  const f1 = (n) => n.toFixed(1);
  const pt = (cx, cy, r, a) => polar(cx, cy, r, a).map(f1);
  const arcBack = (cx, cy, r, a0, a1) => {
    const [x0, y0] = pt(cx, cy, r, a0), [x1, y1] = pt(cx, cy, r, a1);
    return `M${x0} ${y0} A${r} ${r} 0 ${a0 - a1 > 180 ? 1 : 0} 0 ${x1} ${y1}`;
  };
  const fill = (src, d, cls = 'fl') => `<path class="${cls}" d="${d}" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" data-arc="${src}"/>`;
  const ticks = (cx, cy, r0, r1, a0, sweep, n, cls = 'tk', every = 1) => {
    let t = '';
    for (let i = 0; i <= n; i++) {
      const a = a0 + i / n * sweep, [x0, y0] = pt(cx, cy, i % every ? r0 + (r1 - r0) * .45 : r0, a), [x1, y1] = pt(cx, cy, r1, a);
      t += `<line class="${cls} ${i % every ? '' : 'mj'}" x1="${x0}" y1="${y0}" x2="${x1}" y2="${y1}"/>`;
    }
    return t;
  };
  const labels = (cx, cy, r, a0, sweep, values, cls = 'tl') => values.map((v, i) => {
    const [x, y] = pt(cx, cy, r, a0 + i / (values.length - 1) * sweep);
    return `<text class="${cls}" x="${x}" y="${y}">${v}</text>`;
  }).join('');
  let motoCut = 0;
  const range = (n, fn) => Array.from({ length: n }, (_, i) => fn(i));
  const needle = (cx, cy, len, src, a0, sw, w = 3) => `<g class="ndl" data-rot="${src}" data-a0="${a0}" data-sw="${sw}" style="transform-origin:${cx}px ${cy}px"><path d="M${cx - 14} ${cy - w / 2} L${cx + len} ${cy - .6} L${cx + len} ${cy + .6} L${cx - 14} ${cy + w / 2} Z"/></g>`;

  const NEW = {
    supercar(max) {
      const cx = 190, cy = 160;
      return `<div class="spd gx supercar">${SHIFT()}
        <svg class="sv" viewBox="0 0 380 300">
          <circle class="face" cx="${cx}" cy="${cy}" r="150"/>
          <path class="trk" d="${arc(cx, cy, 134, 135, 405)}"/>
          <path class="redz" d="${arc(cx, cy, 134, 135 + .8 * 270, 405)}"/>
          ${fill('rpm', arc(cx, cy, 134, 135, 405), 'rf')}
          ${ticks(cx, cy, 116, 124, 135, 270, 16, 'tk', 2)}
          ${labels(cx, cy, 103, 135, 270, range(9, i => i))}
          <circle class="inner" cx="${cx}" cy="${cy}" r="88"/>
          <path class="ftrk" d="${arc(cx, cy, 134, 62, 118)}"/>
          ${fill('fuel', arc(cx, cy, 134, 62, 118), 'ff')}
        </svg>
        <div class="gr"><span class="gear"></span></div>
        <div class="mid"><div class="num sp"></div><span class="unit"></span><span class="cruise-set"></span>${ODO()}</div>
        <div class="fz">${FUEL()}<span class="pct tnum"></span></div>
        <div class="inds">${INDS()}</div>
        <div class="lamps">${LAMPS()}</div>
      </div>`;
    },

    retro() {
      const bars = range(30, i => `<i style="height:${30 + i * 2.3}%"></i>`).join('');
      return `<div class="spd gx retro">
        <div class="lcd">
          <div class="row1">${seg7(3)}<div class="side"><span class="unit"></span><span class="gtag">${L.gear}</span><span class="gear"></span></div></div>
          <div class="tach" data-seg="rpm">${bars}</div>
          <div class="tsc"><span>0</span><span>2</span><span>4</span><span>6</span><span>8</span></div>
          <div class="row3"><span class="ft">${L.fuel}</span><div class="fblk" data-seg="fuel">${range(12, () => '<i></i>').join('')}</div><span class="pct tnum"></span><span class="cruise-set"></span><div class="inds">${INDS()}</div></div>
        </div>
        <div class="lamps">${LAMPS()}</div>
      </div>`;
    },

    race() {
      const leds = range(15, i => `<i class="${i < 5 ? 'g' : i < 10 ? 'r' : 'b'}"></i>`).join('');
      return `<div class="spd gx race">
        <div class="leds" data-seg="rpm" data-from=".5">${leds}</div>
        <div class="body">
          <div class="box l"><small>${L.speed}</small><div class="num sp"></div><span class="unit"></span></div>
          <div class="gbig"><span class="gear"></span></div>
          <div class="box r"><small>${L.fuel}</small><span class="pct tnum"></span><div class="fbar"><i data-w="fuel"></i></div></div>
        </div>
        <div class="foot"><span class="ind l">${ico('arrow-big-left')}</span><span class="cruise-set"></span>${ODO()}<div class="lamps">${LAMPS()}</div><span class="ind r">${ico('arrow-big-right')}</span></div>
      </div>`;
    },

    muscle(max) {
      const dial = (cx, cy, kind) => {
        const vals = kind === 'spd' ? range(11, i => Math.round(max / 10 * i)) : range(9, i => i);
        const red = kind === 'rpm' ? `<path class="redz" d="${arc(cx, cy, 92, 135 + 6.5 / 8 * 270, 405)}"/>` : '';
        return `<circle class="bez" cx="${cx}" cy="${cy}" r="108"/><circle class="bez2" cx="${cx}" cy="${cy}" r="100"/><circle class="face" cx="${cx}" cy="${cy}" r="96"/>${red}
          ${ticks(cx, cy, 80, 90, 135, 270, (vals.length - 1) * 2, 'tk', 2)}${labels(cx, cy, 66, 135, 270, vals)}
          <text class="cap" x="${cx}" y="${cy + 38}">${kind === 'spd' ? '' : L.rpm + ' ×1000'}</text>
          ${needle(cx, cy, 84, kind, 135, 270)}<circle class="hub" cx="${cx}" cy="${cy}" r="9"/>`;
      };
      return `<div class="spd gx muscle">
        <svg class="sv" viewBox="0 0 580 250">
          ${dial(118, 120, 'rpm')}${dial(462, 120, 'spd')}
          <circle class="bez" cx="290" cy="168" r="50"/><circle class="face" cx="290" cy="168" r="44"/>
          ${ticks(290, 168, 33, 39, 200, 140, 4, 'tk', 1)}
          <text class="tl sm" x="254" y="152">E</text><text class="tl sm" x="326" y="152">F</text>
          ${needle(290, 168, 34, 'fuel', 200, 140, 2.5)}<circle class="hub" cx="290" cy="168" r="5"/>
        </svg>
        <div class="win"><span class="gear"></span></div>
        <div class="dig"><div class="num sp"></div><span class="unit"></span></div>
        <div class="inds">${INDS()}</div>
        <div class="lamps">${LAMPS()}<span class="cruise-set"></span>${ODO()}</div>
      </div>`;
    },

    ev() {
      return `<div class="spd gx ev">
        <div class="top"><div class="prnd"><b>P</b><b>R</b><b>N</b><b>D</b></div><div class="bat">${FUEL()}<div class="bb"><i data-w="fuel"></i></div><span class="pct tnum"></span></div></div>
        <div class="mid"><span class="ind l">${ico('arrow-big-left')}</span><div class="sp"><div class="num sp"></div><span class="unit"></span></div><span class="ind r">${ico('arrow-big-right')}</span></div>
        <div class="pw"><div class="half"><i data-w="rpm"></i></div></div>
        <div class="foot"><span class="evrange"></span><span class="cruise-set"></span>${ODO()}<div class="lamps">${LAMPS()}</div></div>
      </div>`;
    },

    moto() {
      const curve = 'M24 128 Q 170 24 436 34', id = 'mcut' + (++motoCut);
      return `<div class="spd gx moto">
        <svg class="sv" viewBox="0 0 460 210">
          <mask id="${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="460" height="210"><rect width="460" height="210" fill="#fff"/><path class="cut" d="${curve}"/></mask>
          <g mask="url(#${id})">
            <path class="trk" d="${curve}"/>
            <path class="fl" d="${curve}" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" data-arc="rpm"/>
          </g>
          <path class="red" d="M372 30 Q 410 30 436 34"/>
        </svg>
        <div class="scl"><span style="left:4%;top:120px">0</span><span style="left:22%;top:72px">3</span><span style="left:44%;top:44px">6</span><span style="left:68%;top:34px">9</span><span style="left:92%;top:40px">12</span></div>
        <div class="mid"><div class="num sp"></div><span class="unit"></span></div>
        <div class="gb"><small>${L.gear}</small><span class="gear"></span></div>
        <div class="foot"><span class="ind l">${ico('arrow-big-left')}</span>${FUEL()}<div class="fbar"><i data-w="fuel"></i></div><span class="pct tnum"></span><span class="cruise-set"></span>${ODO()}<div class="lamps">${LAMPS()}</div><span class="ind r">${ico('arrow-big-right')}</span></div>
      </div>`;
    },

    neon(max) {
      const cx = 170, cy = 165;
      return `<div class="spd gx neon">${SHIFT()}
        <svg class="sv" viewBox="0 0 340 300">
          <path class="trk" d="${arc(cx, cy, 136, 135, 405)}"/>
          ${fill('spd', arc(cx, cy, 136, 135, 405), 'fl')}
          ${ticks(cx, cy, 116, 124, 135, 270, 20, 'tk', 2)}
          ${labels(cx, cy, 102, 135, 270, range(6, i => Math.round(max / 5 * i)))}
          <path class="rtrk" d="${arc(cx, cy, 150, 150, 390)}"/>
          ${fill('rpm', arc(cx, cy, 150, 150, 390), 'rfl')}
        </svg>
        <div class="mid"><div class="num sp"></div><span class="unit"></span><span class="gear"></span><span class="cruise-set"></span></div>
        <div class="fz">${FUEL()}<span class="pct tnum"></span>${ODO()}</div>
        <div class="inds">${INDS()}</div>
        <div class="lamps">${LAMPS()}</div>
        <div class="scan"></div>
      </div>`;
    },

    minimal() {
      return `<div class="spd gx minimal">
        <div class="top"><div class="num sp"></div><div class="col"><span class="gear"></span><span class="unit"></span></div></div>
        <div class="hl"><i data-w="rpm"></i></div>
        <div class="foot"><span class="ind l">${ico('arrow-big-left')}</span>${FUEL()}<span class="pct tnum"></span><span class="cruise-set"></span>${ODO()}<span class="grow"></span><div class="lamps">${LAMPS()}</div><span class="ind r">${ico('arrow-big-right')}</span></div>
      </div>`;
    },

    chrono(max) {
      const cx = 150, cy = 150;
      const sub = (x, y, src, lab) => `<circle class="sub" cx="${x}" cy="${y}" r="34"/>${ticks(x, y, 26, 31, 135, 270, 8, 'stk', 2)}<text class="sl" x="${x}" y="${y + 20}">${lab}</text>${needle(x, y, 26, src, 135, 270, 2)}<circle class="hub s" cx="${x}" cy="${y}" r="3.5"/>`;
      return `<div class="spd gx chrono">
        <svg class="sv" viewBox="0 0 300 300">
          <circle class="bez" cx="${cx}" cy="${cy}" r="146"/><circle class="face" cx="${cx}" cy="${cy}" r="134"/>
          ${ticks(cx, cy, 120, 130, 135, 270, 40, 'tk', 4)}
          ${labels(cx, cy, 108, 135, 270, range(11, i => Math.round(max / 10 * i)))}
          ${sub(104, 168, 'rpm', L.rpm)}${sub(196, 168, 'fuel', L.fuel)}
          ${needle(cx, cy, 124, 'spd', 135, 270, 4)}<circle class="hub" cx="${cx}" cy="${cy}" r="8"/>
        </svg>
        <div class="dig"><div class="num sp"></div><span class="unit"></span></div>
        <div class="date"><span class="gear"></span></div>
        <div class="inds">${INDS()}</div>
        <div class="lamps">${LAMPS()}<span class="cruise-set"></span></div>
      </div>`;
    },

    fighter(max) {
      let tape = '';
      for (let v = max; v >= 0; v -= 10) tape += `<div>${v % 20 === 0 ? v : ''}</div>`;
      return `<div class="spd gx fighter">
        <div class="tape"><div class="rl" data-tape="spd" data-step="10" data-px="22" data-top="${max}">${tape}</div><div class="box"><div class="num sp"></div></div><span class="cap unit"></span></div>
        <div class="ctr">
          <div class="brk"><span class="gear"></span></div>
          <div class="ladder"><i></i><i></i><i></i></div>
          <div class="rd"><span class="pct tnum"></span><span class="cruise-set"></span>${ODO()}</div>
          <div class="inds">${INDS()}</div>
        </div>
        <div class="rbar"><div class="rb"><i data-h="rpm"></i></div><span class="cap">${L.rpm}</span></div>
        <div class="lamps">${LAMPS()}</div>
      </div>`;
    },

    split(max) {
      const cx = 210, cy = 132, r = 112;
      return `<div class="spd gx split">${SHIFT()}
        <svg class="sv" viewBox="0 0 420 260">
          <path class="trk" d="${arc(cx, cy, r, 118, 242)}"/><path class="trk" d="${arcBack(cx, cy, r, 62, -62)}"/>
          ${fill('spd', arc(cx, cy, r, 118, 242), 'fl')}
          ${fill('rpm', arcBack(cx, cy, r, 62, -62), 'rfl')}
          ${ticks(cx, cy, r - 18, r - 10, 118, 124, 8, 'tk', 2)}${ticks(cx, cy, r - 18, r - 10, -62, 124, 8, 'tk', 2)}
          <text class="lab" x="${pt(cx, cy, r + 2, 250)[0]}" y="${pt(cx, cy, r + 2, 250)[1]}">${L.speed}</text>
          <text class="lab" x="${pt(cx, cy, r + 2, -70)[0]}" y="${pt(cx, cy, r + 2, -70)[1]}">${L.rpm}</text>
        </svg>
        <div class="mid"><span class="gear"></span><div class="num sp"></div><span class="unit"></span><span class="cruise-set"></span></div>
        <div class="fz">${FUEL()}<div class="fbar"><i data-w="fuel"></i></div><span class="pct tnum"></span>${ODO()}</div>
        <div class="inds">${INDS()}</div>
        <div class="lamps">${LAMPS()}</div>
      </div>`;
    },

    euro(max) {
      const cx = 150, cy = 150;
      return `<div class="spd gx euro">
        <svg class="sv" viewBox="0 0 300 300">
          <circle class="rim" cx="${cx}" cy="${cy}" r="146"/><circle class="face" cx="${cx}" cy="${cy}" r="138"/>
          ${ticks(cx, cy, 118, 130, 140, 260, 40, 'tk', 4)}
          ${labels(cx, cy, 100, 140, 260, range(11, i => Math.round(max / 10 * i)))}
          <path class="rtrk" d="${arc(cx, cy, 136, 140, 400)}"/>
          ${fill('rpm', arc(cx, cy, 136, 140, 400), 'rfl')}
          ${needle(cx, cy, 126, 'spd', 140, 260, 4)}<circle class="hub" cx="${cx}" cy="${cy}" r="11"/>
        </svg>
        <div class="scr"><div class="r1"><span class="gear"></span><div class="num sp"></div><span class="unit"></span></div><div class="r2">${FUEL()}<div class="fbar"><i data-w="fuel"></i></div><span class="pct tnum"></span></div>${ODO()}</div>
        <div class="inds">${INDS()}</div>
        <div class="lamps">${LAMPS()}<span class="cruise-set"></span></div>
      </div>`;
    },

    pixel() {
      return `<div class="spd gx pixel" data-digits="3">
        <div class="hdr"><span>${L.speed}</span><span class="gearw">G<span class="gear"></span></span></div>
        <div class="row"><div class="num sp"></div><span class="unit"></span></div>
        <div class="rpm" data-seg="rpm">${range(16, i => `<i class="${i < 9 ? 'g' : i < 13 ? 'y' : 'r'}"></i>`).join('')}</div>
        <div class="foot"><span class="ft">${L.fuel}</span><div class="fb" data-seg="fuel">${range(8, () => '<i></i>').join('')}</div><span class="cruise-set"></span><div class="inds">${INDS()}</div><div class="lamps">${LAMPS()}</div></div>
      </div>`;
    },

    orb() {
      return `<div class="spd gx orb">
        <svg class="ring" viewBox="0 0 260 260"><circle class="rt" cx="130" cy="130" r="122"/><circle class="rf" cx="130" cy="130" r="122" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" data-arc="fuel"/></svg>
        <div class="ball"><div class="liq" data-h="rpm"><svg class="wave" viewBox="0 0 200 20" preserveAspectRatio="none"><path d="M0 10 C 25 0, 50 0, 75 10 S 125 20, 150 10 S 200 0, 200 10 V20 H0 Z"/></svg></div><div class="shine"></div>
          <div class="mid"><span class="gear"></span><div class="num sp"></div><span class="unit"></span><span class="cruise-set"></span></div></div>
        <div class="inds">${INDS()}</div>
        <div class="foot">${FUEL()}<span class="pct tnum"></span>${ODO()}</div>
        <div class="lamps">${LAMPS()}</div>
      </div>`;
    },

    drift() {
      const cx = 190, cy = 175;
      return `<div class="spd gx drift">${SHIFT()}
        <svg class="sv" viewBox="0 0 380 300">
          <circle class="face" cx="${cx}" cy="${cy}" r="152"/>
          <path class="redz" d="${arc(cx, cy, 138, 150 + 7 / 9 * 240, 390)}"/>
          ${ticks(cx, cy, 116, 138, 150, 240, 18, 'tk', 2)}
          ${labels(cx, cy, 96, 150, 240, range(10, i => i), 'tl big')}
          <path class="rtrk" d="${arc(cx, cy, 146, 150, 390)}"/>
          ${fill('rpm', arc(cx, cy, 146, 150, 390), 'rfl')}
          ${needle(cx, cy, 136, 'rpm', 150, 240, 5)}<circle class="hub" cx="${cx}" cy="${cy}" r="14"/>
        </svg>
        <div class="gbig"><span class="gear"></span></div>
        <div class="spdbox"><div class="num sp"></div><span class="unit"></span></div>
        <div class="fz">${FUEL()}<span class="pct tnum"></span><span class="cruise-set"></span>${ODO()}</div>
        <div class="inds">${INDS()}</div>
        <div class="lamps">${LAMPS()}</div>
      </div>`;
    },

    vintage(max) {
      const cx = 160, cy = 160;
      const fx = 160, fy = 238;
      return `<div class="spd gx vintage">
        <svg class="sv" viewBox="0 0 320 320">
          <defs><linearGradient id="vtchrome" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f7f8fa"/><stop offset=".35" stop-color="#9ba1aa"/><stop offset=".55" stop-color="#eef0f3"/><stop offset=".8" stop-color="#6d737c"/><stop offset="1" stop-color="#d9dce1"/></linearGradient></defs>
          <circle class="bez" cx="${cx}" cy="${cy}" r="156"/><circle class="bez2" cx="${cx}" cy="${cy}" r="146"/>
          <circle class="face" cx="${cx}" cy="${cy}" r="141"/>
          <path class="redz" d="${arc(cx, cy, 128, 150 + .85 * 240, 390)}"/>
          ${ticks(cx, cy, 116, 128, 150, 240, 40, 'tk', 4)}
          ${labels(cx, cy, 98, 150, 240, range(11, i => Math.round(max / 10 * i)))}
          <text class="brand" x="${cx}" y="${cy - 62}">${L.speed}</text>
          <g class="fsub"><circle class="fbez" cx="${fx}" cy="${fy}" r="36"/>
          ${ticks(fx, fy, 24, 30, 200, 140, 4, 'tk sm', 1)}
          <text class="tl sm" x="${fx - 18}" y="${fy + 14}">E</text><text class="tl sm" x="${fx + 18}" y="${fy + 14}">F</text>
          ${needle(fx, fy, 26, 'fuel', 200, 140, 2)}<circle class="hub s" cx="${fx}" cy="${fy}" r="4"/></g>
          ${needle(cx, cy, 128, 'spd', 150, 240, 3)}<circle class="hub" cx="${cx}" cy="${cy}" r="12"/>
        </svg>
        <div class="drum"><div class="num sp"></div><span class="unit"></span></div>
        <div class="win"><span class="gear"></span></div>
        <div class="inds">${INDS()}</div>
        <div class="lamps">${LAMPS()}<span class="cruise-set"></span>${ODO()}</div>
      </div>`;
    },

    truck(max) {
      const dial = (cx, cy, kind) => {
        const vals = kind === 'spd' ? range(9, i => Math.round(max / 8 * i)) : range(6, i => i * 5);
        const extra = kind === 'rpm'
          ? `<path class="eco" d="${arc(cx, cy, 92, 135 + 12 / 25 * 270, 135 + 17 / 25 * 270)}"/><path class="redz" d="${arc(cx, cy, 92, 135 + 21 / 25 * 270, 405)}"/>`
          : '';
        return `<circle class="bez" cx="${cx}" cy="${cy}" r="112"/><circle class="face" cx="${cx}" cy="${cy}" r="104"/>${extra}
          ${ticks(cx, cy, 82, 96, 135, 270, (vals.length - 1) * 4, 'tk', 4)}${labels(cx, cy, 66, 135, 270, vals)}
          <text class="cap" x="${cx}" y="${cy + 44}">${kind === 'spd' ? '' : L.rpm + ' ×100'}</text>
          ${needle(cx, cy, 92, kind, 135, 270, 4)}<circle class="hub" cx="${cx}" cy="${cy}" r="11"/>`;
      };
      const small = (cx, cy, src, lo, hi) => `<g class="${src === 'fuel' ? 'fsub' : 'tsub'}"><circle class="sbez" cx="${cx}" cy="${cy}" r="38"/><circle class="face" cx="${cx}" cy="${cy}" r="33"/>
          ${ticks(cx, cy, 22, 28, 205, 130, 4, 'tk sm', 1)}<path class="hot" d="${arc(cx, cy, 30, 305, 335)}"/>
          <text class="tl sm" x="${cx - 21}" y="${cy + 15}">${lo}</text><text class="tl sm" x="${cx + 21}" y="${cy + 15}">${hi}</text>
          ${needle(cx, cy, 25, src, 205, 130, 2)}<circle class="hub s" cx="${cx}" cy="${cy}" r="4"/></g>`;
      return `<div class="spd gx truck">
        <svg class="sv" viewBox="0 0 640 270">
          ${dial(128, 132, 'rpm')}${dial(512, 132, 'spd')}
          ${small(282, 222, 'fuel', 'E', 'F')}${small(358, 222, 'temp', 'C', 'H')}
        </svg>
        <div class="ctr"><div class="gbox"><span class="gear"></span></div><div class="num sp"></div><span class="unit"></span><span class="cruise-set"></span></div>
        <div class="tico f">${FUEL()}</div><div class="tico t"><span class="ico">${ICONS.temperature}</span></div>
        <div class="inds">${INDS()}</div>
        <div class="lamps">${LAMPS()}${ODO()}</div>
      </div>`;
    },

    jdm() {
      const cx = 180, cy = 180;
      return `<div class="spd gx jdm">
        <svg class="sv" viewBox="0 0 360 360">
          <circle class="ring" cx="${cx}" cy="${cy}" r="170"/>
          <circle class="face" cx="${cx}" cy="${cy}" r="160"/>
          <path class="redz" d="${arc(cx, cy, 146, 135 + 7.5 / 10 * 270, 405)}"/>
          ${ticks(cx, cy, 132, 152, 135, 270, 40, 'tk', 4)}
          ${labels(cx, cy, 112, 135, 270, range(11, i => i))}
          <text class="cap" x="${cx}" y="${cy + 34}">${L.rpm} ×1000</text>
          ${needle(cx, cy, 150, 'rpm', 135, 270, 5)}<circle class="hub" cx="${cx}" cy="${cy}" r="16"/>
        </svg>
        <div class="slamp"></div>
        <div class="lcd"><div class="num sp"></div><span class="unit"></span></div>
        <div class="gbox"><span class="gear"></span></div>
        <div class="fz">${FUEL()}<div class="fbar"><i data-w="fuel"></i></div><span class="pct tnum"></span></div>
        <div class="inds">${INDS()}</div>
        <div class="lamps">${LAMPS()}<span class="cruise-set"></span>${ODO()}</div>
      </div>`;
    },
  };

  Object.assign(SPEEDOS, NEW);

  /** Fills a speedometer with sample values for the menu preview. */
  window.HUD.previewSpeedo = (root) => {
    if (!root || !root.classList.contains('gx')) return;
    const g = window.HUD.speedoHooks(root);
    window.HUD.paintHooks(g, { rpm: .7, spd: .44, speed: 88 }, false);
    window.HUD.paintHooks(g, { fuel: .64, temp: .5 }, true);
    window.HUD.paintPrnd(g, 'D');
    g.evr.forEach(n => { n.textContent = '214 mi'; });
  };
})();
