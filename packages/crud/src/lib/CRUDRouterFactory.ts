import JSONStoragePackage from "@bartek0x1001/json-storage";
import { CRUDPathConfig, CRUDResponse, CRUDDeleteResponse, CRUDListResponse, CRUDItemResponse } from "./types.js";
import { BareRouter } from "./BareRouter.js";
import { BareRequest } from "./BareRequest.js";
import { BareResponse } from "./BareResponse.js";
import deepMergeObjects from "@bartek0x1001/deep-merge";

export class CRUDRouterFactory {
    private static async createCRUDRouter(config: CRUDPathConfig): Promise<BareRouter> {
        const jsonStorage = JSONStoragePackage.getInstance({ directory: config.dataDirectory || 'data' });
        const connection = await jsonStorage.connect({ directory: config.path });

        return this.createBareRouter(connection);
    }

    private static async createBareRouter(connection: any): Promise<BareRouter> {
        const router = new BareRouter();

        await this.setupRoutes(router, connection);
        return router;
    }

    private static async setupRoutes(router: BareRouter, connection: any): Promise<void> {
        router.get('/', async (req: BareRequest, res: BareResponse) => {
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

        router.get('/:fileId', async (req: BareRequest, res: BareResponse) => {
            try {
                const { fileId } = req.params;
                const file = await connection.read(fileId);
                res.json({ item: file } as CRUDItemResponse<any>);
            } catch (e) {
                res.status(500).json({ error: e });
            }
        });

        router.post('/', async (req: BareRequest, res: BareResponse) => {
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

        router.put('/:fileId', async (req: BareRequest, res: BareResponse) => {
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

        router.delete('/:fileId', async (req: BareRequest, res: BareResponse) => {
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

    static async generateRouter(config: CRUDPathConfig): Promise<BareRouter> {
        return await this.createCRUDRouter(config);
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