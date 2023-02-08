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
exports.isValidProfile = void 0;
/**
    * @param {Request} req - Express request object
    * @param {Response} res - Express response object
    * @param {Function} next - Express next middleware function
    * @return {void}
    * @description - validate body of profile creation request
    * @example - validateBody(req, res, next)
    * @throws - invalid body, minimum 6 keys are required
    * @throws - nft_image_url is required
    * @throws - nft_contract_addr is required
    * @throws - nft_tokenId is required
    * @throws - bio is required
    * @throws - user_name is required
    * @throws - sendbird_token is required
    * @throws - invalid token
* */
// eslint-disable-next-line complexity
function isValidProfile(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, nft_image_url, nft_contract_addr, nft_tokenId, bio, user_name, sendbird_token;
        return __generator(this, function (_b) {
            try {
                _a = req.body, nft_image_url = _a.nft_image_url, nft_contract_addr = _a.nft_contract_addr, nft_tokenId = _a.nft_tokenId, bio = _a.bio, user_name = _a.user_name, sendbird_token = _a.sendbird_token;
                // check: body should be defined & minimum 6 keys are required
                if (!req.body || Object.keys(req.body).length < 6) {
                    throw new Error("invalid body, minimum 6 keys are required");
                }
                // eslint-disable-next-line max-len
                // check: individually check that each key defined above should be present in body
                if (!nft_image_url) {
                    throw new Error("nft_image_url is required");
                }
                if (!nft_contract_addr) {
                    throw new Error("nft_contract_addr is required");
                }
                if (!nft_tokenId) {
                    throw new Error("nft_tokenId is required");
                }
                if (!bio) {
                    throw new Error("bio is required");
                }
                if (!user_name) {
                    throw new Error("user_name is required");
                }
                if (!sendbird_token) {
                    throw new Error("sendbird_token is required");
                }
                next();
            }
            catch (err) {
                next(err);
            }
            return [2 /*return*/];
        });
    });
}
exports.isValidProfile = isValidProfile;
