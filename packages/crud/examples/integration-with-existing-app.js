import express from 'express';
import { CRUDServer } from '@bartek0x1001/crud';

const app = express();
app.use(express.json());

// Your existing routes
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.get('/version', (req, res) => res.json({ version: '1.0.0' }));

// CRUD server integration
const crudServer = new CRUDServer();
await crudServer.path('api/users');
await crudServer.path('api/products');

// Mount CRUD routes
app.use('/', crudServer.app());

// More existing routes
app.get('/dashboard', (req, res) => res.json({ message: 'Dashboard' }));

app.listen(3000, () => {
  console.log('Server running on port 3000');
  console.log('Available endpoints:');
  console.log('- GET /health');
  console.log('- GET /version');
  console.log('- GET /dashboard');
  console.log('- CRUD endpoints: /api/users, /api/products');
});
