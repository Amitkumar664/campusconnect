import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  GraduationCap,
  Building2,
  Ticket,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Filter,
  Calendar,
  Search,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { bookingAPI, eventAPI } from '../../services/api';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

const MyBookings = () => {
  const [activeTab, setActiveTab] = useState('all'); // all | faculty | resources | events
  const [statusFilter, setStatusFilter] = useState('all');
  const [bookings, setBookings] = useState([]);
  const [eventRegistrations, setEventRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [cancelModal, setCancelModal] = useState({ open: false, bookingId: null, reason: '' });
  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState({ type: '', text: '' });

  const loadData = async () => {
    try {
      const [bRes, eRes] = await Promise.all([
        bookingAPI.getMy(),
        eventAPI.getMyRegistrations()
      ]);

      if (bRes.data.success) {
        setBookings(bRes.data.bookings);
      }
      if (eRes.data.success) {
        setEventRegistrations(eRes.data.registrations);
      }
    } catch (error) {
      console.error('Failed to load my bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCancelBooking = async () => {
    if (!cancelModal.bookingId) return;
    setActionLoading(true);
    setFeedbackMsg({ type: '', text: '' });
    try {
      const res = await bookingAPI.cancel(cancelModal.bookingId, cancelModal.reason);
      if (res.data.success) {
        setFeedbackMsg({ type: 'success', text: 'Booking successfully cancelled and slot released.' });
        setCancelModal({ open: false, bookingId: null, reason: '' });
        await loadData();
      }
    } catch (error) {
      setFeedbackMsg({
        type: 'error',
        text: error.response?.data?.message || 'Failed to cancel booking.'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'faculty' && b.bookingType !== 'faculty_session') return false;
    if (activeTab === 'resources' && b.bookingType !== 'resource_booking') return false;
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#13111C] border border-[#262135] text-xs text-[#A78BFA] font-semibold mb-2 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" /> Live Schedule & Passes
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
          My Schedule & Event Passes
        </h1>
        <p className="text-xs sm:text-sm text-[#9E98AE] mt-1">
          Track real-time status of your faculty doubts, lab reservations, and digital admission tickets.
        </p>
      </div>

      {feedbackMsg.text && (
        <div
          className={`p-4 rounded-xl border text-xs sm:text-sm font-medium flex items-center gap-3 shadow-inner ${
            feedbackMsg.type === 'success'
              ? 'bg-[#10B981]/15 border-[#10B981]/30 text-[#34D399]'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}
        >
          {feedbackMsg.type === 'success' ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Modern Tabs and Status Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#262135] pb-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: `All Bookings (${bookings.length})` },
            { id: 'faculty', label: 'Faculty Doubts' },
            { id: 'resources', label: 'Lab & Room Bookings' },
            { id: 'events', label: `Event Tickets (${eventRegistrations.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#7C3AED] text-white font-bold shadow-[0_0_15px_rgba(124,58,237,0.4)]'
                  : 'bg-[#13111C] text-[#9E98AE] hover:text-white hover:bg-white/5 border border-[#262135]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Status Dropdown */}
        {activeTab !== 'events' && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#716B82] flex items-center gap-1 font-mono">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#0D0C15] border border-[#262135] rounded-xl px-3.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#8B5CF6] cursor-pointer shadow-inner"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        )}
      </div>

      {/* Content Rendering */}
      {loading ? (
        <div className="py-16 text-center text-xs text-[#9E98AE] flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
          Loading your history...
        </div>
      ) : activeTab === 'events' ? (
        /* Event Passes Grid */
        eventRegistrations.length === 0 ? (
          <div className="p-14 text-center rounded-2xl border border-dashed border-[#262135] bg-[#0D0C15]/50">
            <Ticket className="w-12 h-12 text-[#7C3AED]/40 mx-auto mb-3" />
            <h3 className="font-display font-semibold text-white text-base">
              No registered event passes
            </h3>
            <p className="text-xs text-[#9E98AE] mt-1">
              Browse upcoming college hackathons and masterclasses to claim your ticket.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventRegistrations.map((reg) => (
              <motion.div
                key={reg._id}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-[#0D0C15] rounded-2xl border border-[#262135] shadow-[0_15px_35px_rgba(0,0,0,0.85)] p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden group hover:border-[#7C3AED]/50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-[#A78BFA] uppercase tracking-widest bg-[#7C3AED]/15 px-2.5 py-0.5 rounded-full border border-[#7C3AED]/30">
                    {reg.event?.category || 'Event'}
                  </span>
                  <StatusBadge status="confirmed" size="sm" />
                </div>

                <div className="my-5">
                  <h3 className="font-display font-bold text-base sm:text-lg text-white tracking-tight">
                    {reg.event?.title}
                  </h3>
                  <div className="mt-2.5 space-y-1 text-xs text-[#9E98AE] font-mono">
                    <p>📅 {new Date(reg.event?.eventDate).toLocaleDateString()}</p>
                    <p>⏰ {reg.event?.startTime} - {reg.event?.endTime}</p>
                    <p className="font-sans">📍 {reg.event?.venue}</p>
                  </div>
                </div>

                <div className="pt-3.5 border-t border-[#262135] flex items-center justify-between bg-[#13111C] -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-4 sm:p-5">
                  <div className="font-mono">
                    <p className="text-[10px] text-[#716B82] uppercase tracking-wider">Pass Code</p>
                    <p className="text-sm font-bold text-[#A78BFA]">{reg.ticketCode}</p>
                  </div>
                  <Ticket className="w-5 h-5 text-[#8B5CF6]" />
                </div>
              </motion.div>
            ))}
          </div>
        )
      ) : (
        /* Bookings List */
        filteredBookings.length === 0 ? (
          <div className="p-14 text-center rounded-2xl border border-dashed border-[#262135] bg-[#0D0C15]/50">
            <CalendarCheck className="w-12 h-12 text-[#7C3AED]/40 mx-auto mb-3" />
            <h3 className="font-display font-semibold text-white text-base">
              No matching bookings found
            </h3>
            <p className="text-xs text-[#9E98AE] mt-1">
              No reservation records under the selected tab and status filter.
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredBookings.map((b) => (
              <motion.div
                key={b._id}
                whileHover={{ y: -2 }}
                className="bg-[#0D0C15] rounded-2xl border border-[#262135] shadow-[0_15px_35px_rgba(0,0,0,0.85)] p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-[#7C3AED]/40 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#13111C] border border-[#262135] flex items-center justify-center text-[#A78BFA] flex-shrink-0 shadow-inner mt-0.5">
                    {b.bookingType === 'faculty_session' ? (
                      <GraduationCap className="w-6 h-6" />
                    ) : (
                      <Building2 className="w-6 h-6" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-[#1B1828] text-[#9E98AE] border border-[#262135]">
                        {b.bookingType === 'faculty_session' ? 'Faculty Doubt' : 'Campus Resource'}
                      </span>
                      <StatusBadge status={b.status} size="sm" />
                    </div>
                    <h3 className="font-display font-bold text-base text-white tracking-tight">
                      {b.subject}
                    </h3>
                    <p className="text-xs text-[#9E98AE]">
                      {b.bookingType === 'faculty_session'
                        ? `Professor: ${b.faculty?.fullName || 'Faculty Member'} (${b.faculty?.department || ''})`
                        : `Facility: ${b.resource?.name || 'Classroom/Lab'} (${b.resource?.building || ''})`}
                    </p>
                    <p className="text-xs text-[#716B82] line-clamp-2 max-w-xl">
                      "{b.description}"
                    </p>

                    {b.rejectionReason && (
                      <div className="mt-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400">
                        <strong>Reason:</strong> {b.rejectionReason}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right metadata & Action */}
                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-[#262135] flex-shrink-0">
                  <div className="text-left md:text-right font-mono text-xs text-[#716B82]">
                    <p>📅 {new Date(b.date).toLocaleDateString()}</p>
                    <p className="text-white font-semibold pt-0.5">
                      ⏰ {b.startTime} - {b.endTime}
                    </p>
                  </div>

                  {['pending', 'approved'].includes(b.status) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setCancelModal({ open: true, bookingId: b._id, reason: '' })
                      }
                      className="text-rose-400 hover:bg-rose-500/10 text-xs"
                    >
                      Cancel Booking
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )
      )}

      {/* Cancel Reason Modal */}
      <Modal
        isOpen={cancelModal.open}
        onClose={() => setCancelModal({ open: false, bookingId: null, reason: '' })}
        title="Cancel Booking Request"
        subtitle="This action will release the reserved time slot for other students."
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setCancelModal({ open: false, bookingId: null, reason: '' })}
            >
              Keep Booking
            </Button>
            <Button
              variant="danger"
              loading={actionLoading}
              onClick={handleCancelBooking}
            >
              Confirm Cancellation
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-xs text-[#9E98AE]">
            Please optionally share why you are cancelling this appointment:
          </p>
          <textarea
            rows={3}
            placeholder="e.g. Schedule conflict with assignment submission..."
            value={cancelModal.reason}
            onChange={(e) => setCancelModal({ ...cancelModal, reason: e.target.value })}
            className="w-full bg-[#0D0C15] border border-[#262135] rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-[#8B5CF6] shadow-inner resize-none font-medium"
          />
        </div>
      </Modal>
    </div>
  );
};

export default MyBookings;
