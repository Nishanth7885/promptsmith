'use client';

// Pure-presentational star display. Renders 5 unicode stars as a grey
// background layer with a clipped iridescent foreground, so fractional
// ratings (e.g. 4.4) get a partially-filled fourth star.

interface Props {
  rating: number; // can be fractional, e.g. 4.4
  size?: 'sm' | 'md' | 'lg'; // 12px / 16px / 20px
  showNumber?: boolean;
  count?: number; // total review count to show beside, optional
}

const SIZE_PX: Record<NonNullable<Props['size']>, number> = {
  sm: 12,
  md: 16,
  lg: 20,
};

export default function StarRating({
  rating,
  size = 'md',
  showNumber = false,
  count,
}: Props) {
  const px = SIZE_PX[size];
  const clamped = Math.max(0, Math.min(5, Number.isFinite(rating) ? rating : 0));
  // Percentage of the 5-star strip that should be filled.
  const fillPct = (clamped / 5) * 100;

  // Slightly larger gap for bigger sizes so stars breathe.
  const letterSpacing = size === 'lg' ? '2px' : size === 'md' ? '1px' : '0.5px';

  return (
    <span
      className="inline-flex items-center gap-1.5"
      style={{ lineHeight: 1 }}
      aria-label={`Rated ${clamped.toFixed(1)} out of 5${
        typeof count === 'number' ? ` from ${count} review${count === 1 ? '' : 's'}` : ''
      }`}
    >
      <span
        className="relative inline-block select-none"
        style={{
          fontSize: px,
          letterSpacing,
          // Ensure the inline-block is exactly star-strip-shaped.
          lineHeight: 1,
        }}
        aria-hidden="true"
      >
        {/* Empty (background) layer */}
        <span
          style={{
            color: 'var(--border-strong)',
            display: 'inline-block',
          }}
        >
          ★★★★★
        </span>

        {/* Filled (foreground) layer, clipped to fillPct width.
            Uses the iridescent gradient via background-clip: text. */}
        <span
          style={{
            position: 'absolute',
            inset: 0,
            width: `${fillPct}%`,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            background: 'var(--grad-iri)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: 'var(--violet)', // fallback if background-clip unsupported
            pointerEvents: 'none',
          }}
        >
          ★★★★★
        </span>
      </span>

      {showNumber && (
        <span
          style={{ fontSize: Math.max(11, px - 2) }}
          className="font-medium text-slate-300"
        >
          {clamped.toFixed(1)}
        </span>
      )}
      {typeof count === 'number' && (
        <span
          style={{ fontSize: Math.max(10, px - 3) }}
          className="text-slate-500"
        >
          ({count})
        </span>
      )}
    </span>
  );
}
