# CRUD Server Examples

This directory contains examples demonstrating how to use the `@bartek0x1001/crud` package with dual-mode support for both Express.js and bare Node.js servers.

## Examples Overview

### 1. basic-usage.js
Basic Express.js setup showing how to create CRUD endpoints for users and products.

**Features demonstrated:**
- Basic CRUDServer initialization with Express
- Configuration with custom data directory
- Creating multiple CRUD paths
- Mounting routes to Express app
- Complete curl commands for all CRUD operations

### 2. bare-nodejs-server.js ⭐
Standalone bare Node.js server without Express dependencies.

**Features demonstrated:**
- Bare Node.js mode initialization
- Zero external dependencies
- Same CRUD functionality as Express mode
- Direct Node.js HTTP server

### 3. auto-detection-mode.js ⭐
Auto-detection mode that automatically chooses between Express and bare Node.js.

**Features demonstrated:**
- Automatic mode detection
- No manual mode specification needed
- Perfect for libraries and frameworks

### 4. method-chaining.js
Shows how to use method chaining for cleaner, more readable code.

**Features demonstrated:**
- Method chaining with configure() and path()
- Multiple path creation in sequence
- Accessing configured paths

### 5. integration-with-existing-app.js
Demonstrates how to integrate CRUD functionality into an existing Express application.

**Features demonstrated:**
- Mixing existing routes with CRUD endpoints
- Mounting CRUD routes at specific paths
- Maintaining existing application structure

### 6. crud-operations.js
**Comprehensive guide showing actual CRUD operations with real examples.**

**Features demonstrated:**
- Complete HTTP request examples (curl commands)
- Expected JSON responses for each operation
- Step-by-step CRUD workflow
- Testing instructions for browser and Postman

## Running the Examples

1. **Install dependencies:**
   ```bash
   npm install @bartek0x1001/crud
   # For Express examples (optional):
   npm install express
   ```

2. **Run any example:**
   ```bash
   # Express.js examples:
   node examples/basic-usage.js
   node examples/method-chaining.js
   node examples/integration-with-existing-app.js
   
   # Bare Node.js examples:
   node examples/bare-nodejs-server.js
   node examples/auto-detection-mode.js
   
   # CRUD operations guide:
   node examples/crud-operations.js
   ```

3. **Test the endpoints:**
   - Use the provided curl commands
   - Use tools like Postman
   - Use your browser for GET requests
   - Examples run on port 3000
   - Express examples: CRUD endpoints at `/api/{resource}`
   - Bare Node.js examples: CRUD endpoints at `/{resource}`

## CRUD Operations Guide

The `crud-operations.js` example provides a complete reference for:

- **CREATE**: POST requests with JSON data
- **READ**: GET requests for all items or specific item
- **UPDATE**: PUT requests with partial data updates
- **DELETE**: DELETE requests to remove items

Each operation includes:
- Exact curl command to use
- Expected JSON response format
- Real-world usage examples

## Notes

- All examples use the default data directory (`data/`)
- Examples are ES modules (use `.js` extension and `import` syntax)
- Make sure you have Node.js 18+ for ES module support
- The examples create actual JSON files in the data directory
- Use `crud-operations.js` as your main reference for CRUD operations
