import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ReportIncident from './components/ReportIncident';
import Navbar from './components/NavBar';
import MyReports from './components/MyReports';
import AdminReports from './components/AdminReports';  // Assuming you have this component
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

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Regular User Route */}
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

          {/* Admin Route */}
          <Route
            path="/admin-reports"
            element={
              <AdminRoute>
                <AdminReports />
              </AdminRoute>
            }
          />

          {/* Redirect unknown paths to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
