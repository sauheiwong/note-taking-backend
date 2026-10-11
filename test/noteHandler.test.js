import { describe, test, expect, jest, afterEach } from "@jest/globals";
import noteHandler from "../handlers/noteHandler.js"
import Note from "../models/noteModel.js"
import mongoose from "mongoose";
import myError from "../function/error.js"

describe("note seach", () => {

    afterEach(() => jest.restoreAllMocks())

    const userId = "user-123"

    test("returns a note array which are owned by user", async () => {
        const fakeNoteArray = [
            {
                _id: "id-123",
                username: "Tommy",
                title: "note title",
                updateAt: "2026-10-06 210000"
            },
            {
                _id: "id-321",
                username: "Tommy",
                title: "note title 2",
                updateAt: "2026-10-06 213000"
            },
        ]

        const populateFn = jest.fn().mockResolvedValue(fakeNoteArray)

        const noteFindSpy = jest.spyOn(Note, "find").mockReturnValue({
            populate: populateFn
        })

        const noteArray = await noteHandler.noteSeach({}, userId)

        expect(noteFindSpy).toHaveBeenCalledTimes(1)
        expect(noteFindSpy).toHaveBeenCalledWith({ owner: userId }, "_id owner title updatedAt")
        expect(populateFn).toHaveBeenCalledTimes(1)
        expect(populateFn).toHaveBeenCalledWith("owner", "username")

        expect(noteArray).toEqual(fakeNoteArray)
    })

    test("returns a note array which are owned by user and match the title", async () => {
        const title = "note title"

        const fakeNoteArray = [
            {
                _id: "id-123",
                username: "Tommy",
                title: "note title",
                updateAt: "2026-10-06 210000"
            },
            {
                _id: "id-321",
                username: "Tommy",
                title: "note title 2",
                updateAt: "2026-10-06 213000"
            },
        ]

        const populateFn = jest.fn().mockResolvedValue(fakeNoteArray)

        const noteFindSpy = jest.spyOn(Note, "find").mockReturnValue({
            populate: populateFn
        })

        const noteArray = await noteHandler.noteSeach({ title }, userId)

        expect(noteFindSpy).toHaveBeenCalledTimes(1)
        expect(noteFindSpy).toHaveBeenCalledWith({ owner: userId, title: { $regex: title, $options: "i" } }, "_id owner title updatedAt")
        expect(populateFn).toHaveBeenCalledTimes(1)
        expect(populateFn).toHaveBeenCalledWith("owner", "username")

        expect(noteArray).toEqual(fakeNoteArray)
    })

    test("propagates the error when the note lookup fails", async () => {
        const findError = new Error("Fail to connect the database")

        const noteFindSpy = jest.spyOn(Note, "find").mockImplementation(() => { throw findError })

        await expect(
            noteHandler.noteSeach({}, userId)
        ).rejects.toBe(findError)

        expect(noteFindSpy).toHaveBeenCalledTimes(1)
    })
})

