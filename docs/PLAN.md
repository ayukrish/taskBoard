# Taskboard — Implementation Plan

Status: DRAFT v0.2. Companion to `REQUIREMENTS.md`. Backend decided: custom Node API (Fastify + Prisma + PostgreSQL + Socket.io), pnpm monorepo. Estimates updated accordingly (~+2 weeks vs. v0.1).

Estimates assume ~10–12 hrs/week part-time. Each milestone ends with a demoable, deployed slice.

---

## Milestone Overview

| # | Milestone | Outcome | Est. |
|---|---|---|---|
| M0 | Foundations | Monorepo, tooling, CI, design tokens, web app shell, API skeleton | 4–5 d |
| M1 | Auth + Workspaces | Custom auth, create/switch workspace, invite members, authz layer | 2 wk |
| M2 | Board core (read) + DnD spike | Projects, columns, tickets rendered; dnd-kit proven | 1 wk |
| M3 | Tickets + Drag-and-drop (write) | Full CRUD, optimistic moves, fractional ordering | 1.5 wk |
| M4 | Realtime + Presence | Socket.io sync, reconnect handling | 1.5 wk |
| M5 | Search, filters, URL state, saved views | Shareable filtered views | 1 wk |
| M6 | Scale: list view + virtualization + seed | 10k tickets smooth | 1 wk |
| M7 | Collaboration extras | Comments, @mentions, activity, notifications | 1 wk |
| M8 | Polish: a11y, command palette, shortcuts, theming | WCAG AA pass | 1 wk |
| M9 | Hardening + release | E2E, perf budget, docs, demo | 3–4 d |

Stretch (post-M9): attachments, ticket links, bulk actions, group-by, project-level roles, email notifications.

---

## M0 — Foundations

Tasks
- [ ] Init pnpm workspace: `apps/web` (Vite + React + TS strict, path aliases), `apps/api` (Fastify + TS skeleton, `/health`), `packages/shared` (Zod schemas, types)
- [ ] ESLint, Prettier, Husky + lint-staged, commitlint (optional)
- [ ] Tailwind + Radix/shadcn primitives; design tokens (color, spacing, radius, typography) with light/dark
- [ ] Vitest + RTL + MSW + Playwright wired, one smoke test each
- [ ] GitHub Actions: typecheck, lint, unit, build on PR
- [ ] App shell: layout, sidebar, top bar, route skeleton, error boundary, 404, toast system
- [ ] Deploy preview (Vercel/Netlify)
- [ ] ADRs folder; write ADR-001 (stack), ADR-002 (ordering strategy), ADR-003 (state boundaries)

Done when: CI green, shell deployed, `pnpm test` and `pnpm e2e` run locally.

---

## M1 — Auth + Workspaces

Tasks
- [ ] Decide local Postgres approach (Postgres.app, hosted dev DB, or Docker); env handling (`.env.example`, no secrets committed)
- [ ] Prisma setup: migrations workflow, seed script
- [ ] Schema: users, workspaces, memberships, invites, refresh_tokens
- [ ] Auth API: register, login, logout, refresh (rotating, httpOnly cookie, reuse detection), argon2 hashing, rate limiting, CSRF consideration for cookie routes
- [ ] Central authorization layer (`can(user, action, resource)`; deny-by-default) used by all routes, with table-driven tests per endpoint
- [ ] Web auth: auth context with loading state, silent refresh, token handling, sign up/in/out UI, protected routes via TanStack Router `beforeLoad`, safe post-login redirect
- [ ] Workspace create + switcher; last-used workspace remembered
- [ ] Members page: list, invite by email (link/token flow; email sending deferred), accept invite, change role, remove
- [ ] Role-aware UI primitives (`<Can action="..." />` + `useCan()`), mirroring server policy (UX only)

Done when: two accounts can share a workspace; a Viewer's mutation attempts return 403 from the API (tested).

---

## M2 — Board Core (Read) + DnD Spike

Tasks
- [ ] Schema: projects, columns, tickets (+ `ticket_seq` function), labels
- [ ] Project CRUD + key validation
- [ ] Column CRUD + reorder (fractional index util with unit/property tests)
- [ ] Typed API layer (queries/mutations in one module per entity) + Zod schemas
- [ ] TanStack Query setup: key factory, defaults (stale time, retry), devtools
- [ ] Board UI: columns + cards (read-only), loading skeletons, empty and error states
- [ ] **Spike:** dnd-kit sortable across columns with 500 cards; test with virtualization; record findings in ADR-004

Done when: seeded board renders; spike decision documented (virtualize columns vs paginate).

---

## M3 — Tickets + Drag-and-Drop (Write)

Tasks
- [ ] Quick-add ticket in column; full create form (RHF + Zod)
- [ ] Ticket detail drawer, deep-linkable at `/t/:key`
- [ ] Inline editing with autosave + save-state indicator
- [ ] Fields: assignee picker, priority, type, labels, due date, estimate
- [ ] Markdown description with preview (sanitize output)
- [ ] DnD: reorder in column, move across columns, drag overlay, auto-scroll
- [ ] Optimistic move mutation: snapshot → patch cache → server call → rollback on error → invalidate on settle
- [ ] Fractional-index move: compute between neighbors; server fallback/rebalance on collision
- [ ] Keyboard DnD + aria-live announcements
- [ ] Soft delete with 10s undo toast
- [ ] Column WIP limit (soft warning)
- [ ] Tests: ordering util (property-based), move mutation rollback, authorization on ticket endpoints

Done when: acceptance criteria #1 (minus multi-browser) and #2 (simulated) pass.

---

## M4 — Realtime + Presence

