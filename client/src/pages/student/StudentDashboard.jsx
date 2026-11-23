import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Ticket,
  Code2,
  Trophy,
  ArrowRight,
  Sparkles,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { eventAPI, bookingAPI } from '../../services/api';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [activeTicket, setActiveTicket] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [eventsRes, bookingsRes] = await Promise.all([
          eventAPI.getAll(),
          bookingAPI.getMy()
        ]);

        if (eventsRes.data.success) {
          setEvents(eventsRes.data.events || []);
        }
        if (bookingsRes.data.success) {
          setMyBookings(bookingsRes.data.bookings || []);
        }
      } catch (err) {
        console.error('Failed to load student dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const upcomingConfirmedTickets = myBookings.filter(
    (b) => b.status === 'confirmed' && b.checkInStatus !== 'checked_in'
  );

  const activeHackathons = events.filter((e) => e.eventType === 'hackathon' && e.status !== 'completed');
  const activeSports = events.filter((e) => e.eventType === 'sports' && e.status !== 'completed');

  return (
    <div className="space-y-8">
      {/* Personalized Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#1E3A8A]/40 border border-[#1E293B] p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#387ED1]/20 border border-[#387ED1]/40 text-xs font-semibold text-[#60A5FA] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome to CampusConnect</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
            Welcome back, {user?.fullName || 'Student'}! 👋
          </h1>
          <p className="mt-2 text-sm text-[#94A3B8] leading-relaxed">
            Discover university hackathons, sports tournaments, expert webinars, and claim your QR digital passes with instant door verification.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/student/events')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#387ED1] hover:bg-[#2563EB] text-white text-xs sm:text-sm font-semibold shadow-[0_4px_14px_rgba(56,126,209,0.4)] transition-all"
            >
              <span>Explore All Events</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/student/my-tickets')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-white text-xs sm:text-sm font-semibold border border-[#334155] transition-all"
            >
              <Ticket className="w-4 h-4 text-[#387ED1]" />
              <span>My Digital Tickets ({upcomingConfirmedTickets.length})</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#387ED1]/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="p-5 rounded-2xl bg-[#0F172A] border border-[#1E293B] shadow-md flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#64748B]">Total Bookings</p>
            <h3 className="text-2xl font-display font-bold text-white mt-1">{myBookings.length}</h3>
            <p className="text-[11px] text-[#10B981] mt-1 font-medium">All-time passes</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#387ED1]/15 text-[#387ED1] flex items-center justify-center">
            <Ticket className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F172A] border border-[#1E293B] shadow-md flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#64748B]">Upcoming Events</p>
            <h3 className="text-2xl font-display font-bold text-white mt-1">{upcomingConfirmedTickets.length}</h3>
            <p className="text-[11px] text-[#60A5FA] mt-1 font-medium">Ready for check-in</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#10B981]/15 text-[#10B981] flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F172A] border border-[#1E293B] shadow-md flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#64748B]">Active Hackathons</p>
            <h3 className="text-2xl font-display font-bold text-white mt-1">{activeHackathons.length}</h3>
            <p className="text-[11px] text-[#F59E0B] mt-1 font-medium">Prizes & Team builds</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/15 text-[#F59E0B] flex items-center justify-center">
            <Code2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F172A] border border-[#1E293B] shadow-md flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#64748B]">Sports Tournaments</p>
            <h3 className="text-2xl font-display font-bold text-white mt-1">{activeSports.length}</h3>
            <p className="text-[11px] text-[#38BDF8] mt-1 font-medium">Cricket, Football & more</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#38BDF8]/15 text-[#38BDF8] flex items-center justify-center">
            <Trophy className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Upcoming Registered Passes & Featured Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Upcoming Registered Passes */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-display font-bold text-white flex items-center gap-2">
              <Ticket className="w-4 h-4 text-[#387ED1]" />
              <span>Upcoming Passes</span>
            </h2>
            <button
              onClick={() => navigate('/student/my-tickets')}
              className="text-xs font-semibold text-[#387ED1] hover:text-[#60A5FA] transition-colors"
            >
              View Wallet →
            </button>
          </div>

          {upcomingConfirmedTickets.length === 0 ? (
            <div className="p-6 rounded-2xl bg-[#0F172A] border border-[#1E293B] text-center">
              <Ticket className="w-8 h-8 text-[#64748B] mx-auto mb-2 opacity-50" />
              <p className="text-xs text-[#94A3B8]">No upcoming event tickets booked yet.</p>
              <button
                onClick={() => navigate('/student/events')}
                className="mt-3 text-xs font-semibold text-[#387ED1] hover:underline"
              >
                Browse open events →
              </button>
            </div>
          ) : (
            upcomingConfirmedTickets.slice(0, 3).map((booking) => (
              <div
                key={booking._id}
                onClick={() => setActiveTicket(booking)}
                className="p-4 rounded-2xl bg-[#0F172A] border border-[#1E293B] hover:border-[#387ED1]/50 cursor-pointer transition-all shadow-sm hover:shadow-md group"
              >
                <div className="flex items-center justify-between text-xs text-[#64748B] mb-2 font-mono">
                  <span className="font-bold text-[#60A5FA]">{booking.ticketCode}</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] font-sans font-medium text-[10px]">
                    Confirmed Pass
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-[#387ED1] transition-colors line-clamp-1">
                  {booking.event?.title}
                </h3>
                <div className="mt-2 text-xs text-[#94A3B8] flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#64748B]" />
                    {booking.event?.eventDate ? new Date(booking.event.eventDate).toLocaleDateString() : 'TBD'}
                  </span>
                  <span className="flex items-center gap-1 truncate">
                    <MapPin className="w-3.5 h-3.5 text-[#64748B]" />
                    {booking.event?.venue}
                  </span>
                </div>
                {booking.qrCode && (
                  <div className="mt-3 pt-3 border-t border-[#1E293B] flex items-center justify-between text-xs text-[#387ED1] font-medium">
                    <span>Click to view QR pass</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Right Column: Featured & Popular College Events */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-display font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#387ED1]" />
              <span>Featured & Open Events</span>
            </h2>
            <button
              onClick={() => navigate('/student/events')}
              className="text-xs font-semibold text-[#387ED1] hover:text-[#60A5FA] transition-colors"
            >
              Browse All ({events.length}) →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {events.slice(0, 4).map((event) => {
              const isFull = event.registeredCount >= event.capacity;
              return (
                <div
                  key={event._id}
                  className="rounded-2xl bg-[#0F172A] border border-[#1E293B] overflow-hidden hover:border-[#387ED1]/50 transition-all shadow-sm hover:shadow-lg flex flex-col"
                >
                  <div className="h-36 relative overflow-hidden bg-[#1E293B]">
                    <img
                      src={event.bannerUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80'}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/10">
                        {event.category}
                      </span>
                      {event.isVirtual && (
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#387ED1]/80 backdrop-blur-md text-white">
                          Virtual
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-black/70 text-white">
                      {event.ticketPrice > 0 ? `₹${event.ticketPrice}` : 'Free Entry'}
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white line-clamp-1">{event.title}</h3>
                      <p className="text-xs text-[#94A3B8] mt-1 line-clamp-2">{event.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#1E293B] flex items-center justify-between text-xs">
                      <div className="text-[#64748B]">
                        <span className="font-semibold text-white">{event.registeredCount}</span> / {event.capacity} seats
                      </div>
                      <button
                        onClick={() => navigate('/student/events')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          event.isRegistered
                            ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30'
                            : isFull
                            ? 'bg-[#1E293B] text-[#64748B] cursor-not-allowed'
                            : 'bg-[#387ED1] hover:bg-[#2563EB] text-white shadow-sm'
                        }`}
                      >
                        {event.isRegistered ? 'Registered ✓' : isFull ? 'Sold Out' : 'View & Book'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick QR Pass Preview Modal */}
      {activeTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm rounded-2xl bg-[#0F172A] border border-[#1E293B] p-6 text-center shadow-2xl relative"
          >
            <h3 className="text-base font-bold text-white">{activeTicket.event?.title}</h3>
            <p className="text-xs text-[#94A3B8] mt-1">Ticket Code: <span className="font-mono font-bold text-[#60A5FA]">{activeTicket.ticketCode}</span></p>

            <div className="my-5 p-4 bg-white rounded-xl inline-block shadow-inner">
              {activeTicket.qrCode && (
                <img src={activeTicket.qrCode} alt="Ticket QR Code" className="w-48 h-48 mx-auto" />
              )}
            </div>

            <p className="text-xs text-[#64748B]">
              Present this QR code at the door for instant check-in.
            </p>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => navigate('/student/my-tickets')}
                className="flex-1 py-2 rounded-xl bg-[#387ED1] hover:bg-[#2563EB] text-white text-xs font-semibold"
              >
                Open Full Ticket Pass
              </button>
              <button
                onClick={() => setActiveTicket(null)}
                className="px-4 py-2 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
