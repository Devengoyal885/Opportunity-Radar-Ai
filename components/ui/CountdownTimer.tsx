'use client';

import { useEffect, useState } from 'react';
import { getDaysUntilDeadline } from '@/lib/matching';

interface CountdownTimerProps {
  deadline: string;
  compact?: boolean;
}

export function CountdownTimer({ deadline, compact = false }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const daysLeft = getDaysUntilDeadline(deadline);

  useEffect(() => {
    const update = () => {
      const now = new Date().getTime();
      const end = new Date(deadline).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  const color =
    daysLeft <= 1
      ? '#EF4444'
      : daysLeft <= 3
      ? '#F97316'
      : daysLeft <= 7
      ? '#F59E0B'
      : '#4ADE80';

  if (compact) {
    if (daysLeft <= 0) return <span style={{ color: '#64748B', fontSize: '12px' }}>Expired</span>;
    if (daysLeft === 1)
      return (
        <span style={{ color, fontSize: '12px', fontWeight: '600' }}>
          {timeLeft.hours}h {timeLeft.minutes}m left
        </span>
      );
    return (
      <span style={{ color, fontSize: '12px', fontWeight: '600' }}>
        {daysLeft}d {timeLeft.hours}h left
      </span>
    );
  }

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      {[
        { label: 'Days', value: pad(timeLeft.days) },
        { label: 'Hours', value: pad(timeLeft.hours) },
        { label: 'Mins', value: pad(timeLeft.minutes) },
        { label: 'Secs', value: pad(timeLeft.seconds) },
      ].map(({ label, value }) => (
        <div key={label} style={{ textAlign: 'center' }}>
          <div
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: `1px solid ${color}30`,
              borderRadius: '8px',
              padding: '6px 10px',
              fontSize: '20px',
              fontWeight: '800',
              color,
              fontVariantNumeric: 'tabular-nums',
              minWidth: '48px',
            }}
          >
            {value}
          </div>
          <div style={{ fontSize: '10px', color: '#64748B', marginTop: '4px', textTransform: 'uppercase' }}>
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}
