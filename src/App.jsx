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
import ToastContainer from "./features/notifications/toastContainer";
import Loader from "./features/loader/loader";
import CommentThread from "./features/comments/commentThread";
import Dashboard from "./features/dashboard/index";
import SideBar from "./components/layout/sidebar";
import "./App.css";

function ProtectedLayout() {
  const token = sessionStorage.getItem("access_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app">
      <Header />
      <div className="app-body">
        <SideBar />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}



function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Loader />
      <Routes>
        {/* Public routes — no header */}
        <Route path="/login" element={<Login />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />

        {/* Authenticated routes — header wraps all of these */}
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/calendar" element={<GoogleCalendar />} />
          <Route path="/comment" element={<CommentThread />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
