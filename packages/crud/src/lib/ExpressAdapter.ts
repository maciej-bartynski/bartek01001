import { Application, Router, Request, Response } from 'express';
import { ServerAdapter, RequestAdapter, ResponseAdapter, RouterAdapter } from './ServerAdapter.js';

export class ExpressAdapter implements ServerAdapter {
    constructor(private app: Application) { }

    use(path: string, handler: any): void {
        if (handler && typeof handler.router !== 'undefined') {
            this.app.use(path, handler.router);
        } else {
            this.app.use(path, handler);
        }
    }

    get(path: string, handler: any): void {
        this.app.get(path, handler);
    }

    post(path: string, handler: any): void {
        this.app.post(path, handler);
    }

    put(path: string, handler: any): void {
        this.app.put(path, handler);
    }

    delete(path: string, handler: any): void {
        this.app.delete(path, handler);
    }

    listen(port: number, callback?: () => void): any {
        return this.app.listen(port, callback);
    }
}

export class ExpressRequestAdapter implements RequestAdapter {
    public method: string;
    public url: string;
    public params: Record<string, string>;
    public query: Record<string, string>;
    public body: any;
    public headers: Record<string, string>;

    constructor(private req: Request) {
        this.method = req.method;
        this.url = req.url;
        this.params = req.params;
        this.query = req.query as Record<string, string>;
        this.body = req.body;
        this.headers = req.headers as Record<string, string>;
    }
}

export class ExpressResponseAdapter implements ResponseAdapter {
    constructor(private res: Response) { }

    status(code: number): ResponseAdapter {
        this.res.status(code);
        return this;
    }

    json(data: any): void {
        this.res.json(data);
    }

    send(data: any): void {
        this.res.send(data);
    }

    setHeader(name: string, value: string): void {
        this.res.setHeader(name, value);
    }

    end(data?: any): void {
        this.res.end(data);
    }
}

export class ExpressRouterAdapter implements RouterAdapter {
    public router: Router;

    constructor(router: Router) {
        this.router = router;
    }

    get(path: string, handler: (req: RequestAdapter, res: ResponseAdapter) => void): void {
        this.router.get(path, (req: Request, res: Response) => {
            const reqAdapter = new ExpressRequestAdapter(req);
            const resAdapter = new ExpressResponseAdapter(res);
            handler(reqAdapter, resAdapter);
        });
    }

    post(path: string, handler: (req: RequestAdapter, res: ResponseAdapter) => void): void {
        this.router.post(path, (req: Request, res: Response) => {
            const reqAdapter = new ExpressRequestAdapter(req);
            const resAdapter = new ExpressResponseAdapter(res);
            handler(reqAdapter, resAdapter);
        });
    }

    put(path: string, handler: (req: RequestAdapter, res: ResponseAdapter) => void): void {
        this.router.put(path, (req: Request, res: Response) => {
            const reqAdapter = new ExpressRequestAdapter(req);
            const resAdapter = new ExpressResponseAdapter(res);
            handler(reqAdapter, resAdapter);
        });
    }

    delete(path: string, handler: (req: RequestAdapter, res: ResponseAdapter) => void): void {
        this.router.delete(path, (req: Request, res: Response) => {
            const reqAdapter = new ExpressRequestAdapter(req);
            const resAdapter = new ExpressResponseAdapter(res);
            handler(reqAdapter, resAdapter);
        });
    }
}
