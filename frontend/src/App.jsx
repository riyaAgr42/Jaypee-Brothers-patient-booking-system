import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DoctorsPage from "./pages/DoctorsPage";
import DoctorDetailsPage from "./pages/DoctorDetailsPage";
import BookingPage from "./pages/BookingPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import DoctorDashboardPage from "./pages/DoctorDashboardPage";
import AppointmentHistoryPage from "./pages/AppointmentHistoryPage";
import NotFoundPage from "./pages/NotFoundPage";
import AdminRoute from "./components/AdminRoute";
import RoleRoute from "./components/RoleRoute";
import { useAuth } from "./hooks/useAuth";

const App = () => {
  const { user } = useAuth();
  const authenticatedHome =
    user?.role === "admin" ? "/admin" : user?.role === "doctor" ? "/doctor" : "/dashboard";

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/login"
          element={user ? <Navigate to={authenticatedHome} replace /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to={authenticatedHome} replace /> : <RegisterPage />}
        />
        <Route path="/doctors" element={<DoctorsPage />} />
        <Route path="/doctors/:id" element={<DoctorDetailsPage />} />
      </Route>

      <Route
        path="/book/:id"
        element={
          <RoleRoute allowedRoles={["patient"]}>
            <MainLayout />
          </RoleRoute>
        }
      >
        <Route index element={<BookingPage />} />
      </Route>

      <Route
        path="/dashboard"
        element={
          <RoleRoute allowedRoles={["patient"]}>
            <DashboardLayout />
          </RoleRoute>
        }
      >
        <Route index element={<UserDashboardPage />} />
        <Route path="appointments" element={<AppointmentHistoryPage />} />
      </Route>

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <DashboardLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
      </Route>

      <Route
        path="/doctor"
        element={
          <RoleRoute allowedRoles={["doctor"]}>
            <DashboardLayout />
          </RoleRoute>
        }
      >
        <Route index element={<DoctorDashboardPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
