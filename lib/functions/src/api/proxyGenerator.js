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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProxyGenerator = void 0;
var moralis_1 = __importDefault(require("moralis"));
var common_evm_utils_1 = require("moralis/common-evm-utils");
var express_1 = __importDefault(require("express"));
var axios_1 = __importDefault(require("axios"));
var errorHandler_1 = require("../middlewares/errorHandler");
// eslint-disable-next-line max-len
var api_utils_1 = require("@moralisweb3/api-utils");
// eslint-disable-next-line new-cap
var proxyRouter = express_1.default.Router();
// eslint-disable-next-line require-jsdoc
var ProxyGenerator = /** @class */ (function () {
    // eslint-disable-next-line require-jsdoc
    function ProxyGenerator(api, options) {
        this.options = options;
        this.api = api;
    }
    // eslint-disable-next-line require-jsdoc
    ProxyGenerator.prototype.getRouter = function () {
        var _this = this;
        var descriptors;
        var baseUrl;
        switch (this.api) {
            case "evm":
                descriptors = common_evm_utils_1.operations.map(api_utils_1.convertOperationToDescriptor);
                baseUrl = moralis_1.default.EvmApi.baseUrl;
                break;
            default:
                throw new Error("invalid api");
        }
        var _loop_1 = function (descriptor) {
            // eslint-disable-next-line max-len
            var urlPattern = descriptor.urlPattern.replace(/\{/g, ":").replace(/\}/g, "");
            // eslint-disable-next-line max-len
            proxyRouter.route(urlPattern)[descriptor.method](function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
                var url, param, body, params, response, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            url = descriptor.urlPattern;
                            for (param in req.params) {
                                if (Object.prototype.hasOwnProperty.call(req.params, param)) {
                                    url = url.replace("{".concat(param, "}"), req.params[param]);
                                }
                            }
                            body = Object.keys(req.body).reduce(function (result, key) {
                                var _a;
                                if (descriptor.bodyParamNames.includes(key)) {
                                    return __assign(__assign({}, result), (_a = {}, _a[key] = req.body[key], _a));
                                }
                                return result;
                            }, {});
                            params = Object.keys(req.body).reduce(function (result, key) {
                                var _a;
                                // eslint-disable-next-line max-len
                                if (!req.body[key] || key in body || descriptor.urlPatternParamNames.includes(key)) {
                                    return result;
                                }
                                return __assign(__assign({}, result), (_a = {}, _a[key] = req.body[key], _a));
                            }, {});
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, axios_1.default.request({
                                    method: descriptor.method,
                                    params: __assign(__assign({}, params), req.query),
                                    url: "".concat(baseUrl).concat(url),
                                    data: body,
                                    headers: {
                                        "Content-Type": "application/json",
                                        "x-api-key": this.options.apiKey,
                                    },
                                })];
                        case 2:
                            response = _a.sent();
                            return [2 /*return*/, res.send(response.data)];
                        case 3:
                            error_1 = _a.sent();
                            return [2 /*return*/, (0, errorHandler_1.errorHandler)(error_1, req, res, next)];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
        };
        for (var _i = 0, descriptors_1 = descriptors; _i < descriptors_1.length; _i++) {
            var descriptor = descriptors_1[_i];
            _loop_1(descriptor);
        }
        return proxyRouter;
    };
    return ProxyGenerator;
}());
exports.ProxyGenerator = ProxyGenerator;
