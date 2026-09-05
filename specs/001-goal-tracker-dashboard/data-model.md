# Data Model: Goal Tracker Dashboard

## Entity: Goal

Represents one objective stored in the browser for the current user profile.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Client-generated stable identifier, suitable for React keys and updates. |
| `title` | string | Yes | User-entered goal title after trimming whitespace. |
| `endDate` | string | Yes for current goals | ISO calendar date in `yyyy-MM-dd` format from the date input. |
| `status` | `current` \| `completed` | Yes | Determines which dashboard column renders the goal. |
| `createdAt` | string | Yes | ISO timestamp for record creation. |
| `completedAt` | string | Required when completed | ISO timestamp set when the checkbox marks a goal complete. |

### Derived Values

| Value | Source | Rule |
|-------|--------|------|
| `daysRemaining` | `endDate`, current browser date | Whole calendar-day difference between the goal end date and today. Shows `0` on the end date and negative values after the end date. |
| `isUrgent` | `daysRemaining` | `true` when `daysRemaining <= 3`, including overdue goals. |
| `displayDate` | `endDate` | Human-readable date formatted with date-fns for current goals. |

### Relationships

- The dashboard owns a collection of `Goal` records.
- Current and completed columns are filtered projections of the same collection.
- There is no user/account entity in this initial version.

### Validation Rules

- `title` must be present after trimming.
- `title` should be constrained in the UI so very long values truncate visually and do not break the card layout.
- `endDate` must be present for a new current goal.
- `endDate` must parse as a valid calendar date.
- `endDate` must not be earlier than today when creating a new goal.
- Completed goals do not display days remaining and do not expose a checkbox to reopen them.

### State Transitions

```text
new form submission -> current goal
current goal + checkbox checked -> completed goal
current goal + delete -> removed permanently
completed goal + delete -> removed permanently
```

Completion sets `status` to `completed` and writes `completedAt`. Deletion removes the record from localStorage with no confirmation or recovery state.

### Sorting Rules

- Current goals sort by `endDate` ascending, so the soonest deadline appears first.
- Completed goals sort by `completedAt` descending, so the most recently completed goal appears first.