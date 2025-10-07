# Development Guide

Complete technical guide for developing, maintaining, and deploying the @bartek0x1001 monorepo packages.

## Prerequisites

- **Docker**: Latest version with Docker Compose
- **Make**: For running development commands
- **Git**: For version control and package management

## Project Structure

```
bartek0x1001/ (monorepo root)
├── packages/ (all NPM packages)
│   ├── async-tasks-queue/ (@bartek0x1001/async-tasks-queue)
│   ├── deep-merge/ (@bartek0x1001/deep-merge)
│   ├── json-storage/ (@bartek0x1001/json-storage)
│   ├── crud/ (@bartek0x1001/crud)
│   └── fadro/ (@bartek0x1001/fadro)
├── docs/ (documentation)
├── Dockerfile (container configuration)
├── docker-compose.yml (container orchestration)
├── Makefile (development commands)
└── package.json (workspace configuration)
```

## Development Setup

### 1. Docker Environment Setup

This monorepo uses Docker for consistent development across all packages:

```bash
# Clone repository
git clone <repository-url>
cd bartek0x1001

# Build and start Docker container
make setup

# Install all dependencies in container
make install
```

### 2. Available Development Commands

All development commands are executed inside the Docker container via Makefile:

```bash
# Show all available commands
make help

# Build all packages
make build

# Run all tests
make test

# Development mode for specific packages
make dev-crud              # Start crud package in watch mode
make dev-json-storage      # Start json-storage package in watch mode
make dev-async-tasks-queue # Start async-tasks-queue package in watch mode
make dev-deep-merge        # Start deep-merge package in watch mode

# Version management
make changeset             # Create new changeset for version bump
make version               # Bump versions based on changesets (develop branch)
make release               # Publish packages to NPM (main branch)

# Utility commands
make clean                 # Clean all build artifacts
make npm cmd="..."         # Run npm command in container
make docker cmd="..."      # Run docker-compose command
make restart               # Restart existing container
make stop                  # Stop container
make uninstall-fadro       # Uninstall fadro from all packages
```

## Development Workflows

### Docker-based Development

All development work happens inside the Docker container to ensure consistency:

```bash
# Start development for specific package
make dev-crud              # CRUD package with Express.js endpoints
make dev-json-storage      # JSON file storage with async queue
make dev-async-tasks-queue # Async task queue management
make dev-deep-merge        # Deep merge utility

# All commands execute inside container with:
# - Node.js LTS 22.20.0
# - Bidirectional file sync with host
# - Consistent environment across all packages
```

**Development Mode Features:**
- TypeScript compilation in watch mode
- Source maps for debugging
- Automatic recompilation on file changes
- Error reporting with pretty formatting
- Real-time file synchronization between host and container
- **No build required** - works directly with TypeScript sources

### Testing

All packages use Vitest with consistent configuration:

```bash
# Run all tests across all packages (requires build first)
make build
make test

# Run tests for specific package (via Docker)
# REQUIRES BUILD FIRST! No point of building separately, just use: make build and build ALL pkgs
make npm cmd="run test --workspace=packages/crud"
make npm cmd="run test --workspace=packages/json-storage"
make npm cmd="run test --workspace=packages/async-tasks-queue"
make npm cmd="run test --workspace=packages/deep-merge"
```

**Test Configuration:**
- **Environment**: Node.js
- **Execution**: Single-threaded, non-concurrent
- **Timeout**: 10 seconds per test
- **Reporting**: Verbose output
- **Coverage**: Source code only (excludes dist/)

### Building

Compile TypeScript to JavaScript with declarations:

```bash
# Build all packages
make build

# Build specific package (via Docker)
make npm cmd="run build --workspace=packages/crud"
make npm cmd="run build --workspace=packages/json-storage"
```

**Build Output:**
- **JavaScript**: ES2024 modules in `dist/` directory
- **TypeScript Declarations**: `.d.ts` files with source maps
- **Source Maps**: `.js.map` and `.d.ts.map` files
- **Module Resolution**: NodeNext with ESM imports

## Package Development

### Adding New Packages

1. **Create Package Directory**:
   ```bash
   mkdir new-package
   cd new-package
   ```

2. **Initialize Package**:
   ```bash
   npm init -y
   ```

