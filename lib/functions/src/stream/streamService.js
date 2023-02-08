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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
exports.setSettings = exports.getAllAddress = exports.removeAddress = exports.addAddress = exports.updateStream = exports.deleteStream = exports.getStreams = exports.addStream = void 0;
var moralis_1 = __importDefault(require("moralis"));
var common_evm_utils_1 = require("moralis/common-evm-utils");
// valid abi of the event
// eslint-disable-next-line camelcase
var NFT_transfer_ABI = [{
        "anonymous": false,
        "inputs": [
            { "indexed": true, "name": "from", "type": "address" },
            { "indexed": true, "name": "to", "type": "address" },
            { "indexed": true, "name": "tokenId", "type": "uint256" },
        ],
        "name": "transfer",
        "type": "event",
    }];
var DESCRIPTION = "monitor all NFT transfers";
var TAG = "NFT_transfers";
var CHAINIDS = [common_evm_utils_1.EvmChain.ETHEREUM];
// eslint-disable-next-line require-jsdoc
function addStream(options) {
    return __awaiter(this, void 0, void 0, function () {
        var networkType, webhookUrl, triggers, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    networkType = options.networkType, webhookUrl = options.webhookUrl, triggers = options.triggers;
                    return [4 /*yield*/, moralis_1.default.Streams.add({
                            networkType: networkType,
                            webhookUrl: webhookUrl,
                            chains: CHAINIDS,
                            tag: TAG,
                            description: DESCRIPTION,
                            // eslint-disable-next-line camelcase
                            abi: NFT_transfer_ABI,
                            includeContractLogs: true,
                            allAddresses: true,
                            topic0: ["transfer(address,address,uint256)"],
                            advancedOptions: [
                                {
                                    topic0: "transfer(address,address,uint256)",
                                },
                            ],
                            triggers: triggers,
                        })];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result.raw];
            }
        });
    });
}
exports.addStream = addStream;
// eslint-disable-next-line require-jsdoc
function getStreams() {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, moralis_1.default.Streams.getAll({
                        limit: 20,
                        networkType: "evm",
                    })];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result.raw];
            }
        });
    });
}
exports.getStreams = getStreams;
// eslint-disable-next-line require-jsdoc
function deleteStream(id) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, moralis_1.default.Streams.delete({
                        id: id,
                        networkType: "evm",
                    })];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result.raw];
            }
        });
    });
}
exports.deleteStream = deleteStream;
// eslint-disable-next-line require-jsdoc
function updateStream(id, options) {
    return __awaiter(this, void 0, void 0, function () {
        var networkType, webhookUrl, triggers, users, filters, user, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    networkType = options.networkType, webhookUrl = options.webhookUrl, triggers = options.triggers;
                    users = [
                        "0x15d51e51CAF5585a40cB965080098Bfb68AF3336",
                        "0x15F7320adb990020956D29Edb6ba17f3D468001e",
                        "0xEd034B287ea77A14970f1C0c8682a80a9468dBB3",
                        "0x405020c797A64f155c9966C88e5C677B2dbca5AB",
                        "0x2d368d6A84B791D634E6f9f81908D884849fd43d",
                    ];
                    filters = [];
                    for (user in users) {
                        if (!user) {
                            continue;
                        }
                        // @ts-ignore
                        filters.push(["from", user]);
                        // @ts-ignore
                        filters.push(["to", user]);
                    }
                    return [4 /*yield*/, moralis_1.default.Streams.update({
                            id: id,
                            networkType: networkType,
                            webhookUrl: webhookUrl,
                            chains: CHAINIDS,
                            tag: TAG,
                            description: DESCRIPTION,
                            // eslint-disable-next-line camelcase
                            abi: NFT_transfer_ABI,
                            includeContractLogs: true,
                            allAddresses: true,
                            topic0: ["transfer(address,address,uint256)"],
                            advancedOptions: [
                                {
                                    topic0: "transfer(address,address,uint256)",
                                    filter: { "or": [{ "in": ["from", users] }, { "in": ["to", users] }] },
                                },
                            ],
                            triggers: triggers,
                        })];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result.raw];
            }
        });
    });
}
exports.updateStream = updateStream;
// eslint-disable-next-line require-jsdoc
function addAddress(id, address) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, moralis_1.default.Streams.addAddress({
                        id: id,
                        networkType: "evm",
                        address: [address],
                    })];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result.raw];
            }
        });
    });
}
exports.addAddress = addAddress;
// eslint-disable-next-line require-jsdoc
function removeAddress(id, address) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, moralis_1.default.Streams.deleteAddress({
                        id: id,
                        networkType: "evm",
                        address: address,
                    })];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result.raw];
            }
        });
    });
}
exports.removeAddress = removeAddress;
// eslint-disable-next-line require-jsdoc
function getAllAddress(id, limit) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, moralis_1.default.Streams.getAddresses({
                        id: id,
                        networkType: "evm",
                        limit: limit || 100,
                    })];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result.raw];
            }
        });
    });
}
exports.getAllAddress = getAllAddress;
// eslint-disable-next-line require-jsdoc
function setSettings(_a) {
    var region = _a.region;
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, moralis_1.default.Streams.setSettings({
                        region: region,
                    })];
                case 1:
                    result = _b.sent();
                    return [2 /*return*/, result.raw];
            }
        });
    });
}
exports.setSettings = setSettings;
