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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllAddr = exports.removeAddr = exports.addAddr = exports.del = exports.update = exports.getAll = exports.create = void 0;
// eslint-disable-next-line max-len
var streamService_1 = require("./streamService");
function create(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, webhookUrl, triggers, result, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    _a = req.body, webhookUrl = _a.webhookUrl, triggers = _a.triggers;
                    return [4 /*yield*/, (0, streamService_1.addStream)({
                            networkType: "evm",
                            webhookUrl: webhookUrl,
                            triggers: triggers,
                        })];
                case 1:
                    result = _b.sent();
                    res.status(200).json({ result: result });
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _b.sent();
                    next(err_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.create = create;
function getAll(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var message, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, streamService_1.getStreams)()];
                case 1:
                    message = _a.sent();
                    res.status(200).json({ message: message });
                    return [3 /*break*/, 3];
                case 2:
                    err_2 = _a.sent();
                    next(err_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getAll = getAll;
function update(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, webhookUrl, triggers, id, message, err_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    _a = req.body, webhookUrl = _a.webhookUrl, triggers = _a.triggers;
                    id = req.params.id;
                    return [4 /*yield*/, (0, streamService_1.updateStream)(id, {
                            networkType: "evm",
                            webhookUrl: webhookUrl,
                            triggers: triggers,
                        })];
                case 1:
                    message = _b.sent();
                    res.status(200).json({ message: message });
                    return [3 /*break*/, 3];
                case 2:
                    err_3 = _b.sent();
                    next(err_3);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.update = update;
function del(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var id, message, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    id = req.params.id;
                    return [4 /*yield*/, (0, streamService_1.deleteStream)(id)];
                case 1:
                    message = _a.sent();
                    res.status(200).json({ message: message });
                    return [3 /*break*/, 3];
                case 2:
                    err_4 = _a.sent();
                    next(err_4);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.del = del;
function addAddr(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var id, address, result, err_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    id = req.params.id;
                    address = req.body.address;
                    return [4 /*yield*/, (0, streamService_1.addAddress)(id, address)];
                case 1:
                    result = _a.sent();
                    res.status(200).json({ result: result });
                    return [3 /*break*/, 3];
                case 2:
                    err_5 = _a.sent();
                    next(err_5);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.addAddr = addAddr;
function removeAddr(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var id, address, result, err_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    id = req.params.id;
                    address = req.body.address;
                    return [4 /*yield*/, (0, streamService_1.removeAddress)(id, address)];
                case 1:
                    result = _a.sent();
                    res.status(200).json({ result: result });
                    return [3 /*break*/, 3];
                case 2:
                    err_6 = _a.sent();
                    next(err_6);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.removeAddr = removeAddr;
function getAllAddr(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var id, result, err_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    id = req.params.id;
                    return [4 /*yield*/, (0, streamService_1.getAllAddress)(id)];
                case 1:
                    result = _a.sent();
                    res.status(200).json({ result: result });
                    return [3 /*break*/, 3];
                case 2:
                    err_7 = _a.sent();
                    next(err_7);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getAllAddr = getAllAddr;
