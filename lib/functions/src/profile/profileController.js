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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.del = exports.update = exports.getSendbirdToken = exports.get = exports.create = void 0;
var index_1 = require("../index");
/**
 * Create a new profile
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {void}
 * @description - create a new user's profile
 * @example - create(req, res, next)
* */
function create(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    // console displayName from res.locals
                    // eslint-disable-next-line no-console
                    console.log(res.locals.displayName);
                    return [4 /*yield*/, index_1.firestore.collection("profile").doc(res.locals.displayName).set(__assign({}, req.body), {
                            merge: false,
                        })];
                case 1:
                    _a.sent();
                    res.status(200).json({ message: "profile created" });
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    next(err_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.create = create;
/**
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {void}
 * @description - get user's profile
 * @example - get(req, res, next)
 * @throws - profile not found
 *
* */
function get(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var id, result, _a, sendbird_token, rest, err_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    id = req.params.id;
                    return [4 /*yield*/, index_1.firestore.collection("profile").doc(id).get()];
                case 1:
                    result = _b.sent();
                    // check if doc exists
                    if (!result.exists) {
                        throw new Error("profile not found");
                    }
                    _a = result.data(), sendbird_token = _a.sendbird_token, rest = __rest(_a, ["sendbird_token"]);
                    res.status(200).json({ result: rest });
                    return [3 /*break*/, 3];
                case 2:
                    err_2 = _b.sent();
                    next(err_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.get = get;
/**
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {void}
 * @description - get user's sendbird token
 * @example - get(req, res, next)
 * @throws - profile not found
 *
* */
function getSendbirdToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var result, sendbird_token, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, index_1.firestore.collection("profile").doc(res.locals.displayName).get()];
                case 1:
                    result = _a.sent();
                    // check if doc exists
                    if (!result.exists) {
                        throw new Error("profile not found");
                    }
                    sendbird_token = result.data().sendbird_token;
                    res.status(200).json({ result: { sendbird_token: sendbird_token } });
                    return [3 /*break*/, 3];
                case 2:
                    err_3 = _a.sent();
                    next(err_3);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getSendbirdToken = getSendbirdToken;
/**
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {void}
 * @description - update user's profile
 * @example - update(req, res, next)
 * @throws - profile not found
 *
 * */
function update(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    // fetch doc from firestore using id and update it with req.body
                    // eslint-disable-next-line max-len
                    return [4 /*yield*/, index_1.firestore.collection("profile").doc(res.locals.displayName).update(req.body)];
                case 1:
                    // fetch doc from firestore using id and update it with req.body
                    // eslint-disable-next-line max-len
                    _a.sent();
                    res.status(200).json({ message: "profile updated" });
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
exports.update = update;
/**
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {void}
 * @description - delete user's profile
 * @example - del(req, res, next)
 *
 * */
function del(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var err_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    // eslint-disable-next-line max-len
                    return [4 /*yield*/, index_1.firestore.collection("profile").doc(res.locals.displayName).delete()];
                case 1:
                    // eslint-disable-next-line max-len
                    _a.sent();
                    res.status(200).json({ message: "profile deleted" });
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
exports.del = del;
