'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { ChatInterface } from '@/components/chat/ChatInterface';

export default function ChatPage() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <div className="orb orb-purple" />
      <div className="orb orb-cyan" />
      <Sidebar />
      <div
        style={{
          marginLeft: '240px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Header title="AI Assistant" subtitle="Ask Radar AI anything about opportunities" />
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div className="glass-card" style={{ height: '100%', borderRadius: 0, border: 'none' }}>
            <ChatInterface />
          </div>
        </div>
      </div>
    </div>
  );
}
