// Harness kiểm chứng game 3D: nạp dist/index.html vào môi trường giả lập (stub THREE + DOM),
// bấm Bắt đầu, chơi trọn 13 cảnh theo luồng visual novel và kiểm tra kết thúc.
// Chạy: node tests/harness.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function v3() { return {
  x: 0, y: 0, z: 0,
  set(x, y, z) { this.x = x; this.y = y; this.z = z; return this; },
  setScalar(s) { this.x = this.y = this.z = s; return this; },
  copy(v) { this.x = v.x; this.y = v.y; this.z = v.z; return this; },
  clone() { const c = v3(); return c.copy(this); },
  add(v) { this.x += v.x; this.y += v.y; this.z += v.z; return this; },
  sub(v) { this.x -= v.x; this.y -= v.y; this.z -= v.z; return this; },
  multiplyScalar(s) { this.x *= s; this.y *= s; this.z *= s; return this; },
  lerp(v, a) { this.x += (v.x - this.x) * a; this.y += (v.y - this.y) * a; this.z += (v.z - this.z) * a; return this; },
  length() { return Math.hypot(this.x, this.y, this.z); },
  normalize() { const l = this.length() || 1; return this.multiplyScalar(1 / l); },
  distanceTo(v) { return Math.hypot(this.x - v.x, this.y - v.y, this.z - v.z); }
}; }
const universal = new Proxy(function () {}, {
  get: (t, k) => (k === Symbol.toPrimitive ? () => 0 : universal),
  apply: () => universal,
  set: () => true
});
class Stub {
  constructor() {
    this.position = v3(); this.rotation = { x: 0, y: 0, z: 0 }; this.scale = v3();
    this.children = []; this.visible = true;
    this.shadow = { camera: {}, mapSize: { set() {} } };
    return new Proxy(this, {
      get: (t, k) => (k in t ? t[k] : universal),
      set: (t, k, val) => { t[k] = val; return true; }
    });
  }
  add(...a) { this.children.push(...a); }
  remove(...a) { this.children = this.children.filter(c => !a.includes(c)); }
}
const THREE = new Proxy({}, { get: (t, k) => (k in t ? t[k] : (t[k] = Stub)) });

class El {
  constructor(tag) {
    this.tagName = tag; this.children = []; this.style = {}; this.dataset = {};
    this._l = {}; this.width = 300; this.height = 150; this._text = ''; this._html = '';
    const s = new Set();
    this.classList = { add: c => s.add(c), remove: c => s.delete(c), contains: c => s.has(c) };
  }
  set textContent(v) { this._text = v; } get textContent() { return this._text; }
  set innerHTML(v) { this._html = v; if (v === '') this.children = []; } get innerHTML() { return this._html; }
  appendChild(c) { this.children.push(c); return c; }
  addEventListener(t, f) { (this._l[t] = this._l[t] || []).push(f); }
  click() { (this._l.click || []).forEach(f => f({ preventDefault() {}, stopPropagation() {} })); }
  getContext() { return new Proxy({}, { get: (t, k) => (k === 'measureText' ? () => ({ width: 10 }) : () => {}) }); }
  getBoundingClientRect() { return { left: 0, top: 0, width: 390, height: 844 }; }
  setPointerCapture() {}
}
const els = {};
const docListeners = {};
const documentStub = {
  getElementById: id => els[id] || (els[id] = new El('div')),
  createElement: tag => new El(tag),
  addEventListener: (t, f) => { (docListeners[t] = docListeners[t] || []).push(f); },
  body: new El('body')
};
const store = {};
const localStorageStub = { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } };

let rafQueue = [], clockT = 0;
const sandbox = {
  THREE, document: documentStub, localStorage: localStorageStub, console,
  innerWidth: 390, innerHeight: 844, devicePixelRatio: 2,
  requestAnimationFrame: cb => { rafQueue.push(cb); return rafQueue.length; },
  cancelAnimationFrame: () => {},
  setTimeout, clearTimeout, setInterval, clearInterval,
  performance: { now: () => clockT },
  addEventListener: () => {}, navigator: { userAgent: 'harness' }
};
sandbox.window = sandbox; sandbox.globalThis = sandbox;
const ctx = vm.createContext(sandbox);

const html = fs.readFileSync(path.join(__dirname, '..', 'dist', 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
console.log('game scripts found:', scripts.length);
scripts.forEach((s, i) => { new vm.Script(s, { filename: 'game-' + i + '.js' }).runInContext(ctx); });
(docListeners.DOMContentLoaded || []).forEach(f => f());

function frames(n) { for (let i = 0; i < n; i++) { const q = rafQueue; rafQueue = []; q.forEach(cb => cb(clockT += 16.7)); } }
const SEL=(process.argv[2]||'').split(',').filter(s=>s!=='').map(Number);
els['btn-start'].click();
frames(3);
if (!ctx.player) throw new Error('player chưa được tạo sau khi bấm Bắt đầu');
console.log('init OK, mode:', ctx.mode);

for (let step = 0; step < 13; step++) {
  const b = ctx.beacons[ctx.cur];
  ctx.player.position.set(b.x, 0, b.z);
  frames(2);
  if (ctx.mode !== 'dialog') throw new Error('cảnh ' + step + ' không mở hộp thoại (mode=' + ctx.mode + ')');
  let g = 0;
  while (!documentStub.getElementById('choices').classList.contains('show') && g++ < 16) els['dlg'].click();
  if (!documentStub.getElementById('choices').classList.contains('show')) throw new Error('cảnh ' + step + ': lựa chọn không hiện');
  const choices = documentStub.getElementById('choices').children;
  if (!choices.length) throw new Error('cảnh ' + step + ' không có lựa chọn');
  const pick=(step<SEL.length? SEL[step] : 0);
  if(pick>=choices.length) throw new Error('cảnh '+step+': không có lựa chọn số '+pick);
  choices[pick].click();
  g = 0;
  while (ctx.mode === 'dialog' && g++ < 10) els['dlg'].click();
  console.log('cảnh', step, 'xong -> mode:', ctx.mode, '| cur:', ctx.cur, '| stats:', ctx.S.en, ctx.S.he, ctx.S.fi);
}
console.log('màn hình kết thúc hiển thị:', els['screen-end'].style.display !== 'none' && els['screen-end'].style.display !== undefined);
console.log('kết thúc:', documentStub.getElementById('e-title').textContent || documentStub.getElementById('end-title').textContent);
if (ctx.mode !== 'end') throw new Error('chưa tới màn hình kết thúc');
console.log('flags:', JSON.stringify(ctx.S.flags));
console.log('FULL PLAYTHROUGH PASS');
