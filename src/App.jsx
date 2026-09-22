import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import Login from "./features/oAuth/OAuthLogin";
import OAuthCallback from "./features/oAuth/OAuthCallback";
import GoogleCalendar from "./features/calendar/googleCalendar";
import Header from "./components/layout/header";
import ErrorBoundary from "./errors/error-boundry";
import ToastContainer from "./features/notifications/toastContainer";
import Loader from "./features/loader/loader";

function ProtectedLayout() {
  const token = sessionStorage.getItem("access_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <ErrorBoundary>
        <Header />
        <Outlet />
      </ErrorBoundary>
    </>
  );
}

function Dashboard() {
  return (
    <div style={{ maxWidth: 700, margin: "40px auto" }}>
      <h2>Dashboard</h2>
      <p>Welcome back.</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
    <ToastContainer/>
    <Loader />
      <Routes>
        {/* Public routes — no header */}
        <Route path="/login" element={<Login />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />

        {/* Authenticated routes — header wraps all of these */}
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/calendar" element={<GoogleCalendar />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
