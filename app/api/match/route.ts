import { NextRequest, NextResponse } from 'next/server';
import { generateMatchScores } from '@/lib/gemini';
import { UserProfile, Opportunity } from '@/types';
import seedData from '@/data/seed-opportunities.json';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { profile } = body as { profile: UserProfile };

  if (!profile) {
    return NextResponse.json({ error: 'User profile is required' }, { status: 400 });
  }

  const opportunities = seedData as Opportunity[];

  try {
    const scores = await generateMatchScores(profile, opportunities);

    // Apply scores to opportunities and sort
    const matched = opportunities
      .map((opp) => {
        const match = scores.find((s) => s.id === opp.id);
        return {
          ...opp,
          matchScore: match?.score || 0,
          matchReason: match?.reason || 'No specific match data available.',
        };
      })
      .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

    return NextResponse.json({
      success: true,
      opportunities: matched,
      topMatches: matched.slice(0, 6),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'AI matching failed';

    // Fallback: return opportunities with simulated scores
    if (message.includes('GEMINI_API_KEY') || message.includes('API key')) {
      const fallback = opportunities.map((opp) => ({
        ...opp,
        matchScore: Math.floor(Math.random() * 50) + 40,
        matchReason: 'Configure GEMINI_API_KEY in .env.local for AI-powered matching.',
      })).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

      return NextResponse.json({
        success: true,
        demo: true,
        opportunities: fallback,
        topMatches: fallback.slice(0, 6),
      });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
