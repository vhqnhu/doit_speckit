<!--
Sync Impact Report
==================
Version change: [TEMPLATE] → 1.0.0 (initial ratification)
Modified principles: N/A (first concrete adoption of the constitution)
Added sections:
  - Core Principles: I. Clean Code, II. Simple UX, III. Responsive Design,
    IV. Minimal Dependencies, V. No Testing (NON-NEGOTIABLE)
  - Technology Stack Requirements
  - Development Workflow
  - Governance
Removed sections: None (placeholders only)
Templates requiring follow-up review (not modified by this command):
  - .specify/templates/tasks-template.md: contains OPTIONAL test-task sections
    (e.g. "Tests for User Story N"). Principle V forbids these outright; a
    future edit should remove/disable the optional test scaffolding.
  - .specify/templates/plan-template.md: has a "Testing" field in Technical
    Context; should be marked N/A per Principle V in future plans.
  - .specify/templates/spec-template.md: "Independent Test" phrasing refers to
    manual/behavioral verification of user stories, not automated tests; no
    conflict, left as-is.
Deferred TODOs: None.
-->

# doit_spectkit Constitution

## Core Principles

### I. Clean Code
Code MUST be readable, self-explanatory, and consistently formatted before it is
considered done. Functions and components MUST have a single, clear
responsibility; naming MUST reflect intent without requiring inline comments to
explain "what" the code does. Linting (ESLint) MUST pass with no errors prior to
merge. Dead code, commented-out blocks, and speculative abstractions MUST be
removed. Rationale: a small team maintaining a Next.js app benefits far more
from clarity and low cognitive load than from clever or premature abstraction.

### II. Simple UX
User-facing flows MUST favor the simplest interaction that accomplishes the
user's goal. New screens/components MUST NOT introduce additional steps,
modes, or configuration unless they remove more complexity than they add.
Copy, states (loading/empty/error), and navigation MUST be predictable and
consistent across the app. Rationale: simplicity reduces support burden and
keeps the product usable without a learning curve.

### III. Responsive Design
Every UI surface MUST render correctly and remain usable across mobile,
tablet, and desktop breakpoints. Layout MUST be implemented with Tailwind CSS
responsive utilities (e.g. `sm:`, `md:`, `lg:`) rather than fixed pixel
dimensions or device-specific branches. Touch targets, font sizes, and spacing
MUST remain legible and operable on the smallest supported viewport.
Rationale: users access the app from varied devices; responsive-by-default
avoids rework and inconsistent experiences.

### IV. Minimal Dependencies
New third-party packages MUST NOT be added unless the required capability
cannot be reasonably implemented with the existing stack (Next.js, React,
Tailwind CSS, and the standard library/platform APIs). Any proposed dependency
addition MUST be justified in the PR description (why it's needed, why
hand-rolling is worse) and MUST be actively maintained. Unused dependencies
MUST be removed promptly. Rationale: fewer dependencies means a smaller attack
surface, faster installs/builds, and less upgrade churn.

### V. No Testing (NON-NEGOTIABLE)
This project MUST NOT include unit tests, integration tests, end-to-end tests,
or any other automated test suite. No test files, test frameworks, test
runners, or CI test gates MUST be added to the repository. This principle
supersedes any conflicting guidance elsewhere (including default Spec Kit
templates that suggest or scaffold tests) — wherever a template or workflow
proposes test tasks, they MUST be skipped entirely rather than marked
optional. Verification of behavior MUST rely on manual review, type-checking
(TypeScript), and linting instead. Rationale: this is an explicit,
deliberate project constraint set by the project owner and takes precedence
over general software-engineering best practice for this repository.

## Technology Stack Requirements

The project MUST use the framework and library versions pinned in
[package.json](../../package.json):
- Next.js `16.3.3`
- React `19.2.8` / React DOM `19.2.8`
- Tailwind CSS `^4` (via `@tailwindcss/postcss`)
- TypeScript `^5`

Upgrading any of these MUST be a deliberate, explicit change to
`package.json` (not an incidental side effect of another task), and this
section MUST be updated to match whenever those versions change. Styling
MUST be done through Tailwind CSS utility classes; introducing a second,
competing styling system (e.g. CSS-in-JS, a separate component/UI kit) is
prohibited under Principle IV unless it replaces Tailwind entirely.

## Development Workflow

Code review MUST verify compliance with all five Core Principles above,
specifically: no test code was introduced (Principle V), no unjustified new
dependency was added (Principle IV), and any UI change was checked at mobile
and desktop widths (Principle III). Quality gates are limited to: ESLint
passing and the TypeScript compiler reporting no errors. No test-related gate
MUST ever be added to CI or pre-commit hooks.

## Governance

This constitution supersedes all other project practices and prior informal
conventions. Any conflict between this document and a Spec Kit template,
command, or generated artifact MUST be resolved in favor of this
constitution, with Principle V taking precedence even over template defaults
that assume testing.

Amendments require: (1) a documented rationale for the change, (2) an update
to `CONSTITUTION_VERSION` following semantic versioning — MAJOR for backward
incompatible principle removals/redefinitions, MINOR for new principles or
materially expanded guidance, PATCH for wording/clarification fixes — and (3)
an updated `Last Amended` date. All pull requests and code reviews MUST
verify compliance with this constitution; unjustified complexity or added
dependencies MUST be flagged and resolved before merge.

**Version**: 1.0.0 | **Ratified**: 2026-09-05 | **Last Amended**: 2026-09-05
