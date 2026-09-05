/**
 * Goal Date Helpers: date-fns based utilities for goal date calculations and formatting
 */

import {
  differenceInCalendarDays,
  parseISO,
  startOfToday,
  format,
} from 'date-fns';

/**
 * Calculate whole calendar-day difference between a goal's endDate and today
 * - Returns 0 on the end date
 * - Returns negative values after the end date (overdue)
 */
export function calculateDaysRemaining(endDate: string): number {
  const end = parseISO(endDate);
  const today = startOfToday();
  return differenceInCalendarDays(end, today);
}

/**
 * Check if a goal is urgent (due within 3 days or overdue)
 */
export function isUrgent(endDate: string): boolean {
  const daysRemaining = calculateDaysRemaining(endDate);
  return daysRemaining <= 3;
}

/**
 * Format a date string (yyyy-MM-dd) to a human-readable format
 * e.g., "Sep 12, 2026"
 */
export function formatEndDate(endDate: string): string {
  try {
    const date = parseISO(endDate);
    return format(date, 'MMM d, yyyy');
  } catch {
    return endDate; // Fallback to raw date if parsing fails
  }
}

/**
 * Get a display string for days remaining
 * e.g., "2 days left", "Due today", "1 day overdue"
 */
export function formatDaysRemaining(daysRemaining: number): string {
  if (daysRemaining > 0) {
    return daysRemaining === 1 ? '1 day left' : `${daysRemaining} days left`;
  } else if (daysRemaining === 0) {
    return 'Due today';
  } else {
    const overdueDays = Math.abs(daysRemaining);
    return overdueDays === 1
      ? '1 day overdue'
      : `${overdueDays} days overdue`;
  }
}
