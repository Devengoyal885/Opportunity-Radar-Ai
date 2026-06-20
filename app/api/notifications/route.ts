import { NextResponse } from 'next/server';
import seedData from '@/data/seed-opportunities.json';
import { Opportunity } from '@/types';
import { generateDeadlineNotifications, generateDailyDigest } from '@/lib/notifications';

export async function GET() {
  const opportunities = seedData as Opportunity[];
  
  const deadlineNotifications = generateDeadlineNotifications(opportunities);
  const digest = generateDailyDigest(opportunities);

  return NextResponse.json({
    notifications: [digest, ...deadlineNotifications],
    total: deadlineNotifications.length + 1,
  });
}
