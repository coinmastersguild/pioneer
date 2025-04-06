"use strict";
/*
    https://docs.blocknative.com/webhook-api



Retrieve auth0 token:

curl --location --request POST \

        --url 'https://poapauth.auth0.com/oauth/token' \

        --header "Content-Type: application/json" \

        -d '{"audience": "", "grant_type": "client_credentials", "client_id": "", "client_secret": ""}'



Use auth0 token:

curl --location --request GET --url 'https://api.poap.tech/actions/claim-qr?qr_hash=1kozmm' --header "Authorization: Bearer $authtoken"

 */
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
var TAG = " | blocknative | ";
var Axios = require('axios');
var https = require('https');
var POAP_API_KEY = process.env['POAP_API_KEY'];
if (!POAP_API_KEY)
    throw Error("api key required! set env POAP_API_KEY");
var POAP_SECRET = process.env['POAP_SECRET'];
if (!POAP_SECRET)
    throw Error("api key required! set env POAP_SECRET");
var POAP_CLIENT_ID = process.env['POAP_CLIENT_ID'];
if (!POAP_CLIENT_ID)
    throw Error("api key required! set env POAP_CLIENT_ID");
var axios = Axios.create();
// const axios = Axios.create({
//     httpsAgent: new https.Agent({
//         rejectUnauthorized: false,
//         headers: {
//             "Authorization": "Bearer "+process.env['ZAPPER_API_KEY'],
//         }
//     })
// });
var URL_SERVICE = "https://api.poap.tech/";
module.exports = {
    getAuthToken: function () {
        return get_auth_token();
    },
    // getTokens: function (address:string) {
    //     return get_tokens(address);
    // },
    getNFTs: function (address) {
        return get_nfts(address);
    },
};
var get_auth_token = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag, url, body, headers, result, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_tokens | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    url = "https://poapauth.auth0.com/oauth/token";
                    body = {
                        "audience": "KeepKey",
                        "grant_type": "client_credentials",
                        "client_id": POAP_CLIENT_ID,
                        "client_secret": POAP_SECRET
                    };
                    headers = {
                        "Content-Type": "application/json"
                    };
                    console.log(url, body, headers);
                    return [4 /*yield*/, axios.post(url, body, headers)];
                case 2:
                    result = _a.sent();
                    return [2 /*return*/, result.data];
                case 3:
                    e_1 = _a.sent();
                    console.error(tag, "e: ", e_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_nfts = function (address) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, url, result, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_tokens | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    url = URL_SERVICE + "actions/scan/" + address;
                    return [4 /*yield*/, axios({
                            method: 'GET',
                            url: 'https://api.poap.tech/actions/scan/' + address,
                            headers: {
                                'X-API-Key': POAP_API_KEY
                            }
                        })];
                case 2:
                    result = _a.sent();
                    return [2 /*return*/, result.data];
                case 3:
                    e_2 = _a.sent();
                    console.error(tag, "e: ", e_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
};
// const get_tokens = async function (address:string) {
//     let tag = TAG + " | get_tokens | "
//     try {
//         let url = URL_SERVICE + "/v2/balances/apps?addresses=" + address
//         const headers = {
//             headers: {
//                 "Authorization": "Bearer "+process.env['ZAPPER_API_KEY'],
//             }
//         }
//         let result = await axios({
//             url,
//             method: 'GET'
//         },headers)
//         return result.data
//     } catch (e) {
//         console.error(tag, "e: ", e)
//         // console.error(tag, "e: ", e?.response)
//         // console.error(tag, "e: ", e?.response?.status)
//         // console.error(tag, "e: ", JSON.stringify(e.data))
//     }
// }
