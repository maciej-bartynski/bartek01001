import { describe, it, expect } from 'vitest';
import { CRUDRouterFactory } from '#src/lib/CRUDRouterFactory.js';
import express from 'express';

describe('CRUDRouterFactory', () => {
    it('should generate router for given path', async () => {
        const router = await CRUDRouterFactory.generateRouter({
            path: 'test-path',
            dataDirectory: 'test-data'
        });

        expect(router).toBeInstanceOf(express.Router);
    });

    it('should generate router with default data directory', async () => {
        const router = await CRUDRouterFactory.generateRouter({
            path: 'test-path'
        });

        expect(router).toBeInstanceOf(express.Router);
    });

    it('should have all CRUD endpoints', async () => {
        const router = await CRUDRouterFactory.generateRouter({
            path: 'test-path'
        });

        const routes = router.stack.map((layer: any) => layer.route?.path);
        const expectedRoutes = ['/', '/:fileId'];

        expectedRoutes.forEach(route => {
            expect(routes).toContain(route);
        });
    });
});
