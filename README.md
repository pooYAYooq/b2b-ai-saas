# B2B AI SaaS Platform

A modern B2B SaaS application built with Next.js 16, featuring workspace management, type-safe APIs with ORPC, and authentication via Kinde Auth.

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

### UI & Styling
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com)** - Re-usable component library
- **[Radix UI](https://www.radix-ui.com/)** - Unstyled, accessible UI primitives
- **[Lucide Icons](https://lucide.dev)** - Icon library
- **[Motion](https://motion.dev)** - Animation library
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Theme management

## 📁 Project Structure

```
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

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
# Create .env.local file with your Kinde credentials
KINDE_CLIENT_ID=your_client_id
KINDE_CLIENT_SECRET=your_client_secret
KINDE_ISSUER_URL=https://your-domain.kinde.com
KINDE_SITE_URL=http://localhost:3000
KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000
KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/workspace
```

4. Run the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Architecture

### ORPC API Layer

The application uses ORPC for type-safe API communication:

- **Routes** (`app/router/`): Define API endpoints with input/output schemas
- **Middlewares** (`app/middlewares/`): Handle authentication and workspace context
- **Client** (`lib/orpc.ts`): Client-side ORPC configuration with TanStack Query integration
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
- **Switch**: Click on a workspace to switch context (re-authenticates with new org)
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

```bash
# Run linter
pnpm lint

# Build for production
pnpm build

# Start production server
pnpm start
```

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
