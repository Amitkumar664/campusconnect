import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout
import DashboardLayout from '../components/layout/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';

// Public Pages
import Landing from '../pages/Landing';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Profile from '../pages/auth/Profile';

// Student Pages
import StudentDashboard from '../pages/student/StudentDashboard';
import BookFacultySession from '../pages/student/BookFacultySession';
import BookResource from '../pages/student/BookResource';
import EventBrowse from '../pages/student/EventBrowse';
import MyBookings from '../pages/student/MyBookings';

// Faculty Pages
import FacultyDashboard from '../pages/faculty/FacultyDashboard';
import SessionRequests from '../pages/faculty/SessionRequests';
import AvailabilityManager from '../pages/faculty/AvailabilityManager';
import SessionHistory from '../pages/faculty/SessionHistory';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AnalyticsDashboard from '../pages/admin/AnalyticsDashboard';
import MasterBookings from '../pages/admin/MasterBookings';
import ResourceManagement from '../pages/admin/ResourceManagement';
import EventManagement from '../pages/admin/EventManagement';
import UserManagement from '../pages/admin/UserManagement';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Student Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['student']} />}>
        <Route path="/student" element={<DashboardLayout />}>
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="book-faculty" element={<BookFacultySession />} />
          <Route path="book-resource" element={<BookResource />} />
          <Route path="events" element={<EventBrowse />} />
          <Route path="my-bookings" element={<MyBookings />} />
          <Route path="profile" element={<Profile />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>
      </Route>

      {/* Faculty Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['faculty']} />}>
        <Route path="/faculty" element={<DashboardLayout />}>
          <Route path="dashboard" element={<FacultyDashboard />} />
          <Route path="requests" element={<SessionRequests />} />
          <Route path="availability" element={<AvailabilityManager />} />
          <Route path="history" element={<SessionHistory />} />
          <Route path="profile" element={<Profile />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>
      </Route>

      {/* Admin Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<DashboardLayout />}>
          <Route path="analytics" element={<AnalyticsDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="bookings" element={<MasterBookings />} />
          <Route path="resources" element={<ResourceManagement />} />
          <Route path="events" element={<EventManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="profile" element={<Profile />} />
          <Route index element={<Navigate to="analytics" replace />} />
        </Route>
      </Route>

      {/* Catch-all 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;

