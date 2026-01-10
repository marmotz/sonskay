# Social Scheduler

A social media scheduling application built with Next.js 15, Prisma, and shadcn/ui.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui (New York style)
- **Database:** PostgreSQL via Prisma ORM
- **Validation:** Zod
- **Package Manager:** pnpm
- **Theme:** Green light/dark mode

## Getting Started

### Prerequisites

- Docker & Docker Compose
- pnpm

### Installation

```bash
# Start PostgreSQL
docker-compose up -d

# Install dependencies
pnpm install

# Generate Prisma client
pnpx prisma generate

# Push schema to database
pnpx prisma db push

# Start development server
pnpm dev
```

### Environment Variables

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/social_scheduler?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
```

## Available Commands

| Command                   | Description                     |
|---------------------------| ------------------------------- |
| `pnpm dev`                | Start development server        |
| `pnpm build`              | Build for production            |
| `pnpm start`              | Start production server         |
| `pnpm lint`               | Run ESLint                      |
| `pnpx prisma studio`      | Open Prisma database UI         |
| `pnpx prisma db push`     | Push schema changes to database |
| `pnpx prisma migrate dev` | Run migrations                  |

## Database Schema

### User Model

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Validation with Zod

All inputs must be validated using Zod schemas located in `src/lib/validations/`.

## Code Style

- Prettier for formatting (tailwindcss plugin enabled)
- ESLint for linting
- Follow existing code conventions

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
│   └── validations/ # Zod schemas
└── ...
```

## Notes

- Prisma v7 uses `prisma.config.ts` for database configuration
- The `url` property has been moved from `schema.prisma` to `prisma.config.ts`
- Always validate user inputs with Zod before processing
- Use the green theme CSS variables in `src/app/globals.css`

## AI/Agent Guidelines

- **Never commit changes** unless explicitly requested by the user
- Always ask for confirmation before creating commits
- Let the user review and commit changes themselves