Tasks
- [ ] Socket.io server: authenticate on handshake, per-project rooms, re-check membership on join/role change, evict on removal
- [ ] Emit domain events from the service layer after DB commit (single place, no handler-level emits)
- [ ] Client subscribes to project channel (ticket, column changes)
- [ ] Event-to-cache patching (insert/update/delete/move), idempotent
- [ ] Echo suppression for own mutations (mutation IDs)
- [ ] Stale-event guard using `version`
- [ ] Connection status banner; reconnect → refetch + reconcile
- [ ] Presence avatars on board (Socket.io room membership + heartbeat)
- [ ] "Updated by X" non-blocking notice for concurrent field edits
- [ ] Tests: two-client Playwright scenario (move visible in other context)

Done when: acceptance criteria #1 (full), #7 pass.

---

## M5 — Search, Filters, URL State, Saved Views

Tasks
- [ ] Choose router approach for typed search params (TanStack Router recommended) — ADR
- [ ] Filter bar: assignee, label, priority, type, due range, "mine"
- [ ] Text search: Postgres full-text (tsvector + GIN index) + debounced input
- [ ] URL is the source of truth; back/forward works; invalid params sanitized
- [ ] Saved views CRUD (personal/shared), apply/clear/update
- [ ] Filter-aware DnD (moving in a filtered board must still compute correct positions vs. full column)
- [ ] Tests: URL ⇄ filter round trip; filtered-move ordering

Done when: acceptance criterion #4 passes.

---

## M6 — Scale: List View + Virtualization

Tasks
- [ ] Seed script: 10k+ tickets across columns, labels, users
- [ ] Cursor-based pagination endpoints (keyset on `(position, id)` / `(updated_at, id)`)
- [ ] Virtualized list view (TanStack Virtual) with sortable headers, sticky header, infinite load
- [ ] Board columns: virtualized or "load more" per spike result
- [ ] Index review (EXPLAIN on hot queries); add composite indexes
- [ ] Memoization pass: React Profiler, avoid card re-renders during drag
- [ ] Perf tests: scripted scroll in Playwright + Lighthouse CI budget

Done when: acceptance criterion #5 passes; bundle budget enforced in CI.

---

## M7 — Collaboration Extras

Tasks
- [ ] Comments (markdown), edit/delete own
- [ ] @mentions autocomplete → notification
- [ ] Sub-tasks / checklist
- [ ] Activity log (DB trigger or server function writes events) + ticket and project feeds
- [ ] Notification center (unread badge, mark read, realtime)
- [ ] Viewer-comment permission toggle (per open question)

Done when: assigning/mentioning a user produces a live notification in their session.

---

## M8 — Polish: A11y, Command Palette, Shortcuts, Theming

Tasks
- [ ] Command palette (cmdk): ticket search, navigation, actions
- [ ] Global shortcuts + `?` help dialog; no conflicts with inputs
- [ ] Axe checks in CI on key routes; manual screen-reader pass (VoiceOver) on board + drawer
- [ ] Focus management (drawer open/close, dialogs), reduced-motion support
- [ ] Dark mode audit for contrast; responsive pass at 360px
- [ ] Empty states, skeletons, error copy review
- [ ] i18n-ready string extraction pass

Done when: acceptance criterion #6 passes; zero critical axe violations.

---

## M9 — Hardening + Release

Tasks
- [ ] Playwright e2e for critical paths: signup → workspace → project → create/move ticket → filter → share URL
- [ ] Error reporting + web-vitals hook
- [ ] Security review: authorization audit (every route + socket event), auth/refresh flow review, markdown sanitization, secrets scan, dependency audit
- [ ] README with architecture diagram, setup, trade-offs; ADR index
- [ ] Demo seed data + short screen recording / GIFs
- [ ] Production deploy; smoke test

---

## Proposed Folder Structure

```
taskBoard/
  docs/                   REQUIREMENTS.md, PLAN.md, adr/
  pnpm-workspace.yaml
  apps/
    web/                  Vite + React + TS
      src/
        app/              providers, router, layout shell
        features/
          auth/
          workspaces/
          projects/
          board/          columns, cards, dnd, optimistic moves
          tickets/        detail drawer, forms, comments
          filters/        search params, saved views
          notifications/
          palette/
        shared/
          ui/             design-system primitives
          lib/            dates, cn, logger
          api/            http client, query keys, error mapping
          hooks/
        test/             msw handlers, factories, setup
      e2e/                Playwright specs
    api/                  Fastify + Prisma
      prisma/             schema.prisma, migrations/, seed.ts
      src/
        modules/          auth, workspaces, projects, tickets, ... (routes + service + repo per module)
        authz/            central policy layer (can(user, action, resource))
        realtime/         Socket.io server, rooms, event emitters
        plugins/          cookies, rate-limit, error handler, logging
        test/             integration tests (Supertest + test DB)
  packages/
    shared/               Zod schemas, types, fractional-index util
```

Conventions: feature folders own their components, hooks, API calls, and tests; `shared` has no imports from `features`. The web app and API share contracts only through `packages/shared`.

---

## Definition of Done (every task)

- Typecheck, lint, and tests pass in CI
- Loading, error, and empty states handled
- Keyboard accessible; no new axe violations
- Permissions enforced by the server authorization layer (tests included) and reflected in UI
- Tests added at the right level (unit for logic, RTL for components, e2e for flows)
- Docs/ADR updated if a decision was made

---

## Immediate Next Steps

1. Answer the remaining open questions in `REQUIREMENTS.md` §11 (audience, Viewer comments, timeline, local Postgres approach).
2. Confirm or amend MoSCoW priorities, especially the "Should" items.
3. Start M0 (in progress).
