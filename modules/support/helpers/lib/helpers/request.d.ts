import { type Options } from 'ky';
export declare const RequestClient: {
    get: <T>(url: string | URL | Request, options?: Options) => Promise<T>;
    post: <T>(url: string | URL | Request, options?: Options) => Promise<T>;
};
