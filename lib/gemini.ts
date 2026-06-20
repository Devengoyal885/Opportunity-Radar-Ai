import { Opportunity, UserProfile } from '@/types';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

interface GeminiPart {
  text: string;
}

interface GeminiContent {
  role: string;
  parts: GeminiPart[];
}

async function callGemini(contents: GeminiContent[], systemInstruction?: string) {
  const body: Record<string, unknown> = {
    contents,
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 4096,
    },
  };

  if (systemInstruction) {
    body.systemInstruction = {
      parts: [{ text: systemInstruction }],
    };
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

export async function generateMatchScores(
  profile: UserProfile,
  opportunities: Opportunity[]
): Promise<{ id: string; score: number; reason: string }[]> {
  const profileText = `
Skills: ${profile.skills.join(', ')}
Interests: ${profile.interests.join(', ')}
Education Level: ${profile.educationLevel}
Career Goals: ${profile.careerGoals}
Preferred Categories: ${profile.preferredCategories.join(', ')}
Location: ${profile.location || 'Any'}
  `.trim();

  const opportunitiesText = opportunities
    .map(
      (o, i) => `
[${i + 1}] ID: ${o.id}
Title: ${o.title}
Organization: ${o.organization}
Category: ${o.category}
Tags: ${o.tags.join(', ')}
Eligibility: ${o.eligibility}
Description: ${o.description.substring(0, 200)}...
    `.trim()
    )
    .join('\n\n---\n\n');

  const prompt = `You are an AI matching engine for an opportunity discovery platform.

USER PROFILE:
${profileText}

OPPORTUNITIES TO SCORE:
${opportunitiesText}

For each opportunity, provide a relevance score from 0-100 and a brief 1-sentence explanation of why it matches (or doesn't match) the user's profile.

Respond with ONLY valid JSON in this exact format:
[
  {
    "id": "opp-001",
    "score": 85,
    "reason": "Strong match for your ML skills and open-source interests with a generous stipend."
  }
]

Score all ${opportunities.length} opportunities. Higher scores = better match.`;

  const text = await callGemini([{ role: 'user', parts: [{ text: prompt }] }]);

  try {
    // Extract JSON from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('No JSON found in response');
    return JSON.parse(jsonMatch[0]);
  } catch {
    // Fallback: return random scores
    return opportunities.map((o) => ({
      id: o.id,
      score: Math.floor(Math.random() * 40) + 40,
      reason: 'Potentially relevant to your profile.',
    }));
  }
}

export async function chatWithAssistant(
  messages: { role: string; content: string }[],
  opportunitiesContext: Opportunity[]
): Promise<string> {
  const contextText = opportunitiesContext
    .slice(0, 20)
    .map(
      (o) =>
        `- ${o.title} by ${o.organization} [${o.category}] | Deadline: ${new Date(o.deadline).toLocaleDateString()} | ${o.isRemote ? 'Remote' : o.location}`
    )
    .join('\n');

  const systemInstruction = `You are Radar AI, an intelligent assistant for the Opportunity Radar platform. You help students, developers, and job seekers discover opportunities like hackathons, internships, scholarships, fellowships, and open-source programs.

Available opportunities in the database:
${contextText}

When users ask about opportunities:
- Reference specific opportunities from the database above when relevant
- Be concise and helpful
- Format responses with clear structure using markdown
- Always mention deadlines when discussing specific opportunities
- Encourage users to save interesting opportunities and set up their profile for better matches

You can help users:
- Find opportunities matching their skills
- Understand eligibility requirements
- Track deadlines
- Discover opportunities in specific categories`;

  const geminiMessages = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  return callGemini(geminiMessages, systemInstruction);
}

export async function extractOpportunitiesFromMarkdown(markdown: string, sourceUrl: string) {
  const prompt = `Extract opportunity information from this scraped web content and return structured JSON.

SOURCE URL: ${sourceUrl}

CONTENT:
${markdown.substring(0, 8000)}

Extract any opportunities (hackathons, internships, scholarships, fellowships, competitions, grants) found.
Return ONLY valid JSON array. If no opportunities found, return [].

Format:
[
  {
    "title": "Opportunity Title",
    "organization": "Organization Name",
    "description": "Brief description (2-3 sentences)",
    "eligibility": "Who can apply",
    "deadline": "YYYY-MM-DDTHH:mm:ss.000Z or null",
    "category": "hackathon|internship|scholarship|fellowship|open-source|startup|competition|grant",
    "tags": ["tag1", "tag2"],
    "applicationLink": "URL",
    "prize": "Prize amount if any",
    "stipend": "Stipend if any",
    "location": "Location",
    "isRemote": true/false
  }
]`;

  const text = await callGemini([{ role: 'user', parts: [{ text: prompt }] }]);

  try {
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];
    return JSON.parse(jsonMatch[0]);
  } catch {
    return [];
  }
}
