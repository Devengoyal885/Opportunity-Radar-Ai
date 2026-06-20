'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useOpportunityStore } from '@/lib/store';
import { Opportunity } from '@/types';
import { getDaysUntilDeadline } from '@/lib/matching';
import { ChevronLeft, ChevronRight, Calendar, X, ExternalLink, Clock } from 'lucide-react';
import { CountdownTimer } from '@/components/ui/CountdownTimer';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const CATEGORY_COLORS: Record<string, string> = {
  hackathon: '#A855F7',
  internship: '#3B82F6',
  scholarship: '#EAB308',
  fellowship: '#14B8A6',
  'open-source': '#22C55E',
  startup: '#F97316',
  grant: '#6366F1',
  competition: '#EC4899',
};

export default function CalendarPage() {
  const { opportunities, setOpportunities } = useOpportunityStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedOpps, setSelectedOpps] = useState<Opportunity[]>([]);

  // Load opportunities if store is empty (direct navigation to this page)
  useEffect(() => {
    if (opportunities.length === 0) {
      fetch('/api/opportunities')
        .then((r) => r.json())
        .then((data) => setOpportunities(data.opportunities))
        .catch(() => {});
    }
  }, [opportunities.length, setOpportunities]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1));

  // Map deadlines to days
  const deadlineMap: Record<number, Opportunity[]> = {};
  for (const opp of opportunities) {
    const d = new Date(opp.deadline);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      if (!deadlineMap[day]) deadlineMap[day] = [];
      deadlineMap[day].push(opp);
    }
  }

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    setSelectedOpps(deadlineMap[day] || []);
  };

  const cells = [];
  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    cells.push(<div key={`empty-${i}`} />);
  }

  // Day cells
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    const isSelected = day === selectedDay;
    const dayOpps = deadlineMap[day] || [];
    const hasUrgent = dayOpps.some((o) => getDaysUntilDeadline(o.deadline) <= 3);

    cells.push(
      <motion.div
        key={day}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleDayClick(day)}
        style={{
          minHeight: '80px',
          padding: '8px',
          borderRadius: '12px',
          cursor: dayOpps.length > 0 ? 'pointer' : 'default',
          background: isSelected
            ? 'rgba(99,102,241,0.2)'
            : isToday
            ? 'rgba(99,102,241,0.08)'
            : 'rgba(255,255,255,0.02)',
          border: `1px solid ${
            isSelected
              ? 'rgba(99,102,241,0.5)'
              : isToday
              ? 'rgba(99,102,241,0.25)'
              : 'rgba(255,255,255,0.05)'
          }`,
          transition: 'all 0.2s',
          position: 'relative',
        }}
      >
        <div
          style={{
            fontSize: '13px',
            fontWeight: isToday ? '800' : '500',
            color: isToday ? '#818CF8' : 'var(--text-secondary)',
            marginBottom: '6px',
          }}
        >
          {isToday ? (
            <span
              style={{
                background: '#6366F1',
                color: 'white',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
              }}
            >
              {day}
            </span>
          ) : (
            day
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {dayOpps.slice(0, 3).map((opp) => (
            <div
              key={opp.id}
              style={{
                fontSize: '10px',
                padding: '2px 6px',
                borderRadius: '4px',
                background: `${CATEGORY_COLORS[opp.category]}25`,
                color: CATEGORY_COLORS[opp.category],
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontWeight: '600',
              }}
            >
              {opp.title}
            </div>
          ))}
          {dayOpps.length > 3 && (
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>+{dayOpps.length - 3} more</div>
          )}
        </div>
        {hasUrgent && (
          <div
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#EF4444',
            }}
          />
        )}
      </motion.div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Sidebar />
      <div style={{ marginLeft: '240px', flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
        <Header title="Deadline Calendar" subtitle="View all opportunities by deadline" />

        <main style={{ padding: '32px', flex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', alignItems: 'start' }}>
            {/* Calendar */}
            <div className="glass-card" style={{ padding: '24px' }}>
              {/* Calendar header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {MONTHS[month]} {year}
                </h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={prevMonth}
                    className="btn-secondary"
                    style={{ padding: '6px 10px', borderRadius: '8px' }}
                  >
                    <ChevronLeft size={16} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentDate(new Date())}
                    className="btn-secondary"
                    style={{ padding: '6px 14px', fontSize: '12px' }}
                  >
                    Today
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={nextMonth}
                    className="btn-secondary"
                    style={{ padding: '6px 10px', borderRadius: '8px' }}
                  >
                    <ChevronRight size={16} />
                  </motion.button>
                </div>
              </div>

              {/* Day headers */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
                {DAYS.map((d) => (
                  <div
                    key={d}
                    style={{ textAlign: 'center', fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', padding: '4px 0' }}
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                {cells}
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
                  <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: color }} />
                    {cat.replace('-', ' ')}
                  </div>
                ))}
              </div>
            </div>

            {/* Side panel: selected day details */}
            <div>
              <AnimatePresence>
                {selectedDay && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="glass-card"
                    style={{ padding: '24px' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar size={18} color="#6366F1" />
                        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>
                          {MONTHS[month]} {selectedDay}
                        </h3>
                      </div>
                      <button
                        onClick={() => { setSelectedDay(null); setSelectedOpps([]); }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                      >
                        <X size={14} />
                      </button>
                    </div>

                    {selectedOpps.length === 0 ? (
                      <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No deadlines on this day</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {selectedOpps.map((opp) => (
                          <div
                            key={opp.id}
                            style={{
                              padding: '14px',
                              borderRadius: '12px',
                              background: 'rgba(255,255,255,0.03)',
                              border: '1px solid rgba(255,255,255,0.06)',
                            }}
                          >
                            <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                              {opp.title}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                              {opp.organization}
                            </div>
                            <span
                              className={`badge cat-${opp.category}`}
                              style={{ marginBottom: '10px', display: 'inline-block' }}
                            >
                              {opp.category}
                            </span>
                            <div style={{ marginBottom: '10px' }}>
                              <CountdownTimer deadline={opp.deadline} />
                            </div>
                            <a
                              href={opp.applicationLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-primary"
                              style={{ fontSize: '12px', padding: '6px 14px', textDecoration: 'none', display: 'inline-flex' }}
                            >
                              Apply <ExternalLink size={11} />
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {!selectedDay && (
                <div className="glass-card" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <Clock size={16} color="#F59E0B" />
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>
                      This Month
                    </h3>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ color: 'var(--text-primary)', fontWeight: '700' }}>
                        {Object.values(deadlineMap).reduce((sum, arr) => sum + arr.length, 0)}
                      </span> deadlines in {MONTHS[month]}
                    </div>
                    {Object.values(deadlineMap).reduce((sum, arr) => sum + arr.filter(o => getDaysUntilDeadline(o.deadline) <= 7).length, 0) > 0 && (
                      <div style={{ color: '#F59E0B', fontWeight: '600' }}>
                        ⚠️ {Object.values(deadlineMap).reduce((sum, arr) => sum + arr.filter(o => getDaysUntilDeadline(o.deadline) <= 7).length, 0)} closing this week
                      </div>
                    )}
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '12px' }}>
                    Click on a date with colored markers to see opportunities due that day.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
