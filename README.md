# 💬 React Firebase Chat App

📝 **Contents**
- [Introduction](#-introduction)
- [Technology Stack](#-technology-stack)
- [App Features](#-app-features)
- [Directory Structure](#-directory-structure)
- [How to Run](#-how-to-run)
- [Upcoming Features](#-upcoming-features)
- [Contribution Guidelines](#-contribution-guidelines)
- [Get in Touch](#-get-in-touch)

## 🗺️ Introduction
The **React Firebase Chat App** is a real-time web messaging application that leverages Firebase's powerful backend for authentication and data storage. It allows users to exchange text messages, images, and voice recordings. The app is built using modern technologies to offer a seamless, responsive experience for users.

## 💻 Technology Stack
- **React**: A JavaScript library for building user interfaces.
- **Firebase**: Provides real-time database, storage, and authentication services.
- **Vite**: For fast and optimized builds.
- **JavaScript/JSX**: Programming language and markup used throughout the app.
- **CSS**: Styling for UI components.

## 👀 App Features
- **Real-time Messaging**: Instant messaging with automatic sync across users.
- **File Sharing**: Supports image and audio message sharing.
- **Voice Messages**: Users can record and send voice messages directly in the chat.
- **User Authentication**: Secure user authentication through Firebase.
- **Customizable Audio Messages**: Easily customized player styling for audio messages.

## 🗂️ Directory Structure
- **`/src`**: Contains all the app’s source code.
  - **`components/`**: All reusable UI components (e.g., `chatList`, `userInfo`, `detail`).
  - **`lib/`**: Firebase, upload, and chat-related logic (e.g., `firebase.js`, `chatStore.js`, `userStore.js`).
  - **`App.jsx`**: The root component handling main routes.
  - **`index.css`**: Global styles for the entire app.
  - **`main.jsx`**: Entry point for React app rendering.

## 🚀 How to Run
1. **Clone the repository:**
    ```bash
    git clone https://github.com/OKihichak/react-firebase-chat.git
    cd react-firebase-chat
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Run the app locally:**
    ```bash
    npm run dev
    ```

4. **Make sure Firebase is set up with valid credentials in your `.env` file.**

## 🚀 Upcoming Features
This is the first version of the app. In the next versions, I plan to introduce:
- **Responsive Design**: Improving the layout for mobile and tablet devices.
- **Video Messaging**: Supporting video uploads and sharing.
- **Enhanced User Settings**: Adding more customization options for users.
- **Improved UI**: Refining the design to ensure a more cohesive and modern look.

## 🤝 Contribution Guidelines
Interested in contributing? Follow these steps:

1. **Fork the repository.**
2. **Create a new branch:**
    ```bash
    git checkout -b feature/YourFeatureName
    ```
3. **Commit your changes:**
    ```bash
    git commit -m 'Add YourFeatureName'
    ```
4. **Push to the branch:**
    ```bash
    git push origin feature/YourFeatureName
    ```
5. **Open a pull request** to discuss and merge your changes.

## 📧 Get in Touch
- **Email**: oleg15062005@gmail.com
- **GitHub**: [Oleh Kihichak](https://github.com/OKihichak)
