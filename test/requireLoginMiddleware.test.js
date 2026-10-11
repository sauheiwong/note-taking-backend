import { describe, test, expect, jest, afterEach } from "@jest/globals"
import requireLoginMiddleware from "../middleware/requireLogin"

describe("middleware require login", () => {

    test("calls next when the user is logged in", () => {
        const req = { session: { loggedIn: true } }

        const res = { render: jest.fn() }

        const next = jest.fn()

        requireLoginMiddleware.requireLogin(req, res, next)

        expect(next).toHaveBeenCalledTimes(1)

        expect(res.render).not.toHaveBeenCalled()
    })

    test("renders the login page when the user has not logged in", () => {
        const req = { session: { loggedIn: false }}
        const res = { render: jest.fn() }
        const next = jest.fn()

        requireLoginMiddleware.requireLogin(req, res, next)

        expect(res.render).toHaveBeenCalledWith(
            "login",
            {
                title: "Login",
                error: {
                    message: "please login first"
                }
            }
        )
        expect(res.render).toHaveBeenCalledTimes(1)

        expect(next).not.toHaveBeenCalled()

    })

        test("renders the login page when the request does not have a session", () => {
        const req = {}
        const res = { render: jest.fn() }
        const next = jest.fn()

        requireLoginMiddleware.requireLogin(req, res, next)

        expect(res.render).toHaveBeenCalledWith(
            "login",
            {
                title: "Login",
                error: {
                    message: "please login first"
                }
            }
        )
        expect(res.render).toHaveBeenCalledTimes(1)

        expect(next).not.toHaveBeenCalled()

    })
})