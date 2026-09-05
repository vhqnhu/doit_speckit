/**
 * Goal Storage: localStorage helpers for goal persistence
 */

export type GoalStatus = 'current' | 'completed';

export interface Goal {
  id: string;
  title: string;
  endDate: string; // yyyy-MM-dd format
  status: GoalStatus;
  createdAt: string; // ISO timestamp
  completedAt?: string; // ISO timestamp, only for completed goals
}

const STORAGE_KEY = 'doit.goals.v1';

/**
 * Generate a stable client-side ID for a new goal
 */
function generateGoalId(): string {
  return `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Validate that an object is a valid Goal
 */
function isValidGoal(obj: unknown): obj is Goal {
  if (typeof obj !== 'object' || obj === null) return false;

  const goal = obj as Record<string, unknown>;
  return (
    typeof goal.id === 'string' &&
    typeof goal.title === 'string' &&
    typeof goal.endDate === 'string' &&
    (goal.status === 'current' || goal.status === 'completed') &&
    typeof goal.createdAt === 'string' &&
    (goal.completedAt === undefined || typeof goal.completedAt === 'string')
  );
}

/**
 * Load goals from localStorage, handling missing/invalid data gracefully
 */
export function loadGoals(): Goal[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];

    // Filter out invalid records
    return parsed.filter(isValidGoal);
  } catch {
    // Invalid JSON or other errors - return empty list
    return [];
  }
}

/**
 * Save goals to localStorage, writing the full updated array
 */
export function saveGoals(goals: Goal[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
}

/**
 * Create a new current goal
 */
export function createGoal(title: string, endDate: string): Goal {
  return {
    id: generateGoalId(),
    title: title.trim(),
    endDate,
    status: 'current',
    createdAt: new Date().toISOString(),
  };
}

/**
 * Mark a goal as completed
 */
export function completeGoal(goal: Goal): Goal {
  return {
    ...goal,
    status: 'completed',
    completedAt: new Date().toISOString(),
  };
}

/**
 * Sort current goals by endDate ascending (soonest deadline first)
 */
export function sortCurrentGoals(goals: Goal[]): Goal[] {
  return goals
    .filter((g) => g.status === 'current')
    .sort((a, b) => a.endDate.localeCompare(b.endDate));
}

/**
 * Sort completed goals by completedAt descending (most recent first)
 */
export function sortCompletedGoals(goals: Goal[]): Goal[] {
  return goals
    .filter((g) => g.status === 'completed')
    .sort((a, b) => {
      const aTime = a.completedAt ? new Date(a.completedAt).getTime() : 0;
      const bTime = b.completedAt ? new Date(b.completedAt).getTime() : 0;
      return bTime - aTime;
    });
}

/**
 * Get hydrated and sorted goals for display
 */
export function getHydratedGoals(goals: Goal[]): {
  currentGoals: Goal[];
  completedGoals: Goal[];
} {
  return {
    currentGoals: sortCurrentGoals(goals),
    completedGoals: sortCompletedGoals(goals),
  };
}
