# OpenCode Project Guidelines for PetCare App

## Commands
- Dev: `pnpm dev` (runs `pnpm install && vite`)
- Build: `pnpm build` (runs `pnpm install && rm -rf node_modules/.vite-temp && tsc -b && vite build`)
- Lint: `pnpm lint` (runs `pnpm install && eslint .`)
- Preview: `pnpm preview` (runs `pnpm install && vite preview`)
- Test: No explicit test command found in `package.json`. If using Vitest, it might be `pnpm test` or `npx vitest`. For a single file: `npx vitest run <path_to_test_file>`. Please update with the correct command.

## Code Style & Conventions

### Core Stack
- React, TypeScript, Vite, Tailwind CSS.
- UI Components: Primarily from `shadcn/ui` (located in `src/components/ui`), using Radix UI primitives.

### Imports
- Use absolute paths with the `@/*` alias for the `src/` directory (e.g., `import MyComponent from '@/components/MyComponent';`) as configured in `tsconfig.json`.
- Order: 1. React imports, 2. External library imports, 3. Absolute project imports (`@/...`), 4. Relative project imports (`../`, `./`), 5. CSS/style imports.

### Formatting & Linting
- ESLint is configured (`eslint.config.js`). Adhere to its rules. Key plugins include `typescript-eslint` and `eslint-plugin-react-hooks`.
- Consider integrating Prettier for consistent code formatting if not already in use.

### Types & Interfaces
- Utilize TypeScript for strong typing. Minimize `any` where possible (despite `@typescript-eslint/no-explicit-any` being off in current ESLint config).
- Define shared types in `src/types.ts`. Component-specific types can be co-located or defined there.
- Naming: Use `PascalCase` for types, interfaces, and enums (e.g., `interface UserProfile {}`).

### Naming Conventions
- Components: `PascalCase` (e.g., `UserProfileCard.tsx`).
- Variables & Functions: `camelCase` (e.g., `getUserData`).
- Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_USERS`).

### Error Handling
- Use `try-catch` blocks for asynchronous operations (e.g., `fetch` calls).
- For React components, consider using Error Boundaries for graceful error handling in the UI.

### General
- Follow existing patterns in the codebase for consistency.
- Prefer functional components with Hooks.
- Keep components focused on a single responsibility.
- Tailwind CSS is used for styling; leverage its utility classes.
