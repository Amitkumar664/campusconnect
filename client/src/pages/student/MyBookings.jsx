import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Ticket,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  Filter
} from 'lucide-react';
import { bookingAPI } from '../../services/api';

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all'); // all, confirmed, attended, cancelled
  const [cancellingId, setCancellingId] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedFilter !== 'all') params.status = selectedFilter;
      const res = await bookingAPI.getMy(params);
      if (res.data.success) {
        setBookings(res.data.bookings || []);
      }
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [selectedFilter]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this event ticket? Your seat will be released.')) {
      return;
    }
    try {
      setCancellingId(bookingId);
      const res = await bookingAPI.cancel(bookingId, 'Cancelled by student');
      if (res.data.success) {
        fetchBookings();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Calendar className="w-6 h-6 text-[#387ED1]" />
            <span>My Event Registrations & Bookings</span>
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Track status, manage upcoming events, and view official digital booking confirmations.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0F172A] border border-[#1E293B]">
          {[
            { id: 'all', label: 'All' },
            { id: 'confirmed', label: 'Confirmed' },
            { id: 'attended', label: 'Attended' },
            { id: 'cancelled', label: 'Cancelled' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedFilter === tab.id
                  ? 'bg-[#387ED1] text-white shadow-sm'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-sm text-[#94A3B8]">
          <div className="w-8 h-8 border-2 border-[#387ED1] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading your bookings...
        </div>
      ) : bookings.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-[#0F172A] border border-[#1E293B]">
          <Ticket className="w-10 h-10 text-[#64748B] mx-auto mb-2 opacity-50" />
          <h3 className="text-base font-bold text-white">No registrations found</h3>
          <p className="text-xs text-[#94A3B8] mt-1">Explore campus events to reserve your passes.</p>
          <button
            onClick={() => navigate('/student/events')}
            className="mt-4 px-4 py-2 rounded-xl bg-[#387ED1] hover:bg-[#2563EB] text-white text-xs font-semibold shadow-sm"
          >
            Explore Events →
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="p-5 rounded-2xl bg-[#0F172A] border border-[#1E293B] hover:border-[#387ED1]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#387ED1]/15 text-[#387ED1] flex items-center justify-center flex-shrink-0">
                  <Ticket className="w-6 h-6" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#60A5FA]">{booking.ticketCode}</span>
                    <span className="text-[#334155]">•</span>
                    <span className="text-xs text-[#64748B] font-mono">{booking.bookingId}</span>
                  </div>

                  <h3 className="text-base font-bold text-white mt-0.5">{booking.event?.title}</h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#64748B] mt-2">
                    <span className="flex items-center gap-1.5 text-[#94A3B8]">
                      <Calendar className="w-3.5 h-3.5 text-[#387ED1]" />
                      {booking.event?.eventDate ? new Date(booking.event.eventDate).toLocaleDateString() : 'TBD'}
                    </span>
                    <span className="flex items-center gap-1.5 text-[#94A3B8]">
                      <Clock className="w-3.5 h-3.5 text-[#387ED1]" />
                      {booking.event?.startTime} - {booking.event?.endTime}
                    </span>
                    <span className="flex items-center gap-1.5 text-[#94A3B8] truncate max-w-xs">
                      <MapPin className="w-3.5 h-3.5 text-[#387ED1]" />
                      {booking.event?.venue}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-[#1E293B]">
                <div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      booking.status === 'confirmed'
                        ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30'
                        : booking.status === 'attended'
                        ? 'bg-[#387ED1]/20 text-[#60A5FA] border border-[#387ED1]/30'
                        : 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30'
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate('/student/my-tickets')}
                    className="px-3.5 py-1.5 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-white text-xs font-semibold border border-[#334155] transition-all"
                  >
                    View QR Pass
                  </button>

                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      disabled={cancellingId === booking._id}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"
                    >
                      {cancellingId === booking._id ? 'Cancelling...' : 'Cancel'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
