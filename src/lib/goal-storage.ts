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
  position?: number; // Zero-based manual order for current goals
}

const STORAGE_KEY = 'doit.goals.v1';
const ORDER_PREFERENCE_KEY = 'doit.goal-order.v1';

export interface GoalOrderPreference {
  manualOrder: boolean;
}

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

function isValidPosition(position: unknown): position is number {
  return typeof position === 'number' && Number.isFinite(position) && position >= 0 && Number.isInteger(position);
}

function sanitizeGoal(goal: Goal): Goal {
  if (goal.position === undefined || isValidPosition(goal.position)) {
    return goal;
  }

  const goalWithoutPosition = { ...goal };
  delete goalWithoutPosition.position;
  return goalWithoutPosition;
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
    return parsed.filter(isValidGoal).map(sanitizeGoal);
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

export function loadGoalOrderPreference(): GoalOrderPreference {
  try {
    const stored = localStorage.getItem(ORDER_PREFERENCE_KEY);
    if (!stored) return { manualOrder: false };

    const parsed = JSON.parse(stored);
    return { manualOrder: parsed?.manualOrder === true };
  } catch {
    return { manualOrder: false };
  }
}

export function saveGoalOrderPreference(preference: GoalOrderPreference): void {
  localStorage.setItem(ORDER_PREFERENCE_KEY, JSON.stringify({ manualOrder: preference.manualOrder }));
}

/**
 * Create a new current goal
 */
export function createGoal(title: string, endDate: string, position?: number): Goal {
  return {
    id: generateGoalId(),
    title: title.trim(),
    endDate,
    status: 'current',
    createdAt: new Date().toISOString(),
    ...(position === undefined ? {} : { position }),
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
export function sortCurrentGoals(goals: Goal[], manualOrder = false): Goal[] {
  const currentGoals = goals.filter((goal) => goal.status === 'current');

  if (!manualOrder) {
    return currentGoals.sort((a, b) => a.endDate.localeCompare(b.endDate));
  }

  const positionCounts = new Map<number, number>();
  currentGoals.forEach((goal) => {
    if (isValidPosition(goal.position)) {
      positionCounts.set(goal.position, (positionCounts.get(goal.position) ?? 0) + 1);
    }
  });

  return currentGoals
    .map((goal, index) => ({ goal, index }))
    .sort((a, b) => {
      const aPosition = isValidPosition(a.goal.position) && positionCounts.get(a.goal.position) === 1
        ? a.goal.position
        : undefined;
      const bPosition = isValidPosition(b.goal.position) && positionCounts.get(b.goal.position) === 1
        ? b.goal.position
        : undefined;

      if (aPosition === undefined && bPosition === undefined) return a.index - b.index;
      if (aPosition === undefined) return 1;
      if (bPosition === undefined) return -1;
      return aPosition - bPosition;
    })
    .map(({ goal }) => goal);
}

export function normalizeCurrentGoalPositions(goals: Goal[], orderedCurrentGoalIds?: string[]): Goal[] {
  const currentGoals = sortCurrentGoals(goals, true);
  const currentGoalIds = new Set(currentGoals.map((goal) => goal.id));
  const orderedGoals = orderedCurrentGoalIds
    ? orderedCurrentGoalIds
        .filter((id, index, ids) => currentGoalIds.has(id) && ids.indexOf(id) === index)
        .map((id) => currentGoals.find((goal) => goal.id === id)!)
    : currentGoals;
  const missingGoals = currentGoals.filter((goal) => !orderedGoals.some((orderedGoal) => orderedGoal.id === goal.id));
  const positions = new Map([...orderedGoals, ...missingGoals].map((goal, index) => [goal.id, index]));

  return goals.map((goal) => {
    if (goal.status !== 'current') {
      const completedGoal = { ...goal };
      delete completedGoal.position;
      return completedGoal;
    }

    return { ...goal, position: positions.get(goal.id)! };
  });
}

export function addGoalWithOrdering(goals: Goal[], title: string, endDate: string, manualOrder: boolean): Goal[] {
  const position = manualOrder ? sortCurrentGoals(goals, true).length : undefined;
  const updatedGoals = [...goals, createGoal(title, endDate, position)];
  return manualOrder ? normalizeCurrentGoalPositions(updatedGoals) : updatedGoals;
}

export function completeGoalWithOrdering(goals: Goal[], goalId: string, manualOrder: boolean): Goal[] {
  const updatedGoals = goals.map((goal) => (goal.id === goalId ? completeGoal(goal) : goal));
  return manualOrder ? normalizeCurrentGoalPositions(updatedGoals) : updatedGoals;
}

export function deleteGoalWithOrdering(goals: Goal[], goalId: string, manualOrder: boolean): Goal[] {
  const updatedGoals = goals.filter((goal) => goal.id !== goalId);
  return manualOrder ? normalizeCurrentGoalPositions(updatedGoals) : updatedGoals;
}

export function persistSuccessfulReorder(goals: Goal[], orderedCurrentGoalIds: string[]): Goal[] {
  const updatedGoals = normalizeCurrentGoalPositions(goals, orderedCurrentGoalIds);
  saveGoals(updatedGoals);
  saveGoalOrderPreference({ manualOrder: true });
  return updatedGoals;
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
export function getHydratedGoals(goals: Goal[], manualOrder = false): {
  currentGoals: Goal[];
  completedGoals: Goal[];
} {
  return {
    currentGoals: sortCurrentGoals(goals, manualOrder),
    completedGoals: sortCompletedGoals(goals),
  };
}
