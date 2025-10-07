import express from 'express';
import { CRUDServer } from '@bartek0x1001/crud';

const app = express();
app.use(express.json());

// Method chaining example
const crudServer = new CRUDServer()
    .configure({ dataDirectory: 'my-data' });

// Chain multiple path creations
await crudServer
    .path('users')
    .path('products')
    .path('orders')
    .path('categories');

// Get the configured Express app
const crudApp = crudServer.app();

// Mount the CRUD routes
app.use('/api', crudApp);

app.listen(3000, () => {
    console.log('Server running on port 3000');
    console.log('Available CRUD endpoints:');

    const paths = crudServer.getPaths();
    paths.forEach(path => {
        console.log(`- /api/${path.path}`);
    });
});
