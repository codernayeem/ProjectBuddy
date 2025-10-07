import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Providers } from "@/providers/providers";

// Layout Components
import DashboardLayout from "@/components/dashboard/DashboardLayout";

// Pages
import LandingPage from "@/pages/landing";
import LoginPage from "@/pages/auth/login";
import RegisterPage from "@/pages/auth/register";
import HomePage from "@/pages/dashboard/home";
import TeamsPage from "@/pages/dashboard/teams";
import ProjectsPage from "@/pages/dashboard/projects";
import ConnectionsPage from "@/pages/dashboard/connections";
import NotificationsPage from "@/pages/dashboard/notifications";
import ProfilePage from "@/pages/dashboard/profile";
import SettingsPage from "@/pages/settings";
import { ProtectedRoute } from "./providers/ProtectedRoute";

function App() {
  return (
    <Providers>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<HomePage />} />
              <Route path="teams" element={<TeamsPage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="connections" element={<ConnectionsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
            
            <Route path="/settings" element={<SettingsPage />} />

          </Routes>
        </div>
      </Router>
    </Providers>
  );
}

export default App;
