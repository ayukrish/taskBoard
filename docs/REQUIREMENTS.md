# Taskboard — Requirements

A Jira/Trello-style project management app. Primary goal: a portfolio-grade, production-shaped React app that exercises hard frontend problems (optimistic drag-and-drop, realtime sync, virtualization, RBAC, URL-driven state).

Status: DRAFT v0.1 — no code written yet.

---

## 1. Goals and Non-Goals

### Goals
- G1. Kanban board with smooth drag-and-drop and optimistic updates that never "flicker back" on success.
- G2. Multi-user, with roles and permissions enforced both in the UI and at the data layer.
- G3. Handle large data (10k+ tickets in a project) without UI jank.
- G4. Shareable, URL-driven state (filters, saved views, open ticket).
- G5. Keyboard-first UX (command palette, shortcuts).
- G6. Production-shaped engineering: TypeScript strict, tests, CI, accessibility, error/loading/empty states.

### Non-Goals (v1)
- Sprints, burndown, velocity, roadmaps/Gantt.
- Custom workflows/state machines per project (columns are free-form, no transition rules).
- Native mobile apps (responsive web only).
- Third-party integrations (GitHub, Slack) and billing.
- Self-hosting / on-prem support.

---

## 2. Users and Roles

| Role | Scope | Capabilities |
|---|---|---|
| Owner | Workspace | Everything, incl. delete workspace, manage billing-free settings, change any role |
| Admin | Workspace | Manage members, create/delete projects, all Member abilities |
| Member | Project | Create/edit/move/comment on tickets, create saved views |
| Viewer | Project | Read-only; can comment (configurable, default: no) |

Assumption: a user can belong to multiple workspaces; a workspace has multiple projects; roles are per workspace (project-level overrides are a stretch goal).

---

## 3. Functional Requirements

Priority: **M** = Must (v1), **S** = Should (v1 if time), **C** = Could (stretch).

### 3.1 Auth and Accounts
| ID | Requirement | Pri |
|---|---|---|
| FR-A1 | Sign up / sign in with email + password | M |
| FR-A2 | OAuth sign-in (Google or GitHub) | S |
| FR-A3 | Sign out, session persistence across reloads, silent token refresh | M |
| FR-A4 | Password reset via email | S |
| FR-A5 | Profile: display name, avatar | S |

### 3.2 Workspaces and Members
| ID | Requirement | Pri |
|---|---|---|
| FR-W1 | Create a workspace; creator becomes Owner | M |
| FR-W2 | Switch between workspaces | M |
| FR-W3 | Invite members by email; accept invite | M |
| FR-W4 | Change member role; remove member | M |
| FR-W5 | Pending invites list with revoke | S |

### 3.3 Projects and Boards
| ID | Requirement | Pri |
|---|---|---|
| FR-P1 | Create / rename / archive / delete project | M |
| FR-P2 | Project has a short key (e.g. `WEB`) used for ticket IDs (`WEB-123`) | M |
| FR-P3 | Board has user-defined columns: add, rename, reorder, delete, optional WIP limit | M |
| FR-P4 | Deleting a non-empty column requires choosing a destination column | M |
| FR-P5 | Board and List view toggle for the same data | S |

### 3.4 Tickets
| ID | Requirement | Pri |
|---|---|---|
| FR-T1 | Create ticket (quick-add in column, or full form) with title (required) | M |
| FR-T2 | Fields: description (rich text/markdown), assignee, reporter, priority (Lowest–Highest), type (Task/Bug/Story), labels, due date, estimate | M |
| FR-T3 | Auto-generated sequential key per project (`WEB-123`), unique and immutable | M |
| FR-T4 | Edit any field inline; changes autosave with visible save state | M |
| FR-T5 | Drag ticket within a column (reorder) and across columns (status change) | M |
| FR-T6 | Delete ticket (soft delete with undo toast for 10s) | M |
| FR-T7 | Comments with markdown and @mentions | S |
| FR-T8 | Attachments (images/files, size-limited) | C |
| FR-T9 | Sub-tasks / checklist on a ticket | S |
| FR-T10 | Ticket links (blocks / relates to) | C |
| FR-T11 | Activity log per ticket (who changed what, when) | S |
| FR-T12 | Bulk actions on multi-selected tickets (move, assign, label, delete) | C |

