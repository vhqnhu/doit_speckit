# Local Storage Contract: Goal Reordering

## Keys

| Key | Value | Ownership |
|-----|-------|-----------|
| `doit.goals.v1` | JSON array of Goal records | Existing goal-storage helper, extended with optional `position`. |
| `doit.goal-order.v1` | JSON object `{ "manualOrder": boolean }` | Goal ordering helper. |

## Read Behavior

- Missing or malformed `doit.goals.v1` reads as an empty collection, matching existing behavior.
- Missing or malformed `doit.goal-order.v1` reads as `{ "manualOrder": false }`.
- Legacy Goal records without `position` remain valid.
- A stored `position` is valid only when it is a non-negative integer. Invalid values are treated as missing.

## Write Behavior

- A successful pointer or keyboard reorder writes the complete Goal array with dense current-goal positions and writes `{ "manualOrder": true }`.
- A cancelled, invalid, interrupted, or unchanged reorder writes neither key.
- In manual mode, creating, completing, or deleting a goal writes compacted positions for current goals and retains `manualOrder: true`.
- In default mode, creation preserves the existing goal-array behavior and does not create positions solely for display sorting.

## Compatibility and Recovery

- The raw Goal array key remains unchanged, avoiding a breaking migration for existing browsers.
- Entries referencing deleted goals cannot exist because positions are fields on the records themselves.
- Missing or incomplete positions place affected current goals after valid positioned goals; every valid Goal is rendered.