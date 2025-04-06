"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERC721_ABI = exports.AIRDROP_ABI = exports.ERC20ABI = exports.TCRopstenAbi = exports.SABLIER_ABI = exports.METADATA_ABI = exports.CLAIM_URL = exports.AIRDROP_CONTRACT = exports.THORCHAIN_ROUTER_TESTNET = exports.PIONEER_CONTRACT_ADDRESS_BASE = exports.PIONEER_CONTRACT_ADDRESS = exports.PIONEER_METADATA_CONTRACT_ADDRESS_BASE = exports.PIONEER_METADATA_CONTRACT_ADDRESS = exports.FOX_AIRDROP_ADDRESS = exports.FOX_ETH_FARMING_ADDRESS = exports.FOX_ETH_TEST_FARMING_ADDRESS = exports.PROXY_CONTRACT_SABLIER = exports.WETH_TOKEN_CONTRACT_ADDRESS = exports.FOX_TOKEN_CONTRACT_ADDRESS = exports.UNISWAP_V2_ROUTER = exports.UNISWAP_V2_USDC_ETH_POOL_ADDRESS = exports.UNISWAP_V2_WETH_FOX_POOL_ADDRESS = void 0;
exports.UNISWAP_V2_WETH_FOX_POOL_ADDRESS = '0x470e8de2ebaef52014a47cb5e6af86884947f08c';
exports.UNISWAP_V2_USDC_ETH_POOL_ADDRESS = '0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc';
exports.UNISWAP_V2_ROUTER = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
exports.FOX_TOKEN_CONTRACT_ADDRESS = '0xc770EEfAd204B5180dF6a14Ee197D99d808ee52d';
exports.WETH_TOKEN_CONTRACT_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
exports.PROXY_CONTRACT_SABLIER = '0xbd6a40bb904aea5a49c59050b5395f7484a4203d';
exports.FOX_ETH_TEST_FARMING_ADDRESS = '0x1F2BBC14BCEc7f06b996B6Ee920AB5cA5A56b77F';
exports.FOX_ETH_FARMING_ADDRESS = '0x1F2BBC14BCEc7f06b996B6Ee920AB5cA5A56b77F';
exports.FOX_AIRDROP_ADDRESS = '0x1F2BBC14BCEc7f06b996B6Ee920AB5cA5A56b77F';
exports.PIONEER_METADATA_CONTRACT_ADDRESS = '0x0E1cDf34e15414C6AfDd4E75Bd2dBcAC5E8cc8E4';
exports.PIONEER_METADATA_CONTRACT_ADDRESS_BASE = '0x6127f757b827284ff24335cfe8fd7e51fd0cd8f6';
exports.PIONEER_CONTRACT_ADDRESS = '0x25EF864904d67e912B9eC491598A7E5A066B102F';
//0xd0d31f743d5f7e8fcf4add1bdb198f07241a4f23
exports.PIONEER_CONTRACT_ADDRESS_BASE = '0xd0d31f743d5f7e8fcf4add1bdb198f07241a4f23';
exports.THORCHAIN_ROUTER_TESTNET = process.env['THORCHAIN_ROUTER_TESTNET'] || "0x9d496De78837f5a2bA64Cb40E62c19FBcB67f55a";
exports.AIRDROP_CONTRACT = "0x4C20CDAdBcaE364Edc03E2B90F09eB97d08ce3C8";
exports.CLAIM_URL = "https://fox-api.shapeshift.com/claims";
//TODO move to coins.js
exports.METADATA_ABI = [{
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_tokenId",
                "type": "uint256"
            }
        ],
        "name": "getAttributes",
        "outputs": [
            {
                "internalType": "string",
                "name": "resultAttributes",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "queryString",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }];
