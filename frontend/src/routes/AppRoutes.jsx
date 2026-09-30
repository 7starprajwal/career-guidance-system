import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

// ============================================================
// PUBLIC
// ============================================================

import Home from "../pages/Home";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// ============================================================
// STUDENT LAYOUT
// ============================================================

import DashboardLayout from "../layouts/DashboardLayout";

// ============================================================
// ADMIN LAYOUT
// ============================================================

import AdminLayout from "../layouts/AdminLayout";

// ============================================================
// STUDENT PAGES
// ============================================================

import Dashboard from "../pages/student/Dashboard";
import CareerAnalysis from "../pages/student/CareerAnalysis";
import Profile from "../pages/student/Profile";
import Assessment from "../pages/student/Assessment";
import SkillGap from "../pages/student/SkillGap";
import Roadmap from "../pages/student/Roadmap";
import Courses from "../pages/student/Courses";
import Progress from "../pages/student/Progress";
import Chatbot from "../pages/student/Chatbot";
import Feedback from "../pages/student/Feedback";

// ============================================================
// ADMIN PAGES
// ============================================================

import AdminDashboard from "../pages/admin/AdminDashboard";
import Analytics from "../pages/admin/Analytics";
import Careers from "../pages/admin/Careers";
import Skills from "../pages/admin/Skills";
import AdminCourses from "../pages/admin/Courses";
import AdminUsers from "../pages/admin/Users";
import AdminFeedback from "../pages/admin/Feedback";

// ============================================================
// GUARDS
// ============================================================

import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

// ============================================================
// 404 PAGE
// ============================================================

import NotFound from "../pages/NotFound";

// ============================================================
// APP ROUTES
// ============================================================

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ==================================================
            PUBLIC ROUTES
        ================================================== */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* ==================================================
            STUDENT ROUTES
        ================================================== */}

        <Route element={<ProtectedRoute />}>

          <Route element={<DashboardLayout />}>

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/career-analysis"
              element={<CareerAnalysis />}
            />

            <Route
              path="/skill-gap"
              element={<SkillGap />}
            />

            <Route
              path="/roadmap"
              element={<Roadmap />}
            />

            <Route
              path="/courses"
              element={<Courses />}
            />

            <Route
              path="/progress"
              element={<Progress />}
            />

            <Route
              path="/assessment"
              element={<Assessment />}
            />

            <Route
              path="/chatbot"
              element={<Chatbot />}
            />

            <Route
              path="/profile"
              element={<Profile />}
            />

            <Route
              path="/feedback"
              element={<Feedback />}
            />

          </Route>

        </Route>

        {/* ==================================================
            ADMIN ROUTES
        ================================================== */}

        <Route element={<AdminRoute />}>

          <Route element={<AdminLayout />}>

            <Route
              path="/admin"
              element={<AdminDashboard />}
            />

            <Route
              path="/admin/analytics"
              element={<Analytics />}
            />

            <Route
              path="/admin/careers"
              element={<Careers />}
            />

            <Route
              path="/admin/skills"
              element={<Skills />}
            />

            <Route
              path="/admin/courses"
              element={<AdminCourses />}
            />

            <Route
              path="/admin/users"
              element={<AdminUsers />}
            />

            <Route
              path="/admin/feedback"
              element={<AdminFeedback />}
            />

          </Route>

        </Route>

        {/* ==================================================
            404 PAGE
        ================================================== */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;