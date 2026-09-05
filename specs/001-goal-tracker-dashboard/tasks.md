# Tasks: Goal Tracker Dashboard

**Input**: Design documents from `/specs/001-goal-tracker-dashboard/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Note**: Manual verification scenarios are included in spec.md user stories and quickstart.md; no automated test tasks are included per project Constitution Principle V (No Testing).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and core UI foundation for the `doit` dashboard.

**Prerequisite**: Run `npx shadcn-ui@latest init` in the project root before starting Phase 1, if shadcn has not been initialized yet.

- [ ] T001 Create the feature entry page scaffold and align the dashboard layout with the app router in src/app/page.tsx
- [ ] T002 Set up the pastel light theme tokens and global Tailwind styling in src/app/globals.css
- [ ] T003 [P] Add the shadcn UI primitives (Button, Dialog, Input, Checkbox, Label, and form field patterns) under src/components/ui/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core persistence and date logic that must exist before user stories can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T004 Implement browser localStorage validation, load/save helpers, and versioned key handling in src/lib/goal-storage.ts
- [ ] T005 [P] Implement date math and urgency helpers using date-fns in src/lib/goal-dates.ts
- [ ] T006 [P] Define the consistent goal sort and hydration rules for current/completed records in src/lib/goal-storage.ts and src/lib/goal-dates.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - View goals at a glance (Priority: P1) 🎯 MVP

**Goal**: Render the dashboard with both columns, empty states, and persisted goals sorted correctly.

**Independent Test**: Load the page with a mix of active and completed goals already present and confirm each goal appears in the correct column with the correct days-remaining count.

### Implementation for User Story 1

- [ ] T007 [P] [US1] Build the dashboard shell with Current Goals and Completed Goals columns in src/app/page.tsx
- [ ] T008 [P] [US1] Render goal cards, empty states, and current/completed sorting in src/app/page.tsx
- [ ] T009 [US1] Wire localStorage hydration, date counts, and deadline display to the dashboard in src/app/page.tsx and src/lib/goal-storage.ts

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Add a new goal (Priority: P1)

**Goal**: Allow a user to open the add-goal dialog, submit valid input, and create a goal that persists immediately.

**Independent Test**: Click the add-goal button, fill in a title and a future end date, submit, and verify the goal now appears in the current-goals column with the correct remaining-days count.

### Implementation for User Story 2

- [ ] T010 [P] [US2] Add the Add Goal button and modal shell with title and end-date form fields in src/app/page.tsx
- [ ] T011 [P] [US2] Implement validation, modal close/reset behavior, and error messaging in src/app/page.tsx
- [ ] T012 [US2] Create new goals, persist them under the versioned localStorage key, and insert them into the soonest-deadline order in src/app/page.tsx and src/lib/goal-storage.ts

**Checkpoint**: At this point, User Stories 1 and 2 should both work independently.

---

## Phase 5: User Story 3 - Complete or delete a goal (Priority: P2)

**Goal**: Let users mark goals complete or remove them immediately without confirmation.

**Independent Test**: With an active goal on the board, check its checkbox and confirm it moves to the completed column; separately, delete a goal and confirm it disappears entirely from the board.

### Implementation for User Story 3

- [ ] T013 [P] [US3] Add completion checkbox behavior so current goals move to Completed Goals and persist completedAt in src/app/page.tsx
- [ ] T014 [P] [US3] Add delete controls for current and completed goals with immediate removal and localStorage persistence in src/app/page.tsx
- [ ] T015 [US3] Ensure completed goals render without remaining-day values and without an active checkbox in src/app/page.tsx

**Checkpoint**: User Story 3 should now be independently functional.

---

## Phase 6: User Story 4 - Highlight urgent goals (Priority: P3)

**Goal**: Distinguish goals due within 3 days or already overdue so they stand out visually.

**Independent Test**: Create goals with end dates 1, 3, and 10 days out and confirm only the 1-day and 3-day goals render with the urgent highlight style.

### Implementation for User Story 4

- [ ] T016 [P] [US4] Apply the urgent highlight styling and due-soon visual treatment in src/app/page.tsx and src/app/globals.css
- [ ] T017 [US4] Ensure overdue goals remain visible in Current Goals while showing the highlight and negative days-left value in src/app/page.tsx and src/lib/goal-dates.ts

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final responsiveness, accessibility, and quality polish across the entire dashboard.

- [ ] T018 [P] Refine responsive layout and truncation behaviors so the app stays readable on mobile and desktop in src/app/page.tsx and src/app/globals.css
- [ ] T019 Run lint and TypeScript validation for the feature and confirm the manual quickstart scenarios still match the implementation in src/app/page.tsx, src/app/globals.css, and src/lib/goal-storage.ts

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational completion
  - User Story 1 (P1): can start after Phase 2
  - User Story 2 (P1): can start after Phase 2
  - User Story 3 (P2): can start after Phase 2
  - User Story 4 (P3): can start after Phase 2
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies on other stories
- **User Story 2 (P1)**: No dependencies on other stories; builds on the same goal model and persistence layer
- **User Story 3 (P2)**: Builds on User Story 1 and User Story 2 behavior
- **User Story 4 (P3)**: Builds on User Story 1 behavior and urgency calculations

### Within Each User Story

- Core implementation before integration polish
- Story complete before moving to the next priority
- Keep each story independently testable and recoverable without cross-story assumptions

### Parallel Opportunities

- Setup tasks across different files can run in parallel.
- Foundational storage and date helper work can proceed in parallel once Setup is done.
- Story 1, Story 2, Story 3, and Story 4 workstreams can all be developed in parallel after foundational logic is complete.
- Within each user story, model/helper and UI tasks marked [P] can run in parallel when different files are involved.

---

## Parallel Example: User Story 1

```bash
# Launch the dashboard shell and list rendering work together:
Task: "Build the dashboard shell with Current Goals and Completed Goals columns in src/app/page.tsx"
Task: "Render goal cards, empty states, and current/completed sorting in src/app/page.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Confirm the dashboard renders and persists correctly before continuing
5. Expand to Story 2, Story 3, and Story 4 incrementally

### Incremental Delivery

1. Setup + Foundational → shared model and date logic ready
2. User Story 1 → core dashboard view and localStorage hydration
3. User Story 2 → add new goal flow
4. User Story 3 → complete and delete interactions
5. User Story 4 → urgent highlighting and final polish

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once foundational work is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
   - Developer D: User Story 4
3. Final polish and validation occur once each story is independently complete

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to a specific user story for traceability
- Each user story should be independently completable and testable
- Keep each task concrete enough to implement without additional interpretation
- Stop at each checkpoint to validate the story independently
- Avoid vague tasks, repeated work, or cross-story assumptions that break independence
