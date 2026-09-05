# Local Storage Contract: Goal Tracker Dashboard

## Storage Key

`doit.goals.v1`

## Value Format

The value is a JSON array of goal objects.

```json
[
  {
    "id": "goal_abc123",
    "title": "Ship the first dashboard",
    "endDate": "2026-09-12",
    "status": "current",
    "createdAt": "2026-09-05T10:30:00.000Z"
  },
  {
    "id": "goal_def456",
    "title": "Sketch pastel theme",
    "endDate": "2026-09-06",
    "status": "completed",
    "createdAt": "2026-09-05T09:00:00.000Z",
    "completedAt": "2026-09-05T11:00:00.000Z"
  }
]
```

## Read Rules

- Missing key means no goals exist yet.
- Invalid JSON or non-array values should be treated as an empty collection for rendering stability.
- Records missing required fields should be ignored rather than crashing the page.

## Write Rules

- Create, complete, and delete actions write the full updated array immediately.
- Dates are stored as strings; `endDate` uses `yyyy-MM-dd`, while timestamps use ISO date-time strings.
- The implementation should preserve only fields defined in this contract.

## Compatibility

Future storage migrations should use a new versioned key or an explicit migration path. This initial version does not need multi-device sync, server backup, or import/export.