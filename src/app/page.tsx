'use client';

import { useState, useEffect, useRef } from 'react';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { GripVertical, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Goal,
  loadGoals,
  saveGoals,
  addGoalWithOrdering,
  completeGoalWithOrdering,
  deleteGoalWithOrdering,
  getHydratedGoals,
  loadGoalOrderPreference,
  persistSuccessfulReorder,
} from '@/lib/goal-storage';
import { calculateDaysRemaining, isUrgent, formatEndDate, formatDaysRemaining } from '@/lib/goal-dates';

interface GoalCardContentProps {
  goal: Goal;
  onComplete: (goal: Goal) => void;
  onDelete: (goalId: string) => void;
  dragHandle?: React.ReactNode;
}

function GoalCardContent({ goal, onComplete, onDelete, dragHandle }: GoalCardContentProps) {
  const daysLeft = calculateDaysRemaining(goal.endDate);
  const isUrgentGoal = isUrgent(goal.endDate);
  const displayDate = formatEndDate(goal.endDate);
  const daysDisplay = formatDaysRemaining(daysLeft);

  return (
    <div
      className={`border rounded-lg p-4 transition-colors ${
        isUrgentGoal
          ? 'bg-urgent/50 border-orange-300'
          : 'bg-card border-border hover:border-primary/50'
      }`}
    >
      <div className="flex items-start gap-3">
        {dragHandle}
        <Checkbox
          checked={false}
          onCheckedChange={() => onComplete(goal)}
          className="mt-1"
          aria-label={`Complete ${goal.title}`}
        />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground break-words">{goal.title}</p>
          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground flex-wrap">
            <span>{displayDate}</span>
            <span className={isUrgentGoal ? 'font-semibold text-orange-600' : ''}>
              {daysDisplay}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onDelete(goal.id)}
          className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
          aria-label={`Delete ${goal.title}`}
          title="Delete goal"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

interface SortableGoalCardProps {
  goal: Goal;
  onComplete: (goal: Goal) => void;
  onDelete: (goalId: string) => void;
}

function SortableGoalCard({ goal, onComplete, onDelete }: SortableGoalCardProps) {
  const { attributes, listeners, setActivatorNodeRef, setNodeRef, transform, transition, isDragging } = useSortable({
    id: goal.id,
    data: { goal },
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition,
      }}
      className={isDragging ? 'opacity-30' : ''}
    >
      <GoalCardContent
        goal={goal}
        onComplete={onComplete}
        onDelete={onDelete}
        dragHandle={
          <button
            ref={setActivatorNodeRef}
            type="button"
            {...attributes}
            {...listeners}
            className="mt-0.5 flex min-h-11 min-w-11 touch-none items-center justify-center text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`Reorder ${goal.title}`}
            title={`Reorder ${goal.title}`}
          >
            <GripVertical className="size-5" aria-hidden="true" />
          </button>
        }
      />
    </div>
  );
}

