# Student Management System

A beginner-friendly full-stack project for the **Auspify Technologies – Task 2 (Easy): Student Management System** assignment.

## Features

- Add student records
- View all students and individual student details through the API
- Update existing records
- Delete records after confirmation
- Search by name, roll number, email, or course
- MongoDB database connectivity with Mongoose
- REST API built with Express
- Form validation and duplicate roll-number handling
- Responsive interface for desktop and mobile
- Health endpoint to check server/database status

## Tech stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js and Express.js
- Database: MongoDB (MongoDB Atlas or local MongoDB)
- ODM: Mongoose

## Requirements

Install Node.js LTS from https://nodejs.org/ and have access to MongoDB Atlas (https://www.mongodb.com/cloud/atlas) or a local MongoDB server.

## Run in Visual Studio Code

1. Extract this ZIP file.
2. In VS Code, choose **File → Open Folder** and select the extracted `Student-Management-System` folder.
3. Open **Terminal → New Terminal**.
4. Install dependencies:

   ```bash
   npm install
   ```

5. Copy `.env.example` to a new file named `.env` in the project root.
6. Open `.env` and replace the sample `MONGODB_URI` with your own MongoDB connection string. Do not include angle brackets or keep the sample credentials.
7. In MongoDB Atlas, make sure your database user exists and your current IP address is allowed under Network Access. Use a strong password.
8. Start the project:

   ```bash
   npm run dev
   ```

9. Open http://localhost:5000 in your browser.

The server starts only when it can connect to MongoDB. If connection fails, read the terminal error and check the `.env` value, database user/password, and Atlas Network Access.

## Environment variable example

```env
PORT=5000
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@YOUR_CLUSTER.mongodb.net/student_management?retryWrites=true&w=majority
```

If your password contains special URL characters, URL-encode those characters in the connection string. Keep `.env` private; it is ignored by Git.

## REST API endpoints

Base URL: `http://localhost:5000/api/students`

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/students` | List all students |
| GET | `/api/students?search=noor` | Search students |
| GET | `/api/students/:id` | Get one student |
| POST | `/api/students` | Create a student |
| PUT | `/api/students/:id` | Update a student |
| DELETE | `/api/students/:id` | Delete a student |
| GET | `/api/health` | Check server and database status |

### Example POST body

```json
{
  "name": "Noor Fatima",
  "rollNumber": "CS-2026-001",
  "email": "noor@example.com",
  "course": "Computer Science"
}
```

## Testing checklist

- [ ] Add a student with valid details.
- [ ] Confirm the new record appears in the table.
- [ ] Refresh the page and confirm the record is still present.
- [ ] Search by name and roll number.
- [ ] Edit the student and confirm changes persist.
- [ ] Delete the student and confirm it is removed.
- [ ] Try an invalid email and a duplicate roll number.
- [ ] Test on a narrow/mobile browser width.
- [ ] Check `http://localhost:5000/api/health`.

You can also test the REST endpoints with a tool such as Postman or the VS Code REST Client extension.

## Before submitting

- Replace any example values with your own test data.
- Test every CRUD action and take screenshots of the working application.
- Add your own name and project details to this README if your supervisor requests them.
- Upload the project to your GitHub repository only after removing secrets. Never commit `.env` or database credentials.
- Deploy the frontend/backend and configure environment variables on the hosting platform if deployment is required by your supervisor.

## Project structure

```text
Student-Management-System/
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── src/
│   ├── models/
│   │   └── Student.js
│   └── routes/
│       └── students.js
├── .env.example
├── .gitignore
├── package.json
├── server.js
└── README.md
```

**Note:** This is a project starter prepared to match the supplied task brief. You must configure your own database and run the testing checklist before describing it as fully tested or submitting it.
