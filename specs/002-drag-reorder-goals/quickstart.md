# Quickstart: Validate Goal Reordering

## Prerequisites

- Node.js/npm compatible with the existing Next.js application.
- Install dependencies with `npm install` after the drag-and-drop packages are added.
- Use a browser with localStorage enabled.

## Run Locally

```powershell
npm run dev
```

Open the local URL printed by Next.js and navigate to `/`.

## Static Validation

```powershell
npm run lint
npx tsc --noEmit
```

The constitution prohibits automated test suites. Use the manual scenarios below in addition to these static checks.

## Manual Scenarios

### Default Ordering and First Reorder

1. Clear `doit.goals.v1` and `doit.goal-order.v1` from localStorage.
2. Create current goals A, B, and C with distinct dates so the deadline sort is clear.
3. Confirm Current Goals is sorted by soonest deadline before any reorder.
4. Drag C by its handle above A.
5. Confirm the insertion state and lifted card are visible, then confirm the resulting list is C, A, B.
6. Reload and confirm C, A, B remains the rendered order.

### Mutation and Recovery

1. With manual order established, add a new goal and confirm it appears after all existing current goals.
2. Complete and then delete current goals; confirm the remaining goals retain their relative order.
3. Edit localStorage so one current goal lacks `position` or has an invalid position; reload and confirm no goal disappears and the affected goal appears at the end.
4. Complete or delete all current goals, add two goals with inverse deadlines, and confirm they append in creation order rather than returning to deadline sorting.

### Cancellation and Column Boundaries

1. Start dragging a goal and drop outside Current Goals; confirm no order change.
2. Start dragging a goal and press Escape; confirm no order change.
3. Drag onto Completed Goals; confirm neither column changes.
4. Attempt to drag a one-goal Current Goals list; confirm no error or unintended mutation.

### Touch and Keyboard

1. At a mobile-width viewport, drag from the handle and confirm a normal finger swipe on the rest of a card scrolls rather than starts a drag.
2. Use the handle near the top and bottom of a long Current Goals list; confirm the list auto-scrolls.
3. Tab to a handle, activate sorting, move it with Arrow Up or Arrow Down, then commit. Confirm an assistive-technology announcement names its position and reload preserves the result.
4. Repeat the keyboard move, then press Escape. Confirm the original order is restored.

## Related Artifacts

- [Implementation plan](./plan.md)
- [Research decisions](./research.md)
- [Data model](./data-model.md)
- [UI contract](./contracts/ui-contract.md)
- [Local storage contract](./contracts/local-storage-contract.md)