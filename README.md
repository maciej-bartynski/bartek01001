# @bartek0x1001 Monorepo

A TypeScript monorepo containing utility packages for Node.js development, featuring async task management, data manipulation, and Express.js integration.

## Packages

### Core Utilities
- **[@bartek0x1001/async-tasks-queue](https://github.com/maciej-bartynski/async-tasks-queue)** - Sequential async task processing with TypeScript support
- **[@bartek0x1001/deep-merge](https://github.com/maciej-bartynski/deep-merge)** - Deep merge utility for objects and arrays

### Storage & API
- **[@bartek0x1001/json-storage](https://github.com/maciej-bartynski/json-storage)** - CRUD operations on JSON files with async queue management
- **[@bartek0x1001/crud](https://github.com/maciej-bartynski/crud)** - Automated Express.js CRUD endpoints for JSON file storage

### Development Framework
- **[@bartek0x1001/fadro](https://github.com/maciej-bartynski/fadro)** - AI workflow rules framework for development processes

## Technical Stack

- **TypeScript 5.8.3** with ES2024 target
- **ESM modules** with NodeNext resolution
- **Vitest 3.2.4** for testing
- **Node.js 18+** required

## Quick Start

### Prerequisites
- Node.js 18.0.0 or higher
- NPM package manager

### Installation

Install individual packages as needed:

```bash
# Async task queue
npm install @bartek0x1001/async-tasks-queue

# Deep merge utility
npm install @bartek0x1001/deep-merge

# JSON file storage
npm install @bartek0x1001/json-storage

# Express.js CRUD endpoints
npm install @bartek0x1001/crud

# AI workflow framework
npm install @bartek0x1001/fadro
```

### Basic Usage

#### Async Tasks Queue
```typescript
import AsyncTasksQueue from '@bartek0x1001/async-tasks-queue';

const queue = new AsyncTasksQueue();

// Enqueue async tasks for sequential processing
const result = await queue.enqueue(async () => {
    return await fetchData();
});
```

#### Deep Merge
```typescript
import deepMerge from '@bartek0x1001/deep-merge';

const merged = deepMerge(
    { user: { name: 'John', age: 30 } },
    { user: { city: 'New York' } }
);
// Result: { user: { name: 'John', age: 30, city: 'New York' } }
```

#### JSON Storage
```typescript
import { JSONStorage } from '@bartek0x1001/json-storage';

const storage = JSONStorage.getInstance({ directory: './data' });
const connection = await storage.connect({ maxFileAmount: 1000 });

// CRUD operations
const item = await connection.create({ name: 'test', value: 123 });
const found = await connection.read(item.id);
const updated = await connection.update(item.id, { value: 456 });
await connection.delete(item.id);
```

#### Express.js CRUD
```typescript
import express from 'express';
import { CRUDServer } from '@bartek0x1001/crud';

const app = express();
const crudServer = new CRUDServer({
    dataDirectory: './data',
    port: 3000
});

await crudServer.start();
// Automatically creates CRUD endpoints for JSON file operations
```

## Package Relationships

```
@bartek0x1001/fadro (standalone)
@bartek0x1001/async-tasks-queue (core utility)
@bartek0x1001/deep-merge (core utility)
@bartek0x1001/json-storage (depends on async-tasks-queue)
@bartek0x1001/crud (depends on async-tasks-queue + json-storage)
```

## Development

### Docker-based Development Environment

This monorepo uses Docker for consistent development across all packages.

#### Quick Setup
```bash
# Build and start Docker container
make setup

# Install dependencies
make install

# Build all packages
make build

# Run tests
make test
```

#### Development Workflow
```bash
# Work on specific package
make dev-crud              # Start crud package in watch mode
make dev-json-storage      # Start json-storage package in watch mode
make dev-async-tasks-queue # Start async-tasks-queue package in watch mode
make dev-deep-merge        # Start deep-merge package in watch mode

# Version management
make changeset             # Create new changeset for version bump
make version               # Bump versions based on changesets (develop branch)
make release               # Publish packages to NPM (main branch)
```

#### Git Workflow
- **`develop`** - Integration branch for feature development and local versioning
- **`main`** - Release branch for NPM publishing
- **Feature branches** - Merge into `develop`, then `develop` → `main` for releases

### Available Commands
```bash
make help                  # Show all available commands
make setup                 # Build and run Docker container
make install               # Install all dependencies
make build                 # Build all packages
make test                  # Run all tests
make clean                 # Clean build artifacts
make npm cmd="..."         # Run npm command in container
make docker cmd="..."      # Run docker-compose command
make restart               # Restart existing container
make stop                  # Stop container
make dev-crud              # Start development mode for crud package
make dev-async-tasks-queue # Start development mode for async-tasks-queue package
make dev-deep-merge        # Start development mode for deep-merge package
make dev-json-storage      # Start development mode for json-storage package
make changeset             # Create new changeset
make version               # Bump versions based on changesets
make release               # Publish packages to NPM
make uninstall-fadro       # Uninstall fadro from all packages
```

For detailed development setup, testing, and contribution guidelines, see [docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md).

## License

All packages are licensed under MIT or ISC licenses. See individual package directories for specific license information.

## Author

**bartek0x1001** - [GitHub](https://github.com/maciej-bartynski)
