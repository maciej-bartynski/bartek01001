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
  console.log('CRUD endpoints available at:');
  console.log('- GET/POST /api/users');
  console.log('- GET/PUT/DELETE /api/users/:id');
  console.log('- GET/POST /api/products');
  console.log('- GET/PUT/DELETE /api/products/:id');
  console.log('');
  console.log('=== HOW TO USE CRUD ENDPOINTS ===');
  console.log('');
  console.log('1. CREATE a new user:');
  console.log('   curl -X POST http://localhost:3000/api/users \\');
  console.log('     -H "Content-Type: application/json" \\');
  console.log('     -d \'{"name": "John Doe", "email": "john@example.com", "age": 30}\'');
  console.log('');
  console.log('2. GET all users:');
  console.log('   curl http://localhost:3000/api/users');
  console.log('');
  console.log('3. GET specific user by ID:');
  console.log('   curl http://localhost:3000/api/users/{id}');
  console.log('');
  console.log('4. UPDATE a user:');
  console.log('   curl -X PUT http://localhost:3000/api/users/{id} \\');
  console.log('     -H "Content-Type: application/json" \\');
  console.log('     -d \'{"age": 31, "email": "john.updated@example.com"}\'');
  console.log('');
  console.log('5. DELETE a user:');
  console.log('   curl -X DELETE http://localhost:3000/api/users/{id}');
  console.log('');
  console.log('Same operations work for /api/products endpoint!');
});
