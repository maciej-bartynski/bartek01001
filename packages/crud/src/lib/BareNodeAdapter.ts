import { ServerAdapter, RouterAdapter } from './ServerAdapter.js';
import { BareHTTPServer } from './BareHTTPServer.js';
import { BareRouter } from './BareRouter.js';

export class BareNodeAdapter implements ServerAdapter {
    constructor(private server: BareHTTPServer) { }

    use(path: string, handler: RouterAdapter): void {
        this.server.use(path, handler);
    }

    get(path: string, handler: any): void {
        this.server.get(path, handler);
    }

    post(path: string, handler: any): void {
        this.server.post(path, handler);
    }

    put(path: string, handler: any): void {
        this.server.put(path, handler);
    }

    delete(path: string, handler: any): void {
        this.server.delete(path, handler);
    }

    listen(port: number, callback?: () => void): any {
        return this.server.listen(port, callback);
    }
}

export class BareNodeRouterAdapter implements RouterAdapter {
    constructor(private router: BareRouter) { }

    get(path: string, handler: (req: any, res: any) => void): void {
        this.router.get(path, handler);
    }

    post(path: string, handler: (req: any, res: any) => void): void {
        this.router.post(path, handler);
    }

    put(path: string, handler: (req: any, res: any) => void): void {
        this.router.put(path, handler);
    }

    delete(path: string, handler: (req: any, res: any) => void): void {
        this.router.delete(path, handler);
    }
}
