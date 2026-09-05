---

description: "Implementation tasks for drag and drop goal reordering"

---

# Tasks: Drag and Drop Goal Reordering

**Input**: Design documents from `/specs/002-drag-reorder-goals/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [quickstart.md](./quickstart.md), and [contracts/](./contracts/)

**Tests**: No automated test tasks are included. Constitution Principle V prohibits automated test suites; validate with the manual scenarios in [quickstart.md](./quickstart.md), `npm run lint`, and `npx tsc --noEmit`.

**Organization**: Tasks are grouped by user story so every increment can be implemented and manually verified independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel with other tasks in its phase because it changes different files and has no incomplete-task dependency.
- **[Story]**: The user story served by the task, such as `US1`.
- Every task names its exact target file path.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add the approved accessible sortable-interaction dependencies.

- [X] T001 Add `@dnd-kit/core` and `@dnd-kit/sortable` runtime dependencies and lockfile entries in package.json and package-lock.json

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Extend the goal persistence abstraction with backward-compatible manual ordering before rendering any sortable controls.

**CRITICAL**: Complete this phase before beginning user-story work.

- [X] T002 Extend the Goal model with optional validated `position` data and add resilient `doit.goal-order.v1` manual-order preference load/save helpers in src/lib/goal-storage.ts
- [X] T003 Implement deadline/manual current-goal sorting with invalid-position recovery and dense-position normalization in src/lib/goal-storage.ts
- [X] T004 Implement atomic successful-reorder, manual-mode creation append, and completion/deletion compaction helpers in src/lib/goal-storage.ts

**Checkpoint**: The storage helper preserves legacy deadline ordering until a successful reorder and cannot hide a valid current goal with incomplete persisted positions.

---

## Phase 3: User Story 1 - Reorder goals by dragging (Priority: P1) MVP

**Goal**: Let a user reorder Current Goals by dragging a dedicated handle and safely cancel invalid interactions.

**Independent Test**: With current goals A, B, C, drag C by its handle above A and confirm the rendered order is C, A, B; dropping outside, pressing Escape, or dragging the sole goal leaves the order unchanged.

### Implementation for User Story 1

- [X] T005 [US1] Add a `DndContext`, sortable Current Goals context, pointer sensor, collision strategy, and drag lifecycle state without making Completed Goals draggable in src/app/page.tsx
- [X] T006 [US1] Render each Current Goal through a sortable card with a visible, title-named, focusable 44px grip handle while preserving checkbox and delete behavior in src/app/page.tsx
- [X] T007 [US1] Apply sortable transforms, lifted-card and insertion feedback, urgent styling in the drag overlay, and invalid-drag restoration in src/app/page.tsx
- [X] T008 [US1] Commit only valid changed pointer drops through the reorder persistence helper and refresh dashboard state in src/app/page.tsx

**Checkpoint**: Pointer reordering works only within Current Goals, reflects the intended destination during drag, and does not mutate order on cancellation.

---

## Phase 4: User Story 2 - Custom order is remembered (Priority: P1)

**Goal**: Persist manual ordering across reloads and preserve relative position when goals are created, completed, or deleted.

**Independent Test**: Reorder goals, reload, then add, complete, and delete goals; existing current goals retain their relative manual order and new current goals append.

### Implementation for User Story 2

- [X] T009 [US2] Hydrate and render Current Goals through the manual-order-aware storage helpers while retaining most-recently-completed ordering for Completed Goals in src/app/page.tsx
- [X] T010 [US2] Route goal creation, completion, and deletion through manual-order-aware storage mutations so positions append or compact without changing Completed Goals behavior in src/app/page.tsx
- [X] T011 [US2] Preserve every current goal during malformed, missing, duplicate, or stale persisted position recovery and write dense positions only on the next supported mutation in src/lib/goal-storage.ts

**Checkpoint**: A successful first reorder survives reload, manual mode remains enabled after all current goals are removed, and no current goal disappears during recovery or later mutations.

---

## Phase 5: User Story 3 - Reordering works on touch devices (Priority: P2)

**Goal**: Make the handle-based sortable interaction reliable on mobile without interfering with ordinary scrolling.

**Independent Test**: At a mobile-width viewport, drag a Current Goal by its handle above another goal, then swipe elsewhere on a card and confirm the column scrolls without starting a drag.

### Implementation for User Story 3

- [X] T012 [US3] Configure touch-capable pointer activation constraints and sortable auto-scroll so a gesture outside the handle keeps native scrolling while a handle drag can reach off-screen positions in src/app/page.tsx
- [X] T013 [US3] Refine responsive handle target, sortable-card feedback, and scrollable Current Goals column styling for mobile and desktop widths in src/app/page.tsx and src/app/globals.css

**Checkpoint**: Touch reordering works from handles only, normal card swipes scroll, and a long Current Goals list auto-scrolls near its edges.

---

## Phase 6: User Story 4 - Reordering without a pointer (Priority: P3)

**Goal**: Support keyboard sorting from the same grab handle, including commit, cancellation, and assistive-technology feedback.

**Independent Test**: Tab to a handle, activate sorting, move a goal down twice, confirm it, reload, and verify the final position; repeat then press Escape and verify the original order remains.

### Implementation for User Story 4

- [X] T014 [US4] Add a keyboard sensor and provisional keyboard reorder state so Enter or Space activates and commits, Arrow Up or Arrow Down moves within bounds, and Escape restores the pre-activation order in src/app/page.tsx
- [X] T015 [US4] Configure polite sortable announcements that identify the moved goal and one-based committed position, while retaining handle focus and accessible names in src/app/page.tsx

**Checkpoint**: Keyboard-only users can initiate, move, commit, and cancel Current Goal reordering; committed moves persist and are announced.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Verify the complete feature against its interaction, persistence, responsive, and static-quality requirements.

- [ ] T016 [P] Execute all default-order, recovery, cancellation, touch, keyboard, and long-list manual scenarios in specs/002-drag-reorder-goals/quickstart.md
- [X] T017 Run `npm run lint` and `npx tsc --noEmit`, resolving feature-related failures in src/app/page.tsx and src/lib/goal-storage.ts
- [X] T018 Review the completed implementation against drag-boundary, existing-control, urgent-overlay, responsive, and dependency-justification requirements in specs/002-drag-reorder-goals/spec.md and specs/002-drag-reorder-goals/plan.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: Starts immediately.
- **Phase 2 (Foundational)**: Depends on T001; blocks all user stories because it establishes the persisted ordering contract.
- **US1 (P1)**: Depends on Phase 2 and delivers the pointer reorder MVP.
- **US2 (P1)**: Depends on Phase 2 and T008 because it extends successful reorder persistence into reload and all goal mutations.
- **US3 (P2)**: Depends on US1 because it refines the pointer-driven sortable interaction for touch and long lists.
- **US4 (P3)**: Depends on US1 because it adds keyboard behavior to the existing sortable interaction.
- **Phase 7 (Polish)**: Depends on the user stories selected for release; run T016 after all stories, then T017 and T018.

### User Story Dependencies

```text
Setup -> Foundational -> US1 (pointer reorder MVP) -> US2 (persistent mutations)
                                      |-> US3 (touch and auto-scroll)
                                      |-> US4 (keyboard and announcements)
