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
import TeamDetailPage from "@/pages/dashboard/team-detail";
import CreateTeamPage from "@/pages/dashboard/create-team";
import TeamJoinRequestsPage from "@/pages/dashboard/team-join-requests";
import TeamInvitationsPage from "@/pages/dashboard/team-invitations";
import ProjectsPage from "@/pages/dashboard/projects";
import ConnectionsPage from "@/pages/dashboard/connections";
import MessagesPage from "@/pages/dashboard/messages";
import NotificationsPage from "@/pages/dashboard/notifications";
import SearchPage from "@/pages/dashboard/search";
import ProfilePage from "@/pages/dashboard/profile";
import SettingsPage from "@/pages/settings";
import NotFound from "@/pages/not-found";
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
              <Route path="teams/new" element={<CreateTeamPage />} />
              <Route path="teams/:teamId" element={<TeamDetailPage />} />
              <Route path="teams/:teamId/join-requests" element={<TeamJoinRequestsPage />} />
              <Route path="teams/:teamId/invitations" element={<TeamInvitationsPage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="connections" element={<ConnectionsPage />} />
              <Route path="messages" element={<MessagesPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="profile/:userId" element={<ProfilePage />} />
            </Route>
            
            <Route path="/settings" element={<SettingsPage />} />

            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />

          </Routes>
        </div>
      </Router>
    </Providers>
  );
}

export default App;
