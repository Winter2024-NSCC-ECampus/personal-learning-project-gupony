## Overview
This project is a full-stack web application that allows users to:
1. **Register** and **Log In** with credentials stored in a MySQL database.
2. Maintain a personal **To-Do list**, linked to their user account.
3. View real-time **Weather** data from the OpenWeatherMap API on the dashboard.
4. Enjoy a **responsive** interface styled with Tailwind CSS.

## Technologies Used
- **React** (Front End)
  - React Router for navigation.
  - useState / useEffect hooks for state and side effects.
- **Node.js + Express** (Back End)
  - Routes for user authentication (register, login).
  - Routes for to-do list CRUD operations (create, read, update, delete).
  - A weather endpoint that proxies the OpenWeatherMap API.
- **MySQL** (Database)
  - `users` table for user information.
  - `todos` table for user-linked tasks.
- **Tailwind CSS** for styling and layout.

## File Structure 
- **server/**
  - `server.js` – The main Express server file, handling:
    - /api/register, /api/login routes
    - /api/todos (CRUD)
    - /api/weather route
    - MySQL connection setup
- **src/pages/**
  - `Registration.jsx` – Registration form, sends user details to `/api/register`.
  - `Login.jsx` – Login form, authenticates via `/api/login`.
  - `Dashboard.jsx` – Shows user's name, weather widget, to-do list, and a simple counter.
- **src/App.jsx** – Sets up React Router for `/`, `/login`, and `/dashboard`.
- **src/index.css** or **App.css** – Tailwind CSS imports and global styling.