### 3.5 Drag and Drop
| ID | Requirement | Pri |
|---|---|---|
| FR-D1 | Mouse, touch, and keyboard drag-and-drop (accessible, screen-reader announcements) | M |
| FR-D2 | Optimistic UI: card moves instantly; on server failure it rolls back with an error toast | M |
| FR-D3 | Ordering is stable under concurrent moves by multiple users (no duplicate/lost positions) | M |
| FR-D4 | Auto-scroll when dragging near edges of board or column | M |
| FR-D5 | WIP limit warning (soft) when dropping into a full column | S |

### 3.6 Search, Filters, and Saved Views
| ID | Requirement | Pri |
|---|---|---|
| FR-F1 | Text search over title, description, key | M |
| FR-F2 | Filters: assignee, label, priority, type, due date range, "assigned to me" | M |
| FR-F3 | Filters and sort are reflected in the URL (shareable, back/forward works) | M |
| FR-F4 | Saved views: name + filter/sort/group config; personal or shared | S |
| FR-F5 | Group by (assignee, priority, none) on board | C |

### 3.7 Realtime and Collaboration
| ID | Requirement | Pri |
|---|---|---|
| FR-R1 | Ticket create/update/move/delete by other users appears live without refresh | M |
| FR-R2 | Presence: avatars of users currently viewing the board | S |
| FR-R3 | Conflict handling: if two users edit the same field, last write wins with a non-blocking "updated by X" notice | S |
| FR-R4 | Reconnect handling: on connection loss show banner; on reconnect, refetch and reconcile | M |

### 3.8 Notifications and Activity
| ID | Requirement | Pri |
|---|---|---|
| FR-N1 | In-app notification center (assigned to you, mentioned, comment on your ticket) | S |
| FR-N2 | Project activity feed | S |
| FR-N3 | Email notifications | C |

### 3.9 Command Palette and Shortcuts
| ID | Requirement | Pri |
|---|---|---|
| FR-K1 | `Cmd/Ctrl+K` palette: jump to ticket/project, run actions (create ticket, switch workspace) | S |
| FR-K2 | Shortcuts: `C` create, `/` focus search, `?` shortcut help, `Esc` close panels | S |

### 3.10 Performance at Scale
| ID | Requirement | Pri |
|---|---|---|
| FR-X1 | List view virtualized; renders 10k tickets with smooth scroll | M |
| FR-X2 | Board columns virtualized/paginated for large columns (500+ cards) | S |
| FR-X3 | Cursor-based pagination for ticket queries | M |

---

## 4. Non-Functional Requirements

| ID | Area | Requirement |
|---|---|---|
| NFR-1 | Performance | Initial board load (100 tickets) interactive < 2s on broadband; drag feedback at 60fps; list scroll 10k rows without dropped frames |
| NFR-2 | Perf budget | Main JS bundle < 250 KB gzipped; route-level code splitting |
| NFR-3 | Accessibility | WCAG 2.1 AA; full keyboard operability; visible focus; aria-live for drag/drop and toasts; automated axe checks in CI |
| NFR-4 | Security | Server-side authorization on every endpoint and socket event (membership + role checks in a central policy layer) so users only access workspaces they belong to; no trust in client-side role checks; passwords hashed with argon2; short-lived access tokens + rotating httpOnly refresh cookie; rate limiting on auth routes; input validated with shared Zod schemas; markdown sanitized (XSS); no secrets in client bundle |
| NFR-5 | Reliability | Every async UI has loading, error, empty, and retry states; error boundaries per route |
| NFR-6 | Browser support | Latest 2 versions of Chrome, Firefox, Safari, Edge |
| NFR-7 | Responsive | Usable at 360px width; board horizontally scrolls with snap on mobile |
| NFR-8 | Theming | Light and dark mode via design tokens; respects `prefers-color-scheme` |
| NFR-9 | Code quality | TypeScript strict, ESLint + Prettier, no `any` without justification |
| NFR-10 | Testing | Unit coverage on logic (ordering, filters, reducers) > 80%; integration tests for key flows; e2e for critical paths |
| NFR-11 | Observability | Client error reporting (Sentry-style hook) and basic web-vitals logging |
| NFR-12 | i18n readiness | No hard-coded user strings in components (extractable), dates/numbers via `Intl` |

