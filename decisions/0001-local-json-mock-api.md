# Local JSON database with mock API layer

**Status:** accepted

**Date:** 2026-06-24

## Context

PawsConnect needs persistent application data (animals, volunteers, medications, activities, facilities, adoption inquiries) while the product is still being designed and built. A real backend is planned eventually, but standing one up now would slow iteration on UI, workflows, and the data model.

We need:

- Realistic data for demos and development without external services or credentials
- Persistence across page reloads during local development
- A boundary between UI/state management and data access so a future backend can be swapped in without rewriting pages and components

## Decision

Use a **local JSON database** persisted in **browser localStorage**, exposed through an **async mock API** in `src/api/client.ts`.

Concretely:

1. **Seed data** lives in `src/data/seed.ts` and defines the initial `Database` shape (animals, volunteers, medications, etc.).
2. **Persistence** uses the `pawsconnect-db` localStorage key. A separate `pawsconnect-db-version` key invalidates stale data when the seed schema changes.
3. **The API client** (`api`) mirrors REST-style operations: async methods (`getAnimals`, `createAnimal`, `logActivity`, …), artificial latency (~150 ms) to simulate network calls, and `structuredClone` on reads to avoid accidental mutation of shared state.
4. **UI and state** (`src/stores/appStore.ts`) call `api` only — they do not read or write localStorage directly.

When a real backend is introduced, replace the implementation inside `src/api/client.ts` (or split into an interface + HTTP adapter) while keeping the same method signatures consumed by the store.

## Consequences

### Positive

- Zero infrastructure: `npm install && npm run dev` is enough to run the full app with realistic data.
- UI and store code are already structured for async data fetching, which maps cleanly to HTTP later.
- Seed data can be version-bumped to reset local state when the model changes, without migration tooling during prototyping.
- Demos and user testing work offline in the browser.

### Negative

- Data is per-browser and per-device — no multi-user sync, sharing, or backup.
- localStorage size limits (~5 MB) cap how much data can be stored; not suitable for production scale.
- Business logic that lives in the mock client (e.g. updating volunteer stats when logging activities) will need to move server-side when a backend is added.
- Artificial delay is a development convenience only; it should be removed or made configurable when hitting a real API.

### Neutral

- Resetting to seed data is done by clearing the `pawsconnect-db` localStorage key (documented in the project README).
- `src/data/database.json` may exist as a reference export, but the runtime source of truth is `seed.ts` plus localStorage.
