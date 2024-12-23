# 🗌 Todo List Project

A feature-rich 🗌 application built using **React.js**, **Vite**, **Material-UI (MUI)**, and **Firebase**. The app provides users with a 🖒 and 🔄 way to manage their tasks, supporting multiple 🌐 and a 🌞/🌌 theme toggle.

## ✨ Features

- **🗋 Task Management:** Add, edit, and delete tasks effortlessly.
- **🌞/🌌 Mode:** Seamless theme switching for enhanced user experience.
- **🌐 Multi-language Support:** Available in **🇦🇪 Arabic** and **🇬🇧 English**, with dynamic language switching.
- **🔐 User Authentication:** Secure login/logout functionality using Firebase Authentication.
- **📂 Data Storage:** Tasks are stored per user in Firebase Firestore, ensuring data persistence and privacy.
- **🔧 Responsive Design:** Fully optimized for all 🔄 sizes.

## 🛠️ Technologies Used

- **🎨 React.js:** For building the user interface.
- **⏯ Vite:** As the build tool for fast development and production builds.
- **🌸 Material-UI (MUI):** For pre-designed components and custom styling.
- **🔧 Firebase:** For backend services, including authentication and Firestore.

## 🔧 Installation

1. 📂 Clone the repository:
   ```bash
   git clone https://github.com/your-repo/todo-list
   cd todo-list
   ```

2. 📖 Install dependencies:
   ```bash
   npm install
   ```

3. 🔐 Set up Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
   - Enable **Authentication** and **Firestore**.
   - Add your Firebase configuration to the project:
     - Create a `.env` file in the root directory.
     - Add the following:
       ```env
       VITE_FIREBASE_API_KEY=your-api-key
       VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
       VITE_FIREBASE_PROJECT_ID=your-project-id
       VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
       VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
       VITE_FIREBASE_APP_ID=your-app-id
       ```

4. 🚀 Start the development server:
   ```bash
   npm run dev
   ```

5. 🔗 Open the app in your browser:
   ```
   http://localhost:5173
   ```

## 📁 Deployment

This project is deployed on Firebase Hosting. You can visit the live version here: [Todo List App](https://todo-test-13fb8.web.app/).

To deploy your own version:
1. 🔄 Build the project:
   ```bash
   npm run build
   ```

2. ➡️ Deploy to Firebase Hosting:
   ```bash
   firebase login
   firebase init
   firebase deploy
   ```

## 📊 Usage

- 🌐 Switch between **🇦🇪 Arabic** and **🇬🇧 English** using the language toggle.
- 🌞/🌌 Toggle between **Dark** and **Light** themes using the theme switcher.
- 🔐 Log in with your account to access your tasks.
- 🔄 Add, edit, and delete tasks directly from the interface.

## 📁 Project Structure

```
src/
├── components/         # ♻️ Reusable components
├── pages/              # 📝 Page components
├── context/           # 🌐 Context API for state management
├── hooks/             # ⚙️ Custom React hooks
├── styles/            # 🎨 Global and component-specific styles
├── firebase.js        # 🔥 Firebase configuration
├── App.jsx            # 🏠 Main App component
├── main.jsx           # 🚀 Entry point
```

## ✅ License

This project is open-source and available under the [MIT License](LICENSE).

## 💪 Contributing

Contributions are welcome! If you have suggestions or encounter issues, feel free to open an issue or submit a pull request.

## 👏 Acknowledgments

- [📖 React.js Documentation](https://reactjs.org/docs/getting-started.html)
- [📖 Vite Documentation](https://vitejs.dev/guide/)
- [📖 Material-UI Documentation](https://mui.com/getting-started/installation/)
- [📖 Firebase Documentation](https://firebase.google.com/docs)

---

### 🔗 Live Demo
Check out the live demo of the project here: [Todo List App](https://todo-test-13fb8.web.app/)

