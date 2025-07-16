
# 🏥 MedCare Hospital Management System

A comprehensive full-stack hospital management system built with the MERN stack (MongoDB, Express.js, React.js, Node.js). This system provides three main interfaces: a patient portal (frontend), an admin dashboard, and a robust backend API.


## 🌍 Live Demo

Experience the application live:

| Component | Link | Description |
|-----------|------|-------------|
| 🏥 **Patient Portal** | [View Live Demo](https://medcare-hms-rs.netlify.app/) | Public interface for patients to book appointments and register |
| 🔧 **Admin Dashboard** | [View Live Demo](https://medcare-hms-rs-admin.netlify.app/) | Administrative panel for 

### Demo Credentials
**Admin Dashboard Access:**
- Email: `admin@hospital.com`
- Password: `1st row of qwerty keyboard`
  
## 🌟 Features

### 👨‍⚕️ Patient Portal (Frontend)
- **Patient Registration & Login**: Secure authentication system
- **Appointment Booking**: Schedule appointments with doctors
- **Department Information**: Browse available medical departments
- **Contact & Messaging**: Send messages and inquiries


### 🔧 Admin Dashboard
- **User Management**: Manage patients, doctors, and admin accounts
- **Doctor Registration**: Add new doctors to the system
- **Appointment Management**: View and manage all appointments
- **Message Center**: Handle patient inquiries and messages
- **Analytics Dashboard**: Overview of system statistics

### 🔐 Backend API
- **RESTful API**: Clean and organized API endpoints
- **JWT Authentication**: Secure token-based authentication
- **MongoDB Integration**: Robust database operations
- **File Upload**: Support for document and image uploads (Cloudinary)
- **Error Handling**: Comprehensive error management
- **Input Validation**: Data validation and sanitization

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Cloudinary** - File storage
- **Validator** - Input validation

### Frontend & Dashboard
- **React.js** - UI library
- **Vite** - Build tool
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **React Icons** - Icon library
- **React Multi Carousel** - Carousel component

## 📁 Project Structure

```
hospital/
├── backend/                 # Node.js/Express backend
│   ├── config/             # Configuration files
│   ├── controller/         # Route controllers
│   ├── database/           # Database connection
│   ├── middlewares/        # Custom middlewares
│   ├── models/             # MongoDB schemas
│   ├── router/             # API routes
│   ├── utils/              # Utility functions
│   ├── app.js              # Express app configuration
│   └── server.js           # Server entry point
├── frontend/               # Patient portal (React)
│   ├── public/             # Static assets
│   ├── src/                # Source code
│   │   ├── components/     # Reusable components
│   │   ├── Pages/          # Page components
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   └── index.html          # HTML template
├── dashboard/              # Admin dashboard (React)
│   ├── public/             # Static assets
│   ├── src/                # Source code
│   │   ├── components/     # Dashboard components
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   └── index.html          # HTML template
└── README.md               # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Git


### Environment Configuration

Create a `config.env` file in the `backend/config/` directory:

```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret
JWT_EXPIRES= day
COOKIE_EXPIRE= day

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

FRONTEND_URL=http://localhost:5173
DASHBOARD_URL=http://localhost:5174
```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm start
   ```
   Server runs on `http://localhost:5000`

2. **Start the Frontend (Patient Portal)**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

3. **Start the Dashboard (Admin Panel)**
   ```bash
   cd dashboard
   npm run dev
   ```
   Dashboard runs on `http://localhost:5174`
