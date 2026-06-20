'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { OpportunityCard } from '@/components/dashboard/OpportunityCard';
import { useOpportunityStore } from '@/lib/store';
import { Bookmark, Download } from 'lucide-react';

export default function SavedPage() {
  const { opportunities, savedIds } = useOpportunityStore();
  const savedOpportunities = opportunities.filter((o) => savedIds.includes(o.id));

  const exportCSV = () => {
    const headers = ['Title', 'Organization', 'Category', 'Deadline', 'Link'];
    const rows = savedOpportunities.map((o) => [
      `"${o.title}"`,
      `"${o.organization}"`,
      o.category,
      new Date(o.deadline).toLocaleDateString(),
      o.applicationLink,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'saved-opportunities.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Sidebar />
      <div style={{ marginLeft: '240px', flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
        <Header title="Saved Opportunities" subtitle={`${savedOpportunities.length} saved`} />

        <main style={{ padding: '32px', flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'rgba(74,222,128,0.15)',
                  border: '1px solid rgba(74,222,128,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Bookmark size={22} color="#4ADE80" />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  My Saved Opportunities
                </h2>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                  {savedOpportunities.length} opportunities bookmarked
                </p>
              </div>
            </div>
            {savedOpportunities.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={exportCSV}
                className="btn-secondary"
              >
                <Download size={14} /> Export CSV
              </motion.button>
            )}
          </div>

          {savedOpportunities.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                textAlign: 'center',
                padding: '80px 20px',
              }}
            >
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔖</div>
              <h3 style={{ color: 'var(--text-primary)', fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>
                No saved opportunities yet
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
                Click the bookmark icon on any opportunity to save it here
              </p>
              <a href="/opportunities" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex' }}>
                Explore Opportunities
              </a>
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
                {savedOpportunities.map((opp) => (
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