describe("note seach by Id", () => {
    afterEach(() => jest.restoreAllMocks())

    const noteId = "note-123"
    const userId = "user-123"

    test("returns a note with a specify note id", async () => {

        const isValidSpy = jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true)

        const hasViewPermissionFn = jest.fn().mockReturnValue(true)

        const fakeNote = {
            _id: "id-123",
            username: "Tommy",
            title: "note title",
            updateAt: "2026-10-06 210000",
            owner: { equals: hasViewPermissionFn }
        }

        const populateFn = jest.fn().mockResolvedValue(fakeNote)

        const noteFindByIdSpy = jest.spyOn(Note, "findById").mockReturnValue({ populate: populateFn })

        const note = await noteHandler.noteSeachById(noteId, userId)

        expect(isValidSpy).toHaveBeenCalledTimes(1)
        expect(isValidSpy).toHaveBeenCalledWith(noteId)
        expect(noteFindByIdSpy).toHaveBeenCalledTimes(1)
        expect(noteFindByIdSpy).toHaveBeenCalledWith(noteId, { __v: 0 })
        expect(populateFn).toHaveBeenCalledWith("owner", "username")
        expect(hasViewPermissionFn).toHaveBeenCalledWith(userId)
        expect(note).toEqual(fakeNote)
    })

    test("throws an 400 error when the note id is invalid", async () => {
        const isValidSpy = jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(false)

        const invalidNoteIdError = {
            message: "Invalid id",
            statusCode: 400
        }

        const invalidNoteIdSpy = jest.spyOn(myError, "errorStatus")

        const hasViewPermissionFn = jest.fn().mockReturnValue(true)

        const fakeNote = {
            _id: "id-123",
            username: "Tommy",
            title: "note title",
            updateAt: "2026-10-06 210000",
            owner: { equals: hasViewPermissionFn }
        }

        const populateFn = jest.fn().mockResolvedValue(fakeNote)

        const noteFindByIdSpy = jest.spyOn(Note, "findById").mockReturnValue({ populate: populateFn })

        await expect(
            noteHandler.noteSeachById(noteId, userId)
        ).rejects.toMatchObject(invalidNoteIdError)

        expect(isValidSpy).toHaveBeenCalledTimes(1)
        expect(isValidSpy).toHaveBeenCalledWith(noteId)
        expect(invalidNoteIdSpy).toHaveBeenCalledTimes(1)
        expect(invalidNoteIdSpy).toHaveBeenCalledWith("Invalid id", 400)

        expect(noteFindByIdSpy).toHaveBeenCalledTimes(0)
        expect(populateFn).toHaveBeenCalledTimes(0)
        expect(hasViewPermissionFn).toHaveBeenCalledTimes(0)
    })

    test("throws an 404 error when the note is not found", async () => {
        const isValidSpy = jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true)

        const noteNotFoundError = {
            message: "note not found",
            statusCode: 404
        }

        const noteNotFoundErrorSpy = jest.spyOn(myError, "errorStatus")

        const fakeNote = null

        const populateFn = jest.fn().mockResolvedValue(fakeNote)

        const noteFindByIdSpy = jest.spyOn(Note, "findById").mockReturnValue({ populate: populateFn })

        await expect(
            noteHandler.noteSeachById(noteId, userId)
        ).rejects.toMatchObject(noteNotFoundError)

        expect(isValidSpy).toHaveBeenCalledTimes(1)
        expect(isValidSpy).toHaveBeenCalledWith(noteId)
        expect(noteFindByIdSpy).toHaveBeenCalledTimes(1)
        expect(noteFindByIdSpy).toHaveBeenCalledWith(noteId, { __v: 0 })
        expect(populateFn).toHaveBeenCalledWith("owner", "username")
        expect(noteNotFoundErrorSpy).toHaveBeenCalledTimes(1)
        expect(noteNotFoundErrorSpy).toHaveBeenCalledWith("note not found", 404)
    })

    test("throws an 403 error when the note is not owned by user", async () => {
        const isValidSpy = jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true)

        const notViewPerssionError = {
            message: "You do not have permission to read this note.",
            statusCode: 403
        }

        const notViewPermissionSpy = jest.spyOn(myError, "errorStatus")

        const hasViewPermissionFn = jest.fn().mockReturnValue(false)

        const fakeNote = {
            _id: "id-321",
            username: "Alex",
            title: "note title 2",
            updateAt: "2026-10-06 210000",
            owner: { equals: hasViewPermissionFn }
        }

        const populateFn = jest.fn().mockResolvedValue(fakeNote)

        const noteFindByIdSpy = jest.spyOn(Note, "findById").mockReturnValue({ populate: populateFn })

        await expect(
            noteHandler.noteSeachById(noteId, userId)
        ).rejects.toMatchObject(notViewPerssionError)

        expect(isValidSpy).toHaveBeenCalledTimes(1)
        expect(isValidSpy).toHaveBeenCalledWith(noteId)
        expect(noteFindByIdSpy).toHaveBeenCalledTimes(1)
        expect(noteFindByIdSpy).toHaveBeenCalledWith(noteId, { __v: 0 })
        expect(populateFn).toHaveBeenCalledWith("owner", "username")
        expect(hasViewPermissionFn).toHaveBeenCalledTimes(1)
        expect(hasViewPermissionFn).toHaveBeenCalledWith(userId)
        expect(notViewPermissionSpy).toHaveBeenCalledTimes(1)
        expect(notViewPermissionSpy).toHaveBeenCalledWith("You do not have permission to read this note.", 403)
    })

    test("propagates the error when the note lookup fails", async () => {
        const isValidSpy = jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true)

        const databaseError = new Error("fails to connect database")

        const populateFn = jest.fn().mockRejectedValue(databaseError)

        const noteFindByIdSpy = jest.spyOn(Note, "findById").mockReturnValue({ populate: populateFn })

        await expect(
            noteHandler.noteSeachById(noteId, userId)
        ).rejects.toBe(databaseError)

        expect(isValidSpy).toHaveBeenCalledTimes(1)
        expect(isValidSpy).toHaveBeenCalledWith(noteId)
        expect(noteFindByIdSpy).toHaveBeenCalledTimes(1)
        expect(noteFindByIdSpy).toHaveBeenCalledWith(noteId, { __v: 0 })
        expect(populateFn).toHaveBeenCalledWith("owner", "username")
    })
})

