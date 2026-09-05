# UI Contract: Goal Tracker Dashboard

## Dashboard Surface

The initial route `/` renders the `doit` dashboard.

### Required Regions

| Region | Behavior |
|--------|----------|
| Header | Shows the app name `doit` and a visible Add Goal action. |
| Current Goals column | Shows active goals with title, days-left indicator, due date context, completion checkbox, and delete control. |
| Completed Goals column | Shows completed goals with title and delete control, without days-left indicator or active completion checkbox. |

### Empty States

- If there are no current goals, the Current Goals column displays an empty state inviting the user to add a goal.
- If there are no completed goals, the Completed Goals column displays an empty state that does not imply extra setup.

## Add Goal Modal

Opened from the dashboard Add Goal action.

### Fields

| Field | Input Type | Required | Validation |
|-------|------------|----------|------------|
| Title | text | Yes | Must be non-empty after trimming. |
| End date | date | Yes | Must be today or a future date. |

### Submit Behavior

- Valid submission creates a current goal, closes the modal, clears the form, persists the updated collection, and places the new goal according to soonest-deadline sorting.
- Invalid submission keeps the modal open and shows validation text near the invalid field.
- Closing the modal without submitting creates no goal.

## Goal Actions

| Action | Available On | Result |
|--------|--------------|--------|
| Check completion checkbox | Current goal | Moves the goal to Completed Goals, sets `completedAt`, and persists immediately. |
| Delete | Current or completed goal | Removes the goal immediately and permanently with no confirmation prompt. |

## Visual States

- Current goals due in 3 or fewer days are visually highlighted with the urgent pastel style.
- Overdue current goals remain in Current Goals and use the same urgent style.
- Long titles truncate visually instead of changing the column width.
- Columns remain usable without horizontal scrolling on mobile-width screens.