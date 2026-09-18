// 產生 PWA 圖示（純 Node，不需要額外套件）：public/icons/icon-192.png、icon-512.png、icon.svg
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'icons');
mkdirSync(out, { recursive: true });

const BG = [0x0f, 0x11, 0x15];
const FG = [0xff, 0x7a, 0x1a];
const FG2 = [0xff, 0xa8, 0x5c];

function crcTable() {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
}
const T = crcTable();
function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = T[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}

function roundedRect(px, size, x0, y0, x1, y1, r, color) {
  for (let y = Math.floor(y0); y < Math.ceil(y1); y++) {
    for (let x = Math.floor(x0); x < Math.ceil(x1); x++) {
      // 圓角判斷
      const cx = x < x0 + r ? x0 + r : x > x1 - r ? x1 - r : x;
      const cy = y < y0 + r ? y0 + r : y > y1 - r ? y1 - r : y;
      const dx = x + 0.5 - cx;
      const dy = y + 0.5 - cy;
      const inside = (x >= x0 + r && x < x1 - r) || (y >= y0 + r && y < y1 - r) || dx * dx + dy * dy <= r * r;
      if (!inside) continue;
      const i = (y * size + x) * 4;
      px[i] = color[0];
      px[i + 1] = color[1];
      px[i + 2] = color[2];
      px[i + 3] = 255;
    }
  }
}

function render(size) {
  const px = Buffer.alloc(size * size * 4);
  for (let i = 0; i < size * size; i++) {
    px[i * 4] = BG[0];
    px[i * 4 + 1] = BG[1];
    px[i * 4 + 2] = BG[2];
    px[i * 4 + 3] = 255;
  }
  const s = size;
  const cy = s / 2;
  // 槓
  roundedRect(px, s, s * 0.16, cy - s * 0.045, s * 0.84, cy + s * 0.045, s * 0.03, FG2);
  // 內側大片
  roundedRect(px, s, s * 0.24, cy - s * 0.22, s * 0.32, cy + s * 0.22, s * 0.02, FG);
  roundedRect(px, s, s * 0.68, cy - s * 0.22, s * 0.76, cy + s * 0.22, s * 0.02, FG);
  // 外側小片
  roundedRect(px, s, s * 0.15, cy - s * 0.15, s * 0.22, cy + s * 0.15, s * 0.02, FG);
  roundedRect(px, s, s * 0.78, cy - s * 0.15, s * 0.85, cy + s * 0.15, s * 0.02, FG);

  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0;
    px.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

for (const size of [192, 512]) {
  writeFileSync(join(out, `icon-${size}.png`), render(size));
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
<rect width="100" height="100" rx="22" fill="#0f1115"/>
<rect x="16" y="45.5" width="68" height="9" rx="3" fill="#ffa85c"/>
<rect x="24" y="28" width="8" height="44" rx="2" fill="#ff7a1a"/>
<rect x="68" y="28" width="8" height="44" rx="2" fill="#ff7a1a"/>
<rect x="15" y="35" width="7" height="30" rx="2" fill="#ff7a1a"/>
<rect x="78" y="35" width="7" height="30" rx="2" fill="#ff7a1a"/>
</svg>
`;
writeFileSync(join(out, 'icon.svg'), svg);
console.log('icons written to', out);
