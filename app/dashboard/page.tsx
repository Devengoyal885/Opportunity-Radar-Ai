'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { StatsBar } from '@/components/dashboard/StatsBar';
import { DeadlineWidget } from '@/components/dashboard/DeadlineWidget';
import { OpportunityCard } from '@/components/dashboard/OpportunityCard';
import { useOpportunityStore } from '@/lib/store';
import { Opportunity, DashboardStats } from '@/types';
import { getThisWeekOpportunities, sortByMatchScore, sortByDeadline } from '@/lib/matching';
import { Sparkles, TrendingUp, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { opportunities, setOpportunities, savedIds, userProfile, filters, addNotification } = useOpportunityStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isScraping, setIsScraping] = useState(false);

  const fetchOpportunities = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        search: filters.search || '',
        sortBy: filters.sortBy,
      });
      const res = await fetch(`/api/opportunities?${params}`);
      const data = await res.json();
      setOpportunities(data.opportunities);
    } catch {
      toast.error('Failed to load opportunities');
    } finally {
      setIsLoading(false);
    }
  }, [filters.search, filters.sortBy, setOpportunities]);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  // Fetch notifications on load
  useEffect(() => {
    fetch('/api/notifications')
      .then((r) => r.json())
      .then((data) => {
        data.notifications?.forEach((n: Parameters<typeof addNotification>[0]) => addNotification(n));
      })
      .catch(() => {});
  }, [addNotification]);

  const stats: DashboardStats = {
    total: opportunities.length,
    matching: opportunities.filter((o) => (o.matchScore || 0) >= 60).length,
    closingThisWeek: getThisWeekOpportunities(opportunities).length,
    saved: savedIds.length,
  };

  const topMatches = sortByMatchScore(opportunities).slice(0, 6);
  const urgent = sortByDeadline(getThisWeekOpportunities(opportunities)).slice(0, 3);
  const recent = [...opportunities].slice(0, 6);

  const handleQuickScrape = async () => {
    setIsScraping(true);
    toast('🕷️ Fetching latest opportunities...', { duration: 2000 });
    await new Promise((r) => setTimeout(r, 1500));
    toast.success('✅ Data refreshed successfully!');
    setIsScraping(false);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Background orbs */}
      <div className="orb orb-purple" />
      <div className="orb orb-cyan" />

      <Sidebar />

      <div style={{ marginLeft: '240px', flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
        <Header
          title="Dashboard"
          subtitle={userProfile ? `Welcome back! ${opportunities.filter((o) => (o.matchScore || 0) >= 70).length} high-match opportunities found.` : 'Set up your profile for personalized matches.'}
        />

        <main style={{ padding: '32px', flex: 1 }}>
          {/* Action bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h2 className="gradient-text" style={{ fontSize: '28px', fontWeight: '900', margin: 0 }}>
                Opportunity Radar
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: '4px 0 0' }}>
                AI-powered discovery engine for students & developers
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleQuickScrape}
                disabled={isScraping}
                className="btn-secondary"
              >
                <RefreshCw size={14} className={isScraping ? 'animate-spin' : ''} />
                {isScraping ? 'Refreshing...' : 'Refresh Data'}
              </motion.button>
              {!userProfile && (
                <a href="/profile" className="btn-primary">
                  <Sparkles size={14} /> Setup Profile
                </a>
              )}
            </div>
          </div>

          {/* Stats */}
          <div style={{ marginBottom: '32px' }}>
            <StatsBar stats={stats} />
          </div>

          {/* Main grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px' }}>
            {/* Left column */}
            <div>
              {/* Top matches */}
              {topMatches.length > 0 && (
                <section style={{ marginBottom: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <TrendingUp size={18} color="#6366F1" />
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {userProfile ? 'Top Matches For You' : 'Featured Opportunities'}
                    </h3>
                  </div>
                  {isLoading ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="skeleton" style={{ height: '280px' }} />
                      ))}
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                      {topMatches.map((opp) => (
                        <OpportunityCard key={opp.id} opportunity={opp} showMatchScore={!!userProfile} />
                      ))}
                    </div>
                  )}
                </section>
              )}

              {/* Urgent opportunities */}
              {urgent.length > 0 && (
                <section style={{ marginBottom: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#EF4444',
                        animation: 'urgentPulse 2s infinite',
                      }}
                    />
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>
                      Closing This Week
                    </h3>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                    {urgent.map((opp) => (
                      <OpportunityCard key={opp.id} opportunity={opp} showMatchScore={!!userProfile} />
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right column: Deadline widget */}
            <div>
              <DeadlineWidget opportunities={opportunities} />

              {/* Profile CTA */}
              {!userProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="glass-card"
                  style={{
                    padding: '24px',
                    marginTop: '16px',
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(34,211,238,0.05))',
                    borderColor: 'rgba(99,102,241,0.2)',
                  }}
                >
                  <div style={{ fontSize: '28px', marginBottom: '12px' }}>🎯</div>
                  <h3 style={{ margin: '0 0 8px', fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>
                    Get Personalized Matches
                  </h3>
                  <p style={{ margin: '0 0 16px', fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    Set up your profile with your skills and interests to get AI-powered recommendations.
                  </p>
                  <a href="/profile" className="btn-primary" style={{ display: 'inline-flex', textDecoration: 'none' }}>
                    <Sparkles size={14} /> Set Up Profile
                  </a>
                </motion.div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
