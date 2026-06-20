import { NextRequest, NextResponse } from 'next/server';
import { chatWithAssistant } from '@/lib/gemini';
import seedData from '@/data/seed-opportunities.json';
import { Opportunity } from '@/types';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { messages } = body as { messages: { role: string; content: string }[] };

  if (!messages || messages.length === 0) {
    return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
  }

  const opportunities = seedData as Opportunity[];

  try {
    const reply = await chatWithAssistant(messages, opportunities);
    return NextResponse.json({ success: true, reply });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Chat failed';

    if (message.includes('GEMINI_API_KEY') || message.includes('API key')) {
      return NextResponse.json({
        success: true,
        demo: true,
        reply: `🤖 **Demo Mode** — Add your \`GEMINI_API_KEY\` to \`.env.local\` for full AI chat.\n\nIn the meantime, here are some opportunities that might match your query:\n\n${
          opportunities
            .slice(0, 3)
            .map((o) => `- **${o.title}** by ${o.organization} | Deadline: ${new Date(o.deadline).toLocaleDateString()}`)
            .join('\n')
        }\n\nUse the filters and search on the Opportunities page to explore all ${opportunities.length} opportunities!`,
      });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
