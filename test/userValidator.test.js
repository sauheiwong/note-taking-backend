import { test, expect, describe } from "@jest/globals";
import { validationResult } from "express-validator";
import userValidator from "../validator/userVailtor.js";

const runUserValidator = async (req) => {
    await userValidator.usernameValidator().run(req)

    return validationResult(req);
}

describe("username validation", () => {
    test("accepts an alphanumeric username", async () => {
        const req = { body: { username: "Tommy123" } };

        const errors = await runUserValidator(req);

        expect(errors.isEmpty()).toBe(true);
    })

    test("rejects an empty username", async () => {
        const req = { body : { username: "" } };

        const errors = await runUserValidator(req);

        const errorMessages = errors.array().map((error) => error.msg)

        expect(errorMessages).toContain("please provide your username");
    })

    test("rejects a username containing an underscore", async () => {
        const req = { body: { username: "Tommy_123" } };

        const errors = await runUserValidator(req);

        const errorMessages = errors.array().map((error) => error.msg)

        expect(errorMessages).toContain("please provide username with letters and numbers only")
    })

    test("rejects a request without a body", async () => {
        const req = {};

        const errors = await runUserValidator(req);

        const errorMessages = errors.array().map((error) => error.msg)

        expect(errorMessages).toContain("please provide your username");
        expect(errorMessages).toContain("please provide username with letters and numbers only")
    })
})
