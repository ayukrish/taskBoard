# Taskboard

A Jira/Trello-style project management app built with React. The goal is a production-shaped app that tackles hard frontend problems: optimistic drag-and-drop, realtime collaboration, large-list virtualization, role-based access, and URL-driven state.

> **Status:** Early setup. The monorepo skeleton is in place; features are not built yet. See [Roadmap](#roadmap) and [`docs/`](docs/).

## Features (planned)

- **Boards:** user-defined columns, WIP limits, board and list views
- **Tickets:** sequential keys (`WEB-123`), rich fields, markdown descriptions, comments, sub-tasks, activity log
- **Drag and drop:** mouse, touch, and keyboard; optimistic updates with rollback; stable ordering under concurrent moves
- **Realtime:** live updates across users, presence avatars, reconnect handling
- **Search and filters:** full-text search, filters, saved views, all reflected in a shareable URL
- **Scale:** virtualized list handling 10k+ tickets, cursor-based pagination
- **Workspaces and roles:** Owner, Admin, Member, Viewer, enforced server-side
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
| Backend | Node API: Fastify, Prisma, PostgreSQL |
| Realtime | Socket.io |
| Auth | argon2 password hashing, JWT access token + rotating httpOnly refresh cookie |
| Ordering | Fractional indexing |
| Styling | Tailwind CSS + Radix primitives |
| Testing | Vitest, React Testing Library, MSW, Playwright, axe |
| Tooling | pnpm workspaces, ESLint, Prettier, Husky, GitHub Actions |

Items beyond Vite, React, TypeScript, and ESLint are planned and not installed yet.

## Architecture Notes

- **Monorepo:** `apps/web` (React), `apps/api` (Fastify), and `packages/shared` (Zod schemas and types shared by both).
- **Server state** lives in TanStack Query and is patched by realtime events. It is never duplicated into client stores.
- **URL state** (filters, sort, selected ticket) is the single source of truth for views.
- **Ephemeral UI state** (active drag, selection, palette) lives in Zustand.
- **Ordering** uses fractional-index string keys, so moving a card updates one row and stays safe under concurrent edits.
- **Security** is enforced server-side by a central authorization layer on every route and socket event (deny-by-default). Client-side role checks are UX only.

## Getting Started

Prerequisites:

- Node.js 22 (see `.nvmrc`)
- pnpm 10 (`corepack enable`, or `npm i -g pnpm@10.18.3`)

```bash
pnpm install
cp apps/web/.env.example apps/web/.env.local
pnpm dev
```

The API (`apps/api`) and PostgreSQL setup will be documented when milestone M1 starts.

## Scripts

Run from the repo root.

| Command | Description |
|---|---|
| `pnpm dev` | Start the web dev server |
| `pnpm dev:api` | Start the API dev server (not set up yet) |
| `pnpm build` | Build all packages |
| `pnpm typecheck` | TypeScript check |
| `pnpm lint` | ESLint |
| `pnpm format` | Format with Prettier |
| `pnpm format:check` | Check formatting |
| `pnpm test` | Run tests (none yet) |

## Project Structure

```
taskBoard/
  docs/                 Requirements, plan, ADRs
  apps/
    web/                React app (Vite + TypeScript)
      src/
        app/            Providers, router, layout shell
        features/       auth, workspaces, projects, board, tickets, filters, notifications, palette
        shared/         ui primitives, lib, api client, hooks
        test/           Test setup, factories, MSW handlers
    api/                Fastify + Prisma API, authz layer, Socket.io server (not set up yet)
  packages/
    shared/             Zod schemas, types, fractional-index util (not set up yet)
```

## Roadmap

| Milestone | Outcome |
|---|---|
| M0 | Foundations: tooling, CI, design tokens, app shell |
| M1 | Custom auth, workspaces, invites, roles with server-side authorization |
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
