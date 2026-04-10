# Leadbug

Leadbug is a full-stack MERN (MongoDB, Express, React, Node.js) web application designed for managing email templates and running email campaigns. It features a robust authentication system using JWT and OTP-based email verification, along with secure password recovery functionalities.

## Features

- **User Authentication:**
  - Secure login and registration.
  - OTP-based email verification flow.
  - Forgot password / reset password implementation.
  - JWT-based authentication stored securely in cookies.
- **Dashboard:** Overview of campaigns and analytics.
- **Template Builder:** Create and manage customized email templates to be used across campaigns.
- **Campaign Wizard:** Step-by-step wizard to set up and launch email campaigns.
- **Modern UI:** Built with React, Tailwind CSS, and Lucide React icons for a responsive and polished user interface.

## Tech Stack

### Frontend
- **React.js** (v19) with Vite
- **React Router DOM** for navigation
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Axios** for API communication
- **React Hot Toast** for notifications

### Backend
- **Node.js & Express.js** for the server framework
- **MongoDB & Mongoose** for the database and object modeling
- **JSON Web Tokens (JWT)** for secure authentication
- **Bcrypt.js** for password hashing
- **Nodemailer** for sending OTPs and verification emails
- **Cookie-parser** for managing auth cookies

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v16.x or higher)
- [MongoDB](https://www.mongodb.com/) (Local installation or MongoDB Atlas URI)

## Installation & Setup

1. **Clone the repository (if applicable)**
   ```bash
   git clone <repository_url>
   cd Leadbug
   ```

2. **Backend Setup**
   - Navigate to the backend directory:
     ```bash
     cd backend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Create a `.env` file in the `backend` directory and add the following required environment variables:
     ```env
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret_key
     EMAIL_USER=your_smtp_email
     EMAIL_PASS=your_smtp_app_password
     ```
   - Start the development server:
     ```bash
     npm run start
     ```
     *The backend server should now be running on `http://localhost:5000`.*

3. **Frontend Setup**
   - Open a new terminal instance and navigate to the frontend directory:
     ```bash
     cd frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the Vite development server:
     ```bash
     npm run dev
     ```
   - *The frontend application will be running on `http://localhost:5173`.*

## Available Scripts

### In the `frontend` directory:
- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production to the `dist` folder.
- `npm run lint`: Runs ESLint to find and fix problems in your code.
- `npm run preview`: Previews the production build locally.

### In the `backend` directory:
- `npm run start`: Starts the backend node server using nodemon for automatic restarts on changes.

## API Endpoints (Overview)
- `POST /api/auth/*` - Authentication related routes (Register, Login, Send/Verify OTP, Forgot Password).
- `GET/POST/PUT/DELETE /api/templates/*` - Managing email templates.
- `GET/POST/PUT/DELETE /api/campaign/*` - Managing email campaigns.

## License

ISC License
