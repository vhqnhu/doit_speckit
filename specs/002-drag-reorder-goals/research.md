# Research: Drag and Drop Goal Reordering

## Decision: Use `@dnd-kit/core` with `@dnd-kit/sortable`

**Rationale**: The library provides sortable transforms, pointer/touch and keyboard sensors, drag-overlay support, accessible live-region announcements, and list auto-scrolling. It integrates directly with React and Tailwind classes, so the existing dashboard can retain its visual and state-management pattern. Reordering starts only from the dedicated handle by applying drag listeners and attributes to that control.

**Alternatives considered**: Native HTML drag events were rejected because they do not provide a dependable touch or keyboard experience and would require bespoke announcements, insertion feedback, and auto-scroll. A custom pointer implementation was rejected because it recreates a mature interaction primitive. Existing `@base-ui/react` was rejected because it does not provide sortable drag-and-drop behavior.

## Decision: Persist manual-order mode separately from goal records

**Rationale**: Store `{ "manualOrder": boolean }` at a new versioned localStorage key while continuing to store the raw Goal array at `doit.goals.v1`. The mode remains true even if all current goals are completed or deleted, ensuring a later new goal appends rather than restoring deadline sorting. This preserves backward compatibility with existing stored goal arrays.

**Alternatives considered**: Inferring manual mode from the presence of a position fails when there are no current goals. Migrating the goal collection into a new object envelope was rejected because a separate tiny metadata record avoids a broad data migration and keeps the established goal storage format intact.

## Decision: Use dense ordinal positions only for current goals

**Rationale**: After a successful reorder, derive the ordered current-goal IDs and write `position` values `0..n-1`. Additions in manual mode receive the next ordinal. Completion and deletion compact the remaining current positions. Sorting by `position` in manual mode, with positionless records after positioned ones, ensures no current goal is hidden even if stored data is incomplete.

**Alternatives considered**: Fractional positions reduce immediate rewrites but complicate recovery and can lose precision after repeated moves. Retaining gaps offers no user value and conflicts with the requirement for no duplicate or empty positions.

## Decision: Retain automatic deadline sorting until a successful reorder

**Rationale**: The storage helper reads `manualOrder`. When false, it sorts current goals by `endDate` ascending exactly as it does today. The first valid pointer or keyboard reorder writes positions and enables manual mode atomically with the goals update. A cancelled drag and a keyboard cancellation make no persistence change.

**Alternatives considered**: Assigning positions at initial hydration would silently replace deadline ordering before the user acts. Keeping an in-memory-only mode would lose the required behavior on reload.

## Decision: Use dnd-kit keyboard behavior with explicit commit and cancel state

**Rationale**: The handle is focusable and uses the keyboard sensor. Activating it starts a provisional reorder; arrow keys change its candidate position, Enter confirms, and Escape restores the pre-activation ordering. Configure screen-reader announcements with the goal title and one-based list position. Apply a minimum `min-h-11 min-w-11` handle target and pointer activation distance so touch scrolling outside the handle remains normal.

**Alternatives considered**: Immediate persistence on every arrow key would make Escape unable to restore the original sequence. Making the whole card draggable would conflict with the existing checkbox, delete control, and normal touch scrolling.

## Decision: Verify with static gates and manual browser scenarios

**Rationale**: Constitution V prohibits all automated test suites. The feature can be verified by the focused scenarios in [quickstart.md](./quickstart.md), then `npm run lint` and `npx tsc --noEmit`.

**Alternatives considered**: Unit, component, and end-to-end tests were rejected because they violate the project constitution.