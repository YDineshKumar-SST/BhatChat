# 💬 BhatChat — Modern Real-Time Chat Application

<div align="center">

![BhatChat Banner](https://img.shields.io/badge/BhatChat-Real--Time%20Messaging-38bdf8?style=for-the-badge&logo=socketdotio&logoColor=white)

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8-010101?style=flat-square&logo=socketdotio&logoColor=white)](https://socket.io/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![DaisyUI](https://img.shields.io/badge/DaisyUI-4.12-5AD8E6?style=flat-square&logo=daisyui&logoColor=white)](https://daisyui.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-2.5-764ABC?style=flat-square&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)

**A feature-rich, high-performance, and beautifully crafted MERN stack real-time chat application with glassmorphism aesthetics, live typing indicators, theme personalization, and advanced profile customization.**

</div>

---

## 🎬 Project Demo & Video Walkthrough

<div align="center">



> 🎥 **Video Link:** [Click here to watch the full BhatChat Demo Walkthrough](https://www.loom.com/share/b286cddda32f4a64af755cee04744d75)


</div>

---

## 🌟 Key Features

### ⚡ 1. Real-Time Socket.IO Communication
- **Instant Messaging**: Real-time bidirectional communication powered by Socket.IO.
- **Robust Multi-Tab Online Tracking**: Tracks connected users using user-to-socket Sets — users stay online seamlessly across multiple tabs or windows.
- **Live Online/Offline Indicators**: Glowing emerald pulse badges and real-time online friends counter.
- **Real-Time Typing Indicators**: Dynamic animated bouncing dots (`typing...`) displayed in both the chat header and the user sidebar.
- **Audio Chimes**: Soft, synthesized notification sound for incoming messages using the native Web Audio API (no external audio assets required).

### ⚙️ 2. Comprehensive Profile & Credentials Settings
- **Custom Photo Upload**: Upload custom avatar photos (PNG, JPG, WEBP) directly from your device with automatic client-side canvas compression for lightning-fast loads.
- **Preset 3D Avatars**: 1-click avatar selector with curated 3D and animated avatar choices.
- **Credentials Management**: Update Full Name and unique Username with live validations.
- **Password Security**: Change passwords securely with current password verification, new password confirmation, and show/hide eye toggles.
- **Real-Time Profile Broadcast**: When a user updates their name or avatar, all online contacts' sidebars and active headers update instantly without refreshing.

### 🎨 3. 9 Premium Color Themes
- Built-in visual theme picker with local persistence:
  - **Night** (Default sleek cyber dark)
  - **Deep Dark**
  - **Luxury Gold**
  - **Synthwave**
  - **Cyberpunk**
  - **Dracula**
  - **Forest**
  - **Cupcake**
  - **Clean Light**

### 💬 4. Interactive Chat Experience
- **Emoji Picker Popover**: Quick emoji drawer built right into the message input bar.
- **Conversation Ice Breakers**: Quick-start interactive greeting chips (*"Say Hi! 👋"*, *"What are you up to today? 🚀"*) for empty conversations.
- **Message Hover Toolbar**: 1-click **Copy to Clipboard** and **Interactive Emoji Reactions** (❤️, 👍, 😂, 🔥, 😮).
- **Sent & Read Indicators**: Gradient bubbles with timestamps and double-check delivery ticks (`✓✓`).
- **Scroll-to-Bottom Floating Button**: Smoothly jump to the newest messages when scrolling up through chat history.

### 📱 5. Responsive & Mobile-Ready
- Seamless mobile split-view with intuitive back navigation between contacts and active conversations.
- Modern glassmorphic typography using Google Fonts (**Outfit** and **Plus Jakarta Sans**).

### 🔒 6. Robust Authentication
- Secure user registration and login with **JWT** (JSON Web Tokens) and **bcryptjs** password hashing.
- Dual authentication transport (HTTP-only cookies & Bearer Authorization tokens).
- Route guards with Redux-persisted authentication state.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) + [Redux Persist](https://github.com/rt2zz/redux-persist)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [DaisyUI](https://daisyui.com/)
- **Real-Time Client**: [Socket.IO Client](https://socket.io/docs/v4/client-api/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Icons & Alerts**: [React Icons](https://react-icons.github.io/react-icons/) & [React Hot Toast](https://react-hot-toast.com/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **WebSocket Engine**: [Socket.IO](https://socket.io/)
- **Security**: [JSONWebToken](https://jwt.io/), [bcryptjs](https://www.npmjs.com/package/bcryptjs), [cookie-parser](https://www.npmjs.com/package/cookie-parser), [cors](https://www.npmjs.com/package/cors)

---

## 📁 Project Architecture

```
BhatChat/
├── client/                     # Frontend Vite + React application
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── SettingsModal.jsx # Profile, photo upload, security & theme modal
│   │   │   └── utitlities/     # Axios instance & HTTP interceptors
│   │   ├── pages/
│   │   │   ├── authentication/ # Login & Signup screens
│   │   │   └── home/           # Chat dashboard (Sidebar, Messages, User items)
│   │   ├── socket/             # Socket.IO client singleton manager
│   │   ├── store/              # Redux Toolkit slices (user, message, socket)
│   │   ├── utils/              # Sound synthesis & helper utilities
│   │   ├── App.jsx             # Main application container
│   │   ├── index.css           # Design tokens, scrollbars, glass utilities
│   │   └── main.jsx            # Entry point & Router setup
│   └── tailwind.config.js      # Tailwind & DaisyUI theme configuration
│
└── server/                     # Backend Node.js + Express + Socket.IO
    ├── controllers/            # User & Message controller handlers
    ├── db/                     # MongoDB connection setup
    ├── middlewares/            # JWT authentication & global error handlers
    ├── models/                 # Mongoose schemas (User, Message, Conversation)
    ├── routes/                 # API endpoint definitions (/api/v1/user, /message)
    ├── socket/                 # Socket.IO server & multi-tab connection manager
    └── server.js               # Express application bootstrap
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn
- MongoDB Atlas cluster or local MongoDB instance

---

### 1. Clone & Setup Repository

```bash
git clone https://github.com/your-username/BhatChat.git
cd BhatChat
```

---

### 2. Backend Setup

1. Navigate to the server folder:
   ```bash
   cd server
   npm install
   ```

2. Create a `.env` file in `server/` with the following variables:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES=2d
   COOKIE_EXPIRES=2
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```

3. Start the backend development server:
   ```bash
   npm run dev
   ```

---

### 3. Frontend Setup

1. Open a new terminal and navigate to `client/`:
   ```bash
   cd client
   npm install
   ```

2. Create a `.env` file in `client/`:
   ```env
   VITE_DB_URL=http://localhost:5000/api/v1
   VITE_DB_ORIGIN=http://localhost:5000
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

---

## 💡 Usage Tips
- **Testing 2 Users Locally**: Open one account in your standard browser tab and the second account in an **Incognito / Private Window** (or a different browser like Edge / Brave).
- **Edit Profile**: Click your profile card at the bottom of the sidebar or the **Gear (⚙️) icon** at the top to access the Settings modal.
- **Send Greetings**: Click any of the icebreaker chips in a new conversation to start chatting instantly.

---

## 🙏 Credits & Acknowledgements

Special thanks and sincere credit to:

* **[Ghupshup by School4U](https://www.youtube.com/@School4U)**:
  Heartfelt gratitude to the **Ghupshup** project and tutorials by **School4U**. The fundamental concepts of building full-stack MERN real-time chat applications, socket integration patterns, and architecture were learned and inspired by their content. BhatChat was built upon those solid fundamentals and further elevated with modern UI/UX enhancements, customizable themes, canvas compression photo uploads, and multi-tab socket resilience.
* The open-source community for **React**, **Vite**, **Tailwind CSS**, **DaisyUI**, **Socket.IO**, and **MongoDB**.

---

## 📄 License

Feel free to customize, learn from, and build upon it!
