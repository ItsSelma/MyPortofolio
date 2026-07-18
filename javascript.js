const SVG_NS = 'http://www.w3.org/2000/svg';
const PAGE_HEIGHT_MULTIPLIER = 6; // koliko "ekrana" visoka je stranica
const MAX_DEPTH = 8;

function seededRandom(seed) {
  let s = seed;
  return function () {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function buildTree() {
  const page = document.getElementById('tree-page');
  const svg = document.getElementById('tree-svg');

  const width = window.innerWidth;
  const height = Math.round(window.innerHeight * PAGE_HEIGHT_MULTIPLIER);

  page.style.height = height + 'px';
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

  // ocisti prethodni sadrzaj (npr. kod resize-a)
  while (svg.firstChild) svg.removeChild(svg.firstChild);

  const rand = seededRandom(7);

  const defs = document.createElementNS(SVG_NS, 'defs');
  const glow = document.createElementNS(SVG_NS, 'radialGradient');
  glow.setAttribute('id', 'coreGlow');
  glow.innerHTML = `
    <stop offset="0%" stop-color="#fff3c4" stop-opacity="0.95"/>
    <stop offset="45%" stop-color="#e8c76b" stop-opacity="0.5"/>
    <stop offset="100%" stop-color="#e8c76b" stop-opacity="0"/>
  `;
  defs.appendChild(glow);

  const cloudBlur = document.createElementNS(SVG_NS, 'filter');
  cloudBlur.setAttribute('id', 'cloudBlur');
  cloudBlur.setAttribute('x', '-50%');
  cloudBlur.setAttribute('y', '-50%');
  cloudBlur.setAttribute('width', '200%');
  cloudBlur.setAttribute('height', '200%');
  cloudBlur.innerHTML = `<feGaussianBlur stdDeviation="7" />`;
  defs.appendChild(cloudBlur);

  svg.appendChild(defs);

  const cloudsGroup = document.createElementNS(SVG_NS, 'g');
  cloudsGroup.setAttribute('filter', 'url(#cloudBlur)');
  const birdsGroup = document.createElementNS(SVG_NS, 'g');
  const rootsGroup = document.createElementNS(SVG_NS, 'g');
  const branchesGroup = document.createElementNS(SVG_NS, 'g');
  const leavesGroup = document.createElementNS(SVG_NS, 'g');

  const baseX = width / 2;
  const baseY = height - height * 0.17;

  // sjaj u bazi debla - izvor "zivota"
  const core = document.createElementNS(SVG_NS, 'circle');
  core.setAttribute('cx', baseX);
  core.setAttribute('cy', baseY);
  core.setAttribute('r', height * 0.05);
  core.setAttribute('fill', 'url(#coreGlow)');
  svg.appendChild(core);

  const trunkColor = (t) => `hsl(28, ${38 - t * 12}%, ${22 + t * 18}%)`;

  // gradijent lisca: dublje grane (blize deblu) = tamnije/rjeđe, vrhovi = svjetlije/gušće
  const LEAF_START_DEPTH = 5;
  function leafColorForDepth(depth) {
    const tt = 1 - depth / LEAF_START_DEPTH; // 0 kod depth=5, 1 kod depth=0
    const hue = 108 - tt * 60;
    const sat = 40 + tt * 30;
    const light = 30 + tt * 28 + rand() * 6;
    return `hsl(${hue}, ${sat}%, ${light}%)`;
  }

  function buildClouds() {
    const skyTop = 0;
    const skyBottom = Math.max(crownTopY - 20, height * 0.1); // sve do vrha krosnje
    const cloudCount = Math.max(10, Math.floor((skyBottom - skyTop) / 130));

    for (let c = 0; c < cloudCount; c++) {
      const cx = rand() * width;
      const cy = skyTop + rand() * (skyBottom - skyTop);
      const scale = 0.5 + rand() * 0.9;
      const puffs = 4 + Math.floor(rand() * 4);

      for (let p = 0; p < puffs; p++) {
        const px = cx + (rand() - 0.5) * 110 * scale;
        const py = cy + (rand() - 0.5) * 26 * scale;
        const rx = (22 + rand() * 30) * scale;
        const ry = rx * (0.55 + rand() * 0.15);

        const ellipse = document.createElementNS(SVG_NS, 'ellipse');
        ellipse.setAttribute('cx', px);
        ellipse.setAttribute('cy', py);
        ellipse.setAttribute('rx', rx);
        ellipse.setAttribute('ry', ry);
        ellipse.setAttribute('fill', '#ffffff');
        ellipse.setAttribute('opacity', 0.5 + rand() * 0.3);
        cloudsGroup.appendChild(ellipse);
      }
    }
  }

  function birdMark(x, y, size, group) {
    const path = document.createElementNS(SVG_NS, 'path');
    const d = `M ${x - size} ${y} Q ${x - size / 2} ${y - size * 0.75} ${x} ${y} ` +
              `Q ${x + size / 2} ${y - size * 0.75} ${x + size} ${y}`;
    path.setAttribute('d', d);
    path.setAttribute('stroke', '#38455c');
    path.setAttribute('stroke-width', Math.max(size * 0.12, 1.2));
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('opacity', 0.35 + rand() * 0.35);
    group.appendChild(path);
  }

  function buildBirds() {
    const skyTop = height * 0.02;
    const skyBottom = Math.max(crownTopY - 10, height * 0.12);
    const birdCount = 4 + Math.floor(rand() * 5);

    for (let i = 0; i < birdCount; i++) {
      const x = width * 0.15 + rand() * width * 0.7;
      const y = skyTop + rand() * (skyBottom - skyTop);
      const size = 6 + rand() * 12; // manje = dalje u daljini
      birdMark(x, y, size, birdsGroup);
    }
  }

  function curvedLine(x1, y1, x2, y2, w, color, group) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    const perpX = -dy / len;
    const perpY = dx / len;
    const offset = (rand() - 0.5) * len * 0.3;
    const mx = (x1 + x2) / 2 + perpX * offset;
    const my = (y1 + y2) / 2 + perpY * offset;

    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`);
    path.setAttribute('stroke', color);
    path.setAttribute('stroke-width', w);
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('fill', 'none');
    group.appendChild(path);
  }

  let crownTopY = height;

  function leafCluster(x, y, count, spread, minR, maxR, depth, group) {
    crownTopY = Math.min(crownTopY, y - maxR - spread / 2);
    for (let i = 0; i < count; i++) {
      const lx = x + (rand() - 0.5) * spread;
      const ly = y + (rand() - 0.5) * spread;
      const r = minR + rand() * (maxR - minR);
      const color = leafColorForDepth(depth);
      const circle = document.createElementNS(SVG_NS, 'circle');
      circle.setAttribute('cx', lx);
      circle.setAttribute('cy', ly);
      circle.setAttribute('r', r);
      circle.setAttribute('fill', color);
      circle.setAttribute('opacity', 0.7 + rand() * 0.25);
      group.appendChild(circle);
    }
  }

  function branch(x, y, angle, length, depth, w) {
    const x2 = x + Math.cos(angle) * length;
    const y2 = y - Math.sin(angle) * length;
    const t = depth / MAX_DEPTH;

    curvedLine(x, y, x2, y2, w, trunkColor(t), branchesGroup);

    // lisce od malog i rijetkog na nizim granama do gustog na vrhovima - postupan gradijent
    if (depth <= LEAF_START_DEPTH) {
      const lt = 1 - depth / LEAF_START_DEPTH; // 0 -> 1 kako se penjemo prema vrhu
      const count = 1 + Math.round(lt * 5) + Math.floor(rand() * 2);
      const spread = 20 + lt * 40;
      const minR = 4 + lt * 5;
      const maxR = 8 + lt * 12;
      leafCluster(x2, y2, count, spread, minR, maxR, depth, leavesGroup);
    }

    if (depth === 0) return;

    const extraBranch = depth <= 5 && rand() < 0.3;
    const count = extraBranch ? 3 : 2;

    for (let i = 0; i < count; i++) {
      const mid = (count - 1) / 2;
      const spread = (i - mid) * (0.35 + rand() * 0.25) + (rand() - 0.5) * 0.12;
      const nextLength = length * (0.72 + rand() * 0.12);
      const nextWidth = Math.max(w * 0.78, 1.5);
      branch(x2, y2, angle + spread, nextLength, depth - 1, nextWidth);
    }
  }

  function rootBranch(x, y, angle, length, depth, w) {
    const x2 = x + Math.cos(angle) * length;
    const y2 = y + Math.sin(angle) * length;

    curvedLine(x, y, x2, y2, w, '#3b2417', rootsGroup);

    if (depth === 0) return;

    const extraBranch = depth <= 5 && rand() < 0.5;
    const count = extraBranch ? 3 : 2;

    for (let i = 0; i < count; i++) {
      const mid = (count - 1) / 2;
      const spread = (i - mid) * (0.38 + rand() * 0.3) + (rand() - 0.5) * 0.18;
      rootBranch(x2, y2, angle + spread, length * 0.78, depth - 1, Math.max(w * 0.74, 1));
    }
  }

  branch(baseX, baseY, Math.PI / 2, height * 0.1, MAX_DEPTH, width * 0.04);
  rootBranch(baseX, baseY, Math.PI / 2, height * 0.04, 6, width * 0.032);
  buildClouds();
  buildBirds();

  svg.appendChild(cloudsGroup);
  svg.appendChild(birdsGroup);
  svg.appendChild(rootsGroup);
  svg.appendChild(branchesGroup);
  svg.appendChild(leavesGroup);
}

function scrollToRoot() {
  window.scrollTo(0, document.body.scrollHeight);
}

// textboxovi se pojavljuju kad skrolanjem udju u ekran i nestaju kad izadju iz njega,
// u oba smjera - svaki panel ima fiksnu poziciju na stranici, a vidljivost prati viewport
function initRootInfo() {
  const panels = document.querySelectorAll('.info-panel, #contact-note');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      // panel se pali tek kad mu je bar 30% u ekranu, da se ne pojavljuje na samom rubu
      entry.target.classList.toggle('visible', entry.intersectionRatio >= 0.3);
    });
  }, { threshold: [0, 0.3] });

  panels.forEach((panel) => observer.observe(panel));
}

window.addEventListener('load', () => {
  buildTree();
  scrollToRoot();
  initRootInfo();
});

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(buildTree, 250);
});
