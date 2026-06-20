'use client';

import { motion } from 'framer-motion';
import { useOpportunityStore } from '@/lib/store';
import { Opportunity, OpportunityCategory } from '@/types';
import { getDaysUntilDeadline, getDeadlineStatus } from '@/lib/matching';
import { ExternalLink, Bookmark, BookmarkCheck, Clock, MapPin, Trophy, Award } from 'lucide-react';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { MatchScore } from '@/components/ui/MatchScore';
import toast from 'react-hot-toast';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onCardClick?: (opp: Opportunity) => void;
  showMatchScore?: boolean;
  variant?: 'default' | 'compact';
}

const categoryEmoji: Record<OpportunityCategory, string> = {
  hackathon: '⚡',
  internship: '💼',
  scholarship: '🎓',
  fellowship: '🌟',
  'open-source': '💻',
  startup: '🚀',
  competition: '🏆',
  grant: '💰',
};

export function OpportunityCard({
  opportunity,
  onCardClick,
  showMatchScore = true,
  variant = 'default',
}: OpportunityCardProps) {
  const { toggleSave, isSaved } = useOpportunityStore();
  const saved = isSaved(opportunity.id);
  const daysLeft = getDaysUntilDeadline(opportunity.deadline);
  const deadlineStatus = getDeadlineStatus(opportunity.deadline);

  const deadlineColor =
    deadlineStatus === 'critical'
      ? '#EF4444'
      : deadlineStatus === 'warning'
      ? '#F59E0B'
      : deadlineStatus === 'expired'
      ? '#64748B'
      : '#4ADE80';

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSave(opportunity.id);
    toast(saved ? 'Removed from saved' : '✨ Saved!', {
      icon: saved ? '🗑️' : '🔖',
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      onClick={() => onCardClick?.(opportunity)}
      className={`glass-card gradient-border ${opportunity.isUrgent ? 'urgent-glow' : ''}`}
      style={{
        padding: variant === 'compact' ? '16px' : '20px',
        cursor: onCardClick ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background gradient accent */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '120px',
          height: '120px',
          background:
            opportunity.category === 'hackathon'
              ? 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)'
              : opportunity.category === 'internship'
              ? 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)'
              : opportunity.category === 'scholarship'
              ? 'radial-gradient(circle, rgba(234,179,8,0.08) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
          {/* Category emoji avatar */}
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              flexShrink: 0,
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {categoryEmoji[opportunity.category]}
          </div>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: '14px',
                fontWeight: '700',
                color: 'var(--text-primary)',
                lineHeight: 1.3,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: variant === 'compact' ? 'nowrap' : 'normal',
              }}
            >
              {opportunity.title}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {opportunity.organization}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {showMatchScore && opportunity.matchScore !== undefined && (
            <MatchScore score={opportunity.matchScore} size="sm" />
          )}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSave}
            style={{
              background: saved ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${saved ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: saved ? '#818CF8' : 'var(--text-muted)',
            }}
          >
            {saved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
          </motion.button>
        </div>
      </div>

      {/* Category badge */}
      <div style={{ marginBottom: '12px' }}>
        <span className={`badge cat-${opportunity.category}`}>
          {opportunity.category.replace('-', ' ')}
        </span>
        {opportunity.isRemote && (
          <span
            className="badge"
            style={{
              marginLeft: '6px',
              background: 'rgba(34,211,238,0.1)',
              color: '#22D3EE',
              border: '1px solid rgba(34,211,238,0.25)',
            }}
          >
            🌐 Remote
          </span>
        )}
      </div>

      {/* Description */}
      {variant !== 'compact' && (
        <p
          style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            marginBottom: '14px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {opportunity.description}
        </p>
      )}

      {/* Match reason */}
      {showMatchScore && opportunity.matchReason && opportunity.matchScore !== undefined && (
        <div
          style={{
            background: 'rgba(99,102,241,0.06)',
            border: '1px solid rgba(99,102,241,0.15)',
            borderRadius: '8px',
            padding: '8px 12px',
            marginBottom: '12px',
            fontSize: '12px',
            color: '#818CF8',
            display: 'flex',
            gap: '6px',
            alignItems: 'flex-start',
          }}
        >
          <Award size={12} style={{ marginTop: '1px', flexShrink: 0 }} />
          <span>{opportunity.matchReason}</span>
        </div>
      )}

      {/* Prize/Stipend */}
      {(opportunity.prize || opportunity.stipend) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '12px',
            fontSize: '13px',
            color: '#FBBF24',
            fontWeight: '600',
          }}
        >
          <Trophy size={13} />
          {opportunity.prize || opportunity.stipend}
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '12px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        {/* Deadline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
          <Clock size={12} color={deadlineColor} />
          {deadlineStatus === 'expired' ? (
            <span style={{ color: '#64748B' }}>Expired</span>
          ) : (
            <CountdownTimer deadline={opportunity.deadline} compact />
          )}
        </div>

        {/* Location + Apply */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {opportunity.location && variant !== 'compact' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                color: 'var(--text-muted)',
              }}
            >
              <MapPin size={11} />
              <span style={{ maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {opportunity.location}
              </span>
            </div>
          )}
          <a
            href={opportunity.applicationLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="btn-primary"
            style={{
              padding: '8px 16px',
              fontSize: '12px',
              borderRadius: '10px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              textDecoration: 'none',
            }}
          >
            Apply now <ExternalLink size={11} />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
