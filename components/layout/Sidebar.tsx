'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Compass,
  Bookmark,
  Calendar,
  Bot,
  User,
  Zap,
  ChevronRight,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/opportunities', icon: Compass, label: 'Explore' },
  { href: '/saved', icon: Bookmark, label: 'Saved' },
  { href: '/calendar', icon: Calendar, label: 'Calendar' },
  { href: '/chat', icon: Bot, label: 'AI Assistant' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: '240px',
        minHeight: '100vh',
        background: 'rgba(10, 15, 30, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 0',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 40,
      }}
    >
      {/* Logo */}
      <div style={{ padding: '0 20px 32px' }}>
        <Link href="/dashboard" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #6366F1, #22D3EE)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Zap size={20} color="white" fill="white" />
            </div>
            <div>
              <div
                style={{
                  fontSize: '15px',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #6366F1, #22D3EE)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1.1,
                }}
              >
                Opportunity
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '500' }}>
                Radar AI
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: '0 12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    borderLeft: isActive ? '3px solid #6366F1' : '3px solid transparent',
                    background: isActive ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
                    color: isActive ? '#818CF8' : '#64748B',
                  }}
                >
                  <Icon size={18} />
                  <span style={{ fontSize: '14px', fontWeight: isActive ? 600 : 400 }}>
                    {item.label}
                  </span>
                  {isActive && (
                    <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.6 }} />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom info */}
      <div style={{ padding: '16px 20px' }}>
        <div
          style={{
            padding: '12px',
            borderRadius: '12px',
            background: 'rgba(99, 102, 241, 0.08)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
          }}
        >
          <div style={{ fontSize: '11px', color: '#6366F1', fontWeight: '600', marginBottom: '4px' }}>
            🚀 MVP Demo
          </div>
          <div style={{ fontSize: '11px', color: '#64748B', lineHeight: 1.4 }}>
            Add API keys in .env.local for live AI + scraping
          </div>
        </div>
      </div>
    </aside>
  );
}
