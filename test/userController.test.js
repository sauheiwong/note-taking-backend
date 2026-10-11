import { describe, test, expect, jest, afterEach } from "@jest/globals";
import userController from "../controllers/userController.js";
import userHandler from "../handlers/userHandler.js";
import userValidator from "../validator/userVailtor.js"

const refReq = {
    body : {
        username: "Tommy",
        password: "secret123"
    },
    session: {}
}

const fakeUser = {
    _id: "user-123",
    username: "Tommy"
}

describe("user controller login", () => {

    afterEach(() => {
        jest.restoreAllMocks()
    })

    test("sets the session and redirects when the credentials are correct", async () => {
        const req = {
            body: { ...refReq.body },
            session: {}
        }
        const res = {
            redirect: jest.fn()
        }

        const loginSpy = jest.spyOn(userHandler, "loginUser").mockResolvedValue(fakeUser)

        await userController.login(req, res); 

        expect(loginSpy).toHaveBeenCalledWith(req.body.username.toLowerCase(), req.body.password)

        expect(req.session.userId).toBe(fakeUser._id)
        expect(req.session.username).toBe(fakeUser.username)
        expect(req.session.loggedIn).toBe(true)

        expect(res.redirect).toHaveBeenCalledWith("/protected/home")
    })

    test("renders the login page without setting the session when login fails", async () => {
        const req = {
            body: { ...refReq.body },
            session: {}
        }
        const res = {
            redirect: jest.fn(),
            render: jest.fn()
        }
        const loginError = new Error("username or password are incorrect")

        jest.spyOn(userHandler, "loginUser").mockRejectedValue(loginError)

        await userController.login(req, res)

        expect(res.redirect).not.toHaveBeenCalled()
        expect(res.render).toHaveBeenCalledWith("login", { title: "Login", error: loginError })
        expect(req.session).toEqual({})
    })

    test("returns 400 with validation errors when the username is invalid", async () => {
        const req = {
            body: { username: "Tommy_123", password: "screct123" },
            session: {}
        }
        const res = {
            redirect: jest.fn(),
            render: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        }

        const loginSpy = jest.spyOn(userHandler, "loginUser").mockResolvedValue(fakeUser)

        await userValidator.usernameValidator().run(req)
        await userValidator.passwordValidator().run(req)

        await userController.login(req, res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                errors: expect.arrayContaining([
                    expect.objectContaining({
                        path: "username",
                        msg: "please provide username with letters and numbers only"
                    })
                ])
            })
        )

        expect(loginSpy).not.toHaveBeenCalled()
        expect(req.session).toEqual({})
        expect(res.redirect).not.toHaveBeenCalled()
        expect(res.render).not.toHaveBeenCalled()
    })

    test("returns 400 with validation errors when the password is empty", async () => {
        const req = {
            body: { username: "Tommy123", password: "" },
            session: {}
        }
        const res = {
            redirect: jest.fn(),
            render: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        }

        const loginSpy = jest.spyOn(userHandler, "loginUser").mockResolvedValue(fakeUser)

        await userValidator.usernameValidator().run(req)
        await userValidator.passwordValidator().run(req)

        await userController.login(req, res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                errors: expect.arrayContaining([
                    expect.objectContaining({
                        path: "password",
                        msg: "please provide your password"
                    })
                ])
            })
        )

        expect(loginSpy).not.toHaveBeenCalled()
        expect(req.session).toEqual({})
        expect(res.redirect).not.toHaveBeenCalled()
        expect(res.render).not.toHaveBeenCalled()
    })
})

describe("user controller register", () => {
    afterEach(() => {
        jest.restoreAllMocks()
    })

    test("redirects to home page when a valid username and password", async () => {
        const req = {
            body: {...refReq.body}
        }

        const res = {
            redirect: jest.fn(),
            render: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        const registerSpy = jest.spyOn(userHandler, "registerUser").mockResolvedValue(fakeUser)

        await userController.signUp(req, res)

        expect(registerSpy).toHaveBeenCalledTimes(1)
        expect(registerSpy).toHaveBeenCalledWith(req.body.username.toLocaleLowerCase(), req.body.password)
        expect(res.redirect).toHaveBeenCalledWith("/")

        expect(res.render).not.toHaveBeenCalled()
        expect(res.status).not.toHaveBeenCalled()
        expect(res.json).not.toHaveBeenCalled()
    })

    test("redirects to home page when a valid lower case username and password", async () => {
        const req = {
            body: {...refReq.body, username: refReq.body.username.toLocaleLowerCase()}
        }

        const res = {
            redirect: jest.fn(),
            render: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        const registerSpy = jest.spyOn(userHandler, "registerUser").mockResolvedValue(fakeUser)

        await userController.signUp(req, res)

        expect(registerSpy).toHaveBeenCalledTimes(1)
        expect(registerSpy).toHaveBeenCalledWith(req.body.username.toLocaleLowerCase(), req.body.password)
        expect(res.redirect).toHaveBeenCalledWith("/")

        expect(res.render).not.toHaveBeenCalled()
        expect(res.status).not.toHaveBeenCalled()
        expect(res.json).not.toHaveBeenCalled()
    })

    test("renders the sign-up page when sign-up fails", async () => {
        const req = {
            body: {...refReq.body}
        }

        const res = {
            redirect: jest.fn(),
            render: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        const registerError = new Error("fails to register")

        const registerSpy = jest.spyOn(userHandler, "registerUser").mockRejectedValue(registerError)

        await userController.signUp(req, res)

        expect(registerSpy).toHaveBeenCalledTimes(1)
        expect(registerSpy).toHaveBeenCalledWith(req.body.username.toLocaleLowerCase(), req.body.password)
        expect(res.redirect).not.toHaveBeenCalled()
        expect(res.render).toHaveBeenCalledWith("signup", {
            title: "Sign Up",
            error: "fails to register"
        })

        expect(res.status).not.toHaveBeenCalled()
        expect(res.json).not.toHaveBeenCalled()

    })

    test("returns 400 with validation erros when username is invalid", async () => {
        const req = {
            body: {...refReq.body, username: "Tommy_123"}
        }

        const res = {
            redirect: jest.fn(),
            render: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        const registerSpy = jest.spyOn(userHandler, "registerUser").mockResolvedValue(fakeUser)

        await userValidator.usernameValidator().run(req)
        await userValidator.passwordValidator().run(req)

        await userController.signUp(req, res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                errors: expect.arrayContaining([
                    expect.objectContaining({
                        path: "username",
                        msg: "please provide username with letters and numbers only"
                    })
                ])
            })
        )
        
        expect(registerSpy).not.toHaveBeenCalled()
        expect(res.redirect).not.toHaveBeenCalled()
        expect(res.render).not.toHaveBeenCalled()
    })

    test("returns 400 with validation erros when password is empty", async () => {
        const req = {
            body: {...refReq.body, password: ""}
        }

        const res = {
            redirect: jest.fn(),
            render: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        const registerSpy = jest.spyOn(userHandler, "registerUser").mockResolvedValue(fakeUser)

        await userValidator.usernameValidator().run(req)
        await userValidator.passwordValidator().run(req)

        await userController.signUp(req, res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                errors: expect.arrayContaining([
                    expect.objectContaining({
                        path: "password",
                        msg: "please provide your password"
                    })
                ])
            })
        )
        
        expect(registerSpy).not.toHaveBeenCalled()
        expect(res.redirect).not.toHaveBeenCalled()
        expect(res.render).not.toHaveBeenCalled()
    })
})