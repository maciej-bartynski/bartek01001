import express, { Application } from 'express';
import { CRUDRouterFactory } from './CRUDRouterFactory.js';
import { CRUDServerConfig, CRUDPathConfig } from './types.js';

export class CRUDServer {
    private appInstance: Application;
    private config: CRUDServerConfig;
    private paths: CRUDPathConfig[];

    constructor() {
        this.appInstance = express();
        this.appInstance.use(express.json());
        this.config = { dataDirectory: 'data' };
        this.paths = [];

        this.appInstance.get('/', (req, res) => {
            res.send({ message: 'CRUD Server is running!' });
        });
    }

    configure(config: CRUDServerConfig): CRUDServer {
        this.config = { ...this.config, ...config };
        return this;
    }

    async path(pathName: string): Promise<CRUDServer> {
        const pathConfig: CRUDPathConfig = {
            path: pathName,
            dataDirectory: this.config.dataDirectory
        };

        this.paths.push(pathConfig);

        const router = await CRUDRouterFactory.generateRouter(pathConfig);
        this.appInstance.use(`/${pathName}`, router);

        return this;
    }

    app(): Application {
        return this.appInstance;
    }

    getPaths(): CRUDPathConfig[] {
        return [...this.paths];
    }

    getConfig(): CRUDServerConfig {
        return { ...this.config };
    }
}
