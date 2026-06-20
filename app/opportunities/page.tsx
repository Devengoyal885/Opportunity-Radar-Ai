'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { FilterPanel } from '@/components/opportunities/FilterPanel';
import { OpportunityCard } from '@/components/dashboard/OpportunityCard';
import { useOpportunityStore } from '@/lib/store';
import { Opportunity, OpportunityCategory } from '@/types';
import { Compass, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OpportunitiesPage() {
  const { opportunities, setOpportunities, filters } = useOpportunityStore();
  const [localFilters, setLocalFilters] = useState({
    categories: [] as OpportunityCategory[],
    deadline: 'all',
    isRemote: null as boolean | null,
    sortBy: 'newest',
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchOpportunities = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        search: filters.search || '',
        sortBy: localFilters.sortBy,
        deadline: localFilters.deadline,
        ...(localFilters.categories.length > 0 && { category: localFilters.categories.join(',') }),
        ...(localFilters.isRemote !== null && { isRemote: String(localFilters.isRemote) }),
      });
      const res = await fetch(`/api/opportunities?${params}`);
      const data = await res.json();
      setOpportunities(data.opportunities);
    } catch {
      toast.error('Failed to load opportunities');
    } finally {
      setIsLoading(false);
    }
  }, [filters.search, localFilters, setOpportunities]);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  const displayed = opportunities;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <div className="orb orb-purple" style={{ opacity: 0.04 }} />

      <Sidebar />

      <div style={{ marginLeft: '240px', flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
        <Header
          title="Explore Opportunities"
          subtitle={`${displayed.length} opportunities found`}
        />

        <main style={{ padding: '32px', flex: 1 }}>
          {/* Page header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366F1, #22D3EE)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Compass size={22} color="white" />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)' }}>
                Discover Opportunities
              </h2>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                Browse and filter from {opportunities.length}+ opportunities
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="glass-card" style={{ padding: '20px', marginBottom: '24px' }}>
            <FilterPanel
              onFilterChange={(f) => setLocalFilters(f)}
              currentFilters={localFilters}
            />
          </div>

          {/* Results grid */}
          {isLoading ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '80px',
                gap: '16px',
              }}
            >
              <Loader2 size={32} color="#6366F1" style={{ animation: 'spin 1s linear infinite' }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading opportunities...</p>
              <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : displayed.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ textAlign: 'center', padding: '80px 20px' }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
              <h3 style={{ color: 'var(--text-primary)', fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
                No opportunities found
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                Try adjusting your filters or search terms
              </p>
            </motion.div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                gap: '20px',
              }}
            >
              <AnimatePresence>
                {displayed.map((opp) => (
                  <OpportunityCard key={opp.id} opportunity={opp} showMatchScore />
                ))}
              </AnimatePresence>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
