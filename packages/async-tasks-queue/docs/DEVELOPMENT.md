# Development Guide

This document provides comprehensive technical guidance for developing, maintaining, and deploying the Async Tasks Queue project.

## Project Overview

**Type**: NPM Package (TypeScript)  
**Purpose**: Sequential async task execution for Node.js  
**Package**: `@bartek01001/async-tasks-queue`  
**Version**: 2.0.0  

## Technical Stack

- **Language**: TypeScript 5.8.3
- **Target**: ES2024 with NodeNext module resolution
- **Build Tool**: TypeScript Compiler (tsc)
- **Testing**: Vitest 3.2.4
- **Package Manager**: NPM
- **Module System**: ESM (ES Modules)

## Development Setup

### Prerequisites

- Node.js (version 18 or higher)
- NPM (comes with Node.js)

### Local Development Setup

1. **Clone and Install Dependencies**
   ```bash
   git clone https://github.com/maciej-bartynski/async-tasks-queue.git
   cd async-tasks-queue
   npm install
   ```

2. **Verify Installation**
   ```bash
   npm run build
   npm test
   ```

## Development Workflow

### Available Scripts

| Script | Purpose | Command |
|--------|---------|---------|
| `build` | Compile TypeScript to JavaScript | `npm run build` |
| `test` | Run test suite | `npm test` |
| `dev` | Watch mode for development | `npm run dev` |
| `prepublishOnly` | Build before publishing | `npm run prepublishOnly` |

### Development Mode

**Watch Mode Development:**
```bash
npm run dev
```
This runs TypeScript compiler in watch mode, automatically rebuilding when files change.

**Manual Build:**
```bash
npm run build
```
Compiles TypeScript source files to the `dist/` directory.

### Testing

**Run Tests:**
```bash
npm test
```

**Test Configuration:**
- **Framework**: Vitest 3.2.4
- **Environment**: Node.js
- **Execution**: Single-threaded (sequential)
- **Timeout**: 10 seconds per test
- **Pattern**: `tests/**/*.test.ts`

**Test Structure:**
- Tests are located in `tests/AsyncQueue.test.ts`
- Tests verify sequential execution behavior
- Tests include performance and concurrency scenarios
- All tests use deterministic assertions

## Build Process

### TypeScript Configuration

**File**: `tsconfig.json`

**Key Settings:**
- **Target**: ES2024
- **Module**: NodeNext
- **Module Resolution**: NodeNext
- **Output**: `dist/` directory
- **Source Maps**: Enabled
- **Declarations**: Enabled with maps
- **Strict Mode**: Enabled

**Path Mapping:**
- `#src/*` → `src/*` (source files)
- `tests/*` → `tests/*` (test files)

### Build Output

**Structure:**
```
dist/
├── index.js              # Main entry point
├── index.d.ts            # Type definitions
├── src/
│   └── AsyncTasksQueue.js
└── tests/
    └── AsyncQueue.test.js
```

**Source Maps**: All files include `.map` files for debugging.

## Project Structure

```
async-tasks-queue/
├── src/
│   └── AsyncTasksQueue.ts    # Core implementation
├── tests/
│   └── AsyncQueue.test.ts    # Test suite
├── docs/
│   ├── DEVELOPMENT.md        # This file
│   └── task-log.md          # Fadro workflow log
├── dist/                     # Built files (generated)
├── index.ts                  # Main entry point
├── package.json             # Package configuration
├── tsconfig.json            # TypeScript configuration
├── vitest.config.ts         # Test configuration
└── README.md                # Package documentation
```

## Publishing Workflow

### Pre-publish Steps

1. **Build Package**
   ```bash
   npm run build
   ```

2. **Run Tests**
   ```bash
   npm test
   ```

3. **Verify Package Contents**
   ```bash
   npm pack --dry-run
   ```

### Publishing

**Publish to NPM:**
```bash
npm publish
```

**Package Configuration:**
- **Access**: Public
- **Files**: `dist/`, `README.md`
- **Main**: `dist/index.js`
- **Types**: `dist/index.d.ts`
- **Module Type**: ESM

### Version Management

**Current Version**: 2.0.0  
**Versioning**: Semantic Versioning (SemVer)  
**Registry**: NPM Public Registry  

## Environment Variables

**No environment variables required** - this package has no external dependencies or configuration.

## Concurrency and Performance

### Single-Threaded Execution

- **Test Execution**: Vitest runs tests sequentially (single thread)
- **Queue Processing**: Tasks are processed one at a time
- **No Parallel Processing**: Intentionally sequential for predictable behavior

### Performance Considerations

- **Memory Usage**: Minimal - only stores task references
- **Processing**: O(1) enqueue, O(n) processing where n = queue length
- **Error Handling**: Errors don't stop queue processing

## Dependencies

### Production Dependencies
**None** - Zero runtime dependencies.

### Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@bartek01001/fadro` | ^4.0.0 | Development workflow framework |
| `@types/node` | ^24.1.0 | Node.js type definitions |
| `typescript` | ^5.8.3 | TypeScript compiler |
| `vitest` | ^3.2.4 | Testing framework |

## Code Standards

### TypeScript Guidelines

- **Strict Mode**: Enabled for all files
- **No Implicit Any**: All types must be explicit
- **ESM Modules**: Use `import/export` syntax
- **Type Definitions**: All public APIs must have types

### Code Organization

- **Single Responsibility**: One class per file
- **No Comments**: Code must be self-explanatory
- **English Only**: All code in English
- **Test Coverage**: All code must be tested

### File Naming

- **Classes**: PascalCase (e.g., `AsyncTasksQueue`)
- **Files**: PascalCase for classes, kebab-case for others
- **Tests**: `*.test.ts` suffix

## Troubleshooting

### Common Issues

**Build Errors:**
- Ensure TypeScript 5.8.3+ is installed
- Check `tsconfig.json` configuration
- Verify all imports use `.js` extensions

**Test Failures:**
- Tests are deterministic - failures indicate actual issues
- Check timeout settings (10 seconds per test)
- Verify single-threaded execution

**Import Issues:**
- Use `.js` extensions in imports (not `.ts`)
- Ensure proper path mapping in `tsconfig.json`
- Check module resolution settings

### Development Tips

1. **Use Watch Mode**: `npm run dev` for automatic rebuilding
2. **Test Frequently**: Run `npm test` after changes
3. **Check Types**: TypeScript will catch type errors during build
4. **Verify Exports**: Ensure `index.ts` properly exports the main class
