import type { CSSProperties } from 'react';

interface ScoreboardProps {
  label: string;
  score: number;
  color: 'red' | 'green' | 'yellow' | 'blue';
  compact?: boolean;
}

export function Scoreboard({ label, score, color, compact = false }: ScoreboardProps) {
  return (
    <article
      style={{
        ...scoreboardStyle,
        minHeight: compact ? '92px' : '120px',
        background: getScoreboardBackground(color),
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-title)',
          fontSize: compact ? '1.1rem' : '1.35rem',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          opacity: 0.92,
        }}
      >
        {label}
      </span>

      <strong
        style={{
          fontFamily: 'var(--font-title)',
          fontSize: compact ? '3rem' : '4.6rem',
          lineHeight: 0.85,
          textShadow: '0 8px 18px rgba(0, 0, 0, 0.28)',
        }}
      >
        {score}
      </strong>
    </article>
  );
}

function getScoreboardBackground(color: ScoreboardProps['color']) {
  if (color === 'red') {
    return 'linear-gradient(135deg, #e94362, #b91f43)';
  }

  if (color === 'green') {
    return 'linear-gradient(135deg, #2fac66, #197944)';
  }

  if (color === 'yellow') {
    return 'linear-gradient(135deg, #fdc533, #d89900)';
  }

  return 'linear-gradient(135deg, #005ca9, #003f74)';
}

const scoreboardStyle: CSSProperties = {
  borderRadius: '28px',
  padding: '18px 22px',
  color: '#ffffff',
  display: 'grid',
  placeItems: 'center',
  gap: '8px',
  textAlign: 'center',
  border: '3px solid rgba(255, 255, 255, 0.45)',
  boxShadow: '0 18px 36px rgba(0, 0, 0, 0.25)',
};