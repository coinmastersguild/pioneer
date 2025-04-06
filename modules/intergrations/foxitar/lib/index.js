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
Object.defineProperty(exports, "__esModule", { value: true });
var TAG = " | foxitar | ";
/*
curl --request GET \
     --url 'https://polygon-mainnet.g.alchemy.com/nft/v2/docs-demo/getNFTs?owner=0x33b35c665496bA8E71B22373843376740401F106&contractAddresses\[\]=0x2e727c425a11ce6b8819b3004db332c12d2af2a2&withMetadata=true&pageSize=100' \
     --header 'accept: application/json'

 */
var Web3 = require('web3');
var axios = require('axios');
var https = require('https');
var constants_1 = require("./constants");
var FOX_CONTRACT_ABI = ""; // provide the ABI here
var FOXITAR_CONTRACT_ADDRESS = "0x2e727C425a11Ce6b8819B3004dB332C12D2aF2a2"; // provide the contract address here
//@TODO get from pioneer best node
var NETWORK_PROVIDER = "https://polygon.llamarpc.com";
var web3 = new Web3(new Web3.providers.HttpProvider(NETWORK_PROVIDER));
module.exports = {
    getContractInfo: function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getContractInfo()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    getOwners: function (skip, limit) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, get_all_owners(skip, limit)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    getTokenInfo: function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, get_token_by_id(id)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    isFoxOwner: function (address) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, get_tokens_by_address(address)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
};
function get_tokens_by_address(address) {
    return __awaiter(this, void 0, void 0, function () {
        var nftContract, tokenURI, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    nftContract = new web3.eth.Contract(constants_1.FOXITAR_CONTRACT_ABI, FOXITAR_CONTRACT_ADDRESS);
                    return [4 /*yield*/, nftContract.methods.balanceOf(address).call()];
                case 1:
                    tokenURI = _a.sent();
                    console.log("tokenURI: ", tokenURI);
                    return [2 /*return*/, tokenURI];
                case 2:
                    e_1 = _a.sent();
                    console.error(e_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getContractInfo() {
    return __awaiter(this, void 0, void 0, function () {
        var nftContract, totalSupply;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nftContract = new web3.eth.Contract(FOX_CONTRACT_ABI, FOXITAR_CONTRACT_ADDRESS);
                    return [4 /*yield*/, nftContract.methods.totalSupply().call()];
                case 1:
                    totalSupply = _a.sent();
                    return [2 /*return*/, { totalSupply: totalSupply }];
            }
        });
    });
}
var get_all_owners = function (skip, limit) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, nftContract, i, owner, count, error_1, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_all_owners | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 8, , 9]);
                    output = {};
                    nftContract = new web3.eth.Contract(constants_1.ERC721_ABI, FOXITAR_CONTRACT_ADDRESS);
                    // Fetch the total supply of the NFTs
                    output['owners'] = [];
                    i = 1;
                    owner = '';
                    count = 0;
                    _a.label = 2;
                case 2:
                    if (!(count < limit)) return [3 /*break*/, 7];
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, nftContract.methods.ownerOf(i).call()];
                case 4:
                    owner = _a.sent();
                    if (i > skip) {
                        output['owners'].push(owner.toLowerCase());
                        count++;
                    }
                    //console.log(i + " address: ", owner.toLowerCase());
                    i++;
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    // No owner found for the current index i
                    output['totalSupply'] = i;
                    return [3 /*break*/, 7];
                case 6: return [3 /*break*/, 2];
                case 7: return [2 /*return*/, output];
                case 8:
                    e_2 = _a.sent();
                    console.error(tag, e_2);
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
};
function get_token_by_id(tokenId) {
    return __awaiter(this, void 0, void 0, function () {
        var nftContract, tokenURI, result, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    nftContract = new web3.eth.Contract(constants_1.FOXITAR_CONTRACT_ABI, FOXITAR_CONTRACT_ADDRESS);
                    return [4 /*yield*/, nftContract.methods.tokenURI(tokenId).call()];
                case 1:
                    tokenURI = _a.sent();
                    return [4 /*yield*/, axios.get(tokenURI)];
                case 2:
                    result = _a.sent();
                    return [2 /*return*/, result.data];
                case 3:
                    e_3 = _a.sent();
                    console.error(e_3);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