---

## 5. Proposed Tech Stack (decisions to confirm)

| Concern | Choice | Rationale / Alternative |
|---|---|---|
| Build | Vite + React + TypeScript (strict) — **decided** | Next.js not needed; app is an auth-gated SPA |
| Routing | TanStack Router — **decided** | First-class typed search params, ideal for FR-F3; auth guards in `beforeLoad` |
| Server state | TanStack Query | Optimistic updates, cache, retries |
| Client/UI state | Zustand (small, scoped) | Drag state, selection, palette open |
| Forms | React Hook Form + Zod | Shared schemas for validation |
| Drag and drop | dnd-kit | Accessible, keyboard support, sortable preset |
| Virtualization | TanStack Virtual | List and large columns |
| Backend | Custom Node API — **decided**: Fastify + Prisma + PostgreSQL, Socket.io for realtime/presence | More work than a BaaS but full control and more full-stack signal. Auth is built in-house (argon2, JWT access + rotating refresh cookie). Shared Zod schemas in `packages/shared` |
| Ordering | Fractional indexing (LexoRank-style string keys) | Single-row updates on move; concurrency-safe |
| Rich text | Tiptap (or markdown textarea + preview for v1) | Tiptap adds weight; start with markdown |
| Styling | Tailwind + Radix primitives (shadcn/ui style) — **decided** | Tokens, a11y primitives, dark mode |
| Testing | Vitest, React Testing Library, MSW, Playwright, axe; API: Vitest + Supertest against a test Postgres | |
| Tooling | pnpm workspaces (`apps/web`, `apps/api`, `packages/shared`), ESLint, Prettier, Husky + lint-staged, GitHub Actions | |
| Deploy | Frontend: Vercel/Netlify. API + Postgres: TBD (e.g., Render/Fly + Neon) | WebSockets require a long-lived server, not serverless functions |

---

## 6. Data Model (draft)

```
users            (id, email, display_name, avatar_url, created_at)
workspaces       (id, name, slug, owner_id, created_at)
memberships      (workspace_id, user_id, role[owner|admin|member|viewer], created_at)  PK(workspace_id, user_id)
invites          (id, workspace_id, email, role, token, status, expires_at, invited_by)
projects         (id, workspace_id, name, key, archived_at, ticket_seq, created_at)
columns          (id, project_id, name, position[text], wip_limit?, created_at)
tickets          (id, project_id, number[int], column_id, position[text], title, description,
                  type, priority, assignee_id?, reporter_id, due_date?, estimate?,
                  deleted_at?, version[int], created_at, updated_at)
                  UNIQUE(project_id, number)
labels           (id, project_id, name, color)
ticket_labels    (ticket_id, label_id)
subtasks         (id, ticket_id, title, done, position)
comments         (id, ticket_id, author_id, body, created_at, edited_at?)
activity         (id, project_id, ticket_id?, actor_id, type, payload jsonb, created_at)
saved_views      (id, project_id, owner_id, name, config jsonb, shared bool)
notifications    (id, user_id, type, payload jsonb, read_at?, created_at)
```

