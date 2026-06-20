import { NextRequest, NextResponse } from 'next/server';
import { scrapeUrl } from '@/lib/anakin';
import { extractOpportunitiesFromMarkdown } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { url, category } = body;

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    // Step 1: Scrape the URL using Anakin
    const scrapeResult = await scrapeUrl(url);

    if (!scrapeResult.markdown) {
      return NextResponse.json(
        { error: 'Failed to extract content from URL' },
        { status: 422 }
      );
    }

    // Step 2: Use Gemini to extract structured opportunity data
    const extractedOpps = await extractOpportunitiesFromMarkdown(scrapeResult.markdown, url);

    // Apply category override if provided
    const opportunities = extractedOpps.map((opp: Record<string, unknown>) => ({
      ...opp,
      category: category || opp.category,
      id: `opp-scraped-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    }));

    return NextResponse.json({
      success: true,
      url,
      opportunitiesFound: opportunities.length,
      opportunities,
      rawMarkdownLength: scrapeResult.markdown.length,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    
    // Return mock data if API keys not set (for demo)
    if (message.includes('ANAKIN_API_KEY')) {
      return NextResponse.json({
        success: false,
        error: 'ANAKIN_API_KEY not configured. Add it to .env.local to enable live scraping.',
        demo: true,
      });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
