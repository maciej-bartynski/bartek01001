import { describe, it, expect, beforeEach } from 'vitest';
import { CRUDServer } from '#src/lib/CRUDServer.js';

describe('CRUDServer', () => {
    let crudServer: CRUDServer;

    beforeEach(() => {
        crudServer = new CRUDServer();
    });

    it('should create instance with default configuration', () => {
        expect(crudServer.getConfig()).toEqual({ dataDirectory: 'data' });
        expect(crudServer.getPaths()).toEqual([]);
    });

    it('should configure data directory', () => {
        crudServer.configure({ dataDirectory: 'custom-data' });
        expect(crudServer.getConfig()).toEqual({ dataDirectory: 'custom-data' });
    });

    it('should add CRUD path', async () => {
        await crudServer.path('test-path');
        expect(crudServer.getPaths()).toHaveLength(1);
        expect(crudServer.getPaths()[0]).toEqual({
            path: 'test-path',
            dataDirectory: 'data'
        });
    });

    it('should add multiple CRUD paths', async () => {
        await crudServer.path('path1');
        await crudServer.path('path2');

        expect(crudServer.getPaths()).toHaveLength(2);
        expect(crudServer.getPaths()[0].path).toBe('path1');
        expect(crudServer.getPaths()[1].path).toBe('path2');
    });

    it('should return bare Node.js server instance', () => {
        const app = crudServer.app();
        expect(typeof app.use).toBe('function');
        expect(typeof app.get).toBe('function');
        expect(typeof app.listen).toBe('function');
    });

    it('should support method chaining with async paths', async () => {
        crudServer.configure({ dataDirectory: 'custom' });

        const result1 = await crudServer.path('test1');
        const result2 = await result1.path('test2');

        expect(result2).toBe(crudServer);
        expect(crudServer.getConfig().dataDirectory).toBe('custom');
        expect(crudServer.getPaths()).toHaveLength(2);
    });

    it('should use configured data directory for paths', async () => {
        crudServer.configure({ dataDirectory: 'custom-data' });
        await crudServer.path('test-path');

        const pathConfig = crudServer.getPaths()[0];
        expect(pathConfig.dataDirectory).toBe('custom-data');
    });
});
