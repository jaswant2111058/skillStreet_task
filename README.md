
# User API Routes

This Express.js application defines RESTful API routes for user-related operations, such as user registration, authentication, note management, and password reset.

## Installation

1. Clone the repository:

```bash
git clone <https://github.com/jaswant2111058/skillStreet_task.git>
```

2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
npm start
```

## Routes

### 1. User Registration

Endpoint: `/signup` (POST)

- Validates user registration data using Express-validator middleware.
- Requires `name`, `password`, and `email` in the request body.
- Calls `userControllers.signup` to handle the registration process.

### 2. User Login

Endpoint: `/login` (POST)

- Validates user login data using Express-validator middleware.
- Requires `email` and `password` in the request body.
- Calls `userControllers.login` to handle the login process.

### 3. Password Reset

Endpoint: `/password/reset` (POST)

- Validates password reset data using Express-validator middleware.
- Requires `password`, `newPassword`, and authentication token in the request body.
- Calls `userControllers.authMiddleware` to verify user authentication.
- Calls `userControllers.resetPassword` to handle the password reset process.

### 4. Show User's Notes

Endpoint: `/show/note` (POST)

- Calls `userControllers.authMiddleware` to verify user authentication.
- Calls `userControllers.showNote` to retrieve and show the user's notes.

### 5. Add a Note

Endpoint: `/add/note` (POST)

- Validates note data using Express-validator middleware.
- Requires `title` and `content` in the request body.
- Calls `userControllers.authMiddleware` to verify user authentication.
- Calls `userControllers.createNote` to add a new note.

### 6. Edit a Note

Endpoint: `/edit/note` (POST)

- Validates note edit data using Express-validator middleware.
- Requires `title_id` in the request body.
- Calls `userControllers.authMiddleware` to verify user authentication.
- Calls `userControllers.updateNote` to edit an existing note.

### 7. Delete a Note

Endpoint: `/delete/note` (POST)

- Validates note deletion data using Express-validator middleware.
- Requires `title_id` in the request body.
- Calls `userControllers.authMiddleware` to verify user authentication.
- Calls `userControllers.deleteNote` to delete an existing note.
