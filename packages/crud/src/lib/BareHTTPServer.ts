import { createServer, IncomingMessage, ServerResponse, Server } from 'http';
import { BareRequest } from './BareRequest.js';
import { BareResponse } from './BareResponse.js';
import { BareRouter } from './BareRouter.js';

export class BareHTTPServer {
    private server: Server;
    private routes: Array<{
        path: string;
        router: BareRouter;
    }> = [];
    private middleware: Array<(req: BareRequest, res: BareResponse, next: () => void) => void> = [];

    constructor() {
        this.server = createServer((req: IncomingMessage, res: ServerResponse) => {
            this.handleRequest(req, res);
        });
    }

    use(path: string, router: BareRouter): void {
        this.routes.push({ path, router });
    }

    get(path: string, handler: (req: BareRequest, res: BareResponse) => void): void {
        const router = new BareRouter();
        router.get(path, handler);
        this.routes.push({ path: '', router });
    }

    post(path: string, handler: (req: BareRequest, res: BareResponse) => void): void {
        const router = new BareRouter();
        router.post(path, handler);
        this.routes.push({ path: '', router });
    }

    put(path: string, handler: (req: BareRequest, res: BareResponse) => void): void {
        const router = new BareRouter();
        router.put(path, handler);
        this.routes.push({ path: '', router });
    }

    delete(path: string, handler: (req: BareRequest, res: BareResponse) => void): void {
        const router = new BareRouter();
        router.delete(path, handler);
        this.routes.push({ path: '', router });
    }

    listen(port: number, callback?: () => void): Server {
        return this.server.listen(port, callback);
    }

    address(): any {
        return this.server.address();
    }

    public async handleRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
        const bareReq = new BareRequest(req);
        const bareRes = new BareResponse(res);

        try {
            await this.parseBody(bareReq);
            await this.runMiddleware(bareReq, bareRes);
            await this.routeRequest(bareReq, bareRes);
        } catch (error) {
            console.error('Request handling error:', error);
            bareRes.status(500).json({ error: 'Internal Server Error' });
        }
    }

    private async parseBody(req: BareRequest): Promise<void> {
        if (req.method === 'POST' || req.method === 'PUT') {
            const chunks: Buffer[] = [];

            return new Promise((resolve, reject) => {
                req.req.on('data', (chunk: Buffer) => {
                    chunks.push(chunk);
                });

                req.req.on('end', () => {
                    try {
                        const body = Buffer.concat(chunks).toString();
                        req.setBody(JSON.parse(body));
                        resolve();
                    } catch (error) {
                        req.setBody({});
                        resolve();
                    }
                });

                req.req.on('error', reject);
            });
        }
    }

    private async runMiddleware(req: BareRequest, res: BareResponse): Promise<void> {
        return new Promise((resolve) => {
            let index = 0;

            const next = () => {
                if (index < this.middleware.length) {
                    this.middleware[index++](req, res, next);
                } else {
                    resolve();
                }
            };

            next();
        });
    }

    private async routeRequest(req: BareRequest, res: BareResponse): Promise<void> {
        const url = new URL(req.url, 'http://localhost');
        const pathname = url.pathname;

        for (const route of this.routes) {
            if (route.path && pathname.startsWith(route.path)) {
                const remainingPath = pathname.substring(route.path.length);
                if (route.router instanceof BareRouter) {
                    if (route.router.handleRequest(req.method, remainingPath || '/', req, res)) {
                        return;
                    }
                }
            } else if (!route.path) {
                if (route.router instanceof BareRouter) {
                    if (route.router.handleRequest(req.method, pathname, req, res)) {
                        return;
                    }
                }
            }
        }

        res.status(404).json({ error: 'Not Found' });
    }
}
