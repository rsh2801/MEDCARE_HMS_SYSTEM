
# MedCare Hospital Management System

A full-stack hospital management system built with the MERN stack featuring three role-based portals (Patient, Admin, Doctor), an AI-powered symptom checker chatbot using Google Gemini, dark/light theme support, and a modern UI built with Tailwind CSS and Shadcn/ui.

---

## Live Demo

| Portal | Link |
|--------|------|
| Patient Portal | [medcare-hms-rs.netlify.app](https://roshannitjsr-patients.netlify.app/) |
| Admin Dashboard | [medcare-hms-rs-admin.netlify.app](https://roshannitjsr-admin.netlify.app/) |
| Doctor Dashboard | [medcare-hms-rs-admin.netlify.app](https://roshannitjsr-doctor.netlify.app/) |

**Admin Login:** `admin@medcare.com` / `qwertyuiop`

---


---

## Features

### Patient Portal
- Register and login with JWT-based authentication
- Browse doctors by department
- Book appointments with real-time slot availability
- View, track, and cancel appointments
- AI-powered symptom checker chatbot (suggests department + urgency level)
- Update profile and reset password
- Send contact messages to the hospital
- Dark/Light theme toggle
- Responsive design with mobile bottom navigation

### Admin Dashboard
- Secure admin login
- Dashboard with animated statistics (doctors, appointments, patients)
- Add and manage doctors (with avatar upload via Cloudinary)
- Register new admin accounts
- View and manage all appointments (accept/reject)
- View patient contact messages
- Dark/Light theme toggle

### Doctor Portal
- Doctor login
- Dashboard with appointment statistics
- View and manage assigned appointments (accept/reject)
- Update profile information
- Dark/Light theme toggle

### AI Symptom Checker Chatbot
- Powered by Google Gemini API (gemini-2.0-flash)
- Strategy pattern architecture (easily swap AI providers)
- Acts as a medical triage assistant — never diagnoses or prescribes
- Asks clarifying questions before suggesting a department
- Returns structured responses: department recommendation + urgency level
- Supports 9 departments: Pediatrics, Orthopedics, Cardiology, Neurology, Oncology, Radiology, Physical Therapy, Dermatology, ENT
- Urgency levels: Routine, Soon, Urgent
- "Book Appointment" button pre-fills the appointment form with the suggested department
- No authentication required — publicly accessible

---

## Tech Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB + Mongoose | Database + ODM |
| JWT + Bcrypt | Authentication + password hashing |
| Cloudinary | Doctor avatar storage |
| Google Generative AI SDK | Gemini chatbot integration |
| express-fileupload | File upload handling |
| Validator | Input validation |

### Frontend (All 3 Portals)
| Technology | Purpose |
|-----------|---------|
| React 18 | UI library |
| Vite | Build tool + dev server |
| Tailwind CSS v4 | Utility-first styling |
| Shadcn/ui | Accessible UI components |
| React Router v6 | Client-side routing |
| Axios | HTTP client |
| Framer Motion | Animations + page transitions |
| Lucide React | Icons |
| Sonner | Toast notifications |
| Recharts | Dashboard charts (admin + doctor) |
| React Multi Carousel | Doctor carousel |

---

## Project Structure

```
MEDCARE_HMS_SYSTEM/
├── backend/
│   ├── config/
│   │   └── config.env              # Environment variables
│   ├── controller/
│   │   ├── userController.js       # Auth, user, doctor, admin management
│   │   ├── appointmentController.js
│   │   ├── messageController.js
│   │   └── chatbotController.js    # AI chatbot controller
│   ├── database/
│   │   └── dbConnection.js
│   ├── middlewares/
│   │   ├── auth.js                 # Role-based JWT auth
│   │   ├── error.js                # Global error handler
│   │   └── catchAsyncErrors.js
│   ├── models/
│   │   ├── userSchema.js           # Patient, Doctor, Admin (single schema)
│   │   ├── appointmentSchema.js
│   │   └── messageSchema.js
│   ├── router/
│   │   ├── userRouter.js
│   │   ├── appointmentRouter.js
│   │   ├── messageRouter.js
│   │   └── chatbotRouter.js
│   ├── services/
│   │   ├── aiService.js            # AI strategy context + system prompt
│   │   └── providers/
│   │       └── geminiProvider.js    # Gemini API implementation
│   ├── utils/
│   │   └── jwtToken.js
│   ├── app.js
│   └── server.js
│
├── frontend/                        # Patient Portal (port 5173)
│   └── src/
│       ├── Pages/
│       │   ├── Home.jsx
│       │   ├── Appointment.jsx
│       │   ├── MyAppointments.jsx
│       │   ├── OurDoctors.jsx
│       │   ├── AboutUs.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Profile.jsx
│       │   └── ForgotPassword.jsx
│       ├── components/
│       │   ├── Chatbot.jsx          # AI symptom checker widget
│       │   ├── AppointmentForm.jsx
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── BottomNav.jsx
│       │   ├── ThemeToggle.jsx
│       │   └── ui/                  # Shadcn/ui components
│       └── context/
│           └── ThemeContext.jsx
│
├── dashboard/                       # Admin Dashboard (port 5174)
│   └── src/
│       └── components/
│           ├── Dashboard.jsx
│           ├── Doctors.jsx
│           ├── AddNewDoctor.jsx
│           ├── AddNewAdmin.jsx
│           ├── Messages.jsx
│           ├── Sidebar.jsx
│           └── Login.jsx
│
├── doctor/                          # Doctor Portal (port 5176)
│   └── src/
│       └── components/
│           ├── Dashboard.jsx
│           ├── Appointments.jsx
│           ├── Profile.jsx
│           ├── Sidebar.jsx
│           └── Login.jsx
│
└── README.md
```

---

## API Endpoints

### Authentication & Users (`/api/v1/user`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/patient/register` | Public | Register a new patient |
| POST | `/login` | Public | Login (all roles) |
| GET | `/doctors` | Public | Get all doctors |
| GET | `/patient/me` | Patient | Get patient profile |
| PUT | `/patient/update` | Patient | Update patient profile |
| GET | `/patient/logout` | Patient | Logout patient |
| POST | `/password/reset` | Public | Reset password |
| GET | `/admin/me` | Admin | Get admin profile |
| GET | `/admin/logout` | Admin | Logout admin |
| POST | `/admin/addnew` | Admin | Register new admin |
| POST | `/doctor/addnew` | Admin | Add new doctor |
| DELETE | `/doctor/:id` | Admin | Delete a doctor |
| GET | `/doctor/me` | Doctor | Get doctor profile |
| PUT | `/doctor/profile` | Doctor | Update doctor profile |
| GET | `/doctor/logout` | Doctor | Logout doctor |

### Appointments (`/api/v1/appointment`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/available-slots` | Patient | Get available time slots |
| POST | `/post` | Patient | Book an appointment |
| GET | `/myappointments` | Patient | Get patient's appointments |
| DELETE | `/cancel/:id` | Patient | Cancel an appointment |
| GET | `/getall` | Admin | Get all appointments |
| PUT | `/update/:id` | Admin | Update appointment status |
| DELETE | `/delete/:id` | Admin | Delete an appointment |
| GET | `/doctor/all` | Doctor | Get doctor's appointments |
| GET | `/doctor/stats` | Doctor | Get appointment statistics |
| PUT | `/doctor/status/:id` | Doctor | Update appointment status |

### Messages (`/api/v1/message`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/send` | Public | Send a contact message |
| GET | `/getall` | Admin | Get all messages |

### AI Chatbot (`/api/v1/chatbot`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/ask` | Public | Send message to AI chatbot |

**Chatbot request body:**
```json
{
  "message": "I have a headache and fever",
  "history": [
    { "role": "user", "content": "previous message" },
    { "role": "assistant", "content": "previous response" }
  ]
}
```

**Chatbot response:**
```json
{
  "success": true,
  "reply": "I understand you're experiencing headache and fever...",
  "suggestedDepartment": "Neurology",
  "urgency": "soon"
}
```

---

## Getting Started

### Prerequisites
- **Node.js** v18 or higher
- **MongoDB** (local installation or MongoDB Atlas)
- **Git**
- **Cloudinary** account (for doctor avatar uploads)
- **Google Gemini API key** (for AI chatbot — optional)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/MEDCARE_HMS_SYSTEM.git
cd MEDCARE_HMS_SYSTEM
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `backend/config/config.env`:

```env
PORT=5000
MONGO_URL=mongodb://localhost:27017/HOSPITAL_MANAGEMENT

# Frontend URLs (CORS)
FRONTEND_URL_ONE=http://localhost:5173
FRONTEND_URL_TWO=http://localhost:5174
FRONTEND_URL=http://localhost:5173
FRONTEND_URL_THREE=http://localhost:5176

# Cloudinary (for doctor avatar uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# JWT
JWT_SECRET_KEY=your_secret_key
JWT_EXPIRES=7d
COOKIE_EXPIRE=7

# Default Admin (seeded on first run)
ADMIN_EMAIL=admin@medcare.com
ADMIN_PASSWORD=your_admin_password

# AI Chatbot (optional — get key from https://aistudio.google.com/apikey)
GEMINI_API_KEY=your_gemini_api_key
AI_PROVIDER=gemini
```

Start the backend:

```bash
npm start
```

The server runs at `http://localhost:5000`.

### 3. Patient Portal (Frontend)

```bash
cd frontend
npm install
npm run dev
```

Runs at `http://localhost:5173`.

### 4. Admin Dashboard

```bash
cd dashboard
npm install
npm run dev
```

Runs at `http://localhost:5174`.

### 5. Doctor Portal

```bash
cd doctor
npm install
npm run dev
```

Runs at `http://localhost:5176`.

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | Yes | Backend server port (default: 5000) |
| `MONGO_URL` | Yes | MongoDB connection string |
| `FRONTEND_URL_ONE` | Yes | Patient portal URL (CORS) |
| `FRONTEND_URL_TWO` | Yes | Admin dashboard URL (CORS) |
| `FRONTEND_URL_THREE` | Yes | Doctor portal URL (CORS) |
| `CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary API secret |
| `JWT_SECRET_KEY` | Yes | Secret for JWT signing |
| `JWT_EXPIRES` | Yes | JWT token expiry (e.g., `7d`) |
| `COOKIE_EXPIRE` | Yes | Cookie expiry in days |
| `ADMIN_EMAIL` | Yes | Default admin email |
| `ADMIN_PASSWORD` | Yes | Default admin password |
| `GEMINI_API_KEY` | No | Google Gemini API key (for chatbot) |
| `AI_PROVIDER` | No | AI provider name (default: `gemini`) |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Client Layer                        │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────┐     │
│  │ Patient  │  │    Admin     │  │    Doctor      │     │
│  │ Portal   │  │  Dashboard   │  │    Portal      │     │
│  │ :5173    │  │  :5174       │  │    :5176       │     │
│  └────┬─────┘  └──────┬───────┘  └───────┬───────┘     │
│       │               │                  │              │
│  React + Vite + Tailwind + Shadcn/ui + Framer Motion    │
└───────┼───────────────┼──────────────────┼──────────────┘
        │               │                  │
        ▼               ▼                  ▼
┌─────────────────────────────────────────────────────────┐
│                   Backend (Express.js) :5000             │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Middleware: CORS, Auth (JWT), Error Handling     │   │
│  └──────────────────────────────────────────────────┘   │
│                                                         │
│  ┌────────────┐ ┌──────────────┐ ┌─────────────────┐   │
│  │  User      │ │ Appointment  │ │   Message        │   │
│  │  Controller│ │ Controller   │ │   Controller     │   │
│  └────────────┘ └──────────────┘ └─────────────────┘   │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Chatbot Controller → AI Service (Strategy)      │   │
│  │    └── Gemini Provider (Google Generative AI)     │   │
│  └──────────────────────────────────────────────────┘   │
└───────────────────────┬─────────────────────────────────┘
                        │
              ┌─────────┼──────────┐
              ▼         ▼          ▼
         ┌────────┐ ┌────────┐ ┌────────────┐
         │MongoDB │ │Cloudi- │ │Google      │
         │        │ │nary    │ │Gemini API  │
         └────────┘ └────────┘ └────────────┘
```

---

## License

This project is for educational and portfolio purposes.