US2 + US3 + US4 -> Polish
```

## Parallel Opportunities

- After US1 is complete, US3 and US4 can proceed in parallel because each has a distinct interaction focus, though both modify src/app/page.tsx and therefore require coordinated integration.
- In the final phase, T016 can run in parallel with initial static validation in T017; address any feature-related static failures before T018.

## Parallel Example: User Story 3 and User Story 4

```text
Task: "Configure touch pointer activation and auto-scroll in src/app/page.tsx"
Task: "Add keyboard provisional reorder behavior and announcements in src/app/page.tsx"
```

Coordinate the two changes because they share `src/app/page.tsx`; they are behaviorally parallel but not safe for uncoordinated same-file edits.

## Implementation Strategy

### MVP First

1. Complete T001 through T004 to establish the compatible storage contract.
2. Complete T005 through T008 for pointer-based Current Goal reordering.
3. Manually validate US1 before adding persistence-mutation, touch, or keyboard refinements.

### Incremental Delivery

1. Setup + Foundational: dependency and manual-order data behavior ready.
2. US1: handle-only pointer reorder with clear visual feedback and cancellation.
3. US2: reload persistence and correct add/complete/delete transitions.
4. US3: touch activation safeguards and auto-scroll.
5. US4: keyboard commit/cancel workflow and announcements.
6. Polish: manual quickstart coverage plus lint and TypeScript validation.

## Notes

- All tasks use the required checklist format with sequential IDs and exact file paths.
- No automated test artifacts are planned, in accordance with Constitution Principle V.
- The Completed Goals column remains non-sortable and most-recently-completed-first throughout every phase.