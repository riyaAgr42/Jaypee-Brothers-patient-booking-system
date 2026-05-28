# DocEase

DocEase is a MERN Stack Patient Appointment Booking System for clinics and healthcare centers. It includes role-based dashboards for patients, doctors, and admins, JWT authentication, doctor approval workflow, dynamic doctor search, appointment booking, and responsive healthcare UI.

## Features

- Patient and doctor registration with JWT login/logout
- Password hashing with bcrypt
- Role-based protected routes
- Doctor registrations stay pending until admin approval
- Admin can approve, reject, edit, and delete doctors
- Approved doctors appear in public search and listings
- Dynamic doctor search by name, specialization, location, experience, fees, and availability day
- Doctor profile page with qualification, fees, clinic address, about section, days, slots, and booking action
- Appointment lifecycle: pending, approved, rejected, completed, cancelled
- Doctor dashboard for profile editing and appointment request management
- Patient dashboard for profile editing, appointment history, cancellation, and appointment download
- Admin analytics cards for patients, doctors, active doctors, appointments, and pending requests
- Dark mode toggle and responsive Tailwind UI
- Vercel-compatible API entry with environment variables

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Axios
- Backend: Node.js, Express.js, MongoDB, Mongoose
- Auth: JWT, bcrypt
- Deployment: Vercel

## Environment Variables

Create `backend/.env`:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=admin@docease.com
ADMIN_PASSWORD=replace_with_a_strong_password
ADMIN_NAME=DocEase Admin
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## Installation

```bash
npm run install:all
npm run backend
npm run frontend
```

Frontend runs with Vite. Backend uses the Express server and MongoDB Atlas connection from `backend/.env`.

## API Routes

- `POST /api/auth/register` - Register patient or doctor
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Current user
- `GET /api/doctors` - Public approved doctor listing with filters
- `GET /api/doctors/:id` - Public doctor profile
- `GET /api/doctors/me` - Doctor dashboard profile
- `PUT /api/doctors/me` - Update doctor profile
- `POST /api/appointments` - Book appointment
- `GET /api/appointments/my` - Patient appointments
- `PATCH /api/appointments/:id/cancel` - Cancel appointment
- `PATCH /api/appointments/:id/doctor-status` - Doctor approve/reject/complete
- `GET /api/admin/dashboard` - Admin analytics
- `GET /api/admin/doctors` - All doctors including pending requests
- `PATCH /api/admin/doctors/:id/approval` - Approve/reject doctor
- `GET /api/admin/appointments` - All appointments
- `GET /api/admin/patients` - All patients

## Vercel Deployment

The project includes `api/index.js` and `vercel.json`. Add `MONGODB_URI`, `JWT_SECRET`, and `ADMIN_PASSWORD` in Vercel environment variables. Add Cloudinary variables too if image uploads are enabled. Avoid hardcoded localhost URLs; the frontend API client reads `VITE_API_BASE_URL` when needed.

## Interview Notes

This project is structured with MVC backend folders, reusable frontend components, service-based API calls, role-based routing, and practical healthcare workflows. It is designed to be easy to explain in placements and easy to extend.
