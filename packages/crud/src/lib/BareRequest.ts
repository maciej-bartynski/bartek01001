import { IncomingMessage } from 'http';
import { RequestAdapter } from './ServerAdapter.js';

export class BareRequest implements RequestAdapter {
    public method: string;
    public url: string;
    public params: Record<string, string> = {};
    public query: Record<string, string> = {};
    public body: any = {};
    public headers: Record<string, string> = {};
    public req: IncomingMessage;

    constructor(req: IncomingMessage) {
        this.req = req;
        this.method = req.method || 'GET';
        this.url = req.url || '/';
        this.headers = req.headers as Record<string, string>;
        this.parseQuery();
    }

    private parseQuery(): void {
        const url = new URL(this.url, 'http://localhost');
        this.query = Object.fromEntries(url.searchParams.entries());
    }

    setParams(params: Record<string, string>): void {
        this.params = params;
    }

    setBody(body: any): void {
        this.body = body;
    }
}
