export interface ProxyOptions {
    apiKey: string;
}
export declare class ProxyGenerator {
    private options;
    private api;
    constructor(api: 'evm', options: ProxyOptions);
    getRouter(): import("express-serve-static-core").Router;
}
