# Taskboard

A Jira/Trello-style project management app built with React. The goal is a production-shaped app that tackles hard frontend problems: optimistic drag-and-drop, realtime collaboration, large-list virtualization, role-based access, and URL-driven state.

> **Status:** Planning. No application code yet. See [Roadmap](#roadmap).

## Features (planned)

- **Boards:** user-defined columns, WIP limits, board and list views
- **Tickets:** sequential keys (`WEB-123`), rich fields, markdown descriptions, comments, sub-tasks, activity log
- **Drag and drop:** mouse, touch, and keyboard; optimistic updates with rollback; stable ordering under concurrent moves
- **Realtime:** live updates across users, presence avatars, reconnect handling
- **Search and filters:** full-text search, filters, saved views, all reflected in a shareable URL
- **Scale:** virtualized list handling 10k+ tickets, cursor-based pagination
- **Workspaces and roles:** Owner, Admin, Member, Viewer, enforced at the database level
- **Keyboard-first UX:** command palette (`Cmd/Ctrl+K`) and shortcuts
- **Quality:** WCAG 2.1 AA, light/dark theme, loading/error/empty states everywhere

## Tech Stack

| Concern | Choice |
|---|---|
| Build | Vite, React, TypeScript (strict) |
| Routing | TanStack Router (typed search params) |
| Server state | TanStack Query |
| UI state | Zustand |
| Forms | React Hook Form + Zod |
| Drag and drop | dnd-kit |
| Virtualization | TanStack Virtual |
| Backend | Supabase (Postgres, Auth, Realtime, Row-Level Security) |
| Ordering | Fractional indexing |
| Styling | Tailwind CSS + Radix primitives |
| Testing | Vitest, React Testing Library, MSW, Playwright, axe |
| Tooling | pnpm, ESLint, Prettier, Husky, GitHub Actions |

## Architecture Notes

- **Server state** lives in TanStack Query and is patched by realtime events. It is never duplicated into client stores.
- **URL state** (filters, sort, selected ticket) is the single source of truth for views.
- **Ephemeral UI state** (active drag, selection, palette) lives in Zustand.
- **Ordering** uses fractional-index string keys, so moving a card updates one row and stays safe under concurrent edits.
- **Security** is enforced by Postgres Row-Level Security. Client-side role checks are UX only.

## Getting Started

> Setup instructions will be added in milestone M0.

Expected prerequisites:

- Node.js 20+
- pnpm
- A Supabase project (or the Supabase CLI for local development)

```bash
pnpm install
cp .env.example .env.local   # add your Supabase URL and anon key
pnpm dev
```

## Scripts (planned)

| Command | Description |
|---|---|
| `pnpm dev` | Start the dev server |
| `pnpm build` | Production build |
| `pnpm typecheck` | TypeScript check |
| `pnpm lint` | ESLint |
| `pnpm test` | Unit and component tests |
| `pnpm e2e` | Playwright end-to-end tests |

## Project Structure (planned)

```
taskBoard/
  docs/            Requirements, plan, ADRs
  supabase/        Migrations, seed data, policy tests
  src/
    app/           Providers, router, layout shell
    features/      auth, workspaces, projects, board, tickets, filters, notifications, palette
    shared/        ui primitives, lib (fractional-index, dates), api client, hooks
    test/          MSW handlers, factories, setup
  e2e/             Playwright specs
```

## Roadmap

| Milestone | Outcome |
|---|---|
| M0 | Foundations: tooling, CI, design tokens, app shell |
| M1 | Auth and workspaces, invites, roles with RLS |
| M2 | Board core (read) and drag-and-drop spike |
| M3 | Ticket CRUD and optimistic drag-and-drop |
| M4 | Realtime sync and presence |
| M5 | Search, filters, URL state, saved views |
| M6 | List view, virtualization, 10k-ticket scale |
| M7 | Comments, mentions, activity, notifications |
| M8 | Accessibility, command palette, theming polish |
| M9 | E2E tests, hardening, release |

## Contributing

1. Create a feature branch from `main`.
2. Make sure `pnpm typecheck`, `pnpm lint`, and `pnpm test` pass.
3. Open a pull request with a short summary and test plan.

## License

TBD
