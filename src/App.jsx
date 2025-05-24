import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ReportIncident from './components/ReportIncident';
import Navbar from './components/NavBar';
import MyReports from './components/MyReports';
import AdminReports from './components/AdminReports';
import About from './components/About';
import { Toaster } from 'react-hot-toast';
import DonationCampaigns from './components/DonationCampaigns'; // new Donations page
import Footer from './components/Footer';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Wrapper to protect routes for regular users
function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? (
    <>
      <Navbar />
      <div style={{ paddingTop: '80px' }}>{children}</div>
    </>
  ) : (
    <Navigate to="/login" replace />
  );
}

// Wrapper to protect routes for admins
function AdminRoute({ children }) {
  const { currentUser, userRole } = useAuth();
  return currentUser && userRole === "admin" ? (
    <>
      <Navbar />
      <div style={{ paddingTop: '80px' }}>{children}</div>
    </>
  ) : (
    <Navigate to="/login" replace />
  );
}

function AppContent() {
  const location = useLocation();
  const hideFooter = location.pathname === "/login";

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Regular User Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/report"
          element={
            <PrivateRoute>
              <ReportIncident />
            </PrivateRoute>
          }
        />

        <Route
          path="/my-reports"
          element={
            <PrivateRoute>
              <MyReports />
            </PrivateRoute>
          }
        />

        {/* New Donations Route */}
        <Route
          path="/donation-campaigns"
          element={
            <PrivateRoute>
              <DonationCampaigns />
            </PrivateRoute>
          }
        />

        {/* Admin Route */}
        <Route
          path="/admin-reports"
          element={
            <AdminRoute>
              <AdminReports />
            </AdminRoute>
          }
        />

        {/* Public Route */}
        <Route
          path="/about"
          element={
            <>
              <Navbar />
              <div style={{ paddingTop: '80px' }}>
                <About />
              </div>
            </>
          }
        />

        {/* Redirect unknown paths to dashboard */}
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
