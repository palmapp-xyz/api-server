/*
// write profile test here using firebase-functions-test
import { describe, it, beforeAll } from "mocha";
// @ts-ignore
const test = require("firebase-functions-test")();

const myFunctions = require("../index");

describe("Profile", () => {
    let wrapped;

    beforeAll(() => {
        wrapped = test.wrap(myFunctions.v1);
    });

    afterAll(() => {
        test.cleanup();
    });

    it("should return a 200 response", async () => {
        const req = {
        method: "GET",
        path: "/profile/get/:id",
            param: {
                id: "123"
            }
        };

        const res = await wrapped(req);

        expect(res.status).toBe(200);
    });

    it("should return a 404 response", async () => {
        const req = {
        method: "GET",
        path: "/foo",
        };

        const res = await wrapped(req);

        expect(res.status).toBe(404);
    }
}
*/
export default null;
