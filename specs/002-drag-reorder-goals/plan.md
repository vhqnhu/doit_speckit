# Implementation Plan: Drag and Drop Goal Reordering
**Branch**: `002-drag-reorder-goals` | **Date**: 2026-09-06 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-drag-reorder-goals/spec.md`

## Summary

Add accessible mouse, touch, and keyboard reordering to Current Goals using `@dnd-kit/core` and `@dnd-kit/sortable`. Persist an explicit manual-order mode and dense current-goal positions in browser localStorage; retain deadline ordering until the first successful reorder and preserve the existing completed-goal ordering.

## Technical Context

**Language/Version**: TypeScript 5, React 19.2.8, Next.js 16.3.3

**Primary Dependencies**: Next.js, React, Tailwind CSS 4, lucide-react; add `@dnd-kit/core` and `@dnd-kit/sortable` for accessible sortable interactions.

**Storage**: Browser localStorage: existing `doit.goals.v1` goal array plus a new versioned order-preference key described in [local-storage-contract.md](./contracts/local-storage-contract.md).

**Testing**: No automated tests, per Constitution V. Validate manually, with `npm run lint` and `npx tsc --noEmit`.

**Target Platform**: Modern desktop and mobile browsers supported by the Next.js application.

**Project Type**: Client-rendered web application.

**Performance Goals**: Reorder updates appear without perceptible lag for lists of tens of goals; dragged list auto-scroll allows access to every item.

**Constraints**: Reordering begins only from a 44px-or-larger handle; preserve checkbox and deletion actions; no cross-column dragging; retain Tailwind-only styling and browser-local persistence.

**Scale/Scope**: One dashboard route, one existing Goal record collection, tens of goals per browser profile.

## Constitution Check

*GATE: Passed before Phase 0 research. Re-checked after Phase 1 design: passed.*

| Principle | Result | Evidence |
|-----------|--------|----------|
| Clean Code | Pass | Keep persistence and ordering transformations in `src/lib/goal-storage.ts`; page owns interaction state and rendering. |
| Simple UX | Pass | A dedicated familiar grip handle protects existing card controls; no configuration or reset mode is introduced. |
| Responsive Design | Pass | `@dnd-kit` pointer and keyboard sensors work across desktop and touch devices; existing Tailwind responsive layout remains the presentation mechanism. |
| Minimal Dependencies | Justified pass | `@dnd-kit/core` and `@dnd-kit/sortable` supply touch, pointer, keyboard, announcements, sortable transforms, and auto-scroll. Native browser drag APIs cannot provide this required set without a larger bespoke implementation. |
| No Testing | Pass | The design specifies manual checks and static lint/type checks only; no automated testing artifacts or tasks are planned. |

## Project Structure

### Documentation (this feature)

```text
specs/002-drag-reorder-goals/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
    ├── local-storage-contract.md
    └── ui-contract.md
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── page.tsx             # Dashboard and sortable Current Goals interaction
│   └── globals.css          # Existing Tailwind theme and interaction styling if needed
└── lib/
    └── goal-storage.ts      # Goal model, localStorage, ordering and sorting helpers

package.json                 # Drag-and-drop dependency declarations
```

**Structure Decision**: Keep the single Next.js application. This feature extends the existing dashboard page and storage helper; it does not introduce a server API, route, or separate component layer.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Two new runtime packages | Accessible cross-input sortable behavior is a required feature. | Native HTML drag events lack usable touch and keyboard support, screen-reader announcements, sortable transforms, and reliable auto-scroll; hand-building these would be more complex and less robust. |