3. **Configure TypeScript** (copy from existing package):
   ```json
   {
     "compilerOptions": {
       "types": ["vitest/globals"],
       "module": "nodenext",
       "esModuleInterop": false,
       "target": "es2024",
       "moduleResolution": "NodeNext",
       "sourceMap": true,
       "outDir": "dist",
       "baseUrl": ".",
       "declaration": true,
       "declarationMap": true,
       "strict": true,
       "skipLibCheck": true,
       "forceConsistentCasingInFileNames": true,
       "paths": {
         "#src/*": ["src/*"],
         "tests/*": ["tests/*"]
       }
     },
     "include": ["src/**/*", "index.ts", "tests"],
     "exclude": ["node_modules", "dist"],
     "lib": ["es2015"]
   }
   ```

4. **Configure Vitest** (copy vitest.config.ts from existing package)

5. **Add Package Scripts**:
   ```json
   {
     "scripts": {
       "build": "tsc --pretty",
       "test": "vitest --run",
       "prepublishOnly": "npm run build",
       "dev": "tsc --watch --pretty"
     }
   }
   ```

### Dependency Management

**Internal Dependencies:**
- Use exact versions for internal package dependencies
- Update versions when making breaking changes
- Test integration between packages before publishing

**External Dependencies:**
- Use caret (^) for minor/patch updates
- Pin major versions for stability
- Regular dependency updates recommended

**Example Package Dependencies (Monorepo):**
```json
{
  "dependencies": {
    "@bartek0x1001/async-tasks-queue": "*",
    "@bartek0x1001/json-storage": "*"
  },
  "devDependencies": {
    "@bartek0x1001/fadro": "*",
    "typescript": "^5.8.3",
    "vitest": "^3.2.4"
  }
}
```

**Note**: All internal dependencies use `"*"` to reference local workspace packages. This ensures packages always use the latest local version during development.

## TypeScript Configuration

### Compiler Options

All packages use consistent TypeScript configuration:

- **Target**: ES2024 (latest stable features)
- **Module**: NodeNext (ESM with Node.js resolution)
- **Strict Mode**: Enabled for type safety
- **Source Maps**: Enabled for debugging
- **Declaration Files**: Generated for type definitions

### Path Mapping

Internal imports use `#src/*` aliases:

```typescript
// Instead of relative imports
import { SomeType } from './lib/types.js';

// Use path mapping
import { SomeType } from '#src/lib/types.js';
```

### Module Resolution

- **Type**: ESM modules only
- **Resolution**: NodeNext for Node.js compatibility
- **Interop**: Disabled (pure ESM)
- **File Extensions**: Required in imports (`.js` for compiled output)

## Testing Framework

### Vitest Configuration

**Global Configuration:**
- **Environment**: Node.js
- **Globals**: Enabled (describe, it, expect available)
- **Concurrency**: Disabled (single-threaded execution)
- **Timeout**: 10 seconds per test
- **Threads**: Single thread execution

**Test File Organization:**
```
tests/
├── package.test.ts (main tests)
├── feature.test.ts (feature-specific tests)
└── integration.test.ts (integration tests)
```

**Test Naming Convention:**
- Files: `*.test.ts`
- Describe blocks: Feature or class name
- Test cases: Descriptive behavior

**Example Test Structure:**
```typescript
import { describe, it, expect } from 'vitest';
import { SomeClass } from '#src/SomeClass.js';

describe('SomeClass', () => {
  it('should perform expected behavior', () => {
    const instance = new SomeClass();
    const result = instance.method();
    expect(result).toBe(expectedValue);
  });
});
```

## Build and Publishing

### Build Process

1. **TypeScript Compilation**:
   ```bash
   tsc --pretty
   ```

2. **Output Structure**:
   ```
   dist/
   ├── index.js (main entry point)
   ├── index.d.ts (type definitions)
   ├── src/
   │   ├── ClassName.js
   │   └── ClassName.d.ts
   └── tests/ (if included)
   ```

3. **Pre-publish Validation**:
   - Automatic build before publish
   - Type checking
   - Test execution

### Publishing Workflow

This monorepo uses Changesets for version management with a develop→main workflow:

1. **Development Branch (develop)**:
   ```bash
   # Create changeset for version bump
   make changeset
   
   # Bump versions based on changesets
   make version
   ```

