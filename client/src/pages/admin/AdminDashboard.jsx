import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  Calendar,
  Ticket,
  BarChart3,
  QrCode,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Download,
  Code2,
  Trophy,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { analyticsAPI, eventAPI, bookingAPI } from '../../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [kpis, setKpis] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminOverview = async () => {
      try {
        setLoading(true);
        const [overviewRes, bookingsRes, eventsRes] = await Promise.all([
          analyticsAPI.getOverview(),
          bookingAPI.getAll({ limit: 6 }),
          eventAPI.getAll({ limit: 5 })
        ]);

        if (overviewRes.data.success) {
          setKpis(overviewRes.data.kpis);
        }
        if (bookingsRes.data.success) {
          setRecentBookings(bookingsRes.data.bookings || []);
        }
        if (eventsRes.data.success) {
          setUpcomingEvents(eventsRes.data.events || []);
        }
      } catch (err) {
        console.error('Failed to load admin overview:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminOverview();
  }, []);

  const handleExportCSV = async () => {
    try {
      const res = await analyticsAPI.exportCSV('bookings');
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'campusconnect_bookings.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to export CSV report');
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-2xl bg-[#0F172A] border border-[#1E293B] shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#387ED1]/20 text-xs font-semibold text-[#60A5FA] mb-2 border border-[#387ED1]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Campus Operations Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
            Executive Admin Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1 max-w-xl">
            Real-time management for college hackathons, athletic tournaments, ticket inventory, door check-ins and AI analytics.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 relative z-10">
          <button
            onClick={() => navigate('/admin/events')}
            className="px-4 py-2.5 rounded-xl bg-[#387ED1] hover:bg-[#2563EB] text-white text-xs font-semibold shadow-md transition-all flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Create Event</span>
          </button>
          <button
            onClick={() => navigate('/admin/ticket-verification')}
            className="px-4 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-semibold shadow-md transition-all flex items-center gap-2"
          >
            <QrCode className="w-4 h-4" />
            <span>Door Check-In Desk</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-white text-xs font-semibold border border-[#334155] transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-[#387ED1]" />
            <span>Export CSV</span>
          </button>
        </div>

        <div className="absolute right-0 top-0 w-80 h-80 bg-[#387ED1]/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
        <div className="p-5 rounded-2xl bg-[#0F172A] border border-[#1E293B] shadow-md">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-xs font-medium">Total Registered Students</span>
            <Users className="w-5 h-5 text-[#387ED1]" />
          </div>
          <h3 className="text-2xl font-display font-bold text-white mt-2">
            {kpis?.totalStudents || 0}
          </h3>
          <p className="text-[11px] text-[#10B981] mt-1 font-medium">Active campus accounts</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F172A] border border-[#1E293B] shadow-md">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-xs font-medium">Total Campus Events</span>
            <Calendar className="w-5 h-5 text-[#387ED1]" />
          </div>
          <h3 className="text-2xl font-display font-bold text-white mt-2">
            {kpis?.totalEvents || 0}
          </h3>
          <p className="text-[11px] text-[#60A5FA] mt-1 font-medium">
            {kpis?.upcomingEvents || 0} upcoming & open
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F172A] border border-[#1E293B] shadow-md">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-xs font-medium">Total Tickets Issued</span>
            <Ticket className="w-5 h-5 text-[#10B981]" />
          </div>
          <h3 className="text-2xl font-display font-bold text-white mt-2">
            {kpis?.totalBookings || 0}
          </h3>
          <p className="text-[11px] text-[#10B981] mt-1 font-medium">
            {kpis?.overallUtilization || 0}% avg capacity fill
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F172A] border border-[#1E293B] shadow-md">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-xs font-medium">Door Check-In Turnout</span>
            <QrCode className="w-5 h-5 text-[#F59E0B]" />
          </div>
          <h3 className="text-2xl font-display font-bold text-white mt-2">
            {kpis?.totalCheckedIn || 0}
          </h3>
          <p className="text-[11px] text-[#F59E0B] mt-1 font-medium">
            {kpis?.checkInRate || 0}% verified attendees
          </p>
        </div>
      </div>

      {/* Secondary Quick Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#111827] border border-[#1E293B] flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[#64748B]">Active Hackathons</span>
            <p className="text-lg font-bold text-white mt-0.5">{kpis?.activeHackathons || 0}</p>
          </div>
          <Code2 className="w-5 h-5 text-[#387ED1]" />
        </div>

        <div className="p-4 rounded-xl bg-[#111827] border border-[#1E293B] flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[#64748B]">Sports Tournaments</span>
            <p className="text-lg font-bold text-white mt-0.5">{kpis?.liveSports || 0}</p>
          </div>
          <Trophy className="w-5 h-5 text-[#F59E0B]" />
        </div>

        <div className="p-4 rounded-xl bg-[#111827] border border-[#1E293B] flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[#64748B]">Sold-Out Events</span>
            <p className="text-lg font-bold text-white mt-0.5">{kpis?.soldOutEvents || 0}</p>
          </div>
          <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
        </div>

        <div className="p-4 rounded-xl bg-[#111827] border border-[#1E293B] flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[#64748B]">Teams Formed</span>
            <p className="text-lg font-bold text-white mt-0.5">{kpis?.totalTeams || 0}</p>
          </div>
          <Users className="w-5 h-5 text-[#38BDF8]" />
        </div>
      </div>

      {/* Main Grid: Recent Bookings & Upcoming Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Registrations Table */}
        <div className="lg:col-span-2 rounded-2xl bg-[#0F172A] border border-[#1E293B] overflow-hidden shadow-lg flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-[#1E293B] bg-[#0B0F19] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-[#387ED1]" />
                  <span>Recent Ticket Bookings</span>
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">Live stream of incoming participant registrations</p>
              </div>

              <button
                onClick={() => navigate('/admin/bookings')}
                className="text-xs font-semibold text-[#387ED1] hover:text-[#60A5FA] transition-colors"
              >
                View All Bookings →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#111827] text-[#94A3B8] uppercase text-[10px] tracking-wider border-b border-[#1E293B]">
                  <tr>
                    <th className="py-3 px-4">Ticket Code</th>
                    <th className="py-3 px-4">Attendee</th>
                    <th className="py-3 px-4">Event</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Door Check-In</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E293B]">
                  {recentBookings.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-[#64748B]">
                        No bookings recorded yet.
                      </td>
                    </tr>
                  ) : (
                    recentBookings.map((b) => (
                      <tr key={b._id} className="hover:bg-[#1E293B]/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-[#60A5FA]">
                          {b.ticketCode}
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-white">{b.attendeeDetails?.fullName || b.user?.fullName}</p>
                          <p className="text-[10px] text-[#64748B]">{b.attendeeDetails?.studentOrEmployeeId || b.user?.studentOrEmployeeId}</p>
                        </td>
                        <td className="py-3.5 px-4 text-[#94A3B8] max-w-xs truncate">
                          {b.event?.title}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              b.status === 'confirmed'
                                ? 'bg-[#10B981]/20 text-[#10B981]'
                                : 'bg-[#EF4444]/20 text-[#EF4444]'
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              b.checkInStatus === 'checked_in'
                                ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30'
                                : 'bg-[#1E293B] text-[#64748B]'
                            }`}
                          >
                            {b.checkInStatus === 'checked_in' ? 'Verified' : 'Unchecked'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: AI Analytics & Predictions Shortcut Card */}
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-[#387ED1]/30 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#60A5FA]">
              <Sparkles className="w-4 h-4 text-[#387ED1]" />
              <span>Scikit-Learn Predictive Model</span>
            </div>
            <h3 className="text-lg font-bold text-white">AI Event Turnout Forecasting</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Regression modeling analyzes historical turnout across technical, cultural, and athletic tracks to forecast exact capacity demands.
            </p>

            <button
              onClick={() => navigate('/admin/analytics')}
              className="w-full py-2.5 rounded-xl bg-[#387ED1] hover:bg-[#2563EB] text-white text-xs font-semibold shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Open Analytics Engine</span>
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-[#0F172A] border border-[#1E293B] space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Quick Actions</h4>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/admin/ticket-verification')}
                className="w-full p-2.5 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-left text-xs font-medium text-white flex items-center justify-between transition-colors"
              >
                <span>Door Staff Check-In Scanner</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#387ED1]" />
              </button>
              <button
                onClick={() => navigate('/admin/hackathons')}
                className="w-full p-2.5 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-left text-xs font-medium text-white flex items-center justify-between transition-colors"
              >
                <span>Review Hackathon Submissions</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#387ED1]" />
              </button>
              <button
                onClick={() => navigate('/admin/notifications')}
                className="w-full p-2.5 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-left text-xs font-medium text-white flex items-center justify-between transition-colors"
              >
                <span>Broadcast Event Announcement</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#387ED1]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
