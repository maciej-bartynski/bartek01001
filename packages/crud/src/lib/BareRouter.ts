import { RequestAdapter, ResponseAdapter, RouterAdapter } from './ServerAdapter.js';

type RouteHandler = (req: RequestAdapter, res: ResponseAdapter) => void;

export class BareRouter implements RouterAdapter {
    private routes: Array<{
        method: string;
        path: string;
        handler: RouteHandler;
    }> = [];

    get(path: string, handler: RouteHandler): void {
        this.routes.push({ method: 'GET', path, handler });
    }

    post(path: string, handler: RouteHandler): void {
        this.routes.push({ method: 'POST', path, handler });
    }

    put(path: string, handler: RouteHandler): void {
        this.routes.push({ method: 'PUT', path, handler });
    }

    delete(path: string, handler: RouteHandler): void {
        this.routes.push({ method: 'DELETE', path, handler });
    }

    handleRequest(method: string, path: string, req: RequestAdapter, res: ResponseAdapter): boolean {
        const route = this.routes.find(r =>
            r.method === method && this.matchPath(r.path, path)
        );

        if (route) {
            const params = this.extractParams(route.path, path);
            if (req.setParams) {
                req.setParams(params);
            }
            route.handler(req, res);
            return true;
        }

        return false;
    }

    private matchPath(routePath: string, requestPath: string): boolean {
        if (routePath === requestPath) return true;

        const routeParts = routePath.split('/');
        const pathParts = requestPath.split('/');

        if (routeParts.length !== pathParts.length) return false;

        for (let i = 0; i < routeParts.length; i++) {
            if (routeParts[i].startsWith(':')) continue;
            if (routeParts[i] !== pathParts[i]) return false;
        }

        return true;
    }

    private extractParams(routePath: string, requestPath: string): Record<string, string> {
        const params: Record<string, string> = {};
        const routeParts = routePath.split('/');
        const pathParts = requestPath.split('/');

        for (let i = 0; i < routeParts.length; i++) {
            if (routeParts[i].startsWith(':')) {
                const paramName = routeParts[i].substring(1);
                params[paramName] = pathParts[i];
            }
        }

        return params;
    }
}
