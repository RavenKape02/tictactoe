import * as THREE from "three";

type WoodOptions = {
  base: string;
  grain: string;
  /** Average spacing of grain lines in pixels. */
  spacing: number;
  /** How much the grain lines wander. */
  waviness: number;
  seed: number;
};

/** Small deterministic PRNG so the grain is identical on every load. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const BEECH: WoodOptions = { base: "#e2b77c", grain: "#9c6a38", spacing: 18, waviness: 6, seed: 3 };

/** Paints a procedural wood grain onto a canvas and returns it as a repeating colour texture. */
export function createWoodTexture(options: WoodOptions) {
  const texture = new THREE.CanvasTexture(paintWood(options));
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 8;
  return texture;
}

/** The same grain as a CSS image, so DOM controls are cut from the board's wood. */
let beechUrl: string | undefined;
export function beechDataUrl() {
  beechUrl ??= paintWood(BEECH, 256).toDataURL("image/png");
  return beechUrl;
}

function paintWood({ base, grain, spacing, waviness, seed }: WoodOptions, size = 512) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const rand = mulberry32(seed);

  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);

  // Long grain lines running along x, each with its own drift and thickness.
  for (let y = -spacing; y < size + spacing; y += spacing * (0.5 + rand())) {
    const amp = waviness * (0.4 + rand());
    const freq = (Math.PI * 2 * (1 + Math.floor(rand() * 2))) / size;
    const phase = rand() * Math.PI * 2;
    ctx.strokeStyle = grain;
    ctx.globalAlpha = 0.08 + rand() * 0.22;
    ctx.lineWidth = 0.6 + rand() * 2.2;
    ctx.beginPath();
    for (let x = 0; x <= size; x += 8) {
      const yy = y + Math.sin(x * freq + phase) * amp;
      if (x === 0) ctx.moveTo(x, yy);
      else ctx.lineTo(x, yy);
    }
    ctx.stroke();
  }

  // Fine pores.
  ctx.globalAlpha = 0.06;
  ctx.fillStyle = grain;
  for (let i = 0; i < (2600 * size * size) / (512 * 512); i++) {
    ctx.fillRect(rand() * size, rand() * size, 1 + rand() * 3, 1);
  }
  ctx.globalAlpha = 1;
  return canvas;
}
