import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CalendarCheck,
  Clock,
  CheckCircle2,
  Calendar,
  GraduationCap,
  Building2,
  ArrowRight,
  Sparkles,
  Ticket,
  ChevronRight,
  TrendingUp,
  MapPin,
  Flame,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { bookingAPI, eventAPI } from '../../services/api';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Time-aware dynamic greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, eventsRes] = await Promise.all([
          bookingAPI.getMy(),
          eventAPI.getAll()
        ]);

        if (bookingsRes.data.success) {
          setBookings(bookingsRes.data.bookings);
        }
        if (eventsRes.data.success) {
          setEvents(eventsRes.data.events);
        }
      } catch (error) {
        console.error('[StudentDashboard] Error loading overview:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const approvedCount = bookings.filter((b) => b.status === 'approved').length;
  const upcomingEventsCount = events.filter((e) => e.status === 'upcoming').length;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Zerodha Blue-White Bento Hero Banner */}
      <motion.div
        variants={itemVariants}
        className="relative rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-blue-50/80 via-white to-blue-50/30 border border-blue-200/80 overflow-hidden shadow-sm"
      >
        <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-gradient-to-bl from-blue-400/[0.08] to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5">
            {/* Pill chip */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs text-[#387ED1] font-semibold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Student Academic Hub</span>
              <span className="w-1 h-1 rounded-full bg-blue-400" />
              <span className="text-[11px] font-mono text-slate-500">Term 2026</span>
            </div>

            <h1 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-slate-900 tracking-tight leading-tight">
              {getGreeting()},{' '}
              <span className="text-[#387ED1]">
                {user?.fullName?.split(' ')[0] || 'Student'}!
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
              Book faculty doubt sessions, reserve campus laboratories & classrooms, and claim your tickets for college hackathons.
            </p>
          </div>

          {/* Quick Action CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 self-start lg:self-center">
            <Link to="/student/book-faculty">
              <Button variant="primary" size="lg" icon={GraduationCap}>
                Book Faculty Doubt
              </Button>
            </Link>
            <Link to="/student/book-resource">
              <Button variant="secondary" size="lg" icon={Building2}>
                Reserve Room / Lab
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* KPI Stats Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
      >
        <StatCard
          title="Total Bookings"
          value={bookings.length}
          subtitle="All-time requests"
          icon={CalendarCheck}
          variant="blue"
          trend="+12%"
          trendPositive={true}
        />
        <StatCard
          title="Pending Approvals"
          value={pendingCount}
          subtitle="Awaiting faculty/admin"
          icon={Clock}
          variant="amber"
        />
        <StatCard
          title="Approved Sessions"
          value={approvedCount}
          subtitle="Ready to attend"
          icon={CheckCircle2}
          variant="emerald"
        />
        <StatCard
          title="Active Events"
          value={upcomingEventsCount}
          subtitle="Open for registration"
          icon={Calendar}
          variant="cyan"
          trend="Live"
          trendPositive={true}
        />
      </motion.div>

      {/* Main Content Sections: Recent Bookings & Featured Events */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left 2 Columns: Recent Bookings List */}
        <div className="lg:col-span-2 space-y-6">
          <Card
            title="My Recent Bookings"
            subtitle="Track live status and scheduled slots"
            action={
              <Link
                to="/student/my-bookings"
                className="text-xs text-[#387ED1] hover:text-blue-700 flex items-center gap-1 font-semibold group transition-colors"
              >
                <span>View all</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            }
          >
            {loading ? (
              <div className="py-12 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-[#387ED1] border-t-transparent rounded-full animate-spin" />
                <span>Loading your booking schedule...</span>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
                <CalendarCheck className="w-10 h-10 text-slate-300 mx-auto mb-2.5" />
                <p className="text-sm font-medium text-slate-700">No active bookings</p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  You haven't requested any doubt sessions or labs yet. Click above to schedule one.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.slice(0, 5).map((booking) => (
                  <div
                    key={booking._id}
                    className="p-4 rounded-xl bg-slate-50/50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 transition-all duration-200 group"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#387ED1] flex-shrink-0 mt-0.5 group-hover:scale-105 transition-transform shadow-sm">
                        {booking.bookingType === 'faculty_session' ? (
                          <GraduationCap className="w-5 h-5" />
                        ) : (
                          <Building2 className="w-5 h-5" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-semibold text-sm text-slate-900 group-hover:text-[#387ED1] transition-colors">
                          {booking.subject}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {booking.bookingType === 'faculty_session'
                            ? `Faculty: ${booking.faculty?.fullName || 'Faculty Member'}`
                            : `Resource: ${booking.resource?.name || 'Classroom/Lab'}`}
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono pt-0.5">
                          <span>📅 {new Date(booking.date).toLocaleDateString()}</span>
                          <span>⏰ {booking.startTime} - {booking.endTime}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-shrink-0 self-start sm:self-center">
                      <StatusBadge status={booking.status} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right 1 Column: Featured Events Bento Card */}
        <div className="space-y-6">
          <Card
            title="Featured Campus Events"
            subtitle="Workshops, Hackathons, Symposia"
            action={
              <Link
                to="/student/events"
                className="text-xs text-[#387ED1] hover:text-blue-700 flex items-center gap-1 font-semibold group transition-colors"
              >
                <span>Browse all</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            }
          >
            {events.length === 0 ? (
              <p className="text-sm text-slate-500 py-6 text-center">
                No events currently scheduled.
              </p>
            ) : (
              <div className="space-y-4">
                {events.slice(0, 3).map((event) => (
                  <div
                    key={event._id}
                    className="p-4 rounded-xl bg-slate-50/50 border border-slate-200 hover:border-orange-300 hover:bg-orange-50/10 transition-all duration-200 group"
                  >
                    <div className="flex items-center justify-between text-[11px] font-semibold mb-1.5">
                      <span className="text-[#FF5722] uppercase tracking-wider font-mono">
                        {event.category}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {event.registeredCount} / {event.capacity} seats
                      </span>
                    </div>

                    <h4 className="font-display font-semibold text-sm text-slate-900 group-hover:text-[#387ED1] transition-colors line-clamp-1">
                      {event.title}
                    </h4>

                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>

                    <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        <span className="truncate max-w-[130px]">{event.venue}</span>
                      </span>

                      <Link
                        to="/student/events"
                        className="text-[#387ED1] hover:text-blue-700 font-semibold flex items-center gap-1 text-xs"
                      >
                        Register <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StudentDashboard;
