import { describe, test, expect, jest, afterEach } from "@jest/globals";
import userHandler from "../handlers/userHandler";
import User from "../models/userModel";
import bcrypt, { hash } from "bcryptjs";

const newUserInfo = {
    username: "Tommy",
    password: "secret123"
}

const userInfo = newUserInfo

describe("user registration", () => {

    afterEach(() => {
        jest.restoreAllMocks()
    })

    test("hashes the password before saving the user", async () => {
        const { username, password } = newUserInfo
        let passwordAtSave;

        // Arrange: pretend that the username is available.
        const findOneSpy = jest.spyOn(User, "findOne").mockResolvedValue(null)

        const saveSpy = jest.spyOn(User.prototype, "save").mockImplementation(function () {
            passwordAtSave = this.password
            return Promise.resolve(this)
        })

        await userHandler.registerUser(username, password)

        const isPasswordMatch = await bcrypt.compare(password, passwordAtSave);

        expect(findOneSpy).toHaveBeenCalledWith({ username })
        expect(passwordAtSave).not.toBe(password)
        expect(isPasswordMatch).toBe(true);
        expect(saveSpy).toHaveBeenCalledTimes(1);
    })

    test("rejects an existing username", async () => {
        const { username, password } = newUserInfo

        jest.spyOn(User, "findOne").mockResolvedValue({ username })

        const saveSpy = jest.spyOn(User.prototype, "save").mockImplementation(function () {
            return Promise.resolve(this)
        })

        await expect(
            userHandler.registerUser(username, password)
        ).rejects.toThrow("username has been used");

        expect(saveSpy).not.toHaveBeenCalled()
    })

    test("propagates the error when saving the user fails", async () => {
        const { username, password } = newUserInfo
        const saveError = new Error("Database write failed")

        jest.spyOn(User, "findOne").mockResolvedValue(null);

        jest.spyOn(User.prototype, "save").
        mockRejectedValue(saveError)

        await expect(
            userHandler.registerUser(username, password)
        ).rejects.toBe(saveError)
    })

    test("propagates the error when the user lookup fails", async () => {
        const { username, password } = newUserInfo
        const findError = new Error("Fail to connect to the database")

        jest.spyOn(User, "findOne").mockRejectedValue(findError)

        const saveSpy = jest.spyOn(User.prototype, "save").mockImplementation(function () {
            return Promise.resolve(this)
        })

        await expect(
            userHandler.registerUser(username, password)
        ).rejects.toBe(findError)

        expect(saveSpy).not.toHaveBeenCalled()
    })
})

describe("user login", () => {

    afterEach(() => {
        jest.restoreAllMocks()
    })

    test("returns the user when the credentials are correct", async () => {
        const { username, password } = userInfo
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        const fakeUser = { username, password: hashedPassword }

        const findOneSpy = jest.spyOn(User, "findOne").mockResolvedValue(fakeUser)

        const returnUser = await userHandler.loginUser(username, password);

        expect(findOneSpy).toHaveBeenCalledTimes(1)
        expect(returnUser).toBe(fakeUser)
    })

    test("rejects login when the username is not registered", async () => {
        const wrongUsername = "Alex";
        const alexPassword = "secret123"

        const findOneSpy = jest.spyOn(User, "findOne").mockResolvedValue(null)

        await expect(
            userHandler.loginUser(wrongUsername, alexPassword)
        ).rejects.toThrow("username or password are wrong");
        expect(findOneSpy).toHaveBeenCalledTimes(1)
    })

    test("rejects login when the password is incorrect", async () => {
        const { username, password } = userInfo
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        const wrongPassword = "wrongPassword"

        const findOneSpy = jest.spyOn(User, "findOne").mockResolvedValue({ username, password: hashedPassword })

        await expect(
            userHandler.loginUser(username, wrongPassword)
        ).rejects.toThrow("username or password are wrong");
        expect(findOneSpy).toHaveBeenCalledTimes(1)
    })

    test("propagates the error when the user lookup fails", async () => {
        const { username, password } = userInfo
        const findOneError = new Error("Failed to connect to the database")

        const findOneSpy = jest.spyOn(User, "findOne").mockRejectedValue(findOneError)

        await expect(
            userHandler.loginUser(username, password)
        ).rejects.toBe(findOneError)
        expect(findOneSpy).toHaveBeenCalledTimes(1)
    })
})