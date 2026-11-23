import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Calendar,
  MapPin,
  Clock,
  Search,
  Filter,
  Ticket,
  CheckCircle2,
  AlertCircle,
  Video,
  Sparkles,
  ArrowRight,
  X,
  Share2
} from 'lucide-react';
import { eventAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const CATEGORIES = [
  { id: 'all', label: 'All Categories' },
  { id: 'technical', label: 'Technical' },
  { id: 'cultural', label: 'Cultural' },
  { id: 'workshop', label: 'Workshops' },
  { id: 'seminar', label: 'Seminars' },
  { id: 'guest_lecture', label: 'Guest Lectures' },
  { id: 'competition', label: 'Competitions' },
  { id: 'festival', label: 'Festivals' },
  { id: 'hackathon', label: 'Hackathons' },
  { id: 'sports', label: 'Sports' }
];

const EventBrowse = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  // Modal State
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory !== 'all') params.category = selectedCategory;
      if (selectedStatus !== 'all') params.status = selectedStatus;
      if (search) params.search = search;

      const res = await eventAPI.getAll(params);
      if (res.data.success) {
        setEvents(res.data.events || []);
      }
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory, selectedStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  const handleBookTicket = async (event) => {
    try {
      setBookingLoading(true);
      setErrorMsg('');
      const res = await eventAPI.register(event._id);

      if (res.data.success) {
        setBookingResult(res.data.booking);
        // Confetti celebration
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        // Refresh events list
        fetchEvents();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to book ticket. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const sortedEvents = [...events].sort((a, b) => {
    if (sortBy === 'date') return new Date(a.eventDate) - new Date(b.eventDate);
    if (sortBy === 'popular') return (b.registeredCount || 0) - (a.registeredCount || 0);
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Explore College Events</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#387ED1]/20 text-[#60A5FA] border border-[#387ED1]/30">
              {sortedEvents.length} Available
            </span>
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Browse hackathons, technical symposia, sports tournaments and digital passes across the campus.
          </p>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md w-full">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by event title, venue, or keywords..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#0F172A] border border-[#1E293B] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#387ED1]"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-[#387ED1] hover:bg-[#2563EB] text-white text-xs font-semibold shadow-sm transition-all"
          >
            Search
          </button>
        </form>
      </div>

      {/* Category Pills & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full custom-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#387ED1] text-white shadow-sm font-semibold'
                  : 'bg-[#0F172A] border border-[#1E293B] text-[#94A3B8] hover:text-white hover:bg-[#1E293B]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#64748B]">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#0F172A] border border-[#1E293B] text-xs text-white focus:outline-none focus:border-[#387ED1]"
          >
            <option value="date">Upcoming Date</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="py-20 text-center text-sm text-[#94A3B8]">
          <div className="w-8 h-8 border-2 border-[#387ED1] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading campus events...
        </div>
      ) : sortedEvents.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-[#0F172A] border border-[#1E293B]">
          <Calendar className="w-10 h-10 text-[#64748B] mx-auto mb-3 opacity-50" />
          <h3 className="text-base font-bold text-white">No events found</h3>
          <p className="text-xs text-[#94A3B8] mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or category filter to discover other scheduled campus events.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedEvents.map((event) => {
            const fillRatio = event.capacity > 0 ? (event.registeredCount || 0) / event.capacity : 0;
            const isFull = event.registeredCount >= event.capacity;
            const isClosed = event.status === 'closed' || new Date() > new Date(event.registrationDeadline);

            return (
              <div
                key={event._id}
                className="rounded-2xl bg-[#0F172A] border border-[#1E293B] overflow-hidden hover:border-[#387ED1]/50 transition-all shadow-md hover:shadow-xl flex flex-col group"
              >
                {/* Event Image Banner */}
                <div className="h-44 relative bg-[#1E293B] overflow-hidden">
                  <img
                    src={event.bannerUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80'}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Category & Status badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md text-white border border-white/10">
                      {event.category}
                    </span>
                    {event.status === 'filling_fast' && (
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#F59E0B]/90 text-white shadow-sm">
                        Filling Fast
                      </span>
                    )}
                    {isFull && (
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#EF4444]/90 text-white">
                        Sold Out
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg text-xs font-bold bg-black/80 backdrop-blur-md text-white border border-white/10">
                    {event.ticketPrice > 0 ? `₹${event.ticketPrice}` : 'Free Ticket'}
                  </div>
                </div>

                {/* Event Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-[#387ED1] transition-colors line-clamp-1">
                      {event.title}
                    </h3>
                    <p className="text-xs text-[#94A3B8] mt-1.5 line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>

                    {/* Metadata details */}
                    <div className="mt-4 space-y-2 text-xs text-[#64748B]">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#387ED1]" />
                        <span className="text-[#94A3B8]">
                          {new Date(event.eventDate).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })}{' '}
                          • {event.startTime} - {event.endTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {event.isVirtual ? (
                          <Video className="w-3.5 h-3.5 text-[#10B981]" />
                        ) : (
                          <MapPin className="w-3.5 h-3.5 text-[#387ED1]" />
                        )}
                        <span className="text-[#94A3B8] truncate">{event.venue}</span>
                      </div>
                    </div>
                  </div>

                  {/* Capacity progress & Registration action */}
                  <div className="pt-3 border-t border-[#1E293B] space-y-3">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-[#64748B]">Ticket Availability</span>
                        <span className="font-semibold text-white">
                          {event.capacity - (event.registeredCount || 0)} seats left
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#1E293B] overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            fillRatio >= 0.9 ? 'bg-[#EF4444]' : fillRatio >= 0.7 ? 'bg-[#F59E0B]' : 'bg-[#10B981]'
                          }`}
                          style={{ width: `${Math.min(100, Math.round(fillRatio * 100))}%` }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedEvent(event);
                        setBookingResult(null);
                        setErrorMsg('');
                      }}
                      className={`w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                        event.isRegistered
                          ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 hover:bg-[#10B981]/25'
                          : isFull
                          ? 'bg-[#1E293B] text-[#64748B] hover:bg-[#334155]/50'
                          : 'bg-[#387ED1] hover:bg-[#2563EB] text-white shadow-[0_4px_14px_rgba(56,126,209,0.35)]'
                      }`}
                    >
                      {event.isRegistered ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Pass Confirmed • View Details</span>
                        </>
                      ) : isFull ? (
                        <span>Sold Out • View Details</span>
                      ) : (
                        <>
                          <Ticket className="w-4 h-4" />
                          <span>View & Book Ticket</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Event Details & Booking Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0F172A] border border-[#1E293B] rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
            >
              {/* Modal Banner */}
              <div className="h-48 relative bg-[#1E293B] flex-shrink-0">
                <img
                  src={selectedEvent.bannerUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80'}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-4 right-4 p-2 rounded-xl bg-black/60 text-white hover:bg-black/90 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <span className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-[#387ED1] text-white">
                    {selectedEvent.category}
                  </span>
                  <span className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-black/70 text-white">
                    {selectedEvent.ticketPrice > 0 ? `₹${selectedEvent.ticketPrice}` : 'Free Entry'}
                  </span>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-5 flex-1">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedEvent.title}</h2>
                  <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
                    {selectedEvent.description}
                  </p>
                </div>

                {/* Event Highlights */}
                <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-[#1E293B]/50 border border-[#334155]/50 text-xs">
                  <div>
                    <span className="text-[#64748B]">Date & Time</span>
                    <p className="font-semibold text-white mt-0.5">
                      {new Date(selectedEvent.eventDate).toLocaleDateString()} ({selectedEvent.startTime} - {selectedEvent.endTime})
                    </p>
                  </div>
                  <div>
                    <span className="text-[#64748B]">Venue</span>
                    <p className="font-semibold text-white mt-0.5 truncate">{selectedEvent.venue}</p>
                  </div>
                  <div>
                    <span className="text-[#64748B]">Organizer</span>
                    <p className="font-semibold text-white mt-0.5">{selectedEvent.organizerName || 'University Board'}</p>
                  </div>
                  <div>
                    <span className="text-[#64748B]">Registration Deadline</span>
                    <p className="font-semibold text-white mt-0.5">
                      {new Date(selectedEvent.registrationDeadline).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* If hackathon, show problem statement and prizes */}
                {selectedEvent.eventType === 'hackathon' && selectedEvent.problemStatement && (
                  <div className="p-4 rounded-xl bg-[#387ED1]/10 border border-[#387ED1]/30 space-y-2">
                    <h4 className="text-xs font-bold uppercase text-[#60A5FA]">Hackathon Tracks & Problem Statement</h4>
                    <p className="text-xs text-[#CBD5E1] whitespace-pre-line leading-relaxed">
                      {selectedEvent.problemStatement}
                    </p>
                  </div>
                )}

                {/* Successful booking instant QR display */}
                {bookingResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-5 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 text-center space-y-3"
                  >
                    <CheckCircle2 className="w-8 h-8 text-[#10B981] mx-auto" />
                    <h4 className="text-base font-bold text-white">Ticket Confirmed!</h4>
                    <p className="text-xs text-[#94A3B8]">
                      Your digital pass code is <span className="font-mono font-bold text-[#60A5FA]">{bookingResult.ticketCode}</span>
                    </p>
                    {bookingResult.qrCode && (
                      <div className="p-3 bg-white rounded-xl inline-block shadow-md">
                        <img src={bookingResult.qrCode} alt="Ticket QR" className="w-36 h-36 mx-auto" />
                      </div>
                    )}
                    <p className="text-[11px] text-[#64748B]">
                      A confirmation email was dispatched. View this anytime in "My Digital Tickets".
                    </p>
                  </motion.div>
                )}

                {/* Error message if booking fails */}
                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/30 text-xs text-[#EF4444] flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-[#1E293B] bg-[#0B0F19] flex items-center justify-between">
                <div className="text-xs text-[#64748B]">
                  Capacity: <span className="font-semibold text-white">{selectedEvent.registeredCount}</span> / {selectedEvent.capacity} booked
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="px-4 py-2 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-white text-xs font-semibold"
                  >
                    Close
                  </button>
                  {!selectedEvent.isRegistered && !bookingResult && (
                    <button
                      onClick={() => handleBookTicket(selectedEvent)}
                      disabled={bookingLoading || selectedEvent.registeredCount >= selectedEvent.capacity}
                      className="px-5 py-2 rounded-xl bg-[#387ED1] hover:bg-[#2563EB] disabled:opacity-50 text-white text-xs font-semibold shadow-md flex items-center gap-2"
                    >
                      {bookingLoading ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Securing Seat...</span>
                        </>
                      ) : (
                        <>
                          <Ticket className="w-4 h-4" />
                          <span>Confirm & Book Ticket</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventBrowse;
