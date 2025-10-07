export interface ServerAdapter {
    use(path: string, handler: RouterAdapter): void;
    get(path: string, handler: any): void;
    post(path: string, handler: any): void;
    put(path: string, handler: any): void;
    delete(path: string, handler: any): void;
    listen(port: number, callback?: () => void): any;
}

export interface RequestAdapter {
    method: string;
    url: string;
    params: Record<string, string>;
    query: Record<string, string>;
    body: any;
    headers: Record<string, string>;
    setParams?(params: Record<string, string>): void;
}

export interface ResponseAdapter {
    status(code: number): ResponseAdapter;
    json(data: any): void;
    send(data: any): void;
    setHeader(name: string, value: string): void;
    end(data?: any): void;
}

export interface RouterAdapter {
    get(path: string, handler: (req: RequestAdapter, res: ResponseAdapter) => void): void;
    post(path: string, handler: (req: RequestAdapter, res: ResponseAdapter) => void): void;
    put(path: string, handler: (req: RequestAdapter, res: ResponseAdapter) => void): void;
    delete(path: string, handler: (req: RequestAdapter, res: ResponseAdapter) => void): void;
}