describe("note create", () => {
    afterEach(() => jest.restoreAllMocks())

    const userId = new mongoose.Types.ObjectId()

    test("return a new note when user create a new note", async () => {
        const savedNoteSpy = jest.spyOn(Note.prototype, "save").mockReturnThis()

        const newNote = await noteHandler.noteCreate(undefined, String(userId))

        expect(savedNoteSpy).toHaveBeenCalledTimes(1)
        expect(newNote.owner).toEqual(userId)
        expect(newNote.title).toBe("Title")
    })

    test("propagates the error when the note create fails", async () => {
        const saveError = new Error("fails to connect the database")

        const savedNoteSpy = jest.spyOn(Note.prototype, "save").mockRejectedValue(saveError)

        await expect(
            noteHandler.noteCreate(undefined, String(userId))
        ).rejects.toBe(saveError)

        expect(savedNoteSpy).toHaveBeenCalledTimes(1)
    })

})

describe("note update", () => {
    afterEach(() => jest.restoreAllMocks())

    const userId = "user-123"
    const noteId = "id-123"
    const reqBody = {
        title: "title-123",
        content: "content-123"
    }

    const fakeNote = {
        _id: "id-123",
        title: "old-title-123",
        content: "old-content-123"
    }

    test("return updated note", async () => {
        const isValidSpy = jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true)

        const equalsFn = jest.fn().mockReturnValue(true)

        const noteFindSpy = jest.spyOn(Note, "findById").mockResolvedValue({
            ...fakeNote,
            owner: { equals: equalsFn }
        })

        const populateFn = jest.fn().mockResolvedValue({
            ...fakeNote,
            ...reqBody
        })

        const updateNoteSpy = jest.spyOn(Note, "findByIdAndUpdate").mockReturnValue({ populate: populateFn })

        const newNote = await noteHandler.noteUpdateContentById(noteId, userId, reqBody)

        expect(isValidSpy).toHaveBeenCalledTimes(1)
        expect(isValidSpy).toHaveBeenCalledWith(noteId)

        expect(noteFindSpy).toHaveBeenCalledTimes(1)
        expect(noteFindSpy).toHaveBeenCalledWith(noteId, { __v: 0 })

        expect(equalsFn).toHaveBeenCalledTimes(1)
        expect(equalsFn).toHaveBeenCalledWith(userId)

        expect(updateNoteSpy).toHaveBeenCalledTimes(1)
        expect(updateNoteSpy).toHaveBeenCalledWith(noteId, reqBody, {
            new: true,
            runValidators: true
        })
        expect(populateFn).toHaveBeenCalledTimes(1)
        expect(populateFn).toHaveBeenCalledWith("owner", "username")

        expect(newNote).toEqual({ ...fakeNote, ...reqBody })
    })

    test("return updated note without saving malicious content", async () => {

        const maliciousContent = {
            ...reqBody,
            content: "<script>alert(1)</script>hello"
        }

        const isValidSpy = jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true)

        const equalsFn = jest.fn().mockReturnValue(true)

        const noteFindSpy = jest.spyOn(Note, "findById").mockResolvedValue({
            ...fakeNote,
            owner: { equals: equalsFn }
        })

        const populateFn = jest.fn().mockResolvedValue({
            ...fakeNote,
            ...reqBody,
            content: "hello"
        })

        const updateNoteSpy = jest.spyOn(Note, "findByIdAndUpdate").mockReturnValue({ populate: populateFn })

        const newNote = await noteHandler.noteUpdateContentById(noteId, userId, maliciousContent)

        expect(isValidSpy).toHaveBeenCalledTimes(1)
        expect(isValidSpy).toHaveBeenCalledWith(noteId)

        expect(noteFindSpy).toHaveBeenCalledTimes(1)
        expect(noteFindSpy).toHaveBeenCalledWith(noteId, { __v: 0 })

        expect(equalsFn).toHaveBeenCalledTimes(1)
        expect(equalsFn).toHaveBeenCalledWith(userId)

        expect(updateNoteSpy).toHaveBeenCalledTimes(1)
        expect(updateNoteSpy).toHaveBeenCalledWith(noteId, { ...reqBody, content: "hello" }, {
            new: true,
            runValidators: true
        })
        expect(populateFn).toHaveBeenCalledTimes(1)
        expect(populateFn).toHaveBeenCalledWith("owner", "username")

        expect(newNote).toEqual({ ...fakeNote, ...reqBody, content:"hello" })
    })

    test("return updated note without saving malicious title", async () => {

        const maliciousContent = {
            ...reqBody,
            title: "<script>alert(1)</script>new-title"
        }

        const isValidSpy = jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true)

        const equalsFn = jest.fn().mockReturnValue(true)

        const noteFindSpy = jest.spyOn(Note, "findById").mockResolvedValue({
            ...fakeNote,
            owner: { equals: equalsFn }
        })

        const populateFn = jest.fn().mockResolvedValue({
            ...fakeNote,
            ...reqBody,
            title: "new-title"
        })

        const updateNoteSpy = jest.spyOn(Note, "findByIdAndUpdate").mockReturnValue({ populate: populateFn })

        const newNote = await noteHandler.noteUpdateContentById(noteId, userId, maliciousContent)

        expect(isValidSpy).toHaveBeenCalledTimes(1)
        expect(isValidSpy).toHaveBeenCalledWith(noteId)

        expect(noteFindSpy).toHaveBeenCalledTimes(1)
        expect(noteFindSpy).toHaveBeenCalledWith(noteId, { __v: 0 })

        expect(equalsFn).toHaveBeenCalledTimes(1)
        expect(equalsFn).toHaveBeenCalledWith(userId)

        expect(updateNoteSpy).toHaveBeenCalledTimes(1)
        expect(updateNoteSpy).toHaveBeenCalledWith(noteId, { ...reqBody, title: "new-title" }, {
            new: true,
            runValidators: true
        })
        expect(populateFn).toHaveBeenCalledTimes(1)
        expect(populateFn).toHaveBeenCalledWith("owner", "username")

        expect(newNote).toEqual({ ...fakeNote, ...reqBody, title:"new-title" })
    })

    test("throws a 400 error when the note id is invalid", async () => {
        const isValidSpy = jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(false)

        const isValidError = {
            message: "Invalid id",
            statusCode: 400
        }

        const equalsFn = jest.fn().mockReturnValue(true)

        const noteFindSpy = jest.spyOn(Note, "findById").mockResolvedValue({
            ...fakeNote,
            owner: { equals: equalsFn }
        })

        const populateFn = jest.fn().mockResolvedValue({
            ...fakeNote,
            ...reqBody
        })

        const updateNoteSpy = jest.spyOn(Note, "findByIdAndUpdate").mockReturnValue({ populate: populateFn })

        await expect(
            noteHandler.noteUpdateContentById(noteId, userId, reqBody)
        ).rejects.toMatchObject(isValidError)

        expect(isValidSpy).toHaveBeenCalledTimes(1)
        expect(isValidSpy).toHaveBeenCalledWith(noteId)

        expect(noteFindSpy).toHaveBeenCalledTimes(0)

        expect(equalsFn).toHaveBeenCalledTimes(0)

        expect(updateNoteSpy).toHaveBeenCalledTimes(0)
        expect(populateFn).toHaveBeenCalledTimes(0)
    })

    test("throws a 404 error when the note is not found", async () => {
        const isValidSpy = jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true)

        const notFoundError = {
            message: "note not found",
            statusCode: 404
        }

        const equalsFn = jest.fn().mockReturnValue(true)

        const noteFindSpy = jest.spyOn(Note, "findById").mockRejectedValue(notFoundError)

        const populateFn = jest.fn().mockResolvedValue({
            ...fakeNote,
            ...reqBody
        })

        const updateNoteSpy = jest.spyOn(Note, "findByIdAndUpdate").mockReturnValue({ populate: populateFn })

        await expect(
            noteHandler.noteUpdateContentById(noteId, userId, reqBody)
        ).rejects.toMatchObject(notFoundError)

        expect(isValidSpy).toHaveBeenCalledTimes(1)
        expect(isValidSpy).toHaveBeenCalledWith(noteId)

        expect(noteFindSpy).toHaveBeenCalledTimes(1)
        expect(noteFindSpy).toHaveBeenCalledWith(noteId, { __v: 0 })

        expect(equalsFn).toHaveBeenCalledTimes(0)

        expect(updateNoteSpy).toHaveBeenCalledTimes(0)
        expect(populateFn).toHaveBeenCalledTimes(0)
    })

    test("propagates the error when the note lookup fails", async () => {
        const isValidSpy = jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true)

        const databaseError = new Error("fails to connect database")

        const equalsFn = jest.fn().mockReturnValue(true)

        const noteFindSpy = jest.spyOn(Note, "findById").mockRejectedValue(databaseError)

        const populateFn = jest.fn().mockResolvedValue({
            ...fakeNote,
            ...reqBody
        })

        const updateNoteSpy = jest.spyOn(Note, "findByIdAndUpdate").mockReturnValue({ populate: populateFn })

        await expect(
            noteHandler.noteUpdateContentById(noteId, userId, reqBody)
        ).rejects.toBe(databaseError)

        expect(isValidSpy).toHaveBeenCalledTimes(1)
        expect(isValidSpy).toHaveBeenCalledWith(noteId)

        expect(noteFindSpy).toHaveBeenCalledTimes(1)
        expect(noteFindSpy).toHaveBeenCalledWith(noteId, { __v: 0 })

        expect(equalsFn).toHaveBeenCalledTimes(0)

        expect(updateNoteSpy).toHaveBeenCalledTimes(0)
        expect(populateFn).toHaveBeenCalledTimes(0)
    })

    test("throws a 403 error when the note is not owned by the user", async () => {
        const isValidSpy = jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true)

        const permissionError = {
            message: "You do not have permission to edit this note.",
            statusCode: 403
        }

        const equalsFn = jest.fn().mockReturnValue(false)

        const noteFindSpy = jest.spyOn(Note, "findById").mockReturnValue({
            ...fakeNote,
            owner: { equals: equalsFn }
        })

        const populateFn = jest.fn().mockResolvedValue({
            ...fakeNote,
            ...reqBody
        })

        const updateNoteSpy = jest.spyOn(Note, "findByIdAndUpdate").mockReturnValue({ populate: populateFn })

        await expect(
            noteHandler.noteUpdateContentById(noteId, userId, reqBody)
        ).rejects.toMatchObject(permissionError)

        expect(isValidSpy).toHaveBeenCalledTimes(1)
        expect(isValidSpy).toHaveBeenCalledWith(noteId)

        expect(noteFindSpy).toHaveBeenCalledTimes(1)
        expect(noteFindSpy).toHaveBeenCalledWith(noteId, { __v: 0 })

        expect(equalsFn).toHaveBeenCalledTimes(1)
        expect(equalsFn).toHaveBeenCalledWith(userId)

        expect(updateNoteSpy).toHaveBeenCalledTimes(0)
        expect(populateFn).toHaveBeenCalledTimes(0)
    })

    test("propagates the error when the note update fails", async () => {
        const isValidSpy = jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true)
        
        const equalsFn = jest.fn().mockReturnValue(true)
        
        const noteFindSpy = jest.spyOn(Note, "findById").mockResolvedValue({
            ...fakeNote,
            owner: { equals: equalsFn }
        })

        const databaseError = new Error("fails to connect database")
        
        const populateFn = jest.fn().mockRejectedValue(databaseError)

        const updateNoteSpy = jest.spyOn(Note, "findByIdAndUpdate").mockReturnValue({ populate: populateFn })

        await expect(
            noteHandler.noteUpdateContentById(noteId, userId, reqBody)
        ).rejects.toBe(databaseError)

        expect(isValidSpy).toHaveBeenCalledTimes(1)
        expect(isValidSpy).toHaveBeenCalledWith(noteId)

        expect(noteFindSpy).toHaveBeenCalledTimes(1)
        expect(noteFindSpy).toHaveBeenCalledWith(noteId, { __v: 0 })

        expect(equalsFn).toHaveBeenCalledTimes(1)
        expect(equalsFn).toHaveBeenCalledWith(userId)

        expect(updateNoteSpy).toHaveBeenCalledTimes(1)
        expect(updateNoteSpy).toHaveBeenCalledWith(noteId, reqBody, {
            new: true,
            runValidators: true
        })
        expect(populateFn).toHaveBeenCalledTimes(1)
        expect(populateFn).toHaveBeenCalledWith("owner", "username")
    })
})

