import express, { Application } from 'express';
import { CRUDRouterFactory } from './CRUDRouterFactory.js';
import { CRUDServerConfig, CRUDPathConfig } from './types.js';
import { ServerAdapter } from './ServerAdapter.js';
import { ExpressAdapter } from './ExpressAdapter.js';
import { BareNodeAdapter } from './BareNodeAdapter.js';
import { BareHTTPServer } from './BareHTTPServer.js';

type ServerMode = 'express' | 'bare' | 'auto';

export class CRUDServer {
    private appInstance: ServerAdapter;
    private config: CRUDServerConfig;
    private paths: CRUDPathConfig[];
    private mode: ServerMode;

    constructor(options?: { mode?: ServerMode }) {
        this.config = { dataDirectory: 'data' };
        this.paths = [];
        this.mode = options?.mode || 'auto';

        this.appInstance = this.createServer();
        this.setupDefaultRoute();
    }

    private createServer(): ServerAdapter {
        if (this.mode === 'bare') {
            return new BareNodeAdapter(new BareHTTPServer());
        }

        if (this.mode === 'express') {
            const expressApp = express();
            expressApp.use(express.json());
            return new ExpressAdapter(expressApp);
        }

        try {
            const expressApp = express();
            expressApp.use(express.json());
            return new ExpressAdapter(expressApp);
        } catch (error) {
            return new BareNodeAdapter(new BareHTTPServer());
        }
    }

    private setupDefaultRoute(): void {
        this.appInstance.get('/', (req: any, res: any) => {
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

        const routerAdapter = await CRUDRouterFactory.generateRouter(pathConfig, this.mode);
        this.appInstance.use(`/${pathName}`, routerAdapter);

        return this;
    }

    app(): any {
        if (this.mode === 'express' || (this.mode === 'auto' && this.appInstance instanceof ExpressAdapter)) {
            return (this.appInstance as ExpressAdapter)['app'];
        }
        return this.appInstance;
    }

    getPaths(): CRUDPathConfig[] {
        return [...this.paths];
    }

    getConfig(): CRUDServerConfig {
        return { ...this.config };
    }
}
