# NotesSync 📝

NotesSync is a cross-platform note synchronization system designed for seamless access to your personal notes. It features a robust PHP backend using SQLite, a responsive React-based web application, and a Java-based CLI client for desktop users.

![JavaScript](https://img.shields.io/badge/language-JavaScript-yellow) ![PHP](https://img.shields.io/badge/backend-PHP-blue) ![React](https://img.shields.io/badge/frontend-React-61DAFB) ![SQLite](https://img.shields.io/badge/database-SQLite-003B57)

## 📖 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features
- **Cross-Platform**: Access notes via Web UI or Java CLI.
- **User Authentication**: Secure JWT-based session management.
- **CRUD Operations**: Create, Read, Update, and Delete notes with ease.
- **Search Functionality**: Quickly find specific notes via the web interface.
- **Sync Status**: Real-time feedback on synchronization status.
- **Responsive Design**: Mobile-friendly web interface powered by Bootstrap.

## 🛠 Tech Stack
| Component | Technology |
| :--- | :--- |
| **Backend** | PHP, SQLite, PDO |
| **Frontend** | React 19, Vite, Bootstrap 5 |
| **Desktop** | Java (CLI) |
| **Tools** | ESLint, Vite, NPM |

## 🚀 Installation

### Web Application
1. Navigate to the `web` directory: `cd web`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

### Backend
1. Ensure you have PHP installed with `pdo_sqlite` extension enabled.
2. Serve the `backend` directory via a local PHP server.
3. The database will be automatically initialized in `backend/data/notesync.db` upon the first request.

## 💻 Usage

### Web App
Access the application in your browser (usually `http://localhost:5173`). Use the provided login/signup screen to start managing your notes.

### Java CLI
Compile and run the `NotesCLI.java` file:
```bash
javac -cp .:lib/json-20230227.jar android/src/NotesCLI.java
java -cp .:lib/json-20230227.jar NotesCLI
```
Follow the interactive menu to register, login, and sync your notes.

## 📂 Project Structure
- `/web`: React application source code.
- `/backend`: PHP API routes and SQLite database files.
- `/android`: Java CLI client implementation.

## 📡 API Reference
All endpoints are protected by an `Authorization: Bearer <token>` header:
- `POST /routes/login.php`: Authenticates user.
- `GET /routes/notes_list.php`: Retrieves all user notes.
- `POST /routes/notes_add.php`: Creates a new note.

## 🤝 Contributing
Contributions are welcome! Please fork this repository and submit a pull request with your changes.

## 📜 License
This project is currently unlicensed.

## 🔗 Important Links
- [GitHub Repository](https://github.com/almhdy24/NotesSync)

---
Built with 💙 for the community. If you found this helpful, consider starring the repo!