Key rules:
- `tickets.number` allocated atomically via `projects.ticket_seq` (DB function/trigger).
- `position` is a fractional-index string; rebalance when keys grow too long.
- `version` incremented on update for conflict detection.
- Every workspace-scoped query goes through a central authorization layer keyed on `memberships` (no handler queries tenant data without a membership/role check).
- Refresh tokens stored hashed in a `refresh_tokens` table (user_id, token_hash, family_id, expires_at, revoked_at) to support rotation and reuse detection.
- `tickets` gets an index on `(column_id, position, id)`; search uses a `tsvector` column with a GIN index.

---

## 7. Screens and Routes

| Route | Screen |
|---|---|
| `/login`, `/signup`, `/reset` | Auth |
| `/` | Redirect to last workspace/project |
| `/w/:workspace` | Workspace home (projects list) |
| `/w/:workspace/settings` | Members, invites, roles |
| `/w/:workspace/p/:project/board` | Kanban board |
| `/w/:workspace/p/:project/list` | Virtualized list |
| `/w/:workspace/p/:project/t/:key` | Ticket detail (modal/drawer over board; also deep-linkable) |
| `/w/:workspace/p/:project/settings` | Columns, labels, project config |
| `/notifications` | Notification center |
| `*` | 404 |

Search params on board/list: `q`, `assignee`, `label`, `priority`, `type`, `due`, `sort`, `view`.

---

## 8. State Strategy

- Server state (tickets, columns, members): TanStack Query, normalized per project, with realtime events patching the cache.
- URL state: filters, sort, selected ticket (single source of truth).
- Ephemeral UI state: Zustand (active drag, multi-select, palette).
- Form state: React Hook Form, scoped to the form.
- Rule: never duplicate server data into Zustand.

---

## 9. Acceptance Criteria (headline flows)

1. **Move a card:** Dragging a card to another column updates it instantly; reload shows same position; a second browser sees it within ~1s; if the network is cut, card snaps back and an error toast with Retry appears.
2. **Concurrent moves:** Two users move different cards into the same spot simultaneously; both persist, order is deterministic, no duplicates.
3. **Permissions:** A Viewer cannot see create/edit/drag affordances, and direct API calls to mutate are rejected by the server's authorization layer (403), covered by automated tests.
4. **Shareable view:** Copying the URL with filters into a new tab reproduces the exact filtered board.
5. **Scale:** Seeded project with 10k tickets: list view scrolls smoothly; board loads first page of each column < 2s.
6. **Keyboard:** A user can create a ticket, move it across columns, and open it using only the keyboard.
7. **Offline blip:** Connection drops for 30s, then returns; the app shows a banner, then reconciles with no duplicate or lost tickets.

---

## 10. Risks

| Risk | Mitigation |
|---|---|
| Ordering bugs under concurrency | Fractional indexing + server-side tie-break on (position, id); property tests |
| Realtime events racing with optimistic updates | Per-ticket `version`; ignore stale events; tag own mutations to skip echo |
| Authorization gaps (a forgotten check leaks tenant data) | Single policy layer used by all routes and socket handlers; deny-by-default; table-driven permission tests per endpoint |
| Hand-rolled auth mistakes | Use vetted libs (argon2, jose, @fastify/cookie, @fastify/rate-limit); refresh rotation with reuse detection; security review in M9 |
| Socket auth and room leakage | Authenticate on handshake, re-check membership on join and on role change, evict on removal |
| Scope creep | Strict MoSCoW; freeze Musts first; stretch only after M5 |
| dnd-kit + virtualization conflict | Spike early (M2); fall back to pagination for columns |

---

## 11. Open Questions

Resolved:
- Backend: custom Node API (Fastify + Prisma + PostgreSQL + Socket.io).
- Design system: Tailwind + Radix.
- Router: TanStack Router. Build: Vite + React + TypeScript.

Still open:
1. Is this a pure portfolio/learning project, or will it be used by a real team (affects email, hosting)?
2. Should Viewers be allowed to comment?
3. Target timeline (weekend sprints vs. ~8–10 weeks part-time)?
4. Local Postgres: Docker is not installed on this machine. Options: Postgres.app, a hosted dev DB (e.g., Neon), or install Docker Desktop. Needed before M1.
