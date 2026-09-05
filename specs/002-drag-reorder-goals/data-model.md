# Data Model: Drag and Drop Goal Reordering

## Entity: Goal

Extends the existing browser-stored goal record.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Existing client-generated stable identifier. |
| `title` | string | Yes | Existing trimmed goal title. |
| `endDate` | string | Yes | Existing `yyyy-MM-dd` due date. |
| `status` | `current` \| `completed` | Yes | Existing workflow state. |
| `createdAt` | string | Yes | Existing creation timestamp. |
| `completedAt` | string | When completed | Existing completion timestamp. |
| `position` | non-negative integer | In manual mode for current goals | Zero-based ordinal in the user-defined Current Goals sequence. Omitted for records that predate manual ordering or are not current. |

## Entity: Goal Order Preference

One browser-local metadata record independent of the Goal array.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `manualOrder` | boolean | Yes | `false` keeps the default deadline sort. `true` permanently selects user-defined Current Goals ordering for this browser profile. |

## Relationships

- The dashboard owns one Goal collection and one Goal Order Preference record.
- Only goals whose `status` is `current` participate in the manual ordering sequence.
- Completed goals retain the existing `completedAt` descending display order and do not participate in drag-and-drop.

## Validation Rules

- `position`, when present, must be a finite, non-negative integer.
- A valid persisted order has distinct, dense `position` values from `0` through current-goal-count minus one.
- Invalid, duplicate, stale, or missing positions must never hide a current goal. Positionless current goals sort after valid positioned goals and are compacted on the next successful reorder or current-goal mutation.
- `manualOrder` defaults to `false` for absent, malformed, or legacy metadata.
- A successful first reorder initializes all active goals with positions matching the displayed deadline-sorted sequence before applying the requested move.

## Ordering Transitions

```text
legacy/default goals + no successful reorder -> deadline order by endDate
successful current-goal reorder -> manualOrder: true + dense positions
manual order + create current goal -> append with next dense position
manual order + complete/delete current goal -> compact remaining positions
manual order + reload -> restore dense position order
cancelled/invalid reorder -> no goal or preference mutation
```

No current reopen operation exists today. Should one be added, it places the restored goal at the end of the manual sequence when `manualOrder` is true.