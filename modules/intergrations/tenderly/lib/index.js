"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var https_1 = __importDefault(require("https"));
var TAG = " | tenderly | ";
// Ensure API key is set
var TENDERLY_ACCESS_KEY = process.env.TENDERLY_ACCESS_KEY;
if (!TENDERLY_ACCESS_KEY) {
    throw new Error("API key required! Set env TENDERLY_ACCESS_KEY");
}
var TENDERLY_USER = 'highlander2';
var TENDERLY_PROJECT = 'project';
// Axios instance with custom HTTPS agent
var axiosInstance = axios_1.default.create({
    httpsAgent: new https_1.default.Agent({
        rejectUnauthorized: false
    })
});
module.exports = {
    validateTransaction: function (tx) {
        return simulateTransaction(tx);
    },
};
// Function to simulate a transaction
function simulateTransaction(tx) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, apiURL, body, headers, response, summary, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    tag = " | simulateTransaction | ";
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    apiURL = "https://api.tenderly.co/api/v1/account/highlander2/project/project/simulate";
                    body = {
                        network_id: tx.chainId || "1",
                        from: tx.from,
                        to: tx.to,
                        input: tx.data,
                        value: tx.value || 0,
                        save_if_fails: true
                    };
                    //eip1559
                    if (tx.gas) {
                        body.gas = tx.gas;
                        body.gas_price = tx.gasPrice;
                    }
                    if (tx.maxPriorityFeePerGas) {
                        body.max_priority_fee_per_gas = tx.maxPriorityFeePerGas;
                        body.max_fee_per_gas = tx.maxFeePerGas;
                    }
                    headers = {
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Access-Key': TENDERLY_ACCESS_KEY,
                        }
                    };
                    return [4 /*yield*/, axiosInstance.post(apiURL, body, headers)];
                case 2:
                    response = _b.sent();
                    // console.log(tag,'response: ',Object.keys(response.data))
                    // console.log(tag,'response simulation: ',Object.keys(response.data.simulation))
                    console.log(tag, 'response simulation: ', response.data.simulation);
                    summary = {
                        isValid: response.data.simulation.status,
                        method: response.data.simulation.method,
                        gas_used: response.data.simulation.gas_used,
                        nonce: response.data.simulation.nonce,
                        addresses: response.data.simulation.addresses,
                    };
                    if (!response.data.simulation.status) {
                        summary.error = response.data.simulation.error_message;
                    }
                    summary.raw = response.data.simulation;
                    return [2 /*return*/, summary];
                case 3:
                    error_1 = _b.sent();
                    if (axios_1.default.isAxiosError(error_1)) {
                        console.error(TAG, "Axios error in simulateTransaction:", ((_a = error_1.response) === null || _a === void 0 ? void 0 : _a.data) || error_1.message);
                    }
                    else {
                        console.error(TAG, "Unknown error in simulateTransaction:", error_1);
                    }
                    throw new Error("Transaction simulation failed.");
                case 4: return [2 /*return*/];
            }
        });
    });
}
