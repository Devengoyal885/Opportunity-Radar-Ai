'use client';

import { motion } from 'framer-motion';
import { Opportunity } from '@/types';
import { getDaysUntilDeadline } from '@/lib/matching';
import { Clock, ExternalLink, AlertCircle } from 'lucide-react';

interface DeadlineWidgetProps {
  opportunities: Opportunity[];
}

export function DeadlineWidget({ opportunities }: DeadlineWidgetProps) {
  const upcoming = opportunities
    .filter((o) => getDaysUntilDeadline(o.deadline) >= 0)
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 8);

  const getBarColor = (days: number) =>
    days <= 1 ? '#EF4444' : days <= 3 ? '#F97316' : days <= 7 ? '#F59E0B' : '#4ADE80';

  const getBarWidth = (days: number) => {
    if (days <= 0) return 100;
    if (days >= 30) return 5;
    return Math.max(5, 100 - (days / 30) * 95);
  };

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(245,158,11,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AlertCircle size={17} color="#F59E0B" />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>
            Upcoming Deadlines
          </h3>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
            {upcoming.filter((o) => getDaysUntilDeadline(o.deadline) <= 7).length} closing this week
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {upcoming.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px', fontSize: '13px' }}>
            No upcoming deadlines
          </div>
        ) : (
          upcoming.map((opp, i) => {
            const days = getDaysUntilDeadline(opp.deadline);
            const color = getBarColor(days);
            const barWidth = getBarWidth(days);

            return (
              <motion.div
                key={opp.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{ position: 'relative' }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '6px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                    <Clock size={12} color={color} />
                    <span
                      style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: 'var(--text-primary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {opp.title}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: '700',
                        color,
                        background: `${color}15`,
                        padding: '2px 8px',
                        borderRadius: '20px',
                        border: `1px solid ${color}30`,
                      }}
                    >
                      {days === 0 ? 'Today!' : days === 1 ? '1 day' : `${days}d`}
                    </span>
                    <a
                      href={opp.applicationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>

                {/* Progress bar */}
                <div
                  style={{
                    height: '3px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '2px',
                    overflow: 'hidden',
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${barWidth}%` }}
                    transition={{ delay: i * 0.05 + 0.3, duration: 0.8, ease: 'easeOut' }}
                    style={{
                      height: '100%',
                      background: `linear-gradient(90deg, ${color}, ${color}88)`,
                      borderRadius: '2px',
                    }}
                  />
                </div>

                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {opp.organization} · {new Date(opp.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
