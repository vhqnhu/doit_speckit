# Feature Specification: Goal Tracker Dashboard

**Feature Branch**: `001-goal-tracker-dashboard`

**Created**: 2026-09-05

**Status**: Draft

**Input**: User description: "initial page setup - this application should be a goal tracking web app called 'doit'. There should be two columns - a left one where current goals are shown, along with how many days left the user has to achieve the goal, and a right one where completed goals are. Each goal can be 'checked' using a checkbox, and then either moved to the completed column or permanently deleted. To add new goals, a user can click on a button to open a new goal form in a modal (title and end date fields). Goals reaching their end date (within 3 days) are highlighted. Let's use a modern light theme with fun pastel colours."

## Clarifications

### Session 2026-09-05

- Q: Should deleting a goal require a confirmation step before it's permanently removed? → A: No confirmation — delete immediately on click.
- Q: How should goals be ordered within the Current Goals column? → A: Soonest deadline first (most urgent goals at top).
- Q: How should goals be ordered within the Completed Goals column? → A: Most recently completed first.
- Q: How should an overdue goal (past its end date) display its remaining-time indicator? → A: Negative day count, e.g. "-2 days left".

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View goals at a glance (Priority: P1)

A user opens "doit" and immediately sees all of their active goals in a left
column, each showing the goal title and how many days remain to reach it, and
all of their completed goals in a right column.

**Why this priority**: Without a working dashboard view, none of the other
interactions (adding, completing, deleting) have anywhere to happen. This is
the minimum viable slice of the app.

**Independent Test**: Load the page with a mix of active and completed goals
already present and confirm each goal appears in the correct column with the
correct days-remaining count.

**Acceptance Scenarios**:

1. **Given** at least one active goal and one completed goal exist, **When**
   the page loads, **Then** the active goal appears in the left column and the
   completed goal appears in the right column.
2. **Given** an active goal with an end date 10 days from today, **When** the
   dashboard renders, **Then** the goal displays "10 days left" (or
   equivalent) next to its title.
3. **Given** no goals exist yet, **When** the page loads, **Then** both
   columns show an empty-state message inviting the user to add a goal.

---

### User Story 2 - Add a new goal (Priority: P1)

A user clicks a clearly visible button to open a modal containing a form with
a title field and an end date field, submits it, and sees the new goal appear
in the left (current) column.

**Why this priority**: Creating goals is the core input mechanism; without it
the dashboard has no data to show.

**Independent Test**: Click the add-goal button, fill in a title and a future
end date, submit, and verify the goal now appears in the current-goals
column with the correct remaining-days count.

**Acceptance Scenarios**:

1. **Given** the dashboard is open, **When** the user clicks the "Add Goal"
   button, **Then** a modal opens with a title field and an end date field.
2. **Given** the modal is open, **When** the user enters a title and a valid
   future end date and submits, **Then** the modal closes and the new goal
   appears in the current-goals column, positioned according to the
   soonest-deadline-first ordering.
3. **Given** the modal is open, **When** the user submits without a title or
   without an end date, **Then** the form shows a validation message and does
   not create a goal.
4. **Given** the modal is open, **When** the user closes it without
   submitting, **Then** no goal is created and the dashboard is unchanged.

---

### User Story 3 - Complete or delete a goal (Priority: P2)

A user checks the checkbox on an active goal to mark it achieved, moving it
to the completed column, or removes a goal entirely (from either column)
using a delete control.

**Why this priority**: Builds on Story 1's display and Story 2's creation by
letting the goal list evolve over time; important but the app is still
usable for viewing/adding without it initially.

**Independent Test**: With an active goal on the board, check its checkbox
and confirm it moves to the completed column; separately, delete a goal and
confirm it disappears entirely from the board.

**Acceptance Scenarios**:

1. **Given** an active goal in the left column, **When** the user checks its
   checkbox, **Then** the goal is removed from the left column and appears in
   the right (completed) column.
2. **Given** a goal in either column, **When** the user activates its delete
   control, **Then** the goal is immediately and permanently removed from the
   board with no confirmation prompt, and does not reappear on reload.
3. **Given** a completed goal, **When** the user views the right column,
   **Then** the goal is shown without a days-remaining count and without an
   active checkbox to re-open it.

---

### User Story 4 - Highlight urgent goals (Priority: P3)

A user scanning the current-goals column can immediately spot which goals are
due soon because those goals are visually highlighted.

**Why this priority**: A refinement on top of Story 1's display; valuable for
prioritization but not required for the dashboard to function.

**Independent Test**: Create goals with end dates 1, 3, and 10 days out and
confirm only the 1-day and 3-day goals render with the urgent highlight
style.

**Acceptance Scenarios**:

