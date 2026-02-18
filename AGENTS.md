# AGENTS.md - Development Guidelines

This is a full-stack demo project with a React/TypeScript frontend and ASP.NET Core backend.

## Project Structure

```
demo-project/
├── frontend/          # React + TypeScript + Vite
│   └── src/
│       ├── pages/     # Route pages (Customers, Products, Orders)
│       ├── services/  # API clients (axios)
│       └── App.tsx    # Main app with routing
└── backend/          # ASP.NET Core 8.0 Web API
    ├── Controllers/   # API controllers
    ├── Services/      # Business logic
    ├── Repositories/  # Data access
    ├── Models/        # Domain models
    └── Data/          # DbContext
```

## Commands

### Frontend (React + Vite)

```bash
cd frontend

# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

**Run a single test**: This project doesn't have tests configured. To add tests:
```bash
npm install vitest @testing-library/react @testing-library/jest-dom jsdom
```

### Backend (ASP.NET Core)

```bash
cd backend

# Build the project
dotnet build

# Run development server
dotnet run

# Run tests
dotnet test

# Run a single test (by test class name)
dotnet test --filter "FullyQualifiedName~CustomerServiceTests"

# Run a single test (by test name)
dotnet test --filter "FullyQualifiedName~CustomerServiceTests.GetAllAsync_ReturnsCustomers"

# Clean and rebuild
dotnet clean && dotdotnet build
```

## Code Style Guidelines

### Frontend (TypeScript/React)

**Imports**
- Use absolute imports from `@/` alias (configure in tsconfig.json if needed)
- Order: React imports → external libs → internal components/services → types
- Example: `import { useState } from "react";` → `import { Link } from "react-router-dom";` → `import { api } from "../services/api";`

**Types**
- Always use explicit types for function parameters and return values
- Use interfaces for object shapes, types for unions/aliases
- Avoid `any`; use `unknown` when type is truly unknown

**Components**
- Use functional components with hooks
- Name components PascalCase
- Extract types to `src/types/` directory
- Use `const` for component definitions

**Naming**
- Variables/functions: camelCase
- Components/Types: PascalCase
- Files: kebab-case (e.g., `customer-list.tsx`)
- Constants: UPPER_SNAKE_CASE

**Error Handling**
- Always handle API errors with try/catch
- Display user-friendly error messages
- Use TypeScript's `unknown` for caught errors before type narrowing

**Formatting**
- Use 2 spaces for indentation
- Single quotes for strings in JSX, double quotes for HTML attributes
- Trailing commas in arrays and objects

### Backend (C#)

**Naming Conventions**
- Classes/Interfaces: PascalCase (e.g., `CustomerController`)
- Methods/Properties: PascalCase (e.g., `GetAllAsync`)
- Parameters: camelCase (e.g., `customerId`)
- Private fields: _camelCase (e.g., `_customerService`)

**Controller Guidelines**
- Use `[ApiController]` attribute
- Use attribute routing: `[Route("api/[controller]")]`
- Return `IActionResult` or typed results
- Async methods with `Task<T>` return type

**Dependency Injection**
- Constructor injection for dependencies
- Use interfaces for services/repositories
- Register in `Program.cs` with appropriate lifetime (Scoped, Singleton, Transient)

**Error Handling**
- Use proper HTTP status codes (200 OK, 400 BadRequest, 404 NotFound, 500 Error)
- Validate model state with `[ApiController]` automatic validation
- Use try/catch for operations that may fail

**Code Organization**
- Controllers → Services → Repositories pattern
- One file per class
- Interfaces in `Interfaces/` subfolder, implementations in `Implementations/`

**Nullable Reference Types**
- Enabled in project (`<Nullable>enable</Nullable>`)
- Use `string?` for nullable strings
- Use `= string.Empty` or `= null!` for initialized properties

### ESLint Configuration

The frontend uses ESLint with these plugins:
- `eslint-plugin-react-hooks` - Rules for React hooks
- `eslint-plugin-react-refresh` - Safe Fast Refresh patterns

Run `npm run lint -- --fix` to auto-fix issues.

## Adding Tests

### Frontend
Install Vitest and Testing Library, then add test scripts to package.json:
```json
"test": "vitest",
"test:run": "vitest run"
```

### Backend
Create test project:
```bash
dotnet new xunit -o backend.Tests
dotnet add reference ../backend/backend.csproj
dotnet add package Moq
```

Run specific test: `dotnet test --filter "Name~TestMethodName"`
