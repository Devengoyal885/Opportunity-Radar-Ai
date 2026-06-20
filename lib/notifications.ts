import { Notification, Opportunity } from '@/types';
import { differenceInDays, parseISO } from 'date-fns';

export function generateDeadlineNotifications(opportunities: Opportunity[]): Notification[] {
  const notifications: Notification[] = [];

  for (const opp of opportunities) {
    const daysLeft = differenceInDays(parseISO(opp.deadline), new Date());

    if (daysLeft === 7) {
      notifications.push({
        id: `deadline-7d-${opp.id}`,
        type: 'deadline-7d',
        title: '⏰ 7 Days Left',
        message: `"${opp.title}" closes in 7 days. Don't miss your chance to apply!`,
        opportunityId: opp.id,
        opportunityTitle: opp.title,
        read: false,
        createdAt: new Date().toISOString(),
      });
    } else if (daysLeft === 3) {
      notifications.push({
        id: `deadline-3d-${opp.id}`,
        type: 'deadline-3d',
        title: '🚨 3 Days Left',
        message: `"${opp.title}" closes in 3 days. Apply now!`,
        opportunityId: opp.id,
        opportunityTitle: opp.title,
        read: false,
        createdAt: new Date().toISOString(),
      });
    } else if (daysLeft === 1) {
      notifications.push({
        id: `deadline-1d-${opp.id}`,
        type: 'deadline-1d',
        title: '🔴 Last Day!',
        message: `"${opp.title}" closes TOMORROW. This is your final chance!`,
        opportunityId: opp.id,
        opportunityTitle: opp.title,
        read: false,
        createdAt: new Date().toISOString(),
      });
    }
  }

  return notifications;
}

export function generateDailyDigest(opportunities: Opportunity[]): Notification {
  const urgentCount = opportunities.filter((o) => {
    const days = differenceInDays(parseISO(o.deadline), new Date());
    return days >= 0 && days <= 7;
  }).length;

  return {
    id: `digest-${Date.now()}`,
    type: 'daily-digest',
    title: '📋 Daily Opportunity Digest',
    message: `Good morning! You have ${opportunities.length} opportunities available, ${urgentCount} closing this week. Check your dashboard for personalized matches.`,
    read: false,
    createdAt: new Date().toISOString(),
  };
}

export function createNewMatchNotification(opp: Opportunity, score: number): Notification {
  return {
    id: `match-${opp.id}-${Date.now()}`,
    type: 'new-match',
    title: '✨ New Match Found',
    message: `"${opp.title}" matches your profile with a ${score}% relevance score!`,
    opportunityId: opp.id,
    opportunityTitle: opp.title,
    read: false,
    createdAt: new Date().toISOString(),
  };
}
