import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarCheck,
  Clock,
  CheckCircle2,
  Calendar,
  GraduationCap,
  Building2,
  ArrowRight,
  Sparkles,
  Ticket
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

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-campus-card via-campus-surface to-campus-card border border-campus-border overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-campus-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-campus-primary/10 border border-campus-primary/20 text-xs text-campus-primary font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Student Academic Portal
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-campus-text">
              Welcome back, <span className="text-campus-primary">{user?.fullName?.split(' ')[0]}</span>!
            </h1>
            <p className="text-xs sm:text-sm text-campus-textMuted max-w-xl">
              Book faculty doubt sessions, reserve campus labs & classrooms, and register for upcoming college hackathons.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/student/book-faculty">
              <Button variant="primary" icon={GraduationCap}>
                Book Faculty Doubt
              </Button>
            </Link>
            <Link to="/student/book-resource">
              <Button variant="secondary" icon={Building2}>
                Reserve Room / Lab
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Bookings"
          value={bookings.length}
          subtitle="All-time requests"
          icon={CalendarCheck}
          variant="emerald"
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
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Bookings & Upcoming Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <Card
            title="My Recent Bookings"
            subtitle="Track live status and scheduled slots"
            action={
              <Link to="/student/my-bookings" className="text-xs text-campus-primary hover:underline flex items-center gap-1 font-medium">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            }
          >
            {bookings.length === 0 ? (
              <div className="text-center py-8 text-sm text-campus-textMuted">
                No bookings requested yet. Click 'Book Faculty Doubt' above to get started.
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.slice(0, 5).map((booking) => (
                  <div
                    key={booking._id}
                    className="p-4 rounded-xl bg-campus-surface border border-campus-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-campus-borderGlow transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-campus-card border border-campus-border flex items-center justify-center text-campus-primary flex-shrink-0 mt-0.5">
                        {booking.bookingType === 'faculty_session' ? (
                          <GraduationCap className="w-5 h-5" />
                        ) : (
                          <Building2 className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-campus-text">
                          {booking.subject}
                        </h4>
                        <p className="text-xs text-campus-textMuted mt-0.5">
                          {booking.bookingType === 'faculty_session'
                            ? `Faculty: ${booking.faculty?.fullName || 'Faculty Member'}`
                            : `Resource: ${booking.resource?.name || 'Classroom/Lab'}`}
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-campus-textSubtle mt-1.5 font-mono">
                          <span>📅 {new Date(booking.date).toLocaleDateString()}</span>
                          <span>⏰ {booking.startTime} - {booking.endTime}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-shrink-0 self-start sm:self-center">
                      <StatusBadge status={booking.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right 1 Col: Featured Events */}
        <div className="space-y-6">
          <Card
            title="Featured Campus Events"
            subtitle="Workshops, Hackathons, Symposia"
            action={
              <Link to="/student/events" className="text-xs text-campus-primary hover:underline flex items-center gap-1 font-medium">
                Browse all <ArrowRight className="w-3 h-3" />
              </Link>
            }
          >
            {events.length === 0 ? (
              <p className="text-sm text-campus-textMuted py-4">No events scheduled.</p>
            ) : (
              <div className="space-y-4">
                {events.slice(0, 3).map((event) => (
                  <div
                    key={event._id}
                    className="group p-3.5 rounded-xl bg-campus-surface border border-campus-border hover:border-campus-primary/30 transition-all"
                  >
                    <div className="flex items-center justify-between text-[11px] text-campus-amber font-semibold uppercase tracking-wider mb-1">
                      <span>{event.category}</span>
                      <span className="font-mono text-campus-textSubtle">
                        {event.registeredCount} / {event.capacity} seats
                      </span>
                    </div>
                    <h4 className="font-display font-semibold text-sm text-campus-text group-hover:text-campus-primary transition-colors line-clamp-1">
                      {event.title}
                    </h4>
                    <p className="text-xs text-campus-textMuted mt-1 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="mt-3 pt-2.5 border-t border-campus-border/60 flex items-center justify-between text-xs">
                      <span className="text-campus-textSubtle">
                        📍 {event.venue}
                      </span>
                      <Link to="/student/events" className="text-campus-primary font-medium hover:underline flex items-center gap-1">
                        Register <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

