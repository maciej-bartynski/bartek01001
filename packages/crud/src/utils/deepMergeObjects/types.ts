type AnyObjectOrArray = Record<any, any> | Array<any>;

interface ScopedDeepMergeObjectsFunction<T extends AnyObjectOrArray> {
    (source: T, updationData: Partial<T>): T;
    recursiveTraverse: (flatMergedObject: T, flatMergingSource: Partial<T>, flatMergingUpdationData: Partial<T>, currentPath: string, pathHandlers?: Record<string, (source: any, updationData: any) => any>) => T;
}

export type {
    AnyObjectOrArray,
    ScopedDeepMergeObjectsFunction,
}