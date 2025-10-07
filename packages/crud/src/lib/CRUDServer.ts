import { CRUDRouterFactory } from './CRUDRouterFactory.js';
import { CRUDServerConfig, CRUDPathConfig } from './types.js';
import { BareHTTPServer } from './BareHTTPServer.js';

export class CRUDServer {
    private appInstance: BareHTTPServer;
    private config: CRUDServerConfig;
    private paths: CRUDPathConfig[];

    constructor() {
        this.config = { dataDirectory: 'data' };
        this.paths = [];

        this.appInstance = new BareHTTPServer();
        this.setupDefaultRoute();
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

        const router = await CRUDRouterFactory.generateRouter(pathConfig);
        this.appInstance.use(`/${pathName}`, router);

        return this;
    }

    app(): BareHTTPServer {
        return this.appInstance;
    }

    getExpressMiddleware(): any {
        return (req: any, res: any, next: any) => {
            this.appInstance.handleRequest(req, res);
        };
    }

    getPaths(): CRUDPathConfig[] {
        return [...this.paths];
    }

    getConfig(): CRUDServerConfig {
        return { ...this.config };
    }
}
