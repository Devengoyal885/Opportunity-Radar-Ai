import { NextRequest, NextResponse } from 'next/server';
import seedData from '@/data/seed-opportunities.json';
import { Opportunity, OpportunityCategory } from '@/types';
import { computeUrgency } from '@/lib/matching';
import { differenceInDays, parseISO } from 'date-fns';

let opportunitiesDB: Opportunity[] = computeUrgency(seedData as Opportunity[]);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const deadline = searchParams.get('deadline');
  const isRemote = searchParams.get('isRemote');
  const sortBy = searchParams.get('sortBy') || 'newest';

  let results = [...opportunitiesDB];

  // Filter by category
  if (category && category !== 'all') {
    const cats = category.split(',') as OpportunityCategory[];
    results = results.filter((o) => cats.includes(o.category));
  }

  // Filter by search
  if (search) {
    const q = search.toLowerCase();
    results = results.filter(
      (o) =>
        o.title.toLowerCase().includes(q) ||
        o.organization.toLowerCase().includes(q) ||
        o.description.toLowerCase().includes(q) ||
        o.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  // Filter by deadline
  if (deadline === 'this-week') {
    results = results.filter((o) => {
      const days = differenceInDays(parseISO(o.deadline), new Date());
      return days >= 0 && days <= 7;
    });
  } else if (deadline === 'this-month') {
    results = results.filter((o) => {
      const days = differenceInDays(parseISO(o.deadline), new Date());
      return days >= 0 && days <= 30;
    });
  } else if (deadline === 'next-3-months') {
    results = results.filter((o) => {
      const days = differenceInDays(parseISO(o.deadline), new Date());
      return days >= 0 && days <= 90;
    });
  }

  // Filter by remote
  if (isRemote === 'true') results = results.filter((o) => o.isRemote);
  if (isRemote === 'false') results = results.filter((o) => !o.isRemote);

  // Sort
  if (sortBy === 'deadline') {
    results.sort((a, b) => parseISO(a.deadline).getTime() - parseISO(b.deadline).getTime());
  } else if (sortBy === 'newest') {
    results.sort((a, b) => parseISO(b.createdAt).getTime() - parseISO(a.createdAt).getTime());
  } else if (sortBy === 'relevance') {
    results.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  }

  return NextResponse.json({
    opportunities: results,
    total: results.length,
    stats: {
      total: opportunitiesDB.length,
      thisWeek: opportunitiesDB.filter((o) => {
        const days = differenceInDays(parseISO(o.deadline), new Date());
        return days >= 0 && days <= 7;
      }).length,
    },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const newOpp: Opportunity = {
    ...body,
    id: `opp-scraped-${Date.now()}`,
    createdAt: new Date().toISOString(),
    isUrgent: false,
  };

  opportunitiesDB = computeUrgency([newOpp, ...opportunitiesDB]);
  return NextResponse.json({ success: true, opportunity: newOpp });
}

export async function PATCH(request: NextRequest) {
  // Update match scores
  const body = await request.json();
  const { scores } = body as { scores: { id: string; score: number; reason: string }[] };

  opportunitiesDB = opportunitiesDB.map((opp) => {
    const match = scores.find((s) => s.id === opp.id);
    if (match) {
      return { ...opp, matchScore: match.score, matchReason: match.reason };
    }
    return opp;
  });

  return NextResponse.json({ success: true });
}
