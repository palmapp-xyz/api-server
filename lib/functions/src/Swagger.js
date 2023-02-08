"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSwagger = void 0;
var express_jsdoc_swagger_1 = __importDefault(require("express-jsdoc-swagger"));
var fs_1 = require("fs");
var options = {
    info: {
        version: "1.0.0",
        title: "Oedi API",
        description: "Oedi API powered by Firebase Functions and Moralis, base_url: https://us-central1-oedi-a1953.cloudfunctions.net/api ",
    },
    security: {
        JWT: {
            type: "http",
            scheme: "bearer",
        },
    },
    // Base directory which we use to locate your JSDOC files
    baseDir: __dirname,
    // eslint-disable-next-line max-len
    // Glob pattern to find your jsdoc files (multiple patterns can be added in an array)
    // eslint-disable-next-line max-len
    filesPattern: ["./stream/streamRouter.ts", "./apiRouter.ts", "./profile/profileRouter.ts", "./swagger-auth.ts"],
    exposeSwaggerUI: true,
};
function getSwagger(app) {
    var eventEmitter = (0, express_jsdoc_swagger_1.default)(app)(options);
    eventEmitter.on("finish", function (swaggerObject) {
        (0, fs_1.writeFileSync)("./swagger.json", JSON.stringify(swaggerObject));
    });
}
exports.getSwagger = getSwagger;
