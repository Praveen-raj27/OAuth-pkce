import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import Login from "./OAuthLogin";
import OAuthCallback from "./OAuthCallback";
import GoogleCalendar from "./googleCalendar";
import Header from "./header";

function ProtectedLayout() {
  const token = sessionStorage.getItem("access_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Header />
      <Outlet />
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