# Feature Specification: Drag and Drop Goal Reordering

**Feature Branch**: `002-drag-reorder-goals`

**Created**: 2026-09-05

**Status**: Draft

**Input**: User description: "drag and drop - let's make it so that users can reorder goals by dragging and dropping them above or below other goals in the list."

## Clarifications

### Session 2026-09-05

- Q: When the user drags a goal into a custom position, should the Current Goals column permanently stop auto-sorting by soonest deadline — including for goals added later? → A: Yes — manual order fully replaces deadline sort once the user drags anything; new goals append to the bottom.
- Q: Before the user has ever dragged anything, should a brand-new goal still be placed by deadline order, or simply appended to the bottom? → A: Deadline sort remains the default until the first drag; after the first drag, new goals append to the bottom.
- Q: Should a drag start immediately when the user presses anywhere on a goal card, or only from a dedicated grab handle? → A: A dedicated grab handle on each card starts the drag; the rest of the card keeps its normal behavior.
- Q: Should keyboard-driven reordering ship with this feature or be deferred to a follow-up? → A: Ship with this feature, using the grab handle as the keyboard entry point.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Reorder goals by dragging (Priority: P1)

A user with several active goals grabs a goal card by its handle, drags it
above or below other goals in the Current Goals column, and drops it. The goal
settles into its new position and the surrounding goals shift to make room.

**Why this priority**: This is the entire point of the feature — without the
core drag-to-reposition interaction there is nothing to deliver.

**Independent Test**: With three active goals A, B, C on the board, drag C
above A and confirm the column reads C, A, B immediately after the drop.

**Acceptance Scenarios**:

1. **Given** three active goals in the Current Goals column, **When** the user
   drags the third goal by its handle and drops it above the first goal,
   **Then** the dragged goal becomes the first item and the other two shift
   down by one position.
2. **Given** the user is dragging a goal, **When** the pointer moves over a
   position between two other goals, **Then** the list shows a clear
   indication of where the goal will land if dropped.
3. **Given** the user is dragging a goal, **When** the user releases it back
   on its original position or outside the list, **Then** the order is
   unchanged and the goal returns to its original slot.
4. **Given** only one active goal exists, **When** the user attempts to drag
   it, **Then** the interaction completes with no change to the list and no
   error.

---

### User Story 2 - Custom order is remembered (Priority: P1)

After arranging goals in a personally meaningful order, the user reloads the
page (or returns later in the same browser) and finds the goals still in the
order they arranged.

**Why this priority**: An order that resets on reload provides no lasting
value; persistence is what turns the interaction into a feature users can
rely on.

**Independent Test**: Reorder goals, reload the page, and confirm the column
renders in the same arranged order.

**Acceptance Scenarios**:

1. **Given** the user has dragged goals into a custom order, **When** the page
   is reloaded, **Then** the Current Goals column renders in that same custom
   order.
2. **Given** a custom order exists, **When** the user adds a new goal, **Then**
   the new goal is added to the list without disturbing the relative order of
   the existing goals.
3. **Given** a custom order exists, **When** the user completes or deletes a
   goal, **Then** the remaining goals keep their relative order and no gap or
   duplicate position appears.

---

### User Story 3 - Reordering works on touch devices (Priority: P2)

A user on a phone or tablet touches a goal card's grab handle, drags the card
to a new position with their finger, and releases it there.

**Why this priority**: The app is expected to be usable across mobile and
desktop, but the desktop pointer interaction can ship and demonstrate value
first.

**Independent Test**: On a touch-sized viewport, drag a goal by its handle
above another goal, release, and confirm the new order.

**Acceptance Scenarios**:

1. **Given** the dashboard on a narrow (mobile-width) viewport, **When** the
   user drags a goal card by its handle to a new position, **Then** the goal
   moves to that position on release.
2. **Given** the user is scrolling the goal column with a finger swipe,
   **When** the swipe starts anywhere other than a grab handle, **Then** the
   column scrolls normally and no drag begins.

---

### User Story 4 - Reordering without a pointer (Priority: P3)

A user who navigates with a keyboard focuses a goal's grab handle, activates
it, and moves the goal up or down the list using arrow keys, confirming or
cancelling the move.

**Why this priority**: Ensures the reordering capability is not exclusive to
pointer/touch users. It is in scope for this release, but the feature can be
built and demonstrated with pointer support first.

**Independent Test**: Tab to a goal's grab handle, activate it, press the
down arrow twice, confirm the move, and verify the goal has shifted two
positions down.

**Acceptance Scenarios**:

1. **Given** keyboard focus is on a goal's grab handle, **When** the user
   activates it and presses the down arrow, **Then** the goal moves one
   position down the list.
2. **Given** a keyboard reorder is in progress, **When** the user cancels,
   **Then** the goal returns to its original position.
3. **Given** a goal has been moved by keyboard, **When** the move is
   confirmed, **Then** the new position is announced to assistive technology
   and persists like a pointer-driven reorder.

---

### Edge Cases

- What happens when the user drops a goal outside the column or on a
  non-droppable area? The reorder is cancelled and the original order is
  restored.
- What happens when a drag is interrupted (window loses focus, page becomes
  hidden, or the user presses Escape)? The drag is cancelled and the order is
  unchanged.
- What happens when the list is longer than the visible column? The column
  scrolls automatically while a goal is dragged near its top or bottom edge so
  the user can reach off-screen drop positions.
