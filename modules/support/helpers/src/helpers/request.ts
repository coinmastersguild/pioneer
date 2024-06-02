import { type Options } from 'ky';

const headers =
    typeof window !== 'undefined'
        ? {}
        : {
          Referrer: 'https://sk.thorswap.net',
          Referer: 'https://sk.thorswap.net',
        };

// Define default options for the new ky instance
const defaultOptions: Options = {
  headers: headers,
  timeout: 30000, // Example: 10000 milliseconds = 10 seconds
  retry: {
    limit: 2, // Maximum number of retry attempts
    methods: ['get', 'post', 'put', 'patch', 'head', 'delete'], // HTTP methods to retry
    statusCodes: [408, 500, 502, 503, 504], // HTTP status codes to retry
  },
};

// Function to dynamically import ky and create an instance
async function getKyInstance() {
  const ky = (await import('ky')).default;
  return ky.create(defaultOptions);
}

export const RequestClient = {
  get: async <T>(url: string | URL | Request, options?: Options): Promise<T> => {
    const kyInstance = await getKyInstance();
    return kyInstance.get(url, options).json<T>();
  },
  post: async <T>(url: string | URL | Request, options?: Options): Promise<T> => {
    const kyInstance = await getKyInstance();
    return kyInstance.post(url, options).json<T>();
  },
  // Implement other methods (put, delete, patch, head) as needed
};
