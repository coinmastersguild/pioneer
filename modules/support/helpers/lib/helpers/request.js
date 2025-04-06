"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestClient = void 0;
const headers = typeof window !== 'undefined'
    ? {}
    : {
        Referrer: 'https://sk.thorswap.net',
        Referer: 'https://sk.thorswap.net',
    };
// Define default options for the new ky instance
const defaultOptions = {
    headers: headers,
    timeout: 30000, // Example: 10000 milliseconds = 10 seconds
    retry: {
        limit: 2, // Maximum number of retry attempts
        methods: ['get', 'post', 'put', 'patch', 'head', 'delete'], // HTTP methods to retry
        statusCodes: [408, 500, 502, 503, 504], // HTTP status codes to retry
    },
};
// Function to dynamically import ky and create an instance
function getKyInstance() {
    return __awaiter(this, void 0, void 0, function* () {
        const ky = (yield Promise.resolve().then(() => __importStar(require('ky')))).default;
        return ky.create(defaultOptions);
    });
}
exports.RequestClient = {
    get: (url, options) => __awaiter(void 0, void 0, void 0, function* () {
        const kyInstance = yield getKyInstance();
        return kyInstance.get(url, options).json();
    }),
    post: (url, options) => __awaiter(void 0, void 0, void 0, function* () {
        const kyInstance = yield getKyInstance();
        return kyInstance.post(url, options).json();
    }),
    // Implement other methods (put, delete, patch, head) as needed
};