- What happens when a goal is dragged onto the Completed Goals column? Nothing
  changes — cross-column dragging is not supported and the goal returns to its
  original position.
- What happens when goals were created before this feature existed and have no
  recorded position? They receive positions matching their current on-screen
  order (soonest deadline first) the first time the dashboard loads.
- What happens if the stored order is incomplete or contains references to
  goals that no longer exist? Stale entries are ignored and any goal without a
  recorded position is placed at the end of the list, so no goal is ever
  hidden.
- What happens when a dragged goal is urgent/highlighted? Its highlight styling
  remains visible throughout the drag so the user does not lose track of it.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Each goal in the Current Goals column MUST present a dedicated,
  visible grab handle, and users MUST be able to reposition a goal by dragging
  it from that handle and dropping it above or below other goals in the same
  column.
- **FR-002**: While a goal is being dragged, the system MUST visually
  distinguish the dragged goal from the rest of the list (e.g., a lifted or
  in-motion appearance).
- **FR-003**: While a goal is being dragged over the list, the system MUST
  indicate the position the goal will occupy if dropped at that moment.
- **FR-004**: On drop, the goal MUST be placed at the indicated position and
  all other goals MUST shift accordingly so no two goals share a position.
- **FR-005**: A cancelled or invalid drag (dropped outside the list, Escape
  pressed, or the drag otherwise interrupted) MUST leave the goal order
  unchanged.
- **FR-006**: Until the user performs their first reorder, the Current Goals
  column MUST keep its automatic soonest-deadline-first ordering. From the
  first successful reorder onward, the user-defined order MUST permanently
  replace that automatic ordering and MUST persist across page reloads in the
  same browser.
- **FR-007**: Once a user-defined order is in effect, newly created goals MUST
  be appended to the end of the Current Goals list without altering the
  relative order of existing goals. Before the first reorder, newly created
  goals MUST continue to be placed by soonest-deadline-first ordering.
- **FR-008**: Completing or deleting a goal MUST preserve the relative order
  of the remaining goals.
- **FR-009**: A goal that returns to the Current Goals column (if it is ever
  re-opened) or a goal with no recorded position MUST be placed at the end of
  the list rather than being omitted.
- **FR-010**: Reordering MUST be operable by touch input on mobile-width
  viewports via the grab handle, and the handle MUST meet the minimum
  comfortable touch-target size so normal column scrolling elsewhere on the
  card is never interrupted.
- **FR-011**: Reordering MUST be operable by keyboard alone in this release,
  with the grab handle serving as the focusable entry point, allowing a goal
  to be moved up or down the list and the move to be confirmed or cancelled.
- **FR-012**: Position changes MUST be communicated to assistive technology
  (e.g., an announcement of the goal's new position in the list).
- **FR-013**: The Completed Goals column MUST continue to use its
  most-recently-completed-first ordering and MUST NOT be reorderable by drag
  and drop.
- **FR-014**: Goals MUST NOT be draggable between the Current Goals and
  Completed Goals columns; only reordering within the Current Goals column is
  supported.
- **FR-015**: The list MUST scroll automatically when a goal is dragged near
  the top or bottom edge of a scrollable goal column.
- **FR-016**: Existing goal interactions (completing via checkbox and
  deleting) MUST continue to work unchanged, and because dragging is confined
  to the grab handle they MUST NOT be triggered by a drag gesture.

### Key Entities

- **Goal**: Existing entity, extended with a user-defined ordering position.
  - `position` (ordinal): The goal's place within the user-defined Current
    Goals order. Unique among current goals; assigned on creation and updated
    when the user reorders. Goals lacking a position sort last.
  - All other existing attributes (title, end date, status, timestamps) are
    unchanged by this feature.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can move a goal from the bottom of a 10-goal list to the
  top in a single drag gesture taking under 5 seconds.
- **SC-002**: 100% of reorder actions that complete successfully are still in
  effect after a page reload in the same browser.
- **SC-003**: The list responds to the drag gesture without perceptible lag,
  with the drop-position indicator updating as the user moves.
- **SC-004**: 95% of first-time users successfully reorder a goal on their
  first attempt without instructions.
- **SC-005**: Reordering is completable using touch-only and keyboard-only
  input, in addition to mouse, on both mobile-width and desktop-width
  viewports.
- **SC-006**: Zero goals are lost, duplicated, or hidden as a result of
  reordering, adding, completing, or deleting goals in any sequence.

## Assumptions

- The user-defined order intentionally supersedes the automatic
  soonest-deadline-first ordering for the Current Goals column, but only from
  the user's first reorder onward; a board that has never been reordered keeps
  the deadline ordering. Urgency remains visible through the existing urgent
  highlight, so no automatic re-sorting is reapplied after the user takes
  manual control.
- Only the Current Goals column is reorderable. The Completed Goals column is
  a historical record and keeps its most-recently-completed-first ordering.
- Dragging goals between columns is out of scope; completing a goal remains
  the only way to move it to the Completed column.
- Order is stored per-browser alongside existing goal data; there is no
  account or cross-device synchronization in this version.
- There is no "reset to deadline order" control in this version; if it is
  wanted it will be specified as a follow-up.
- Goal lists are expected to hold tens of goals, not thousands, so no
  virtualization or pagination is required.
- This feature builds on the existing goal dashboard (specs/001-goal-tracker-dashboard)
  and depends on its goal display and persistence behavior.
