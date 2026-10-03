import { test, expect, describe } from "@jest/globals";
import { validationResult } from "express-validator";
import userValidator from "../validator/userVailtor.js";

const runUsernameValidator = async (req) => {
    await userValidator.usernameValidator().run(req)

    return validationResult(req);
}

const runPasswordValidator = async (req) => {
    await userValidator.passwordValidator().run(req)

    return validationResult(req)
}

describe("password validation", () => {
    test("accepts a not-empty password", async () => {
        const req = { body: { password: "secret123"} };

        const errors = await runPasswordValidator(req);

        expect(errors.isEmpty()).toBe(true);
    })

    test("reject an empty password", async () => {
        const req = { body: { password: ""} };

        const errors = await runPasswordValidator(req);

        const errorMessages = errors.array().map((error) => error.msg);

        expect(errorMessages).toContain("please provide your password");
    })

    test("reject a missing password", async () => {
        const req = { body: {} };

        const errors = await runPasswordValidator(req);

        const errorMessages = errors.array().map((error) => error.msg);

        expect(errorMessages).toContain("please provide your password");
    })
})

describe("username validation", () => {
    test("accepts an alphanumeric username", async () => {
        const req = { body: { username: "Tommy123" } };

        const errors = await runUsernameValidator(req);

        expect(errors.isEmpty()).toBe(true);
    })

    test("rejects an empty username", async () => {
        const req = { body : { username: "" } };

        const errors = await runUsernameValidator(req);

        const errorMessages = errors.array().map((error) => error.msg)

        expect(errorMessages).toContain("please provide your username");
    })

    test("rejects a username containing an underscore", async () => {
        const req = { body: { username: "Tommy_123" } };

        const errors = await runUsernameValidator(req);

        const errorMessages = errors.array().map((error) => error.msg)

        expect(errorMessages).toContain("please provide username with letters and numbers only")
    })

    test("rejects a request with an empty body", async () => {
        const req = { body: {} };

        const errors = await runUsernameValidator(req);

        const errorMessages = errors.array().map((error) => error.msg)

        expect(errorMessages).toContain("please provide your username");
        expect(errorMessages).toContain("please provide username with letters and numbers only")
    })
})
