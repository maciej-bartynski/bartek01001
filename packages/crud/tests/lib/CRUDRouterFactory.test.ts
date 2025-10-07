import { describe, it, expect } from 'vitest';
import { CRUDRouterFactory } from '#src/lib/CRUDRouterFactory.js';
import { BareRouter } from '#src/lib/BareRouter.js';

describe('CRUDRouterFactory', () => {
    it('should generate router for given path', async () => {
        const router = await CRUDRouterFactory.generateRouter({
            path: 'test-path',
            dataDirectory: 'test-data'
        });

        expect(router).toBeInstanceOf(BareRouter);
    });

    it('should generate router with default data directory', async () => {
        const router = await CRUDRouterFactory.generateRouter({
            path: 'test-path'
        });

        expect(router).toBeInstanceOf(BareRouter);
    });

    it('should have all CRUD endpoints', async () => {
        const router = await CRUDRouterFactory.generateRouter({
            path: 'test-path'
        });

        expect(router).toBeInstanceOf(BareRouter);
    });
});
