# Quickstart: Goal Tracker Dashboard

## Prerequisites

- Node.js/npm compatible with the existing Next.js project.
- Dependencies installed with `npm install`.
- Feature dependencies added during implementation: shadcn UI components and date-fns.

## Run Locally

```powershell
npm run dev
```

Open the local Next.js URL shown by the command and navigate to `/`.

## Static Validation

Run the project quality gates after implementation:

```powershell
npm run lint
npx tsc --noEmit
```

No unit, integration, or end-to-end test commands are required or allowed for this project.

## Manual Scenarios

### Empty Dashboard

1. Clear localStorage key `doit.goals.v1` in the browser.
2. Load `/`.
3. Confirm Current Goals and Completed Goals both show empty states.
4. Confirm there is no horizontal scrolling on a mobile-width viewport.

### Add Current Goal

1. Click Add Goal.
2. Submit with an empty title or empty end date.
3. Confirm validation appears and no goal is created.
4. Enter a title and a future end date.
5. Submit and confirm the modal closes and the goal appears under Current Goals.
6. Reload the page and confirm the goal remains visible.

### Sorting and Date Display

1. Add goals due in 10 days, 1 day, and 3 days.
2. Confirm Current Goals sorts them soonest deadline first.
3. Confirm each current goal shows the correct whole-day days-left value.
4. Set up or edit localStorage with an overdue current goal and confirm it displays a negative days-left value.

### Urgent Highlighting

1. Compare current goals due in 1 day, 3 days, and 10 days.
2. Confirm only the goals due within 3 days are highlighted.
3. Confirm overdue current goals also use the urgent highlight style.

### Complete and Delete

1. Check the checkbox on a current goal.
2. Confirm it moves to Completed Goals, no longer shows days left, and does not expose an active checkbox.
3. Confirm completed goals sort by most recently completed first.
4. Delete one current goal and one completed goal.
5. Reload the page and confirm deleted goals do not reappear.

## Related Artifacts

- [Data model](./data-model.md)
- [UI contract](./contracts/ui-contract.md)
- [Local storage contract](./contracts/local-storage-contract.md)