describe("note delete", () => {
    afterEach(() => jest.restoreAllMocks())

    const userId = "user-123"
    const noteId = "note-123"

    test("return deleted note", async () => {
        const hasViewPermissionFn = jest.fn().mockReturnValue(true)

        const fakeNote = {
            _id: "id-123",
            username: "Tommy",
            title: "title-123",
            content: "content-123",
            owner: { equals: hasViewPermissionFn }
        }

        const isValidSpy = jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true)

        const noteFindByIdSpy = jest.spyOn(Note, "findById").mockResolvedValue(fakeNote)

        const deleteNoteSpy = jest.spyOn(Note, "findOneAndDelete").mockResolvedValue(fakeNote)

        const deleteNote = await noteHandler.noteDeleteById(noteId, userId)

        expect(isValidSpy).toHaveBeenCalledTimes(1)
        expect(isValidSpy).toHaveBeenCalledWith(noteId)

        expect(noteFindByIdSpy).toHaveBeenCalledTimes(1)
        expect(noteFindByIdSpy).toHaveBeenCalledWith(noteId)

        expect(hasViewPermissionFn).toHaveBeenCalledTimes(1)
        expect(hasViewPermissionFn).toHaveBeenCalledWith(userId)

        expect(deleteNoteSpy).toHaveBeenCalledTimes(1)
        expect(deleteNoteSpy).toHaveBeenLastCalledWith({ _id: noteId })

        expect(deleteNote).toEqual(fakeNote)
    })

    test("throws a 400 error when the note id is invalid", async () => {
        const hasViewPermissionFn = jest.fn().mockReturnValue(true)

        const fakeNote = {
            _id: "id-123",
            username: "Tommy",
            title: "title-123",
            content: "content-123",
            owner: { equals: hasViewPermissionFn }
        }

        const isValidSpy = jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(false)

        const invalidNoteIdError = {
            message: "Invalid id",
            statusCode: 400
        }

        const noteFindByIdSpy = jest.spyOn(Note, "findById").mockResolvedValue(fakeNote)

        const deleteNoteSpy = jest.spyOn(Note, "findOneAndDelete").mockResolvedValue(fakeNote)

        await expect(
            noteHandler.noteDeleteById(noteId, userId)
        ).rejects.toMatchObject(invalidNoteIdError)

        expect(isValidSpy).toHaveBeenCalledTimes(1)
        expect(isValidSpy).toHaveBeenCalledWith(noteId)

        expect(noteFindByIdSpy).toHaveBeenCalledTimes(0)

        expect(hasViewPermissionFn).toHaveBeenCalledTimes(0)

        expect(deleteNoteSpy).toHaveBeenCalledTimes(0)
    })

    test("throws a 404 error when the note is not found", async () => {

        const noteNotFoundError = {
            message: "note not found",
            statusCode: 404
        }

        const isValidSpy = jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true)

        const noteFindByIdSpy = jest.spyOn(Note, "findById").mockResolvedValue(null)

        const deleteNoteSpy = jest.spyOn(Note, "findOneAndDelete").mockResolvedValue(null)

        await expect(
            noteHandler.noteDeleteById(noteId, userId)
        ).rejects.toMatchObject(noteNotFoundError)

        expect(isValidSpy).toHaveBeenCalledTimes(1)
        expect(isValidSpy).toHaveBeenCalledWith(noteId)

        expect(noteFindByIdSpy).toHaveBeenCalledTimes(1)
        expect(noteFindByIdSpy).toHaveBeenCalledWith(noteId)

        expect(deleteNoteSpy).toHaveBeenCalledTimes(0)
    })
})

