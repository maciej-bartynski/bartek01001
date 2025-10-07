import JSONStoragePackage from "@bartek0x1001/json-storage";
import { Router, Request, Response } from "express";
import { CRUDPathConfig, CRUDResponse, CRUDDeleteResponse, CRUDListResponse, CRUDItemResponse } from "./types.js";
import deepMergeObjects from "#src/utils/deepMergeObjects/deepMergeObjects.js";
import { RouterAdapter, RequestAdapter, ResponseAdapter } from "./ServerAdapter.js";
import { ExpressRouterAdapter } from "./ExpressAdapter.js";
import { BareNodeRouterAdapter } from "./BareNodeAdapter.js";
import { BareRouter } from "./BareRouter.js";

type ServerMode = 'express' | 'bare' | 'auto';

export class CRUDRouterFactory {
    private static async createCRUDRouter(config: CRUDPathConfig, mode: ServerMode = 'auto'): Promise<RouterAdapter> {
        const jsonStorage = JSONStoragePackage.getInstance({ directory: config.dataDirectory || 'data' });
        const connection = await jsonStorage.connect({ directory: config.path });

        if (mode === 'express' || (mode === 'auto' && this.isExpressAvailable())) {
            return this.createExpressRouter(connection);
        } else {
            return this.createBareRouter(connection);
        }
    }

    private static isExpressAvailable(): boolean {
        try {
            require('express');
            return true;
        } catch {
            return false;
        }
    }

    private static async createExpressRouter(connection: any): Promise<ExpressRouterAdapter> {
        const router = Router();
        const expressRouter = new ExpressRouterAdapter(router);

        await this.setupRoutes(expressRouter, connection);
        return expressRouter;
    }

    private static async createBareRouter(connection: any): Promise<BareNodeRouterAdapter> {
        const router = new BareRouter();
        const bareRouter = new BareNodeRouterAdapter(router);

        await this.setupRoutes(bareRouter, connection);
        return bareRouter;
    }

    private static async setupRoutes(router: RouterAdapter, connection: any): Promise<void> {
        router.get('/', async (req: RequestAdapter, res: ResponseAdapter) => {
            try {
                const allItems = await connection.filter({
                    limit: 10,
                    offset: 0,
                });
                res.json({ items: allItems } as CRUDListResponse<any>);
            } catch (e) {
                res.status(500).json({ error: e });
            }
        });

        router.get('/:fileId', async (req: RequestAdapter, res: ResponseAdapter) => {
            try {
                const { fileId } = req.params;
                const file = await connection.read(fileId);
                res.json({ item: file } as CRUDItemResponse<any>);
            } catch (e) {
                res.status(500).json({ error: e });
            }
        });

        router.post('/', async (req: RequestAdapter, res: ResponseAdapter) => {
            try {
                const { _id, ...data } = req.body;
                const { _id: id, path } = await connection.create({
                    _id,
                    ...data,
                });
                res.json({
                    _id: id,
                    path,
                } as CRUDResponse);
            } catch (e) {
                res.status(500).json({ error: e });
            }
        });

        router.put('/:fileId', async (req: RequestAdapter, res: ResponseAdapter) => {
            const override = req.query.override as AllowedOverride || AllowedOverride.TRUE;
            const arrayMergeStrategy = req.query.arrayMergeStrategy as AllowedArrayMergeStrategies || AllowedArrayMergeStrategies.CONCAT;

            if (!allowedArrayMergeStrategies.includes(arrayMergeStrategy) || !allowedOverrides.includes(override)) {
                return res.status(400).json({ error: 'Invalid query parameters' });
            }

            try {
                const { fileId } = req.params;
                let updateData = req.body;

                if (override === AllowedOverride.FALSE) {
                    const file = await connection.read(fileId);
                    updateData = deepMergeObjects(file, updateData, {}, {
                        arrayMergeStrategy
                    });
                    delete updateData._id;
                    delete updateData.stats;
                }

                const { _id, path } = await connection.update(fileId, updateData);

                res.json({
                    _id,
                    path,
                } as CRUDResponse);
            } catch (e) {
                console.error('PUT request - error:', e);
                res.status(500).json({ error: e });
            }
        });

        router.delete('/:fileId', async (req: RequestAdapter, res: ResponseAdapter) => {
            try {
                const { fileId } = req.params;
                await connection.delete(fileId);
                res.json({
                    deleted: true,
                    _id: fileId,
                } as CRUDDeleteResponse);
            } catch (e) {
                res.status(500).json({ error: e });
            }
        });
    }

    static async generateRouter(config: CRUDPathConfig, mode: ServerMode = 'auto'): Promise<RouterAdapter> {
        return await this.createCRUDRouter(config, mode);
    }
}

enum AllowedArrayMergeStrategies {
    CONCAT = 'concat',
    REPLACE = 'replace',
}

enum AllowedOverride {
    TRUE = 'true',
    FALSE = 'false',
}

type UpdateQuery = {
    override?: AllowedOverride;
    arrayMergeStrategy?: AllowedArrayMergeStrategies;
}

const allowedOverrides: AllowedOverride[] = Object.values(AllowedOverride);
const allowedArrayMergeStrategies: AllowedArrayMergeStrategies[] = Object.values(AllowedArrayMergeStrategies);