1. **Given** an active goal with an end date 3 or fewer days from today,
   **When** the dashboard renders, **Then** that goal is displayed with a
   distinct highlighted style.
2. **Given** an active goal with an end date more than 3 days away, **When**
   the dashboard renders, **Then** that goal displays with the standard
   (non-highlighted) style.
3. **Given** an active goal whose end date has already passed, **When** the
   dashboard renders, **Then** that goal is still shown in the current-goals
   column with the highlighted/urgent style.

---

### Edge Cases

- What happens when a goal's end date is today? It counts as 0 days left and
  is shown with the urgent highlight.
- What happens when a goal's end date has already passed? It remains in the
  current-goals column (not auto-completed or auto-deleted) and is shown
  with the urgent highlight so the user notices it needs attention.
- How does the system handle a very long goal title? The title truncates
  visually (e.g., with an ellipsis) rather than breaking the layout.
- What happens if the user tries to submit the new-goal form with an end
  date in the past? The form shows a validation message and does not create
  the goal.
- What happens when there are many goals in one column? The column scrolls
  independently so both columns stay visible without collapsing the layout.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The dashboard MUST display two columns: a left "Current Goals"
  column and a right "Completed Goals" column.
- **FR-002**: Each goal in the current-goals column MUST display its title
  and the number of days remaining until its end date.
- **FR-003**: The system MUST calculate days remaining as the whole-day
  difference between the goal's end date and the current date, showing 0 on
  the end date itself and a negative day count (e.g., "-2 days left") once
  the end date has passed.
- **FR-004**: Users MUST be able to open an "Add Goal" modal via a visible
  button on the dashboard.
- **FR-005**: The Add Goal modal MUST contain a title field and an end date
  field, and MUST require both to be filled with a valid, non-past end date
  before a goal can be created.
- **FR-006**: Submitting a valid Add Goal form MUST create a new goal in the
  current-goals column and close the modal.
- **FR-007**: Each active goal MUST have a checkbox that, when checked,
  moves the goal from the current-goals column to the completed-goals
  column.
- **FR-008**: Each goal, in either column, MUST have a delete control that
  immediately and permanently removes the goal from the board when
  activated, with no confirmation step.
- **FR-009**: Completed goals MUST be displayed without a days-remaining
  count and without an active "mark complete" checkbox.
- **FR-010**: Any active goal whose end date is within 3 days (inclusive) of
  the current date, including goals whose end date has already passed, MUST
  be visually highlighted as urgent.
- **FR-011**: Goals MUST persist across page reloads within the same browser
  (no server-side account or login required for this initial version).
- **FR-012**: The overall visual design MUST use a light color theme with
  pastel accent colors for interactive and highlighted elements.
- **FR-013**: The dashboard layout MUST remain usable on both narrow
  (mobile-width) and wide (desktop-width) screens.
- **FR-014**: The Current Goals column MUST order goals by soonest deadline
  first (nearest end date at the top).
- **FR-015**: The Completed Goals column MUST order goals by most recently
  completed first.

### Key Entities

- **Goal**: Represents a single objective the user is tracking. Key
  attributes: title (text), end date (date), status (current or completed).
  Current goals derive a "days remaining" value from the end date; completed
  goals no longer show this value.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can create a new goal in under 15 seconds from clicking
  the add-goal button to seeing it appear on the board.
- **SC-002**: A user can identify, without scrolling or extra clicks, which
  of their current goals are due within 3 days, based solely on visual
  highlighting.
- **SC-003**: A user can move a goal to completed or delete it in a single
  interaction (one checkbox click or one delete action) with no confirmation
  steps required.
- **SC-004**: Goals a user created remain visible in the correct column after
  closing and reopening the browser tab, with no data loss.
- **SC-005**: The dashboard remains fully readable and operable on a mobile
  phone-width screen without horizontal scrolling.

## Assumptions

- This is a single-user, client-side experience for now: no login/accounts
  and no multi-device sync; goals are stored locally in the user's browser.
- "Checking" a goal's checkbox is the mechanism that marks it complete and
  moves it to the completed column; a separate, distinct delete control (not
  the checkbox) is what permanently removes a goal from either column.
- Deleting a goal is immediate and permanent; no "undo" or trash/recovery
  mechanism is in scope for this initial version.
- Goals whose end date has passed are not automatically deleted or
  auto-completed — they stay visible (highlighted) until the user completes
  or deletes them.
- No filtering controls are required for v1. Sorting is fixed (not
  user-configurable): Current Goals order by soonest deadline first;
  Completed Goals order by most recently completed first.
- "Modern light theme with fun pastel colours" refers to visual styling only
  and does not imply a dark-mode toggle or theme-switching capability in
  this initial version.
