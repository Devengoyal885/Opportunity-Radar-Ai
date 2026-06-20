'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Opportunity, UserProfile, Notification, FilterState, ChatMessage } from '@/types';

interface OpportunityStore {
  // Opportunities
  opportunities: Opportunity[];
  setOpportunities: (opps: Opportunity[]) => void;
  
  // Saved
  savedIds: string[];
  toggleSave: (id: string) => void;
  isSaved: (id: string) => boolean;

  // User Profile
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;

  // Notifications
  notifications: Notification[];
  addNotification: (n: Notification) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  unreadCount: () => number;

  // Filters
  filters: FilterState;
  setFilters: (f: Partial<FilterState>) => void;
  resetFilters: () => void;

  // Chat
  chatMessages: ChatMessage[];
  addChatMessage: (msg: ChatMessage) => void;
  clearChat: () => void;

  // Theme
  theme: 'dark' | 'light';
  toggleTheme: () => void;

  // Scraping status
  isScrapingActive: boolean;
  setScrapingActive: (v: boolean) => void;
}

const defaultFilters: FilterState = {
  categories: [],
  deadline: 'all',
  isRemote: null,
  minMatchScore: 0,
  search: '',
  sortBy: 'relevance',
};

export const useOpportunityStore = create<OpportunityStore>()(
  persist(
    (set, get) => ({
      opportunities: [],
      setOpportunities: (opps) => set({ opportunities: opps }),

      savedIds: [],
      toggleSave: (id) => {
        const savedIds = get().savedIds;
        if (savedIds.includes(id)) {
          set({ savedIds: savedIds.filter((s) => s !== id) });
        } else {
          set({ savedIds: [...savedIds, id] });
        }
      },
      isSaved: (id) => get().savedIds.includes(id),

      userProfile: null,
      setUserProfile: (profile) => set({ userProfile: profile }),

      notifications: [],
      addNotification: (n) =>
        set((state) => ({ notifications: [n, ...state.notifications].slice(0, 50) })),
      markRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
      markAllRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),
      unreadCount: () => get().notifications.filter((n) => !n.read).length,

      filters: defaultFilters,
      setFilters: (f) => set((state) => ({ filters: { ...state.filters, ...f } })),
      resetFilters: () => set({ filters: defaultFilters }),

      chatMessages: [],
      addChatMessage: (msg) =>
        set((state) => ({ chatMessages: [...state.chatMessages, msg] })),
      clearChat: () => set({ chatMessages: [] }),

      theme: 'dark',
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

      isScrapingActive: false,
      setScrapingActive: (v) => set({ isScrapingActive: v }),
    }),
    {
      name: 'opportunity-radar-store',
      partialize: (state) => ({
        savedIds: state.savedIds,
        userProfile: state.userProfile,
        theme: state.theme,
        chatMessages: state.chatMessages,
        notifications: state.notifications,
      }),
    }
  )
);