export default function Home() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isManualOrder, setIsManualOrder] = useState(false);
  const [activeGoal, setActiveGoal] = useState<Goal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const hydratedRef = useRef(false);

  // Hydrate goals from localStorage on mount
  useEffect(() => {
    if (!hydratedRef.current) {
      hydratedRef.current = true;
      const stored = loadGoals();
      setGoals(stored);
      setIsManualOrder(loadGoalOrderPreference().manualOrder);
      setIsHydrated(true);
    }
  }, []);

  const { currentGoals, completedGoals } = getHydratedGoals(goals, isManualOrder);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  // Validate form inputs
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formTitle.trim()) {
      errors.title = 'Title is required';
    }

    if (!formDate) {
      errors.date = 'End date is required';
    } else {
      const today = new Date().toISOString().split('T')[0];
      if (formDate < today) {
        errors.date = 'End date must be today or in the future';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const updatedGoals = addGoalWithOrdering(goals, formTitle, formDate, isManualOrder);
    saveGoals(updatedGoals);
    setGoals(updatedGoals);

    // Reset form and close modal
    setFormTitle('');
    setFormDate('');
    setFormErrors({});
    setIsModalOpen(false);
  };

  // Handle goal completion
  const handleCompleteGoal = (goal: Goal) => {
    const updatedGoals = completeGoalWithOrdering(goals, goal.id, isManualOrder);
    saveGoals(updatedGoals);
    setGoals(updatedGoals);
  };

  // Handle goal deletion
  const handleDeleteGoal = (goalId: string) => {
    const updatedGoals = deleteGoalWithOrdering(goals, goalId, isManualOrder);
    saveGoals(updatedGoals);
    setGoals(updatedGoals);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveGoal(event.active.data.current?.goal as Goal);
  };

  const handleDragCancel = () => {
    setActiveGoal(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveGoal(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = currentGoals.findIndex((goal) => goal.id === active.id);
    const newIndex = currentGoals.findIndex((goal) => goal.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const orderedCurrentGoalIds = arrayMove(currentGoals, oldIndex, newIndex).map((goal) => goal.id);
    const updatedGoals = persistSuccessfulReorder(goals, orderedCurrentGoalIds);
    setGoals(updatedGoals);
    setIsManualOrder(true);
  };

  // Reset modal state when closing
  const handleModalOpenChange = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setFormTitle('');
      setFormDate('');
      setFormErrors({});
    }
  };

  if (!isHydrated) {
    return null; // Avoid hydration mismatch
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">doit</h1>
          <Button onClick={() => setIsModalOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
            Add Goal
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Goals Column */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Current Goals</h2>
            {currentGoals.length === 0 ? (
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <p className="text-muted-foreground">No active goals yet. Add one to get started!</p>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragCancel={handleDragCancel}
                onDragEnd={handleDragEnd}
                accessibility={{
                  announcements: {
                    onDragStart: ({ active }) => `Picked up ${active.data.current?.goal?.title ?? 'goal'}.`,
                    onDragOver: ({ over }) => over ? `Moving over ${over.data.current?.goal?.title ?? 'goal'}.` : undefined,
                    onDragEnd: ({ active, over }) => {
                      const goalTitle = active.data.current?.goal?.title ?? 'Goal';
                      const position = currentGoals.findIndex((goal) => goal.id === over?.id) + 1;
                      return position > 0 ? `${goalTitle} moved to position ${position} of ${currentGoals.length}.` : undefined;
                    },
                    onDragCancel: ({ active }) => `${active.data.current?.goal?.title ?? 'Goal'} was not moved.`,
                  },
                  screenReaderInstructions: {
                    draggable: 'To pick up a goal, press Space or Enter. Use the arrow keys to move it, Space or Enter to drop, and Escape to cancel.',
                  },
                }}
              >
                <SortableContext items={currentGoals.map((goal) => goal.id)} strategy={verticalListSortingStrategy}>
                  <div className="goal-list space-y-3">
                    {currentGoals.map((goal) => (
                      <SortableGoalCard
                        key={goal.id}
                        goal={goal}
                        onComplete={handleCompleteGoal}
                        onDelete={handleDeleteGoal}
                      />
                    ))}
                  </div>
                </SortableContext>
                <DragOverlay>
                  {activeGoal ? (
                    <div className="pointer-events-none rotate-1 shadow-xl" aria-hidden="true">
                      <GoalCardContent goal={activeGoal} onComplete={handleCompleteGoal} onDelete={handleDeleteGoal} />
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            )}
          </section>

          {/* Completed Goals Column */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Completed Goals</h2>
            {completedGoals.length === 0 ? (
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <p className="text-muted-foreground">No completed goals yet. Complete one to see it here!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {completedGoals.map((goal) => (
                  <div key={goal.id} className="border border-border rounded-lg p-4 bg-card/50 hover:bg-card transition-colors">
                    <div className="flex items-start gap-3">
                      <Checkbox checked={true} disabled className="mt-1" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground line-through break-words opacity-75">
                          {goal.title}
                        </p>
                      </div>
                        <button
                          type="button"
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                        aria-label={`Delete ${goal.title}`}
                        title="Delete goal"
                      >
                          <X className="size-5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Add Goal Modal */}
      <Dialog open={isModalOpen} onOpenChange={handleModalOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add a New Goal</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title Field */}
            <div className="space-y-2">
              <Label htmlFor="goal-title">Title</Label>
              <Input
                id="goal-title"
                placeholder="What's your goal?"
                value={formTitle}
                onChange={(e) => {
                  setFormTitle(e.target.value);
                  if (formErrors.title) {
                    setFormErrors((prev) => {
                      const updated = { ...prev };
                      delete updated.title;
                      return updated;
                    });
                  }
                }}
                className={formErrors.title ? 'border-destructive' : ''}
              />
              {formErrors.title && (
                <p className="text-sm text-destructive">{formErrors.title}</p>
              )}
            </div>

            {/* Date Field */}
            <div className="space-y-2">
              <Label htmlFor="goal-date">End Date</Label>
              <Input
                id="goal-date"
                type="date"
                value={formDate}
                onChange={(e) => {
                  setFormDate(e.target.value);
                  if (formErrors.date) {
                    setFormErrors((prev) => {
                      const updated = { ...prev };
                      delete updated.date;
                      return updated;
                    });
                  }
                }}
                className={formErrors.date ? 'border-destructive' : ''}
              />
              {formErrors.date && (
                <p className="text-sm text-destructive">{formErrors.date}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleModalOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Create Goal
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