2. **Release Branch (main)**:
   ```bash
   # Publish packages to NPM registry
   make release
   ```

3. **Publish Configuration**:
   - **Access**: Public (all packages)
   - **Registry**: NPM registry
   - **Files**: dist/ directory and README.md
   - **Workflow**: develop (local versioning) → main (NPM publishing)

### Version Management

**Semantic Versioning:**
- **Patch**: Bug fixes, documentation updates
- **Minor**: New features, backward compatible
- **Major**: Breaking changes

**Dependency Updates:**
- Update dependent packages when publishing breaking changes
- Test integration between packages
- Update version references in package.json files

## Development Tools

### Fadro Framework

**Purpose**: AI workflow rules and development standards

**Usage**:
- Development workflow automation
- Code quality enforcement
- Documentation standards
- Testing requirements

**Configuration**: Located in `.cursor/rules/` directory

### Code Quality Standards

**TypeScript Standards:**
- Strict mode enabled
- No implicit any types
- Consistent naming conventions
- Self-documenting code (no comments in code files)

**Testing Standards:**
- Deterministic tests with exact assertions
- Complete test coverage
- No "this or possibly that" approaches
- Clear test descriptions

**Documentation Standards:**
- README.md for user-facing documentation
- DEVELOPMENT.md for technical details
- No duplication between files
- Verified examples and workflows

## Git Workflow

This monorepo uses a main/develop branch workflow:

### Branch Structure
- **`main`**: Stable releases and NPM publishing
- **`develop`**: Integration branch for feature development and local versioning
- **Feature branches**: Created from develop, merged back to develop

### Development Process
1. **Feature Development**:
   ```bash
   # Create feature branch from develop
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   
   # Work on feature, commit changes
   git add .
   git commit -m "feat: your feature description"
   ```

2. **Integration**:
   ```bash
   # Merge feature to develop
   git checkout develop
   git merge feature/your-feature-name
   git push origin develop
   ```

3. **Version Management** (on develop):
   ```bash
   # Create changeset for version bump
   make changeset
   
   # Bump versions based on changesets
   make version
   git add .
   git commit -m "chore: bump versions"
   ```

4. **Release** (develop → main):
   ```bash
   # Merge develop to main
   git checkout main
   git merge develop
   git push origin main
   
   # Publish to NPM
   make release
   ```

### Changesets Workflow
- **develop branch**: Local versioning and testing
- **main branch**: NPM publishing
- **Automatic**: Version bumping updates dependent packages

## Environment Variables

Currently, no environment variables are required for development or production use. All packages are self-contained with configuration through constructor parameters or method arguments.

## CI/CD Pipeline

**Current Setup**: Manual publishing process

**Recommended Pipeline**:
1. **Code Quality**: TypeScript compilation, linting, testing
2. **Build Verification**: Ensure all packages build successfully
3. **Integration Testing**: Test package dependencies
4. **Publishing**: Automated version bumping and publishing
5. **Documentation**: Automatic documentation updates

## Troubleshooting

### Common Issues

**TypeScript Compilation Errors:**
- Check import paths use `.js` extensions
- Verify path mapping configuration
- Ensure all dependencies are installed

**Test Failures:**
- Verify test environment setup
- Check for async/await issues
- Ensure proper test isolation

**Build Issues:**
- Clear dist/ directory before building
- Check TypeScript configuration
- Verify all source files are included

**Publishing Errors:**
- Verify package.json configuration
- Check NPM authentication
- Ensure version uniqueness

### Debug Mode

**TypeScript Debugging:**
- Source maps are enabled for debugging
- Use Node.js debugger with compiled JavaScript
- Check dist/ directory for compiled output

**Test Debugging:**
- Use `--reporter=verbose` for detailed output
- Add console.log statements for debugging
- Check test timeout settings

## Contributing

1. **Fork Repository**: Create personal fork
2. **Create Branch**: Feature or fix branch
3. **Follow Standards**: Adhere to code quality rules
4. **Test Changes**: Ensure all tests pass
5. **Build Verification**: Verify build process works
6. **Submit PR**: Create pull request with description

## Support

- **Issues**: Use GitHub issues for bug reports
- **Documentation**: Check package-specific README files
- **Development**: Refer to this guide for technical details
