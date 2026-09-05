# Research: Goal Tracker Dashboard

## Decision: Use Tailwind CSS v4 `@theme` for theme colors

**Rationale**: The project already uses Tailwind CSS v4, and the user explicitly requested theme colors through `@theme`. Defining pastel color tokens in `src/app/globals.css` keeps the visual system centralized while preserving utility-first styling and constitution compliance.

**Alternatives considered**: Inline utility-only colors were rejected because they scatter the palette across components. CSS-in-JS or another styling library was rejected because the constitution requires Tailwind and minimal dependencies.

## Decision: Use browser localStorage for goal persistence

**Rationale**: The spec requires goals to persist across reloads within the same browser without accounts or server sync. localStorage is the simplest platform API for this scope. Use a versioned key, `doit.goals.v1`, and load it only on the client to avoid server/client rendering mismatches.

**Alternatives considered**: Server storage was rejected because authentication and multi-device sync are out of scope. IndexedDB was rejected because goal records are small and do not need querying or large-object storage. Cookies were rejected because goal data should not be sent with requests.

## Decision: Use shadcn UI components for accessible controls

**Rationale**: The user requested shadcn. Its generated components can be styled with Tailwind and provide accessible Dialog, Button, Input, Checkbox, and Label patterns for the modal and goal actions. Components should be copied into `src/components/ui/` and only the components needed for this feature should be added.

**Alternatives considered**: Hand-rolled modal and controls were rejected because accessible focus management and keyboard behavior are easy to get subtly wrong. A full separate component framework was rejected because it would compete with Tailwind and add unnecessary visual/system weight.

## Decision: Use date-fns for date formatting and day calculations

**Rationale**: The user requested date-fns. Use `differenceInCalendarDays`, `parseISO`, `startOfToday`, and `format` to calculate whole-day differences, render readable dates, and handle overdue negative counts consistently.

**Alternatives considered**: Native `Date` arithmetic and `Intl.DateTimeFormat` were considered, but date-fns gives clearer intent for calendar-day calculations and formatting with a small, maintained dependency.

## Decision: Keep validation manual plus static checks only

**Rationale**: The constitution explicitly forbids unit, integration, e2e, and other automated tests. The feature should be verified through the quickstart scenarios, ESLint, and TypeScript compiler checks.

**Alternatives considered**: Component tests and Playwright checks were rejected because they violate the non-negotiable no-testing principle.

## Decision: Responsive dashboard with stacked mobile layout and two desktop columns

**Rationale**: The spec requires usability on mobile and desktop. A single-column mobile layout avoids horizontal scrolling, while a two-column layout at wider breakpoints supports the intended current/completed comparison.

**Alternatives considered**: Fixed two-column layout was rejected because it would force horizontal scrolling on narrow screens. Separate mobile screens/tabs were rejected because they add navigation complexity and hide one goal state from view.