exports.SABLIER_ABI = [{ "constant": true, "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "uint256", "name": "", "type": "uint256" }], "name": "relayers", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "sablier", "outputs": [{ "internalType": "contract Sablier", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "relayer", "type": "address" }, { "internalType": "uint256", "name": "salaryId", "type": "uint256" }], "name": "whitelistRelayer", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "relayer", "type": "address" }, { "internalType": "uint256", "name": "salaryId", "type": "uint256" }], "name": "discardRelayer", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "employee", "type": "address" }, { "internalType": "uint256", "name": "salary", "type": "uint256" }, { "internalType": "address", "name": "tokenAddress", "type": "address" }, { "internalType": "uint256", "name": "startTime", "type": "uint256" }, { "internalType": "uint256", "name": "stopTime", "type": "uint256" }, { "internalType": "uint256", "name": "senderSharePercentage", "type": "uint256" }, { "internalType": "uint256", "name": "recipientSharePercentage", "type": "uint256" }], "name": "createCompoundingSalary", "outputs": [{ "internalType": "uint256", "name": "salaryId", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "getHubAddr", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "bytes", "name": "context", "type": "bytes" }], "name": "preRelayedCall", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "uint256", "name": "salaryId", "type": "uint256" }], "name": "getSalary", "outputs": [{ "internalType": "address", "name": "company", "type": "address" }, { "internalType": "address", "name": "employee", "type": "address" }, { "internalType": "uint256", "name": "salary", "type": "uint256" }, { "internalType": "address", "name": "tokenAddress", "type": "address" }, { "internalType": "uint256", "name": "startTime", "type": "uint256" }, { "internalType": "uint256", "name": "stopTime", "type": "uint256" }, { "internalType": "uint256", "name": "remainingBalance", "type": "uint256" }, { "internalType": "uint256", "name": "rate", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "initialize", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "address", "name": "relay", "type": "address" }, { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "bytes", "name": "encodedFunction", "type": "bytes" }, { "internalType": "uint256", "name": "transactionFee", "type": "uint256" }, { "internalType": "uint256", "name": "gasPrice", "type": "uint256" }, { "internalType": "uint256", "name": "gasLimit", "type": "uint256" }, { "internalType": "uint256", "name": "nonce", "type": "uint256" }, { "internalType": "bytes", "name": "approvalData", "type": "bytes" }, { "internalType": "uint256", "name": "", "type": "uint256" }], "name": "acceptRelayedCall", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "bytes", "name": "", "type": "bytes" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "isOwner", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "relayHubVersion", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "ownerAddress", "type": "address" }, { "internalType": "address", "name": "signerAddress", "type": "address" }, { "internalType": "address", "name": "sablierAddress", "type": "address" }], "name": "initialize", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "trustedSigner", "type": "address" }], "name": "initialize", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "uint256", "name": "salaryId", "type": "uint256" }], "name": "cancelSalary", "outputs": [{ "internalType": "bool", "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "employee", "type": "address" }, { "internalType": "uint256", "name": "salary", "type": "uint256" }, { "internalType": "address", "name": "tokenAddress", "type": "address" }, { "internalType": "uint256", "name": "startTime", "type": "uint256" }, { "internalType": "uint256", "name": "stopTime", "type": "uint256" }], "name": "createSalary", "outputs": [{ "internalType": "uint256", "name": "salaryId", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "nextSalaryId", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "bytes", "name": "context", "type": "bytes" }, { "internalType": "bool", "name": "success", "type": "bool" }, { "internalType": "uint256", "name": "actualCharge", "type": "uint256" }, { "internalType": "bytes32", "name": "preRetVal", "type": "bytes32" }], "name": "postRelayedCall", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "uint256", "name": "salaryId", "type": "uint256" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "withdrawFromSalary", "outputs": [{ "internalType": "bool", "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "salaryId", "type": "uint256" }, { "indexed": true, "internalType": "uint256", "name": "streamId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "company", "type": "address" }], "name": "CreateSalary", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "salaryId", "type": "uint256" }, { "indexed": true, "internalType": "uint256", "name": "streamId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "company", "type": "address" }], "name": "WithdrawFromSalary", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "salaryId", "type": "uint256" }, { "indexed": true, "internalType": "uint256", "name": "streamId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "company", "type": "address" }], "name": "CancelSalary", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "oldRelayHub", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newRelayHub", "type": "address" }], "name": "RelayHubChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }];
exports.TCRopstenAbi = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": true, "internalType": "address", "name": "asset", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "string", "name": "memo", "type": "string" }], "name": "Deposit", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "oldVault", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newVault", "type": "address" }, { "indexed": false, "internalType": "address", "name": "asset", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "string", "name": "memo", "type": "string" }], "name": "TransferAllowance", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "vault", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "address", "name": "asset", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "string", "name": "memo", "type": "string" }], "name": "TransferOut", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "oldVault", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newVault", "type": "address" }, { "components": [{ "internalType": "address", "name": "asset", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "indexed": false, "internalType": "struct Router.Coin[]", "name": "coins", "type": "tuple[]" }, { "indexed": false, "internalType": "string", "name": "memo", "type": "string" }], "name": "VaultTransfer", "type": "event" }, { "inputs": [], "name": "RUNE", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address[]", "name": "recipients", "type": "address[]" }, { "components": [{ "internalType": "address", "name": "asset", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "internalType": "struct Router.Coin[]", "name": "coins", "type": "tuple[]" }, { "internalType": "string[]", "name": "memos", "type": "string[]" }], "name": "batchTransferOut", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address payable", "name": "vault", "type": "address" }, { "internalType": "address", "name": "asset", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "string", "name": "memo", "type": "string" }], "name": "deposit", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "router", "type": "address" }, { "internalType": "address payable", "name": "asgard", "type": "address" }, { "components": [{ "internalType": "address", "name": "asset", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "internalType": "struct Router.Coin[]", "name": "coins", "type": "tuple[]" }, { "internalType": "string", "name": "memo", "type": "string" }], "name": "returnVaultAssets", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "router", "type": "address" }, { "internalType": "address", "name": "newVault", "type": "address" }, { "internalType": "address", "name": "asset", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "string", "name": "memo", "type": "string" }], "name": "transferAllowance", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address payable", "name": "to", "type": "address" }, { "internalType": "address", "name": "asset", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "string", "name": "memo", "type": "string" }], "name": "transferOut", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" }], "name": "vaultAllowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }];
exports.ERC20ABI = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "success", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "success", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "success", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }];
exports.AIRDROP_ABI = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "userClaim",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "rewardsEscrowClaim",
                "type": "uint256"
            }
        ],
        "name": "Claimed",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "Claimed",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "MAX_BPS",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "token_",
                "type": "address"
            },
            {
                "internalType": "bytes32",
                "name": "merkleRoot_",
                "type": "bytes32"
            }
        ],
        "name": "__MerkleDistributor_init",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "claimsStart",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "currentRewardRate",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "epochDuration",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "finalEpoch",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "gracePeriod",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
            }
        ],
        "name": "isClaimed",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "merkleRoot",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "rewardReductionPerEpoch",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "rewardsEscrow",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "token",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "token_",
                "type": "address"
            },
            {
                "internalType": "bytes32",
                "name": "merkleRoot_",
                "type": "bytes32"
            },
            {
                "internalType": "uint256",
                "name": "epochDuration_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "rewardReductionPerEpoch_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "claimsStart_",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "gracePeriod_",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "rewardsEscrow_",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "owner_",
                "type": "address"
            }
        ],
        "name": "initialize",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getGracePeriodEnd",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getClaimsStartTime",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getNextEpochStart",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getTimeUntilNextEpoch",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getCurrentEpoch",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getCurrentRewardsRate",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getNextEpochRewardsRate",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "bytes32[]",
                "name": "merkleProof",
                "type": "bytes32[]"
            }
        ],
        "name": "claim",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "recycleExcess",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "duration",
                "type": "uint256"
            }
        ],
        "name": "setGracePeriod",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];
exports.ERC721_ABI = [
    {
        "constant": true,
        "inputs": [
            {
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "ownerOf",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];
//# sourceMappingURL=constant.js.map