'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Opportunity, OpportunityCategory } from '@/types';
import { Filter, X, SlidersHorizontal } from 'lucide-react';

interface FilterPanelProps {
  onFilterChange: (filters: {
    categories: OpportunityCategory[];
    deadline: string;
    isRemote: boolean | null;
    sortBy: string;
  }) => void;
  currentFilters: {
    categories: OpportunityCategory[];
    deadline: string;
    isRemote: boolean | null;
    sortBy: string;
  };
}

const categories: { value: OpportunityCategory; label: string; emoji: string }[] = [
  { value: 'hackathon', label: 'Hackathon', emoji: '⚡' },
  { value: 'internship', label: 'Internship', emoji: '💼' },
  { value: 'scholarship', label: 'Scholarship', emoji: '🎓' },
  { value: 'fellowship', label: 'Fellowship', emoji: '🌟' },
  { value: 'open-source', label: 'Open Source', emoji: '💻' },
  { value: 'startup', label: 'Startup', emoji: '🚀' },
  { value: 'grant', label: 'Grant', emoji: '💰' },
  { value: 'competition', label: 'Competition', emoji: '🏆' },
];

const deadlineOptions = [
  { value: 'all', label: 'All time' },
  { value: 'this-week', label: 'This week' },
  { value: 'this-month', label: 'This month' },
  { value: 'next-3-months', label: 'Next 3 months' },
];

const sortOptions = [
  { value: 'relevance', label: 'Best match' },
  { value: 'deadline', label: 'Deadline (soonest)' },
  { value: 'newest', label: 'Newest' },
];

export function FilterPanel({ onFilterChange, currentFilters }: FilterPanelProps) {
  const [showFilters, setShowFilters] = useState(false);

  const toggleCategory = (cat: OpportunityCategory) => {
    const next = currentFilters.categories.includes(cat)
      ? currentFilters.categories.filter((c) => c !== cat)
      : [...currentFilters.categories, cat];
    onFilterChange({ ...currentFilters, categories: next });
  };

  const resetFilters = () => {
    onFilterChange({ categories: [], deadline: 'all', isRemote: null, sortBy: 'relevance' });
  };

  const hasActiveFilters =
    currentFilters.categories.length > 0 ||
    currentFilters.deadline !== 'all' ||
    currentFilters.isRemote !== null;

  return (
    <div>
      {/* Filter bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          marginBottom: '16px',
        }}
      >
        {/* Sort dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Sort:</span>
          <select
            value={currentFilters.sortBy}
            onChange={(e) => onFilterChange({ ...currentFilters, sortBy: e.target.value })}
            className="input-field"
            style={{ width: 'auto', padding: '6px 12px', fontSize: '13px' }}
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value} style={{ background: '#0A0F1E' }}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Deadline filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Deadline:</span>
          <select
            value={currentFilters.deadline}
            onChange={(e) => onFilterChange({ ...currentFilters, deadline: e.target.value })}
            className="input-field"
            style={{ width: 'auto', padding: '6px 12px', fontSize: '13px' }}
          >
            {deadlineOptions.map((o) => (
              <option key={o.value} value={o.value} style={{ background: '#0A0F1E' }}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Remote toggle */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {[
            { value: null, label: 'All' },
            { value: true, label: '🌐 Remote' },
            { value: false, label: '📍 On-site' },
          ].map((opt) => (
            <motion.button
              key={String(opt.value)}
              whileTap={{ scale: 0.95 }}
              onClick={() => onFilterChange({ ...currentFilters, isRemote: opt.value })}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
                border: '1px solid',
                borderColor:
                  currentFilters.isRemote === opt.value
                    ? 'rgba(99,102,241,0.5)'
                    : 'rgba(255,255,255,0.08)',
                background:
                  currentFilters.isRemote === opt.value
                    ? 'rgba(99,102,241,0.15)'
                    : 'var(--bg-card)',
                color:
                  currentFilters.isRemote === opt.value
                    ? '#818CF8'
                    : 'var(--text-muted)',
              }}
            >
              {opt.label}
            </motion.button>
          ))}
        </div>

        {/* Advanced filters toggle */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFilters(!showFilters)}
          className="btn-secondary"
          style={{ padding: '6px 14px', fontSize: '12px' }}
        >
          <SlidersHorizontal size={13} />
          {showFilters ? 'Hide' : 'Categories'}
          {currentFilters.categories.length > 0 && (
            <span
              style={{
                background: '#6366F1',
                color: 'white',
                borderRadius: '10px',
                padding: '1px 6px',
                fontSize: '10px',
                fontWeight: '700',
              }}
            >
              {currentFilters.categories.length}
            </span>
          )}
        </motion.button>

        {hasActiveFilters && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetFilters}
            style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              color: '#EF4444',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <X size={11} /> Reset
          </motion.button>
        )}
      </div>

      {/* Category chips */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden', marginBottom: '16px' }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', paddingTop: '4px' }}>
              {categories.map((cat) => {
                const active = currentFilters.categories.includes(cat.value);
                return (
                  <motion.button
                    key={cat.value}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleCategory(cat.value)}
                    className={active ? '' : `cat-${cat.value}`}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: active ? '#6366F1' : undefined,
                      color: active ? 'white' : undefined,
                      border: active ? '1px solid #6366F1' : undefined,
                    }}
                  >
                    {cat.emoji} {cat.label}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
