"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
/*
      Pioneer Client
      
      swagger docs:
        https://pioneers.dev/spec/swagger.json
      
                        -Highlander
 */
// @ts-ignore
var swagger_client_1 = __importDefault(require("swagger-client"));
var TAG = " | Client | ";
function customHttpClient(req) {
    return new Promise(function (resolve, reject) {
        var timer = setTimeout(function () {
            reject(new Error('Request timed out'));
        }, 60000); // 60 seconds
        swagger_client_1.default.http(req)
            .then(function (response) {
            clearTimeout(timer);
            resolve(response);
        })
            .catch(function (err) {
            clearTimeout(timer);
            reject(err);
        });
    });
}
var Pioneer = /** @class */ (function () {
    function Pioneer(spec, config) {
        this.spec = spec;
        this.queryKey = config.queryKey;
        this.pioneer = {};
        this.timeout = config.queryKey || 45000;
    }
    Pioneer.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tag, _a, e_1;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        tag = TAG + " | init | ";
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        if (!this.queryKey)
                            throw Error(" You must create an api key! ");
                        _a = this;
                        return [4 /*yield*/, new swagger_client_1.default({
                                url: this.spec,
                                requestInterceptor: function (req) {
                                    req.headers.Authorization = _this.queryKey;
                                    return req;
                                },
                                http: customHttpClient
                            })];
                    case 2:
                        _a.client = _b.sent();
                        Object.keys(this.client.spec.paths).forEach(function (path) {
                            Object.keys(_this.client.spec.paths[path]).forEach(function (method) {
                                var operationId = _this.client.spec.paths[path][method].operationId;
                                _this.pioneer[operationId] = function (parameters) { return __awaiter(_this, void 0, void 0, function () {
                                    var request, result, e_2;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                _a.trys.push([0, 2, , 3]);
                                                request = {
                                                    operationId: operationId,
                                                    parameters: __assign(__assign({}, parameters), { Authorization: this.queryKey }),
                                                    responseContentType: 'application/json'
                                                };
                                                if (method === 'post') {
                                                    request.requestBody = parameters;
                                                }
                                                return [4 /*yield*/, this.client.execute(request)];
                                            case 1:
                                                result = _a.sent();
                                                return [2 /*return*/, { data: result.body }];
                                            case 2:
                                                e_2 = _a.sent();
                                                console.error(e_2);
                                                throw e_2;
                                            case 3: return [2 /*return*/];
                                        }
                                    });
                                }); };
                            });
                        });
                        return [2 /*return*/, this.pioneer];
                    case 3:
                        e_1 = _b.sent();
                        console.error(TAG + 'error: ', e_1);
                        throw e_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return Pioneer;
}());
exports.default = Pioneer;
