# Development Guide

This document provides comprehensive technical guidance for developing, testing, and deploying the @bartek0x1001/crud NPM package.

## Project Structure

```
crud/
├── src/
│   ├── lib/                    # Core package library
│   │   ├── CRUDServer.ts       # Main CRUDServer class
│   │   ├── CRUDRouterFactory.ts # CRUD router generator
│   │   └── types.ts            # TypeScript interfaces
│   └── index.ts                # Package entry point
├── tests/                      # Test files for package functionality
│   └── lib/                    # Tests for core library classes
├── examples/                   # Usage examples for package users
├── dist/                       # Compiled JavaScript output
├── docs/                       # Project documentation
├── tsconfig.json               # TypeScript configuration
├── vitest.config.ts            # Test configuration
├── package.json                # NPM package configuration
└── .npmignore                  # Files excluded from NPM package
```

## Development Setup

### Prerequisites
- Node.js 18+ (required for ES2024 features and ESM modules)
- npm or yarn package manager

### Initial Setup
```bash
npm install
```

### Environment Configuration
- **No additional environment variables required**
- Package is designed to work out-of-the-box

## Available Commands

### Development Mode
```bash
npm run dev
```
**Purpose**: Runs development server with hot reloading
**What it does**: 
- Starts TypeScript compiler in watch mode
- Runs Vitest in watch mode for tests
- Both processes run concurrently using `concurrently` package
- Automatically recompiles when source files change

### Testing
```bash
npm test
```
**Purpose**: Runs all tests once
**What it does**:
- Executes Vitest test runner
- Runs all `.test.ts` files in `tests/` directory
- Tests compiled JavaScript code from `dist/` directory
- Tests core package functionality (CRUDServer, CRUDRouterFactory)

### Build
```bash
npm run build
```
**Purpose**: Compiles TypeScript to JavaScript
**What it does**:
- Compiles TypeScript using `tsc` compiler
- Outputs JavaScript to `dist/` directory
- Generates source maps and declaration files
- Uses ES2024 target with ESM modules
- Creates package structure for NPM distribution

### Package Preparation
```bash
npm run prepublishOnly
```
**Purpose**: Automatically builds package before NPM publishing
**What it does**:
- Runs `npm run build` automatically
- Ensures package is compiled before publishing
- Prevents publishing uncompiled code

## Development Workflow

### 1. Development Mode
```bash
npm run dev
```
- Edit TypeScript files in `src/lib/`
- Tests run automatically in watch mode
- TypeScript compilation happens automatically
- **Why tests work in dev mode**: TypeScript compilation runs concurrently, so tests always have latest compiled code to test

### 2. Testing
```bash
npm test
```
- Run tests against compiled JavaScript code
- Tests use Vitest for fast execution
- No server startup required for testing
- **Important**: Tests run against compiled code in `dist/`, not source code in `src/`

### 3. Building for Distribution
```bash
npm run build
```
- Compile TypeScript to JavaScript
- Create package structure in `dist/` directory
- Generate type definitions and source maps

### 4. Package Testing
```bash
npm run build
npm pack
```
- Build the package
- Create a tarball for local testing
- Verify package structure and contents

## Technical Configuration

### TypeScript Configuration
- **Target**: ES2024
- **Module**: NodeNext (ESM)
- **Module Resolution**: NodeNext
- **Output Directory**: `dist/`
- **Path Mapping**: `#src/*` maps to `src/*`
- **Strict Mode**: Enabled
- **Source Maps**: Enabled
- **Declaration Files**: Enabled

### Test Configuration
- **Framework**: Vitest
- **Environment**: Node.js
- **Test Files**: `tests/**/*.test.ts`
- **Timeout**: 10 seconds
- **Path Alias**: `#src` resolves to `dist/src` (compiled code)
- **Globals**: Enabled (describe, it, expect available)

### Build Output
- **Main Entry**: `dist/src/index.js`
- **Source Maps**: Available for debugging
- **Declaration Files**: TypeScript definitions
- **Module Format**: ES modules (ESM)

## Package Development

### Adding New Features
1. Create new classes/functions in `src/lib/`
2. Export them in `src/index.ts`
3. Add corresponding tests in `tests/lib/`
4. Update documentation and examples

### Testing Strategy
- **Unit Tests**: Test individual classes and functions
- **Integration Tests**: Test CRUDServer class with router generation
- **API Tests**: Test generated Express routers
- **Coverage**: Aim for high test coverage of core functionality

### Test Structure
- Tests mirror source directory structure
- Focus on testing package functionality, not Express.js features
- Use Vitest for fast, reliable testing
- **Critical**: Tests import from `#src/*` which resolves to `dist/src/*` (compiled JavaScript)

## NPM Package Management

### Package Structure
- **Main Entry**: `dist/src/index.js`
- **Type Definitions**: `dist/src/index.d.ts`
- **Files Included**: Only `dist/` directory
- **Excluded**: Source files, tests, documentation, config files

### Publishing Process
1. Ensure all tests pass: `npm test`
2. Build package: `npm run build`
3. Verify package structure: `npm pack`
4. Publish to NPM: `npm publish`

### Version Management
- Update version in `package.json`
- Follow semantic versioning (semver)
- Document breaking changes in CHANGELOG.md

## Dependencies

### Production Dependencies
- `express`: Web framework (peer dependency)
- `@bartek0x1001/json-storage`: File-based storage
- `@bartek0x1001/async-tasks-queue`: Task queue management
- `uuid`: Unique identifier generation

### Development Dependencies
- `typescript`: TypeScript compiler
- `vitest`: Test runner
- `@types/express`: Express type definitions
- `@types/node`: Node.js type definitions
- `concurrently`: Run multiple commands simultaneously

### Peer Dependencies
- `express`: >=5.0.0 (users must provide Express.js)

## Coding Standards

### TypeScript
- Use ES modules (import/export)
- Strict type checking enabled
- Prefer async/await over Promises
- Use proper type annotations
- Export types for package users

### API Design
- Fluent API with method chaining
- Consistent error handling
- Clear method names and parameters
- Proper TypeScript interfaces

### Testing
- Descriptive test names
- Arrange-Act-Assert pattern
- Test both success and error cases
- Test edge cases and error conditions
- Use Vitest for fast, reliable testing

### Documentation
- Clear JSDoc comments for public APIs
- Comprehensive README with examples
- Type definitions for all public interfaces
- Usage examples in examples/ directory
