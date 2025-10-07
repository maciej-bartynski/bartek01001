import { describe, it, expect } from 'vitest';
import { CRUDRouterFactory } from '#src/lib/CRUDRouterFactory.js';
import { ExpressRouterAdapter } from '#src/lib/ExpressAdapter.js';

describe('CRUDRouterFactory', () => {
    it('should generate router for given path', async () => {
        const router = await CRUDRouterFactory.generateRouter({
            path: 'test-path',
            dataDirectory: 'test-data'
        }, 'express');

        expect(router).toBeInstanceOf(ExpressRouterAdapter);
    });

    it('should generate router with default data directory', async () => {
        const router = await CRUDRouterFactory.generateRouter({
            path: 'test-path'
        }, 'express');

        expect(router).toBeInstanceOf(ExpressRouterAdapter);
    });

    it('should have all CRUD endpoints', async () => {
        const router = await CRUDRouterFactory.generateRouter({
            path: 'test-path'
        }, 'express');

        expect(router).toBeInstanceOf(ExpressRouterAdapter);
        const routes = (router as ExpressRouterAdapter).router.stack.map((layer: any) => layer.route?.path);
        const expectedRoutes = ['/', '/:fileId'];

        expectedRoutes.forEach(route => {
            expect(routes).toContain(route);
        });
    });
});
