import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/components/layout/ThemeProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Opportunity Radar AI — Discover Your Next Big Break',
  description:
    'AI-powered platform to discover hackathons, internships, scholarships, fellowships, and open-source programs. Get personalized matches, track deadlines, and never miss an opportunity.',
  keywords: [
    'hackathons',
    'internships',
    'scholarships',
    'fellowships',
    'open source',
    'AI matching',
    'student opportunities',
  ],
  openGraph: {
    title: 'Opportunity Radar AI',
    description: 'Discover your next big break with AI-powered opportunity matching.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(15, 23, 42, 0.95)',
                color: '#e2e8f0',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                borderRadius: '12px',
                backdropFilter: 'blur(20px)',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
