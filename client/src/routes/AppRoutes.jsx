import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout & Protection
import DashboardLayout from '../components/layout/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';

// Public Pages
import Landing from '../pages/Landing';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Profile from '../pages/auth/Profile';

// Student Portal Pages
import StudentDashboard from '../pages/student/StudentDashboard';
import EventBrowse from '../pages/student/EventBrowse';
import HackathonHub from '../pages/student/HackathonHub';
import SportsHub from '../pages/student/SportsHub';
import VirtualEvents from '../pages/student/VirtualEvents';
import MyBookings from '../pages/student/MyBookings';
import MyTickets from '../pages/student/MyTickets';

// Admin Portal Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AnalyticsDashboard from '../pages/admin/AnalyticsDashboard';
import EventManagement from '../pages/admin/EventManagement';
import HackathonManagement from '../pages/admin/HackathonManagement';
import SportsManagement from '../pages/admin/SportsManagement';
import TicketVerification from '../pages/admin/TicketVerification';
import MasterBookings from '../pages/admin/MasterBookings';
import UserManagement from '../pages/admin/UserManagement';
import NotificationManagement from '../pages/admin/NotificationManagement';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />

      {/* Student Protected Portal */}
      <Route element={<ProtectedRoute allowedRoles={['student']} />}>
        <Route path="/student" element={<DashboardLayout />}>
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="events" element={<EventBrowse />} />
          <Route path="hackathons" element={<HackathonHub />} />
          <Route path="sports" element={<SportsHub />} />
          <Route path="virtual" element={<VirtualEvents />} />
          <Route path="my-bookings" element={<MyBookings />} />
          <Route path="my-tickets" element={<MyTickets />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>
      </Route>

      {/* Admin Protected Portal */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<DashboardLayout />}>
          <Route path="analytics" element={<AnalyticsDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="events" element={<EventManagement />} />
          <Route path="hackathons" element={<HackathonManagement />} />
          <Route path="sports" element={<SportsManagement />} />
          <Route path="ticket-verification" element={<TicketVerification />} />
          <Route path="bookings" element={<MasterBookings />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="notifications" element={<NotificationManagement />} />
          <Route index element={<Navigate to="analytics" replace />} />
        </Route>
      </Route>

      {/* Catch-all 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
