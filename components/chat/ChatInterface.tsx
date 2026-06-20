'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, Loader2, Trash2, Sparkles } from 'lucide-react';
import { useOpportunityStore } from '@/lib/store';
import { ChatMessage } from '@/types';
import ReactMarkdown from 'react-markdown';

const SUGGESTED_PROMPTS = [
  '🔍 Find hackathons for AI developers',
  '💼 Show internships matching my profile',
  '📅 What opportunities close this week?',
  '🎓 Best scholarships for CS students',
  '🌐 Remote open-source programs with stipend',
  '🚀 Top startup competitions for founders',
];

export function ChatInterface() {
  const { chatMessages, addChatMessage, clearChat, userProfile } = useOpportunityStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isLoading]);

  const sendMessage = async (text?: string) => {
    const messageText = (text || input).trim();
    if (!messageText || isLoading) return;

    setInput('');
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString(),
    };
    addChatMessage(userMsg);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...chatMessages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();
      const aiMsg: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: data.reply || 'Sorry, I could not process your request.',
        timestamp: new Date().toISOString(),
      };
      addChatMessage(aiMsg);
    } catch {
      addChatMessage({
        id: `msg-error-${Date.now()}`,
        role: 'assistant',
        content: '❌ Failed to connect to AI. Please check your connection and API key.',
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366F1, #22D3EE)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Bot size={20} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-primary)' }}>
              Radar AI
            </div>
            <div style={{ fontSize: '12px', color: '#4ADE80', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#4ADE80',
                  animation: 'urgentPulse 2s infinite',
                }}
              />
              Online
            </div>
          </div>
        </div>
        {chatMessages.length > 0 && (
          <button
            onClick={clearChat}
            style={{
              background: 'none',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              padding: '6px 12px',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Trash2 size={12} /> Clear
          </button>
        )}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        {chatMessages.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: '40px' }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '24px',
                background: 'linear-gradient(135deg, #6366F1, #22D3EE)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}
            >
              <Sparkles size={36} color="white" />
            </motion.div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
              How can I help you today?
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '32px' }}>
              Ask me anything about opportunities, deadlines, or how to apply.
            </p>

            {/* Suggested prompts */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '10px',
                maxWidth: '600px',
                margin: '0 auto',
              }}
            >
              {SUGGESTED_PROMPTS.map((prompt) => (
                <motion.button
                  key={prompt}
                  whileHover={{ y: -3, scale: 1.01 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => sendMessage(prompt.replace(/^[^ ]+ /, ''))}
                  className="glass-card"
                  style={{
                    padding: '14px 16px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.4,
                    border: 'none',
                    width: '100%',
                  }}
                >
                  {prompt}
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <AnimatePresence>
              {chatMessages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  {msg.role === 'assistant' && (
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #6366F1, #22D3EE)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Bot size={16} color="white" />
                    </div>
                  )}
                  <div
                    style={{
                      maxWidth: '80%',
                      padding: '14px 18px',
                      borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      background:
                        msg.role === 'user'
                          ? 'linear-gradient(135deg, #6366F1, #8B5CF6)'
                          : 'var(--bg-card)',
                      border: msg.role === 'user' ? 'none' : '1px solid var(--border-subtle)',
                      fontSize: '14px',
                      lineHeight: 1.7,
                      color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                    }}
                  >
                    {msg.role === 'assistant' ? (
                      <div className="markdown-content">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                    <div style={{ fontSize: '10px', opacity: 0.5, marginTop: '8px' }}>
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ display: 'flex', gap: '12px', alignItems: 'center' }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #6366F1, #22D3EE)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Bot size={16} color="white" />
                </div>
                <div
                  className="glass-card"
                  style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Loader2 size={14} className="animate-spin" style={{ color: '#6366F1', animation: 'spin 1s linear infinite' }} />
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Radar AI is thinking...</span>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div
        style={{
          padding: '20px 24px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(10,15,30,0.6)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-end',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '14px',
            padding: '12px 16px',
            transition: 'border-color 0.2s',
          }}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about opportunities, deadlines, or how to apply..."
            rows={1}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '14px',
              resize: 'none',
              lineHeight: 1.5,
              fontFamily: 'inherit',
              maxHeight: '120px',
            }}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background:
                input.trim() && !isLoading
                  ? 'linear-gradient(135deg, #6366F1, #8B5CF6)'
                  : 'rgba(255,255,255,0.05)',
              border: 'none',
              cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'all 0.2s',
            }}
          >
            {isLoading ? (
              <Loader2 size={16} color="#6366F1" style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <Send size={16} color={input.trim() ? 'white' : '#64748B'} />
            )}
          </motion.button>
        </div>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px', textAlign: 'center' }}>
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .markdown-content p { margin: 0 0 8px; }
        .markdown-content ul, .markdown-content ol { padding-left: 20px; margin: 8px 0; }
        .markdown-content li { margin-bottom: 4px; }
        .markdown-content strong { color: #818CF8; }
        .markdown-content code { background: rgba(99,102,241,0.15); padding: 2px 6px; border-radius: 4px; font-size: 12px; }
      `}</style>
    </div>
  );
}
