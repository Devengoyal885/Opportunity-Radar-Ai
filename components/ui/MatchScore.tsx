'use client';

interface MatchScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function MatchScore({ score, size = 'md', showLabel = false }: MatchScoreProps) {
  const color = score >= 75 ? '#4ADE80' : score >= 50 ? '#FBBF24' : '#94A3B8';
  const bg = score >= 75 ? 'rgba(74,222,128,0.12)' : score >= 50 ? 'rgba(251,191,36,0.12)' : 'rgba(148,163,184,0.1)';

  const dimensions = { sm: 34, md: 48, lg: 64 };
  const fontSizes = { sm: 11, md: 14, lg: 18 };
  const strokeWidths = { sm: 3, md: 4, lg: 5 };
  const dim = dimensions[size];
  const radius = (dim - strokeWidths[size] * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
      title={`${score}% match`}
    >
      <div style={{ position: 'relative', width: dim, height: dim }}>
        <svg width={dim} height={dim} style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            fill={bg}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidths[size]}
          />
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidths[size]}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: fontSizes[size],
            fontWeight: '800',
            color,
          }}
        >
          {score}
        </div>
      </div>
      {showLabel && (
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>match</span>
      )}
    </div>
  );
}
