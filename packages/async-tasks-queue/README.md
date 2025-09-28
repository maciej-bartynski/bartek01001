# Async Tasks Queue

A simple and efficient async tasks queue for Node.js with TypeScript support. This package provides sequential execution of asynchronous tasks, ensuring they run one after another in the order they were enqueued.

## Features

- **Sequential Execution**: Tasks are processed one at a time, maintaining order
- **TypeScript Support**: Full type definitions included
- **Promise-based**: Returns promises for easy async/await usage
- **Lightweight**: Minimal dependencies and small footprint
- **Error Handling**: Proper error propagation for failed tasks

## Installation

```bash
npm install @bartek01001/async-tasks-queue
```

## Quick Start

```typescript
import AsyncTasksQueue from '@bartek01001/async-tasks-queue';

const queue = new AsyncTasksQueue();

// Enqueue tasks - they will execute sequentially
const result1 = await queue.enqueue(async () => {
  return await someAsyncOperation();
});

const result2 = await queue.enqueue(async () => {
  return await anotherAsyncOperation();
});
```

## API

### `AsyncTasksQueue`

The main class for managing async task queues.

#### `enqueue<T>(task: () => Promise<T>): Promise<T>`

Adds a task to the queue and returns a promise that resolves when the task completes.

**Parameters:**
- `task`: A function that returns a Promise

**Returns:** Promise that resolves with the task's result

**Example:**
```typescript
const queue = new AsyncTasksQueue();

// Tasks will execute in order: first, second, third
const first = await queue.enqueue(() => fetch('/api/first'));
const second = await queue.enqueue(() => fetch('/api/second'));  
const third = await queue.enqueue(() => fetch('/api/third'));
```

## Use Cases

- **API Rate Limiting**: Ensure API calls don't exceed rate limits
- **Database Operations**: Sequential database writes to prevent conflicts
- **File Processing**: Process files one at a time to avoid memory issues
- **Resource Management**: Control access to limited resources

## License

MIT

## Repository

[GitHub Repository](https://github.com/maciej-bartynski/async-tasks-queue)

For detailed development information, see [DEVELOPMENT.md](docs/DEVELOPMENT.md).
