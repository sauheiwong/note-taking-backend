# Note-Taking APP

---

## Description

This project is a backend application built with Node.js and Express.js and MongoDB. It provides user authentication and note management functionalities.

## Prerequisites

- Node.js (recommended version 18.x or higher)

## Installation

1. **Clone the repository**:

```bash
git clone https://github.com/sauheiwong/note-taking-backend.git .
```

2. **Install dependencies**:

```bash
npm install
```

3. **Set up environment variables**:

Create a `.env` file in the root directory and add the following configuration:

```
DB_URL = Your MongoDB connection string
PORT = Port number for your application (e.g., 3000)
SECRET_KEY = Secret key for JWT token generation
```

4. **Change API_BASE_URL in public/config.js**:
   Change the API_BASE_URL in `public/config.js` to match your actual port number if different.

```javascript
const API_BASE_URL = `http://localhost:3000"}`; // change to your actual port number if different.
```

### Running the Application

- **Start the server**:

```bash
npm start
```

This will start the sever using `nodemon`, listening on the port specified in the `PORT` environment variable.

---

## API Endpoints

The project's API endpoints are primarily handled by `router.js` and associated controllers. Most API endpoints are prefixed with `/api`, and some routes are protected by login.

### User-related APIs

- **Register Page**:

  - **GET**: `/signup`
  - **Description**: Displays the registration page.

- **User Signup (API)**

  - **POST** `/api/signup`
  - **Description:** Creates a new user account.
  - **Expected Request Body:**
    ```json
    {
      "username": "username",
      "password": "password"
    }
    ```
  - **Important Details:** The request will be validated by `userValidator.usernameValidator()` and `userValidator.passwordValidator()`.

- **Login Page (View)**

  - **GET** `/`
  - **Description:** Renders the user login page.

- **User Login (API)**

  - **POST** `/api/login`
  - **Description:** Logs in a user with a username and password. Successful login establishes a session.
  - **Expected Request Body:**
    ```json
    {
      "username": "username",
      "password": "password"
    }
    ```
  - **Important Details:** The request will be validated by `userValidator.usernameValidator()` and `userValidator.passwordValidator()`.

- **User Logout**

  - **GET** `/api/logout`
  - **Description:** Logs out the current user and clears the session.

### Note-related APIs (Login Required)

All note API and view routes under `/protected/notes` and `/protected/view/notes` require login.

- **Get Note List (API)**

  - **GET** `/api/protected/notes/`
  - **Description:** Retrieves a list of all notes for the current user.
  - **Authentication:** Requires a valid session (protected by `requireLogin.requireLogin` middleware).
  - **Expected Response Format:** An array of note objects is expected.
    ```json
    [
      {
        "id": "note_id_1",
        "title": "Note Title 1",
        "content": "Note Content 1",
        "createdAt": "2023-01-01T10:00:00Z"
      },
      {
        "id": "note_id_2",
        "title": "Note Title 2",
        "content": "Note Content 2",
        "createdAt": "2023-01-02T11:00:00Z"
      }
    ]
    ```

- **View Single Note by ID (View)**

  - **GET** `/protected/view/notes/:id`
  - **Description:** Views the details of a specific note by its ID.
  - **Authentication:** Requires a valid session (protected by `requireLogin.requireLogin` middleware).

- **Create New Note (API)**

  - **POST** `/api/protected/notes/`
  - **Description:** Creates a new note.
  - **Authentication:** Requires a valid session (protected by `requireLogin.requireLogin` middleware).
  - **Expected Request Body:**
    ```json
    {
      "title": "Title of the new note",
      "content": "Content of the new note"
    }
    ```
  - **Expected Response Format:** The newly created note object is expected to be returned.
    ```json
    {
      "id": "new_note_id",
      "title": "Title of the new note",
      "content": "Content of the new note",
      "createdAt": "2023-06-09T14:30:00Z"
    }
    ```

- **Edit Note (API)**

  - **PUT** `/api/protected/notes/:id`
  - **Description:** Edits a note.
  - **Authentication:** Requires a valid session (protected by `requireLogin.requireLogin` middleware).
  - **Expected Request Body:**
    ```json
    {
      "title": "New title of the note",
      "content": "New content of the note"
    }
    ```
  - **Expected Response Format:** The edited note object is expected to be returned.
    ```json
    {
      "id": "note_id",
      "title": "New title of the note",
      "content": "New content of the note",
      "createdAt": "2023-06-09T14:30:00Z"
    }
    ```

- **Delete Note (API)**

  - **PUT** `/api/protected/notes/:id`
  - **Description:** Delete a note.
  - **Authentication:** Requires a valid session (protected by `requireLogin.requireLogin` middleware).
  - **Expected Response Format:** The Deleted note object is expected to be returned.
    ```json
    {
      "id": "note_id",
      "title": "title of the note",
      "content": "content of the note",
      "createdAt": "2023-06-09T14:30:00Z"
    }
    ```

## Important Details

- **Auto Save:** The application could automatically save any changes made to the notes after `1` seconds of inactivity.

- **Error Handling:** The application could handle errors gracefully and return appropriate error messages with status codes.

- **Prevent Leaving Page:** Prevent users from leaving the page without saving their changes.
