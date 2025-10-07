import { CRUDServer } from '@bartek0x1001/crud';

// Create CRUD server in bare Node.js mode
const crudServer = new CRUDServer({ mode: 'bare' });
crudServer.configure({ dataDirectory: 'data' });

// Create CRUD endpoints for 'users'
await crudServer.path('users');

// Create CRUD endpoints for 'products' 
await crudServer.path('products');

// Get the bare Node.js server
const server = crudServer.app();

server.listen(3000, () => {
    console.log('Bare Node.js CRUD server running on port 3000');
    console.log('CRUD endpoints available at:');
    console.log('- GET/POST /users');
    console.log('- GET/PUT/DELETE /users/:id');
    console.log('- GET/POST /products');
    console.log('- GET/PUT/DELETE /products/:id');
    console.log('');
    console.log('=== HOW TO USE CRUD ENDPOINTS ===');
    console.log('');
    console.log('1. CREATE a new user:');
    console.log('   curl -X POST http://localhost:3000/users \\');
    console.log('     -H "Content-Type: application/json" \\');
    console.log('     -d \'{"name": "John Doe", "email": "john@example.com", "age": 30}\'');
    console.log('');
    console.log('2. GET all users:');
    console.log('   curl http://localhost:3000/users');
    console.log('');
    console.log('3. GET specific user by ID:');
    console.log('   curl http://localhost:3000/users/{id}');
    console.log('');
    console.log('4. UPDATE a user:');
    console.log('   curl -X PUT http://localhost:3000/users/{id} \\');
    console.log('     -H "Content-Type: application/json" \\');
    console.log('     -d \'{"age": 31, "email": "john.updated@example.com"}\'');
    console.log('');
    console.log('5. DELETE a user:');
    console.log('   curl -X DELETE http://localhost:3000/users/{id}');
    console.log('');
    console.log('Same operations work for /products endpoint!');
    console.log('');
    console.log('=== BARE NODE.JS MODE BENEFITS ===');
    console.log('- Zero external dependencies (no Express required)');
    console.log('- Smaller bundle size');
    console.log('- Direct Node.js HTTP server');
    console.log('- Same CRUD functionality as Express mode');
});
