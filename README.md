# B2B AI SaaS Platform

A modern B2B SaaS application built with Next.js 16, featuring workspace \
management, type-safe APIs with ORPC, and authentication via Kinde Auth.

## 🚀 Features

- **Multi-workspace Management**: Create and switch between multiple workspaces/organizations
- **Type-safe API Layer**: Full type safety from server to client using ORPC
- **Authentication & Authorization**: Secure authentication with Kinde Auth
- **Modern UI**: Beautiful, responsive UI built with shadcn/ui and Tailwind CSS
- **Real-time Data**: Efficient data fetching and caching with TanStack Query
- **Role-based Access**: Organization-level access control with admin roles

## 🛠️ Technology Stack

### Core

- **[Next.js 16](https://nextjs.org)** - React framework with App Router
- **[React 19](https://react.dev)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety

### API & Data Fetching

- **[ORPC](https://orpc.io)** - Type-safe RPC framework
- **[TanStack Query](https://tanstack.com/query)** - Async state management
- **[Zod](https://zod.dev)** - Schema validation

### Authentication

- **[Kinde Auth](https://kinde.com)** - Authentication and organization management
- **[@kinde/management-api-js](https://github.com/kinde-oss/kinde-management-api-js)** - Kinde Management API
- **[Kinde Management API JS](kinde-mgmt)** – Kinde Management API client for JavaScript/TypeScript

### UI & Styling

- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com)** - Re-usable component library
- **[Radix UI](https://www.radix-ui.com/)** - Unstyled, accessible UI primitives
- **[Lucide Icons](https://lucide.dev)** - Icon library
- **[Motion](https://motion.dev)** - Animation library
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Theme management

## 📁 Project Structure

```text
b2b-ai-saas/
├── app/
│   ├── (dashboard)/                # Dashboard route group
│   │   └── workspace/              # Workspace management
│   │       ├── layout.tsx          # Sidebar layout with navigation
│   │       ├── page.tsx            # Main workspace page
│   │       ├── [workspaceId]/      # Dynamic workspace routes
│   │       └── _components/        # Workspace-specific components
│   │           ├── CreateWorkspace.tsx  # Workspace creation dialog
│   │           ├── UserNav.tsx          # User navigation dropdown
│   │           └── WorkspaceList.tsx    # Workspace switcher
│   ├── (marketing)/                # Marketing route group
│   │   ├── page.tsx                # Landing page
│   │   └── _component/             # Marketing components
│   ├── api/                        # API routes
│   │   └── auth/                   # Kinde Auth endpoints
│   ├── middlewares/                # ORPC middleware
│   │   ├── base.ts                 # Base middleware setup
│   │   ├── auth.ts                 # Authentication middleware
│   │   └── workspace.ts            # Workspace context middleware
│   ├── router/                     # ORPC route definitions
│   │   ├── index.ts                # Router aggregation
│   │   └── workspace.ts            # Workspace routes (list, create)
│   ├── rpc/                        # ORPC handler endpoints
│   │   └── [[...rest]]/route.ts   # Catch-all RPC handler
│   ├── schemas/                    # Zod validation schemas
│   │   └── workspace.ts            # Workspace schema
│   ├── layout.tsx                  # Root layout
│   └── globals.css                 # Global styles
├── components/                     # Shared components
│   ├── ui/                         # shadcn/ui components
│   └── logo.tsx                    # Logo component
├── lib/                            # Utility libraries
│   ├── orpc.ts                     # Client-side ORPC setup
│   ├── orpc.server.ts              # Server-side ORPC setup
│   ├── utils.ts                    # Utility functions
│   ├── get-avatar.ts               # Avatar utilities
│   ├── providers.tsx               # React context providers
│   └── query/                      # TanStack Query setup
│       ├── client.ts               # Query client configuration
│       └── hydration.tsx           # Hydration utilities
└── public/                         # Static assets
```

## 🚦 Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10.28.2+

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd b2b-ai-saas
```

1. Install dependencies:

```bash
pnpm install
```

1. Set up environment variables:

```bash
cp .env.example .env.local

# Then update .env.local with your real credentials
```

1. Run the development server:

```bash
pnpm dev
```

1. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Arcjet Runtime Guard (Error Handling)

Arcjet integration is centralized in `lib/arcjet.ts` and used by:

- `app/middlewares/arcjet/read.ts`
- `app/middlewares/arcjet/write.ts`
- `app/middlewares/arcjet/standard.ts`
- `app/middlewares/arcjet/heavy-write.ts`

Behavior and edge cases:

- If `ARCJET_KEY` is configured, middleware enforces Arcjet decisions normally.
- If `ARCJET_KEY` is missing, the app logs a one-time warning and gracefully bypasses Arcjet checks.
- If Arcjet fails at runtime for a request, the error is logged with middleware
  context and only that request bypasses Arcjet.

This design prevents hard crashes from missing configuration and keeps enforcement logic DRY in a shared helper.

## ✅ Useful Commands

```bash
# Start local development
pnpm dev

# Validate required Arcjet env is present in the current shell
pnpm check:arcjet-env

# Type-check the whole project
pnpm typecheck

# Lint the project
pnpm lint

# Run tests once
pnpm test -- --run

# One-command CI-style verification
pnpm verify
```

## 🏗️ Architecture

### ORPC API Layer

The application uses ORPC for type-safe API communication:

- **Routes** (`app/router/`): Define API endpoints with input/output schemas
- **Middlewares** (`app/middlewares/`): Handle authentication and workspace context
- **Client** (`lib/orpc.ts`): Client-side ORPC configuration with TanStack \
Query integration
- **Server** (`lib/orpc.server.ts`): Server-side router client for SSR

Example route definition:

```typescript
export const listWorkspaces = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .route({
    method: "GET",
    path: "/workspace",
    summary: "list all workspaces",
    tags: ["workspaces"],
  })
  .input(z.void())
  .output(workspaceListSchema)
  .handler(async ({ context }) => {
    // Handler implementation
  });
```

### Authentication Flow

1. User logs in via Kinde Auth
2. Authentication middleware validates session
3. Workspace middleware loads current organization context
4. User can switch between workspaces using the sidebar

### Workspace Management

- **Create**: Users can create new workspaces via the `CreateWorkspace` component
- **List**: All user workspaces are displayed in the `WorkspaceList` sidebar
- **Switch**: Click on a workspace to switch context \
(re-authenticates with new organization)
- **Permissions**: Admin role is automatically assigned to workspace creators

## 🎨 UI Components

The project uses shadcn/ui components with customization:

- **Avatar** - User profile images with fallbacks
- **Button** - Various button variants and sizes
- **Dialog** - Modal dialogs for forms
- **Dropdown Menu** - User navigation menu
- **Form** - Form components with react-hook-form integration
- **Tooltip** - Contextual tooltips
- **Theme Toggle** - Dark/light mode switcher

## 📝 Development Guidelines

### Adding New Features

1. **Define Schema** (`app/schemas/`): Create Zod validation schema
2. **Create Route** (`app/router/`): Define ORPC route with input/output
3. **Add Middleware** (if needed): Apply authentication/authorization
4. **Build UI** (`components/` or `app/_components/`): Create React components
5. **Integrate Query**: Use `orpc.yourRoute.queryOptions()` or `mutationOptions()`

### Code Style

- Use TypeScript for all files
- Follow React Server Components pattern (mark client components with `"use client"`)
- Add JSDoc comments for exported functions/components
- Use consistent naming: PascalCase for components, camelCase for functions
- Validate all inputs with Zod schemas

### State Management

- Use TanStack Query for server state
- Use React hooks (useState, useReducer) for local state
- Leverage ORPC's automatic cache invalidation

## 🧪 Testing

This project uses **Vitest** + **@testing-library/react** for unit and \
component tests. A minimal test setup is provided in `vitest.config.mts` and `test/setup.ts`.

Common test commands:

```bash
# Run tests once (CI-friendly)
pnpm test

# Run tests once with verbose output
pnpm test -- --run --reporter verbose

# Run tests in watch mode while developing
pnpm test -- --watch
```

Notes:

- Test globals (describe/it/expect) are enabled via TypeScript config (`vitest/globals`).
- Add tests next to components or in a `test/` folder using the \
`*.test.tsx` / `*.spec.tsx` naming convention.
- To enable DOM matchers (e.g. `toBeInTheDocument()`), see `test/setup.ts` \
which imports `@testing-library/jest-dom`.

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Configure environment variables
4. Deploy

### Other Platforms

The application can be deployed to any platform supporting Next.js:

- AWS Amplify
- Netlify
- Railway
- Self-hosted with Docker

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [ORPC Documentation](https://orpc.io/docs)
- [Kinde Auth Documentation](https://kinde.com/docs)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [shadcn/ui Documentation](https://ui.shadcn.com)

## 📄 License
