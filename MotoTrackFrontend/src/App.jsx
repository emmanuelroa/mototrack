import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { PrimaryColorProvider } from "./context/PrimaryColorContext";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { NotificationProvider } from "./components/Dashboard/CommonComponts/ToastNotifications";
import { ConfigProvider, App as AntApp } from "antd";
import LoadingOverlay from "./components/LoadingOverlay";

// ✅ These stay as static imports (always needed immediately)
import Login from "./pages/Auth/LogIn";
import Register from "./pages/Auth/Register";
import LandingPage from "./pages/LandingPage/LandingPage";
import Layout from "./Layout/Layout";

// ✅ Lazy-load all dashboard pages (only loaded when the user navigates there)
const Admin = lazy(() => import("./pages/Dashboard/Admin/AdminDashboard"));
const AdminSolicitudes = lazy(
  () => import("./pages/Dashboard/Admin/AdminSolicitudes"),
);
const AdminEmpleados = lazy(
  () => import("./pages/Dashboard/Admin/AdminGestionEmpleado"),
);
const EmpleadoDashboard = lazy(
  () => import("./pages/Dashboard/Empleado/EmpleadoDashboard"),
);
const EmpleadoGestion = lazy(
  () => import("./pages/Dashboard/Empleado/EmpleadoGestion"),
);
const CiudadanoDashboardPage = lazy(
  () => import("./pages/Dashboard/Ciudadano/CiudadanoDashboardPage"),
);
const RegistrarPage = lazy(
  () => import("./pages/Dashboard/Ciudadano/RegistrarPage"),
);
const MotocicletasPage = lazy(
  () => import("./pages/Dashboard/Ciudadano/MotocicletasPage"),
);

// Reusable fallback
const PageLoader = () => (
  <LoadingOverlay isLoading={true} text="Cargando página..." />
);

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (!allowedRoles.includes(currentUser.role)) {
    if (currentUser.role === "administrador")
      return <Navigate to="/panel/admin" replace />;
    if (currentUser.role === "empleado")
      return <Navigate to="/panel/empleado" replace />;
    return <Navigate to="/panel/ciudadano" replace />;
  }
  return children;
};

const DashboardRoutes = () => (
  <PrimaryColorProvider>
    <ThemeProvider>
      <NotificationProvider>
        <Layout />
      </NotificationProvider>
    </ThemeProvider>
  </PrimaryColorProvider>
);

const PublicRoutes = () => (
  // ✅ Single Suspense wrapper covers all lazy routes
  <Suspense fallback={<PageLoader />}>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/panel"
        element={
          <ProtectedRoute
            allowedRoles={["administrador", "empleado", "ciudadano"]}
          >
            <DashboardRoutes />
          </ProtectedRoute>
        }
      >
        <Route path="admin" element={<Admin />} />
        <Route path="admin/solicitudes" element={<AdminSolicitudes />} />
        <Route path="admin/empleados" element={<AdminEmpleados />} />
        <Route path="empleado" element={<EmpleadoDashboard />} />
        <Route path="empleado/gestion" element={<EmpleadoGestion />} />
        <Route path="ciudadano" element={<CiudadanoDashboardPage />} />
        <Route path="ciudadano/registrar" element={<RegistrarPage />} />
        <Route path="ciudadano/motocicletas" element={<MotocicletasPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Suspense>
);

function App() {
  return (
    <ConfigProvider>
      <AuthProvider>
        <LanguageProvider>
          <AntApp>
            <PublicRoutes />
          </AntApp>
        </LanguageProvider>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
