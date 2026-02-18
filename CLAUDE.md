# CLAUDE.md — Car-Ops Agent

## Project Overview

Car-Ops Agent is an AI-powered car maintenance management system. The current codebase is the **Frontend only** (the NestJS backend is not yet implemented). The app is a Hebrew (RTL) SPA with mock data standing in for API calls.

## Tech Stack

| Layer        | Technology                                        |
| ------------ | ------------------------------------------------- |
| Framework    | React 18 + TypeScript                             |
| Build        | Vite 6 (`@vitejs/plugin-react`)                   |
| Styling      | Tailwind CSS v4 (`@tailwindcss/vite` plugin)      |
| UI primitives| Radix UI + shadcn/ui (pre-installed in `components/ui/`) |
| Routing      | React Router v7 (`react-router`)                  |
| Icons        | Lucide React                                      |
| Charts       | Recharts                                          |
| Forms        | React Hook Form                                   |
| Animation    | Motion (Framer Motion)                             |
| Utilities    | clsx + tailwind-merge (via `cn()` helper)         |

## Commands

```bash
# All commands run from the Frontend/ directory
npm run dev        # Start Vite dev server
npm run start      # Dev server + auto-open browser
npm run build      # Production build → Frontend/dist/
```

No test runner is configured yet.

## Directory Structure

```
cars-manager/
├── CLAUDE.md              # This file
├── .claudeignore          # Excludes node_modules, fonts, lock files
├── README.md              # Full project spec (backend + frontend)
├── Specification/         # Product spec docs
│   ├── specification.md
│   └── style.css
└── Frontend/              # The React SPA
    ├── index.html         # Vite entry point
    ├── package.json
    ├── vite.config.ts     # Path alias: @ → src/
    ├── postcss.config.mjs
    └── src/
        ├── main.tsx                # React root render
        ├── styles/
        │   ├── index.css           # Import hub (fonts → tailwind → theme)
        │   ├── tailwind.css        # Tailwind v4 source config
        │   ├── theme.css           # CSS custom properties (design tokens + dark mode)
        │   └── fonts.css           # @font-face declarations
        └── app/
            ├── App.tsx             # Root component (RTL wrapper + RouterProvider)
            ├── routes.ts           # All routes defined here (flat, Layout-wrapped)
            ├── data/
            │   └── mockData.ts     # Mock data (will be replaced by API calls)
            ├── locales/
            │   ├── index.ts        # Exports `t` object and `useTranslations()` hook
            │   └── he.ts           # Hebrew translations, organized by page
            ├── pages/              # One file per route
            │   ├── Dashboard.tsx
            │   ├── Garage.tsx
            │   ├── Upload.tsx
            │   ├── Timeline.tsx
            │   ├── Chat.tsx
            │   ├── Observability.tsx
            │   └── Settings.tsx
            └── components/
                ├── index.ts        # Barrel exports for app-level components
                ├── Layout.tsx      # Sidebar + header + <Outlet />
                ├── Logo.tsx
                ├── StatCard.tsx
                ├── StatusBadge.tsx
                ├── EmptyState.tsx
                ├── LoadingSpinner.tsx
                ├── figma/          # Design-asset components
                └── ui/             # shadcn/ui primitives (do NOT manually edit)
                    ├── utils.ts    # cn() helper
                    ├── use-mobile.ts
                    ├── button.tsx, card.tsx, dialog.tsx, ...
```

## Architecture Patterns

- **Routing**: Flat route array in `routes.ts`. All pages render inside `Layout` via `<Outlet />`.
- **Imports**: Use the `@/` path alias (maps to `src/`). Example: `import { Button } from "@/app/components/ui/button"`.
- **State**: Local `useState` only — no global state management yet.
- **Data**: All data is currently mocked inline or imported from `data/mockData.ts`.
- **Localization**: All user-facing strings come from `locales/he.ts` via `useTranslations()`. Never hardcode Hebrew strings in components.
- **Component composition**: Pages import `ui/` primitives (shadcn) and `components/` app-level wrappers. Pages live in `pages/`, shared pieces in `components/`.

## Conventions

### Naming
- **Files**: PascalCase for components (`StatCard.tsx`), kebab-case for shadcn/ui (`alert-dialog.tsx`).
- **Exports**: Named exports for all components (`export function Dashboard()`). No default exports except `App.tsx` and locale files.
- **Interfaces**: Defined inline above the component that uses them (e.g., `StatCardProps`).

### Styling
- Use **Tailwind utility classes** exclusively — no CSS modules, no inline `style` props.
- Combine classes with `cn()` from `@/app/components/ui/utils`.
- Design tokens are CSS custom properties defined in `theme.css` (e.g., `--primary: #1e3a5f`). Reference them via Tailwind's semantic classes (`bg-primary`, `text-muted-foreground`).
- RTL: The root `<div dir="rtl">` in `App.tsx` handles directionality. Use logical properties where possible (`mr-` → `ml-` in RTL context).

### shadcn/ui Components
- Located in `components/ui/`. These are **generated files** — do not hand-edit them.
- To add new shadcn components, use the ui-design-system agent skill or `npx shadcn@latest add <component>`.

### Adding a New Page
1. Create `pages/NewPage.tsx` with a named export.
2. Add a route entry in `routes.ts`.
3. Add a nav item in `Layout.tsx` navigation array.
4. Add translation keys in `locales/he.ts`.
