import { ServerResponse } from 'http';
import { ResponseAdapter } from './ServerAdapter.js';

export class BareResponse implements ResponseAdapter {
    private statusCode: number = 200;
    private headers: Record<string, string> = {};

    constructor(private res: ServerResponse) {
        this.res.setHeader('Content-Type', 'application/json');
    }

    status(code: number): BareResponse {
        this.statusCode = code;
        return this;
    }

    json(data: any): void {
        this.res.statusCode = this.statusCode;
        this.res.setHeader('Content-Type', 'application/json');
        this.res.end(JSON.stringify(data));
    }

    send(data: any): void {
        this.res.statusCode = this.statusCode;
        if (typeof data === 'string') {
            this.res.setHeader('Content-Type', 'text/plain');
            this.res.end(data);
        } else {
            this.json(data);
        }
    }

    setHeader(name: string, value: string): void {
        this.headers[name] = value;
        this.res.setHeader(name, value);
    }

    end(data?: any): void {
        if (data !== undefined) {
            this.res.end(data);
        } else {
            this.res.end();
        }
    }
}
