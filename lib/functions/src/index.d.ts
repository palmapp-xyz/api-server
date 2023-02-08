import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import expressJSDocSwagger from "express-jsdoc-swagger";
export declare const firestore: admin.firestore.Firestore;
export declare const app: import("express-serve-static-core").Express;
declare const _default: {
    app: import("express-serve-static-core").Express;
    expressJSDocSwagger: typeof expressJSDocSwagger;
};
export default _default;
export declare const v1: functions.HttpsFunction;
