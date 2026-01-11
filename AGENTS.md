# Sonskay - Agent Guidelines

A social media scheduling application built with Next.js 16, Prisma, and shadcn/ui.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui (New York style)
- **Database:** PostgreSQL via Prisma ORM
- **Validation:** Zod
- **Package Manager:** pnpm
- **Theme:** Green light/dark mode

## Available Commands

| Command            | Description              |
| ------------------ | ------------------------ |
| `pnpm dev`         | Start development server |
| `pnpm build`       | Build for production     |
| `pnpm start`       | Start production server  |
| `pnpm lint`        | Run ESLint               |
| `pnpm db:generate` | Generate Prisma client   |
| `pnpm db:migrate`  | Deploy migrations        |
| `pnpm db:seed`     | Seed database            |

## Code Style Guidelines

### Imports

Organize imports in the following order with blank lines between groups:

```typescript
// 1. 'use client' directive (must be first)
'use client';

// 2. Next.js imports
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// 3. Third-party imports (alphabetical)
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

// 4. UI component imports (grouped by directory)
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

// 5. Library imports
import { prisma } from '@/lib/prisma';

// 6. Validation schemas
import { loginSchema, type LoginInput } from '@/lib/validations/auth';

// 7. Icon imports (from lucide-react)
import { LogOut, Settings, User } from 'lucide-react';
```

Use absolute paths with `@/` alias for imports. Do not use relative paths like `../../`.

### Types

- Use explicit types for function parameters and return values
- Export types alongside schemas for reuse
- Use `z.infer<typeof schema>` for type inference from Zod schemas
- Prefer interfaces for object shapes used in components
- Use `type` alias for unions, intersections, and primitives

```typescript
// Good
interface NavbarProps {
  user: {
    name?: string | null;
    email: string;
  } | null;
}

// Export type from validation schema
export type LoginInput = z.infer<typeof loginSchema>;
```

### Naming Conventions

- **Components:** PascalCase (`LoginPage`, `ThemeToggle`)
- **Functions:** camelCase (`getSession`, `handleSubmit`)
- **Variables:** camelCase (`isLoading`, `errorMessage`)
- **Constants:** SCREAMING_SNAKE_CASE for config constants
- **Files:** kebab-case for non-component files (`auth-helper.ts`)
- **Database models:** PascalCase in schema, `snake_case` in database

### Error Handling

- Use try/catch blocks for async operations
- Log errors with descriptive messages
- Return consistent error responses in API routes
- Handle Zod validation errors specifically

```typescript
// API route error handling
try {
  const body = await request.json();
  const validatedData = loginSchema.parse(body);
  // ... operation
} catch (error) {
  if (error instanceof Error && error.name === 'ZodError') {
    return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
  }
  console.error('Operation failed:', error);
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}
```

### Component Structure

- Use `'use client'` directive for client components
- Destructure props explicitly
- Use descriptive variable names
- Keep components focused (single responsibility)
- Extract complex logic into custom hooks

```typescript
'use client';

interface Props {
  title: string;
  onSubmit: (data: Data) => Promise<void>;
}

export function Component({ title, onSubmit }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: Data) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
    } finally {
      setIsLoading(false);
    }
  };

  return <form onSubmit={handleSubmit}>{/* ... */}</form>;
}
```

### React Hook Form

- Use `react-hook-form` with `zodResolver` for forms
- Destructure `register`, `handleSubmit`, `formState: { errors }`
- Display validation errors below inputs
- Disable form during submission

### Tailwind CSS

- Use shadcn/ui component variants
- Follow the green theme (CSS variables in `globals.css`)
- Use `text-muted-foreground`, `bg-primary`, etc. for theming
- Apply responsive classes with `md:`, `lg:` prefixes

### API Routes

- Use Next.js App Router route handlers (`src/app/api/...`)
- Validate input with Zod schemas
- Return `NextResponse.json` with consistent structure
- Use appropriate HTTP status codes

### Database Operations

- Use Prisma client from `@/lib/prisma`
- Use `upsert` for creation that may be idempotent
- Select only needed fields in queries
- Handle not-found cases explicitly

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/
│   ├── ui/          # shadcn/ui components
│   └── ...          # Custom components
├── lib/
│   ├── prisma.ts    # Prisma client singleton
│   ├── utils.ts     # Utility functions
│   ├── auth.ts      # Authentication helpers
│   ├── trpc/        # tRPC configuration
│   └── validations/ # Zod schemas
└── server/          # tRPC routers
```

## AI/Agent Guidelines

- **Never commit changes** unless explicitly requested
- Always ask for confirmation before creating commits
- Let the user review and commit changes themselves

### Database Commands

**NEVER** run database-affecting commands without explicit permission:

- `prisma migrate`, `prisma db push`, `prisma db reset`
- `prisma db seed`, `pnpm db:setup`
- Any raw SQL commands that modify data or schema

Only run when user explicitly asks (e.g., "run the migrations").
