/*
 * Grainy colour field built from plain SVG + CSS (no WebGL or canvas), so it renders
 * the same on every GPU, browser and pixel density.
 *
 *  1. A blurred SVG shape (a rolling wave or a cluster of blobs) filled with the
 *     theme's wave gradient (--wave-1/2/3 in globals.css).
 *  2. A "grain" layer painted in the page background colour and masked by a random
 *     speckle texture, which punches film grain into the colour.
 *  3. Sparse "stars" on the background (dark theme only).
 * The shapes drift slowly with CSS animation, which stops for reduced motion.
 */
import { asset } from '@/lib/asset';

// Passed as CSS variables so the texture URLs respect the deploy base path.
const textures = {
  '--grain-url': `url(${asset('/images/grain.png')})`,
  '--stars-url': `url(${asset('/images/stars.png')})`,
};

function Wave() {
  return (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="none" className="grain-drift absolute inset-0 size-full" aria-hidden="true">
      <defs>
        <linearGradient id="wave-fill" x1="0.25" y1="0.1" x2="0.75" y2="1">
          <stop offset="0" style={{ stopColor: 'rgb(var(--wave-1))' }} />
          <stop offset="0.3" style={{ stopColor: 'rgb(var(--wave-2))' }} />
          <stop offset="0.72" style={{ stopColor: 'rgb(var(--wave-3))' }} />
          <stop offset="1" style={{ stopColor: 'rgb(var(--wave-3))', stopOpacity: 0.6 }} />
        </linearGradient>
        <filter id="wave-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="26" />
        </filter>
        <filter id="wave-halo" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="70" />
        </filter>
      </defs>
      {/* wide, faint halo so the crest dissolves gradually */}
      <path
        d="M-60 560 C 240 470 420 140 650 170 C 880 200 990 580 1210 575 C 1340 572 1410 470 1500 420 L1500 960 L-60 960 Z"
        fill="url(#wave-fill)"
        opacity="0.55"
        filter="url(#wave-halo)"
      />
      <path
        d="M-60 600 C 240 520 430 210 650 235 C 870 260 990 620 1210 615 C 1340 612 1410 520 1500 470 L1500 960 L-60 960 Z"
        fill="url(#wave-fill)"
        filter="url(#wave-soft)"
      />
    </svg>
  );
}

function Blob() {
  return (
    <svg viewBox="0 0 1000 600" preserveAspectRatio="none" className="grain-drift absolute inset-0 size-full" aria-hidden="true">
      <defs>
        <radialGradient id="blob-fill" cx="0.5" cy="0.45" r="0.6">
          <stop offset="0" style={{ stopColor: 'rgb(var(--wave-3))' }} />
          <stop offset="0.55" style={{ stopColor: 'rgb(var(--wave-2))' }} />
          <stop offset="1" style={{ stopColor: 'rgb(var(--wave-1))' }} />
        </radialGradient>
        <filter id="blob-soft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="38" />
        </filter>
      </defs>
      <g fill="url(#blob-fill)" filter="url(#blob-soft)">
        <ellipse cx="440" cy="310" rx="210" ry="130" />
        <ellipse cx="620" cy="340" rx="160" ry="105" />
        <ellipse cx="330" cy="360" rx="120" ry="85" />
      </g>
    </svg>
  );
}

export default function GrainBackground({ shape = 'wave', stars = true, className = '' }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} style={textures} aria-hidden="true">
      {shape === 'blob' ? <Blob /> : <Wave />}
      <div className="grain-layer absolute inset-0" />
      {stars && <div className="stars-layer absolute inset-0" />}
    </div>
  );
}
