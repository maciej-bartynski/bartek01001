export interface CRUDServerConfig {
    dataDirectory?: string;
}

export interface CRUDPathConfig {
    path: string;
    dataDirectory?: string;
}

export interface CRUDResponse {
    _id: string;
    path: string;
}

export interface CRUDDeleteResponse {
    deleted: boolean;
    _id: string;
}

export interface CRUDListResponse<T> {
    items: T[];
}

export interface CRUDItemResponse<T> {
    item: T;
}
