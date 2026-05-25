# LatitudeLord

# 🗺️ LatitudeLord

> A location-based tracking mobile app built with React Native, Node.js + Express, and MongoDB.

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](./LICENSE)

---

## 📖 About

**LatitudeLord** is a mobile application that leverages location data to deliver a rich, map-driven user experience. The app is powered by a RESTful backend built on Node.js and Express, with MongoDB as the primary data store, and a React Native frontend for seamless iOS and Android support.

---

## 🏗️ Architecture

This project follows a **monorepo** structure, housing both the frontend and backend in a single repository. The `frontend/` directory contains the React Native mobile app and the `backend/` directory contains the Node.js + Express REST API, allowing both to be developed, versioned, and reviewed together.

---

## 🛠️ Tech Stack

| Layer    | Technology             |
| -------- | ---------------------- |
| Mobile   | React Native (Expo)    |
| Backend  | Node.js, Express.js    |
| Database | MongoDB (Mongoose ODM) |
| Language | JavaScript (100%)      |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/)
- MongoDB (local instance or MongoDB Atlas)
- Expo CLI `npm install -g expo-cli`
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/RajivAnandKhanal/LatitudeLord.git
cd LatitudeLord
```

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Start the backend server:

```bash
npm run dev
```

### 3. Set Up the Frontend

```bash
cd ../frontend
npm install
```

Start the Expo development server:

```bash
npx expo start
```

Scan the QR code with the **Expo Go** app on your phone, or run on an emulator/simulator.

---

## 🌐 API Overview

The backend exposes a RESTful API. Key endpoints include:

| Method | Endpoint   | Description                 |
| ------ | ---------- | --------------------------- |
| GET    | `/api/...` | Fetch resources             |
| POST   | `/api/...` | Create a new resource       |
| PUT    | `/api/...` | Update an existing resource |
| DELETE | `/api/...` | Delete a resource           |

> 📝 Full API documentation coming soon.

---

## 👥 Team

LatitudeLord is a **2nd Year, 2nd Semester** academic project developed by the following students:

| Name               | GitHub                                                   |
| ------------------ | -------------------------------------------------------- |
| Bandana Gyawali    | [@bg3529](https://github.com/bg3529)                     |
| Rajiv Anand Khanal | [@RajivAnandKhanal](https://github.com/RajivAnandKhanal) |
| Sudip Bayalkoti    | [@Sudiip49](https://github.com/Sudiip49)                 |
| Navraj Pathak      | [@navraj11-ku](https://github.com/navraj11-ku)           |
| Alok Dhakal        |                                                          |

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

Made with ❤️ by the LatitudeLord team
