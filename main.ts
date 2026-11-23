// Tiny stack VM for make.fun's tiny-stack-vm-01 ISA: a faithful reimplementation
// of the reference VM (generator/subject/vm.mjs) — 32-bit wrapping arithmetic,
// 256-value data stack, 64-deep call stack, 256 words of memory, all ten traps
// with their own exit codes, checked in the reference's order. Node 22, stdlib only.
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

function run(p: Uint8Array, n: Uint8Array): { o: Uint8Array; c: number } {
  const S = new Int32Array(256), K = new Int32Array(64), M = new Int32Array(256);
  const u = new Uint8Array(65536);
  let s = 0, k = 0, x = 0, t = 0, j = 0, w = 0;
  const E = (c: number) => ({ o: u.slice(0, w), c });
  for (;;) {
    if (t === 1e6) return E(10);
    if (x < 0 || x >= p.length) return E(9);
    const o = p[x];
    if (!(o < 8 || (o >= 16 && o <= 30) || (o >= 32 && o <= 34) || (o >= 48 && o <= 52) || (o >= 64 && o <= 65) || (o >= 80 && o <= 83))) return E(5);
    const m = o === 1 ? 1 : o === 2 ? 4 : o >= 48 && o <= 51 ? 2 : 0;
    if (x + m >= p.length) return E(9);
    t++;
    const y = x + 1 + m;
    let P = 0, Q = 0;
    if ((o >= 16 && o <= 30) || (o >= 32 && o <= 34)) { P = o === 23 || o === 27 ? 1 : 2; Q = 1; }
    else if (o === 1 || o === 2 || o === 82) { P = 0; Q = 1; }
    else if (o === 3 || o === 80 || o === 81 || o === 83) { P = 1; Q = 0; }
    else if (o === 4) { P = 1; Q = 2; }
    else if (o === 5) { P = 2; Q = 2; }
    else if (o === 6) { P = 2; Q = 3; }
    else if (o === 7) { P = 3; Q = 3; }
    else if (o === 49 || o === 50) { P = 1; Q = 0; }
    else if (o === 64) { P = 1; Q = 1; }
    else if (o === 65) { P = 2; Q = 0; }
    if (s < P) return E(2);
    if (s - P + Q > 256) return E(3);
    x = y;
    switch (o) {
      case 0: return E(0);
      case 1: S[s++] = (p[y - 1] << 24) >> 24; break;
      case 2: S[s++] = p[y - 4] | (p[y - 3] << 8) | (p[y - 2] << 16) | (p[y - 1] << 24); break;
      case 3: s--; break;
      case 4: S[s] = S[s - 1]; s++; break;
      case 5: { const a = S[s - 1]; S[s - 1] = S[s - 2]; S[s - 2] = a; break; }
      case 6: S[s] = S[s - 2]; s++; break;
      case 7: { const a = S[s - 3]; S[s - 3] = S[s - 2]; S[s - 2] = S[s - 1]; S[s - 1] = a; break; }
      case 23: S[s - 1] = -S[s - 1] | 0; break;
      case 27: S[s - 1] = ~S[s - 1]; break;
      case 48: case 49: case 50: {
        const r = ((p[y - 2] | (p[y - 1] << 8)) << 16) >> 16;
        let f = true;
        if (o !== 48) { const v = S[--s]; f = o === 49 ? v === 0 : v !== 0; }
        if (f) x = y + r;
        break;
      }
      case 51:
        if (k === 64) return E(7);
        K[k++] = y; x = p[y - 2] | (p[y - 1] << 8); break;
      case 52:
        if (!k) return E(8);
        x = K[--k]; break;
      case 64: { const a = S[s - 1]; if (a < 0 || a > 255) return E(6); S[s - 1] = M[a]; break; }
      case 65: { const a = S[s - 1], v = S[s - 2]; if (a < 0 || a > 255) return E(6); s -= 2; M[a] = v; break; }
      case 80: {
        const b = String(S[s - 1]);
        if (w + b.length > 65536) return E(11);
        s--;
        for (let i = 0; i < b.length; i++) u[w++] = b.charCodeAt(i);
        break;
      }
      case 81:
        if (w + 1 > 65536) return E(11);
        u[w++] = S[--s] & 255; break;
      case 82: S[s++] = j < n.length ? n[j++] : -1; break;
      case 83: return E(S[--s] & 255);
      default: {
        const b = S[s - 1], a = S[s - 2];
        let r = 0;
        if (o === 16) r = (a + b) | 0;
        else if (o === 17) r = (a - b) | 0;
        else if (o === 18) r = Math.imul(a, b);
        else if (o === 19) { if (!b) return E(4); r = a === -2147483648 && b === -1 ? a : (a / b) | 0; }
        else if (o === 20) { if (!b) return E(4); r = b === -1 ? 0 : (a % b) | 0; }
        else if (o === 21) { if (!b) return E(4); r = Math.floor((a >>> 0) / (b >>> 0)) | 0; }
        else if (o === 22) { if (!b) return E(4); r = ((a >>> 0) % (b >>> 0)) | 0; }
        else if (o === 24) r = a & b;
        else if (o === 25) r = a | b;
        else if (o === 26) r = a ^ b;
        else if (o === 28) r = a << (b & 31);
        else if (o === 29) r = a >> (b & 31);
        else if (o === 30) r = (a >>> (b & 31)) | 0;
        else if (o === 32) r = a === b ? 1 : 0;
        else if (o === 33) r = a < b ? 1 : 0;
        else r = (a >>> 0) < (b >>> 0) ? 1 : 0;
        s -= 2; S[s++] = r; break;
      }
    }
  }
}

const I = process.env.MAKEFUN_INPUT_DIR ?? '/input';
const O = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
for (const id of readdirSync(I).sort()) {
  const r = run(new Uint8Array(readFileSync(join(I, id, 'program.bin'))), new Uint8Array(readFileSync(join(I, id, 'input.bin'))));
  mkdirSync(join(O, id), { recursive: true });
  writeFileSync(join(O, id, 'stdout.bin'), r.o);
  writeFileSync(join(O, id, 'exit.txt'), `${r.c}\n`);
}
