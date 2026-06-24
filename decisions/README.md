# Design Decisions

This folder records significant design decisions made during the Paws project. Each decision lives in its own markdown file so context, rationale, and trade-offs stay easy to find later.

## Adding a decision

1. Copy `TEMPLATE.md` to a new file.
2. Name it `NNNN-short-title.md` (e.g. `0001-local-json-database.md`).
   - Use a zero-padded 4-digit number so files sort chronologically.
   - Use lowercase words separated by hyphens for the title.
3. Fill in the sections and set **Status** to `accepted` when the decision is final.
4. Add a link to the new file in the index below.

## Index

| # | Decision | Status |
|---|----------|--------|
| [0001](./0001-local-json-mock-api.md) | Local JSON database with mock API layer | accepted |
