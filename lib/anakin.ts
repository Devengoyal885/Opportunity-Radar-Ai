const ANAKIN_API_KEY = process.env.ANAKIN_API_KEY || '';
const ANAKIN_BASE_URL = 'https://api.anakin.io/v1';

interface ScrapeResult {
  url: string;
  markdown?: string;
  html?: string;
  title?: string;
  statusCode?: number;
  error?: string;
}

export async function scrapeUrl(url: string): Promise<ScrapeResult> {
  if (!ANAKIN_API_KEY) {
    throw new Error('ANAKIN_API_KEY is not set');
  }

  const response = await fetch(`${ANAKIN_BASE_URL}/scrape`, {
    method: 'POST',
    headers: {
      'X-API-Key': ANAKIN_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url,
      formats: ['markdown'],
      onlyMainContent: true,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Anakin scrape error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return {
    url,
    markdown: data.data?.markdown || data.markdown || '',
    title: data.data?.metadata?.title || data.title || '',
    statusCode: response.status,
  };
}

export async function crawlSite(url: string, limit = 10): Promise<ScrapeResult[]> {
  if (!ANAKIN_API_KEY) {
    throw new Error('ANAKIN_API_KEY is not set');
  }

  const response = await fetch(`${ANAKIN_BASE_URL}/crawl`, {
    method: 'POST',
    headers: {
      'X-API-Key': ANAKIN_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url,
      limit,
      scrapeOptions: {
        formats: ['markdown'],
        onlyMainContent: true,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Anakin crawl error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return (data.data || []).map((item: Record<string, unknown>) => ({
    url: (item.metadata as Record<string, unknown>)?.sourceURL as string || url,
    markdown: item.markdown as string || '',
    title: (item.metadata as Record<string, unknown>)?.title as string || '',
  }));
}

export async function searchOpportunities(query: string): Promise<ScrapeResult[]> {
  if (!ANAKIN_API_KEY) {
    throw new Error('ANAKIN_API_KEY is not set');
  }

  const response = await fetch(`${ANAKIN_BASE_URL}/search`, {
    method: 'POST',
    headers: {
      'X-API-Key': ANAKIN_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      limit: 5,
      scrapeOptions: {
        formats: ['markdown'],
        onlyMainContent: true,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Anakin search error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return (data.data || []).map((item: Record<string, unknown>) => ({
    url: (item.metadata as Record<string, unknown>)?.url as string || '',
    markdown: item.markdown as string || '',
    title: (item.metadata as Record<string, unknown>)?.title as string || '',
  }));
}

// Target opportunity websites to scrape
export const OPPORTUNITY_SOURCES = [
  { url: 'https://mlh.io/seasons/2025/events', category: 'hackathon' },
  { url: 'https://devpost.com/hackathons', category: 'hackathon' },
  { url: 'https://summerofcode.withgoogle.com/', category: 'open-source' },
  { url: 'https://fellowship.mlh.io/', category: 'open-source' },
  { url: 'https://www.outreachy.org/', category: 'open-source' },
];
