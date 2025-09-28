# CRUD Server Examples

This directory contains examples demonstrating how to use the `crud-server` package in different scenarios.

## Examples Overview

### 1. basic-usage.js
Basic setup showing how to create CRUD endpoints for users and products.

**Features demonstrated:**
- Basic CRUDServer initialization
- Configuration with custom data directory
- Creating multiple CRUD paths
- Mounting routes to Express app
- **NEW**: Complete curl commands for all CRUD operations

### 2. method-chaining.js
Shows how to use method chaining for cleaner, more readable code.

**Features demonstrated:**
- Method chaining with configure() and path()
- Multiple path creation in sequence
- Accessing configured paths

### 3. integration-with-existing-app.js
Demonstrates how to integrate CRUD functionality into an existing Express application.

**Features demonstrated:**
- Mixing existing routes with CRUD endpoints
- Mounting CRUD routes at specific paths
- Maintaining existing application structure

### 4. crud-operations.js ⭐ **NEW**
**Comprehensive guide showing actual CRUD operations with real examples.**

**Features demonstrated:**
- Complete HTTP request examples (curl commands)
- Expected JSON responses for each operation
- Step-by-step CRUD workflow
- Testing instructions for browser and Postman

## Running the Examples

1. **Install dependencies:**
   ```bash
   npm install express crud-server
   ```

2. **Run any example:**
   ```bash
   node examples/basic-usage.js
   node examples/method-chaining.js
   node examples/integration-with-existing-app.js
   node examples/crud-operations.js
   ```

3. **Test the endpoints:**
   - Use the provided curl commands
   - Use tools like Postman
   - Use your browser for GET requests
   - Examples run on port 3000
   - CRUD endpoints will be available at `/api/{resource}`

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
