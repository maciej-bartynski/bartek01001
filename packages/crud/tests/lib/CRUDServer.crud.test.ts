import request from 'supertest';
import { CRUDServer } from '#src/lib/CRUDServer.js';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs';

describe('CRUDServer CRUD Functionality Tests', () => {
    let app: any;
    let dataDir: string;
    let testPath: string;

    beforeAll(async () => {
        dataDir = 'test-data';
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        const crudServer = new CRUDServer();
        crudServer.configure({ dataDirectory: dataDir });

        testPath = 'test-resource';
        await crudServer.path(testPath);

        app = crudServer.app();
    });

    afterAll(() => {
        if (fs.existsSync(dataDir)) {
            fs.rmSync(dataDir, { recursive: true, force: true });
        }
    });

    describe('Basic CRUD Operations', () => {
        it('should create a new record', async () => {
            const newRecord = {
                title: 'Test Post',
                content: 'This is a test post content',
                author: 'John Doe',
                tags: ['test', 'example']
            };

            const response = await request(app)
                .post(`/${testPath}`)
                .send(newRecord);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('_id');
            expect(response.body).toHaveProperty('path');
            expect(typeof response.body._id).toBe('string');
        });

        it('should get all records', async () => {
            const response = await request(app)
                .get(`/${testPath}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('items');
            expect(Array.isArray(response.body.items)).toBe(true);
        });

        it('should get a specific record by ID', async () => {
            const newRecord = {
                product: 'Laptop',
                brand: 'TechCorp',
                price: 999.99,
                inStock: true
            };

            const createResponse = await request(app)
                .post(`/${testPath}`)
                .send(newRecord);

            const id = createResponse.body._id;

            const response = await request(app)
                .get(`/${testPath}/${id}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('item');
            expect(response.body.item.product).toBe('Laptop');
            expect(response.body.item.brand).toBe('TechCorp');
            expect(response.body.item.price).toBe(999.99);
            expect(response.body.item.inStock).toBe(true);
        });

        it('should update a record', async () => {
            const newRecord = {
                title: 'Original Title',
                content: 'Original content',
                views: 100
            };
            const createResponse = await request(app)
                .post(`/${testPath}`)
                .send(newRecord);

            const id = createResponse.body._id;

            const updateData = {
                title: 'Updated Title',
                content: 'Original content', // Keep existing content
                views: 150
            };

            const response = await request(app)
                .put(`/${testPath}/${id}`)
                .send(updateData);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('_id', id);
            expect(response.body).toHaveProperty('path');

            const getResponse = await request(app)
                .get(`/${testPath}/${id}`);

            expect(getResponse.body.item.title).toBe('Updated Title');
            expect(getResponse.body.item.content).toBe('Original content');
            expect(getResponse.body.item.views).toBe(150);
        });

        it('should delete a record', async () => {
            const newRecord = {
                name: 'Test User',
                email: 'test@example.com',
                role: 'admin'
            };

            const createResponse = await request(app)
                .post(`/${testPath}`)
                .send(newRecord);

            const id = createResponse.body._id;

            const deleteResponse = await request(app)
                .delete(`/${testPath}/${id}`);

            expect(deleteResponse.status).toBe(200);
            expect(deleteResponse.body).toHaveProperty('deleted', true);
            expect(deleteResponse.body).toHaveProperty('_id', id);

            const getResponse = await request(app)
                .get(`/${testPath}/${id}`)
                .expect(500);
        });
    });

    describe('Multiple Paths Support', () => {
        it('should handle multiple dynamic paths', async () => {
            const multiDataDir = 'test-data-multi';
            if (!fs.existsSync(multiDataDir)) {
                fs.mkdirSync(multiDataDir, { recursive: true });
            }

            const crudServer = new CRUDServer();
            crudServer.configure({ dataDirectory: multiDataDir });

            const path1 = 'multi-test-1-' + Date.now();
            const path2 = 'multi-test-2-' + Date.now();

            await crudServer.path(path1);
            await crudServer.path(path2);

            const multiApp = crudServer.app();

            const testData = {
                name: 'MultiTest',
                value: 42,
                category: 'example'
            };

            const response1 = await request(multiApp as any)
                .post(`/${path1}`)
                .send(testData);

            if (response1.status !== 200) {
                console.log('Error response 1:', response1.body);
            }

            const response2 = await request(multiApp as any)
                .post(`/${path2}`)
                .send(testData);

            expect(response1.status).toBe(200);
            expect(response2.status).toBe(200);
            expect(response1.body._id).toBeDefined();
            expect(response2.body._id).toBeDefined();
            expect(response1.body._id).not.toBe(response2.body._id);

            if (fs.existsSync(multiDataDir)) {
                fs.rmSync(multiDataDir, { recursive: true, force: true });
            }
        });
    });

    describe('Resource CRUD Operations', () => {
        let app: any;
        let path: string;
        let datadir: string;

        beforeAll(async () => {
            datadir = 'test-data-world';
            if (!fs.existsSync(datadir)) {
                fs.mkdirSync(datadir, { recursive: true });
            }

            const crudServer = new CRUDServer();
            crudServer.configure({ dataDirectory: datadir });

            path = 'world';
            await crudServer.path(path);

            app = crudServer.app();
        });

        afterAll(() => {
            if (fs.existsSync(datadir)) {
                fs.rmSync(datadir, { recursive: true, force: true });
            }
        });

        it('should create a new record', async () => {
            const newRecord = {
                name: 'Earth',
                description: 'Our home planet',
                population: 8000000000,
                habitable: true
            };

            const response = await request(app)
                .post(`/${path}`)
                .send(newRecord);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('_id');
            expect(response.body).toHaveProperty('path');
            expect(typeof response.body._id).toBe('string');
        });

        it('should get all records', async () => {
            const response = await request(app)
                .get(`/${path}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('items');
            expect(Array.isArray(response.body.items)).toBe(true);
        });

        it('should get a specific record by ID', async () => {
            const newRecord = {
                name: 'Mars',
                description: 'Red planet',
                population: 0,
                habitable: false
            };

            const createResponse = await request(app)
                .post(`/${path}`)
                .send(newRecord);

            const id = createResponse.body._id;

            const response = await request(app)
                .get(`/${path}/${id}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('item');
            expect(response.body.item.name).toBe('Mars');
            expect(response.body.item.description).toBe('Red planet');
            expect(response.body.item.population).toBe(0);
            expect(response.body.item.habitable).toBe(false);
        });

        it('should update record', async () => {
            const newRecord = {
                name: 'Venus',
                description: 'Morning star',
                temperature: 462,
                atmosphere: 'CO2'
            };
            const createResponse = await request(app)
                .post(`/${path}`)
                .send(newRecord);

            const id = createResponse.body._id;

            const updateData = {
                name: 'Venus',
                description: 'Evening star',
                temperature: 462,
                atmosphere: 'CO2',
                discovered: 'Ancient times'
            };

            const response = await request(app)
                .put(`/${path}/${id}`)
                .send(updateData);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('_id', id);
            expect(response.body).toHaveProperty('path');

            const getResponse = await request(app)
                .get(`/${path}/${id}`);

            expect(getResponse.body.item.name).toBe('Venus');
            expect(getResponse.body.item.description).toBe('Evening star');
            expect(getResponse.body.item.temperature).toBe(462);
            expect(getResponse.body.item.discovered).toBe('Ancient times');
        });

        it('should update record with deep merge', async () => {
            const newRecord = {
                name: 'Venus',
                description: 'Morning star',
                additional: {
                    species: {
                        count: 1,
                        data: [
                            {
                                name: 'Venusian',
                                description: 'Venusian species',
                                population: 1000000,
                            }
                        ]
                    },
                    moons: {
                        count: 1,
                        data: [
                            {
                                name: 'Phobos',
                                diameter: 22.2,
                                distance: 9376
                            },
                            {
                                name: 'Deimos',
                                diameter: 12.6,
                                distance: 23460
                            }
                        ]
                    }
                },
                temperature: { day: 462, night: 452 },
                atmosphere: 'CO2',
            };

            const createResponse = await request(app)
                .post(`/${path}`)
                .send(newRecord);

            const id = createResponse.body._id;

            const updateData = {
                additional: {
                    species: {
                        count: 2,
                        data: [
                            {
                                name: 'Marsian Invaders',
                                description: 'Marsian colonists',
                                population: 880,
                            }
                        ]
                    }
                }
            };

            const response = await request(app)
                .put(`/${path}/${id}?`)
                .query({
                    override: 'false',
                    arrayMergeStrategy: 'concat'
                })
                .send(updateData);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('_id', id);
            expect(response.body).toHaveProperty('path');

            const getResponse = await request(app)
                .get(`/${path}/${id}`);

            expect(getResponse.body.item.stats).toBeDefined();
            expect(getResponse.body.item._id).toBeDefined();

            delete getResponse.body.item.stats;
            delete getResponse.body.item._id;
            expect(getResponse.body.item).toStrictEqual({
                name: 'Venus',
                description: 'Morning star',
                additional: {
                    species: {
                        count: 2,
                        data: [
                            {
                                name: 'Venusian',
                                description: 'Venusian species',
                                population: 1000000,
                            },
                            {
                                name: 'Marsian Invaders',
                                description: 'Marsian colonists',
                                population: 880,
                            }
                        ]
                    },
                    moons: {
                        count: 1,
                        data: [
                            {
                                name: 'Phobos',
                                diameter: 22.2,
                                distance: 9376
                            },
                            {
                                name: 'Deimos',
                                diameter: 12.6,
                                distance: 23460
                            }
                        ]
                    }
                },
                temperature: { day: 462, night: 452 },
                atmosphere: 'CO2',
            });
        });

        it('should update record with array replacement', async () => {
            const newRecord = {
                name: 'Venus',
                description: 'Morning star',
                additional: {
                    species: {
                        count: 1,
                        data: [
                            {
                                name: 'Venusian',
                                description: 'Venusian species',
                                population: 1000000,
                            }
                        ]
                    },
                    moons: {
                        count: 1,
                        data: [
                            {
                                name: 'Phobos',
                                diameter: 22.2,
                                distance: 9376
                            },
                            {
                                name: 'Deimos',
                                diameter: 12.6,
                                distance: 23460
                            }
                        ]
                    }
                },
                temperature: { day: 462, night: 452 },
                atmosphere: 'CO2',
            };

            const createResponse = await request(app)
                .post(`/${path}`)
                .send(newRecord);

            const id = createResponse.body._id;

            const updateData = {
                additional: {
                    species: {
                        data: [
                            {
                                name: 'Marsian colonists',
                                description: 'Marsian colonists',
                                population: 880,
                            }
                        ]
                    }
                }
            };

            const response = await request(app)
                .put(`/${path}/${id}?`)
                .query({
                    override: 'false',
                    arrayMergeStrategy: 'replace'
                })
                .send(updateData);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('_id', id);
            expect(response.body).toHaveProperty('path');

            const getResponse = await request(app)
                .get(`/${path}/${id}`);

            expect(getResponse.body.item.stats).toBeDefined();
            expect(getResponse.body.item._id).toBeDefined();

            delete getResponse.body.item.stats;
            delete getResponse.body.item._id;
            expect(getResponse.body.item).toStrictEqual({
                name: 'Venus',
                description: 'Morning star',
                additional: {
                    species: {
                        count: 1,
                        data: [
                            {
                                name: 'Marsian colonists',
                                description: 'Marsian colonists',
                                population: 880,
                            }
                        ]
                    },
                    moons: {
                        count: 1,
                        data: [
                            {
                                name: 'Phobos',
                                diameter: 22.2,
                                distance: 9376
                            },
                            {
                                name: 'Deimos',
                                diameter: 12.6,
                                distance: 23460
                            }
                        ]
                    }
                },
                temperature: { day: 462, night: 452 },
                atmosphere: 'CO2',
            });
        });

        it('should delete a record', async () => {
            const newRecord = {
                name: 'Pluto',
                description: 'Dwarf planet',
                discovered: 1930
            };

            const createResponse = await request(app)
                .post(`/${path}`)
                .send(newRecord);

            const id = createResponse.body._id;

            const deleteResponse = await request(app)
                .delete(`/${path}/${id}`);

            expect(deleteResponse.status).toBe(200);
            expect(deleteResponse.body).toHaveProperty('deleted', true);
            expect(deleteResponse.body).toHaveProperty('_id', id);

            const getResponse = await request(app)
                .get(`/${path}/${id}`)
                .expect(500);
        });
    });
});
