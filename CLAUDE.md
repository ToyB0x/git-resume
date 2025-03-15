# Codebase Guidelines

## Build & Development Commands
- `pnpm build` - Build all packages and apps
- `pnpm dev` - Start development servers for all apps
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm lint` - Run Biome linting (no auto-fix)
- `pnpm lint:fix` - Run Biome linting with auto-fix
- `cd apps/web && pnpm dev` - Run web app only
- `cd apps/api && pnpm dev` - Run API server only
- `cd apps/cli && pnpm jobs` - Run CLI jobs

## Code Style
- TypeScript w/ strict typing (extends @tsconfig/strictest)
- Use double quotes for strings
- Use spaces for indentation (Biome configured)
- Keep imports organized (auto-sorted by Biome)
- Use React 19 with functional components
- Use arrow functions for component definitions

## Error Handling
- Prefer explicit error handling with typed errors
- Use try/catch blocks for async operations
- Validate inputs with Valibot schemas

## Naming Conventions
- PascalCase for types, interfaces, and React components
- camelCase for variables, functions, and properties
- Use descriptive, intention-revealing names