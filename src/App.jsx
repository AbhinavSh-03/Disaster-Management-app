import { BrowserRouter as Router, Route, Routes, Navigate, useLocation} from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ReportIncident from "./components/ReportIncident";
import Navbar from "./components/NavBar";
import MyReports from "./components/MyReports";
import AdminReports from "./components/AdminReports";
import About from "./components/About";
import { Toaster } from "react-hot-toast";
import DonationCampaigns from "./components/DonationCampaigns";
import Footer from "./components/Footer";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { useNotifications } from "./hooks/useNotification";
import { LoadScript } from "@react-google-maps/api";

// Wrapper to protect routes for regular users
function PrivateRoute({ children, notifications }) {
  const { currentUser } = useAuth();
  return currentUser ? (
    <>
      <Navbar notifications={notifications} />
      <div style={{ paddingTop: "80px" }}>{children}</div>
    </>
  ) : (
    <Navigate to="/login" replace />
  );
}

// Wrapper to protect routes for admins
function AdminRoute({ children, notifications }) {
  const { currentUser, userRole } = useAuth();
  return currentUser && userRole === "admin" ? (
    <>
      <Navbar notifications={notifications} />
      <div style={{ paddingTop: "80px" }}>{children}</div>
    </>
  ) : (
    <Navigate to="/login" replace />
  );
}

function AppContent() {
  const location = useLocation();
  const hideFooter = location.pathname === "/login";
  const { notifications } = useNotifications(); // ✅ Fetch notifications globally

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute notifications={notifications}>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/report"
          element={
            <PrivateRoute notifications={notifications}>
              <ReportIncident />
            </PrivateRoute>
          }
        />

        <Route
          path="/my-reports"
          element={
            <PrivateRoute notifications={notifications}>
              <MyReports />
            </PrivateRoute>
          }
        />

        <Route
          path="/donation-campaigns"
          element={
            <PrivateRoute notifications={notifications}>
              <DonationCampaigns />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin-reports"
          element={
            <AdminRoute notifications={notifications}>
              <AdminReports />
            </AdminRoute>
          }
        />

        <Route
          path="/about"
          element={
            <>
              <Navbar notifications={notifications} />
              <div style={{ paddingTop: "80px" }}>
                <About />
              </div>
            </>
          }
        />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>

      {!hideFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
