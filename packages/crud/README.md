# @bartek0x1001/crud

A lightweight Node.js package that automatically generates CRUD (Create, Read, Update, Delete) endpoints for Express.js applications using JSON file storage.

## Overview

`crud-server` automatically creates REST API endpoints for any data structure you need. Simply define a path, and get instant CRUD operations without writing boilerplate code.

## Features

- **Automatic CRUD endpoints** - Generate full CRUD operations for any path
- **Generic data handling** - Works with any JSON data structure
- **Dynamic path creation** - Create endpoints on-the-fly
- **JSON file storage** - Built-in persistent storage using `@bartek0x1001/json-storage`
- **Express.js integration** - Seamlessly integrates with existing Express apps
- **TypeScript support** - Full TypeScript definitions included
- **Method chaining** - Fluent API for easy configuration

## Installation

```bash
npm install @bartek0x1001/crud
```

## Quick Start

```javascript
import express from 'express';
import { CRUDServer } from '@bartek0x1001/crud';

const app = express();
app.use(express.json());

const crudServer = new CRUDServer();
crudServer.configure({ dataDirectory: 'data' });

// Create CRUD endpoints for 'users'
await crudServer.path('users');

// Create CRUD endpoints for 'products' 
await crudServer.path('products');

// Get the configured Express app
const crudApp = crudServer.app();

// Mount the CRUD routes
app.use('/api', crudApp);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

## API Reference

### CRUDServer Class

#### `configure(config)`
Configure the CRUD server settings.

```javascript
crudServer.configure({
  dataDirectory: 'data' // Directory for JSON files (default: 'data')
});
```

#### `path(resourcePath)`
Create CRUD endpoints for a specific resource path.

```javascript
await crudServer.path('users');     // Creates /users endpoints
await crudServer.path('products');  // Creates /products endpoints
await crudServer.path('orders');    // Creates /orders endpoints
```

#### `app()`
Get the configured Express application with all CRUD routes.

```javascript
const crudApp = crudServer.app();
```

### Generated Endpoints

For each path you create, the following endpoints are automatically generated:

- `GET /{path}` - List all items
- `GET /{path}/:id` - Get item by ID
- `POST /{path}` - Create new item
- `PUT /{path}/:id` - Update item by ID
- `DELETE /{path}/:id` - Delete item by ID

## Examples

### Blog Posts

```javascript
await crudServer.path('posts');

// Create a post
POST /posts
{
  "title": "My First Post",
  "content": "Hello World!",
  "author": "John Doe",
  "tags": ["blog", "first"]
}

// Update a post
PUT /posts/123
{
  "title": "Updated Title",
  "views": 150
}
```

### E-commerce Products

```javascript
await crudServer.path('products');

// Create a product
POST /products
{
  "name": "Laptop",
  "brand": "TechCorp",
  "price": 999.99,
  "inStock": true,
  "category": "Electronics"
}

// Get all products
GET /products

// Get specific product
GET /products/456
```

### User Management

```javascript
await crudServer.path('users');

// Create a user
POST /users
{
  "username": "johndoe",
  "email": "john@example.com",
  "role": "admin",
  "active": true
}

// Update user role
PUT /users/789
{
  "role": "moderator"
}
```

## Advanced Usage

### Method Chaining

```javascript
const crudServer = new CRUDServer()
  .configure({ dataDirectory: 'my-data' });

await crudServer
  .path('users')
  .path('products')
  .path('orders');
```

### Custom Data Directory

```javascript
const crudServer = new CRUDServer();
crudServer.configure({ 
  dataDirectory: '/var/data/my-app' 
});

await crudServer.path('logs');
```

### Integration with Existing Express App

```javascript
import express from 'express';
import { CRUDServer } from '@bartek0x1001/crud';

const app = express();
app.use(express.json());

// Your existing routes
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// CRUD server
const crudServer = new CRUDServer();
await crudServer.path('api/users');
await crudServer.path('api/products');

// Mount CRUD routes
app.use('/', crudServer.app());

app.listen(3000);
```

## Technical Details

- **Runtime**: Node.js 18+ (ES2024 features)
- **Framework**: Express.js 5.1.0+
- **Storage**: `@bartek0x1001/json-storage` for JSON file persistence
- **TypeScript**: Full type definitions included
- **ESM**: Native ES modules support

## Development

For development setup, testing, and contribution guidelines, see [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md).

## License

MIT
