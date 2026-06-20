'use client';

import { motion } from 'framer-motion';
import { DashboardStats } from '@/types';
import { Compass, Star, AlertTriangle, Bookmark } from 'lucide-react';

interface StatsBarProps {
  stats: DashboardStats;
}

export function StatsBar({ stats }: StatsBarProps) {
  const items = [
    {
      label: 'Total Opportunities',
      value: stats.total,
      icon: Compass,
      color: '#6366F1',
      bg: 'rgba(99,102,241,0.1)',
    },
    {
      label: 'Matching You',
      value: stats.matching,
      icon: Star,
      color: '#22D3EE',
      bg: 'rgba(34,211,238,0.1)',
    },
    {
      label: 'Closing This Week',
      value: stats.closingThisWeek,
      icon: AlertTriangle,
      color: '#F59E0B',
      bg: 'rgba(245,158,11,0.1)',
    },
    {
      label: 'Saved',
      value: stats.saved,
      icon: Bookmark,
      color: '#4ADE80',
      bg: 'rgba(74,222,128,0.1)',
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
      }}
    >
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card"
            style={{ padding: '20px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div
                  style={{
                    fontSize: '32px',
                    fontWeight: '900',
                    background: `linear-gradient(135deg, ${item.color}, ${item.color}99)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: 1,
                    marginBottom: '6px',
                  }}
                >
                  <AnimatedNumber value={item.value} />
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500' }}>
                  {item.label}
                </div>
              </div>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: item.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={20} color={item.color} />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function AnimatedNumber({ value }: { value: number }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {value}
    </motion.span>
  );
}
