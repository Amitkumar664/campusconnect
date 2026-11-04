import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  BarChart3,
  CalendarCheck,
  Building2,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { analyticsAPI, bookingAPI } from '../../services/api';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [kpis, setKpis] = useState(null);
  const [pendingBookings, setPendingBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [kpiRes, bookingsRes] = await Promise.all([
          analyticsAPI.getOverview(),
          bookingAPI.getAll({ status: 'pending', limit: 6 })
        ]);

        if (kpiRes.data.success) setKpis(kpiRes.data.kpis);
        if (bookingsRes.data.success) setPendingBookings(bookingsRes.data.bookings);
      } catch (error) {
        console.error('Failed to load admin overview:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Admin Hero Header */}
      <div className="relative rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-blue-50/80 via-white to-blue-50/30 border border-blue-200/80 overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-400/[0.08] rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs text-[#387ED1] font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Central Administration Control
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
              Institutional Operations Command
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              Audit room reservations, publish official events, manage faculty accounts, and analyze campus asset utilization.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/admin/analytics">
              <Button variant="primary" icon={BarChart3}>
                Open Analytics Engine
              </Button>
            </Link>
            <Link to="/admin/bookings">
              <Button variant="secondary" icon={CalendarCheck}>
                Review Bookings
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Registered Students"
          value={kpis?.totalStudents || 0}
          subtitle="Verified active accounts"
          icon={Users}
          variant="blue"
        />
        <StatCard
          title="Faculty Members"
          value={kpis?.totalFaculty || 0}
          subtitle="Active mentors"
          icon={CalendarCheck}
          variant="cyan"
        />
        <StatCard
          title="Campus Facilities"
          value={kpis?.totalResources || 0}
          subtitle="Classrooms, labs, halls"
          icon={Building2}
          variant="emerald"
        />
        <StatCard
          title="Published Events"
          value={kpis?.totalEvents || 0}
          subtitle="Active & upcoming"
          icon={Calendar}
          variant="amber"
        />
      </div>

      {/* Operational Modules Shortcut Grid */}
      <div>
        <h3 className="font-display font-semibold text-lg text-slate-900 mb-4">
          Administrative Modules
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/admin/bookings" className="group">
            <Card interactive className="h-full">
              <CalendarCheck className="w-8 h-8 text-[#387ED1] mb-3 group-hover:scale-105 transition-transform" />
              <h4 className="font-display font-semibold text-base text-slate-900">
                Master Bookings
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Approve or reject resource allocations and monitor doubt sessions.
              </p>
            </Card>
          </Link>

          <Link to="/admin/resources" className="group">
            <Card interactive className="h-full">
              <Building2 className="w-8 h-8 text-[#FF5722] mb-3 group-hover:scale-105 transition-transform" />
              <h4 className="font-display font-semibold text-base text-slate-900">
                Facility & Lab Manager
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Add computer labs, update equipment capacity, and toggle availability.
              </p>
            </Card>
          </Link>

          <Link to="/admin/events" className="group">
            <Card interactive className="h-full">
              <Calendar className="w-8 h-8 text-emerald-600 mb-3 group-hover:scale-105 transition-transform" />
              <h4 className="font-display font-semibold text-base text-slate-900">
                College Event Publishing
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Create hackathons, workshops, set ticket caps, and monitor turnouts.
              </p>
            </Card>
          </Link>

          <Link to="/admin/users" className="group">
            <Card interactive className="h-full">
              <Users className="w-8 h-8 text-sky-600 mb-3 group-hover:scale-105 transition-transform" />
              <h4 className="font-display font-semibold text-base text-slate-900">
                User Directory & Roles
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Manage student, faculty, and administrative account statuses.
              </p>
            </Card>
          </Link>
        </div>
      </div>

      {/* Pending Reservations Requiring Review */}
      <Card
        title="Pending Resource & Session Bookings Requiring Attention"
        subtitle="Review and action requests to release or commit campus spaces"
        action={
          <Link to="/admin/bookings" className="text-xs text-[#387ED1] hover:underline flex items-center gap-1 font-medium">
            View master registry <ArrowRight className="w-3 h-3" />
          </Link>
        }
      >
        {pendingBookings.length === 0 ? (
          <div className="py-8 text-center text-sm text-slate-400">
            ✓ All booking requests are currently up to date!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-mono text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Requester</th>
                  <th className="py-3 px-4">Target Entity</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 uppercase">
                        {b.bookingType === 'faculty_session' ? 'Faculty Doubt' : 'Lab / Room'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900 max-w-xs truncate">
                      {b.subject}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {b.requester?.fullName} ({b.requester?.studentOrEmployeeId})
                    </td>
                    <td className="py-3 px-4 text-[#387ED1] font-medium">
                      {b.bookingType === 'faculty_session'
                        ? b.faculty?.fullName
                        : b.resource?.name}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {new Date(b.date).toLocaleDateString()} • {b.startTime}-{b.endTime}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link to="/admin/bookings">
                        <Button size="sm" variant="primary">
                          Review
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminDashboard;
