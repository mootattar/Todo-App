Overview

A Todo List application built with modern web technologies to manage tasks effectively. This project demonstrates the integration of a frontend built with Vite and React.js, a backend using Strapi, and Material-UI for styling.
🌟 Features

    Task Management: Add, edit, delete, and mark tasks as completed.
    User Authentication: Secure login and logout functionality.
    Dynamic UI: Responsive and modern design using Material-UI.
    Real-Time Data: Sync tasks with a backend powered by Strapi.

🛠️ Technologies Used
Frontend:

    Vite: A fast development build tool.
    React.js: Library for building the user interface.
    Material-UI (MUI): Component library for a responsive and aesthetic UI.

Backend:

    Strapi: Headless CMS for APIs and content management.

🚀 Installation and Setup
Prerequisites:

    Node.js (version 16 or higher)
    npm or yarn
    Strapi installed globally

Steps to Run Locally:

    Clone the Repository:

git clone https://github.com/mootattar/Todo-App.git
cd Todo-App

Install Dependencies for Frontend:

cd frontend
npm install

Run the Frontend:

npm run dev

Setup Backend:

    Navigate to the backend folder.

cd ../backend

    Install dependencies.

npm install

    Start the Strapi server.

    npm run develop

    Open in Browser:
        Frontend: http://localhost:5173
        Backend: http://localhost:1337/admin

🔧 Project Structure

todo-list/
├── frontend/          # React.js frontend
│   ├── src/           # Source code
│   ├── public/        # Static files
│   └── vite.config.js # Vite configuration
├── backend/           # Strapi backend
│   ├── api/           # API models and controllers
│   ├── config/        # Strapi configuration files
│   └── server.js      # Main server file
└── README.md          # Project documentation

📌 Future Improvements

    Add drag-and-drop task reordering.
    Implement notifications for task deadlines.
    Enable offline mode using local storage.

🤝 Contributions

Contributions are welcome! Please fork the repository and submit a pull request.
📄 License

This project is licensed under the MIT License.
📧 Contact

For any inquiries, feel free to reach out:

    Email: mootattar@gmail.com
    GitHub: mootattar
