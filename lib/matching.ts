import { Opportunity } from '@/types';
import { differenceInDays, isPast, parseISO } from 'date-fns';

export function computeUrgency(opportunities: Opportunity[]): Opportunity[] {
  return opportunities.map((opp) => {
    const deadlineDate = parseISO(opp.deadline);
    const daysLeft = differenceInDays(deadlineDate, new Date());
    return {
      ...opp,
      isUrgent: daysLeft >= 0 && daysLeft <= 7,
    };
  });
}

export function filterExpired(opportunities: Opportunity[]): Opportunity[] {
  return opportunities.filter((opp) => !isPast(parseISO(opp.deadline)));
}

export function getDaysUntilDeadline(deadline: string): number {
  return differenceInDays(parseISO(deadline), new Date());
}

export function getDeadlineStatus(deadline: string): 'expired' | 'critical' | 'warning' | 'normal' {
  const days = getDaysUntilDeadline(deadline);
  if (days < 0) return 'expired';
  if (days <= 3) return 'critical';
  if (days <= 7) return 'warning';
  return 'normal';
}

export function sortByDeadline(opportunities: Opportunity[]): Opportunity[] {
  return [...opportunities].sort((a, b) => {
    const aDate = parseISO(a.deadline);
    const bDate = parseISO(b.deadline);
    return aDate.getTime() - bDate.getTime();
  });
}

export function sortByMatchScore(opportunities: Opportunity[]): Opportunity[] {
  return [...opportunities].sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
}

export function getThisWeekOpportunities(opportunities: Opportunity[]): Opportunity[] {
  return opportunities.filter((opp) => {
    const days = getDaysUntilDeadline(opp.deadline);
    return days >= 0 && days <= 7;
  });
}
