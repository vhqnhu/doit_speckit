# UI Contract: Drag and Drop Goal Reordering

This contract extends the dashboard surface defined for feature 001.

## Current Goal Card

| Element | Contract |
|---------|----------|
| Grab handle | Visible, focusable control with a familiar grip icon, accessible name containing the goal title, and a minimum 44 by 44px touch target. It is the only drag activator. |
| Checkbox | Continues to complete the goal and never starts a reorder. |
| Delete control | Continues to delete the goal and never starts a reorder. |
| Urgent styling | Remains visible for urgent cards during sorting and in the drag overlay. |

## Pointer and Touch Interaction

- Dragging from a Current Goal handle reorders only inside Current Goals.
- The dragged card has a visually distinct lifted or in-motion state.
- A clear insertion state shows the candidate destination while the card moves over the list.
- Releasing over a valid different position commits and persists the reorder.
- Releasing at the original position, outside Current Goals, over Completed Goals, or after interruption restores the original order without persisting.
- A dragged list auto-scrolls near its scrollable top and bottom edges.
- A touch gesture that begins outside a handle retains native column/page scrolling behavior.

## Keyboard Interaction

- Tab reaches each Current Goal handle.
- Enter or Space activates keyboard sorting for the focused handle.
- Arrow Up and Arrow Down move the provisional position by one item within bounds.
- Enter or Space commits the candidate position; Escape cancels and restores the original position.
- A polite live announcement identifies the moved goal and its one-based position after a committed move.

## Column Boundaries

- Current Goals uses deadline ordering until the first successful reorder, then uses persisted manual ordering.
- Completed Goals is never a sortable context and remains ordered by most-recent completion first.
- No drag interaction moves a goal between columns.