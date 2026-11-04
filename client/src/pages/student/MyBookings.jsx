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
  Search
} from 'lucide-react';
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

  // Filter bookings
  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'faculty' && b.bookingType !== 'faculty_session') return false;
    if (activeTab === 'resources' && b.bookingType !== 'resource_booking') return false;
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-campus-text">
          My Bookings & Event Passes
        </h1>
        <p className="text-sm text-campus-textMuted mt-1">
          Track real-time status of your faculty doubts, lab reservations, and digital admission tickets.
        </p>
      </div>

      {feedbackMsg.text && (
        <div
          className={`p-4 rounded-xl border text-sm font-medium flex items-center gap-3 ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}
        >
          {feedbackMsg.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Tabs and Status Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-campus-border pb-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'all'
                ? 'bg-campus-primary text-campus-bg shadow-glow'
                : 'bg-campus-surface text-campus-textMuted hover:text-campus-text'
            }`}
          >
            All Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('faculty')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'faculty'
                ? 'bg-campus-primary text-campus-bg shadow-glow'
                : 'bg-campus-surface text-campus-textMuted hover:text-campus-text'
            }`}
          >
            Faculty Doubts
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'resources'
                ? 'bg-campus-primary text-campus-bg shadow-glow'
                : 'bg-campus-surface text-campus-textMuted hover:text-campus-text'
            }`}
          >
            Lab & Room Bookings
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'events'
                ? 'bg-campus-amber text-campus-bg shadow-glow-amber'
                : 'bg-campus-surface text-campus-textMuted hover:text-campus-text'
            }`}
          >
            Event Tickets ({eventRegistrations.length})
          </button>
        </div>

        {/* Status Dropdown */}
        {activeTab !== 'events' && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-campus-textSubtle flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Status:
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-campus-surface border border-campus-border rounded-xl px-3 py-1.5 text-xs text-campus-text focus:outline-none focus:border-campus-primary cursor-pointer"
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
        <div className="py-16 text-center text-sm text-campus-textMuted flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-campus-primary border-t-transparent rounded-full animate-spin" />
          Loading your history...
        </div>
      ) : activeTab === 'events' ? (
        /* Event Passes Grid */
        eventRegistrations.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-campus-border bg-campus-card">
            <Ticket className="w-12 h-12 text-campus-amber/50 mx-auto mb-3" />
            <h3 className="font-display font-semibold text-campus-text text-base">
              No registered event passes
            </h3>
            <p className="text-xs text-campus-textMuted mt-1">
              Browse upcoming college hackathons and masterclasses to claim your ticket.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventRegistrations.map((reg) => (
              <div
                key={reg._id}
                className="bg-campus-card rounded-2xl border border-campus-border p-5 flex flex-col justify-between relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-campus-amber uppercase tracking-wider">
                    {reg.event?.category || 'Event'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold">
                    ✓ Confirmed
                  </span>
                </div>

                <div className="my-4">
                  <h3 className="font-display font-bold text-base text-campus-text">
                    {reg.event?.title}
                  </h3>
                  <div className="mt-2 space-y-1 text-xs text-campus-textMuted">
                    <p>📅 {new Date(reg.event?.eventDate).toLocaleDateString()}</p>
                    <p>⏰ {reg.event?.startTime} - {reg.event?.endTime}</p>
                    <p>📍 {reg.event?.venue}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-campus-border flex items-center justify-between bg-campus-surface/50 -mx-5 -mb-5 p-4">
                  <div className="font-mono">
                    <p className="text-[10px] text-campus-textSubtle uppercase">Ticket Code</p>
                    <p className="text-sm font-bold text-campus-primary">{reg.ticketCode}</p>
                  </div>
                  <Ticket className="w-5 h-5 text-campus-amber" />
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Bookings List */
        filteredBookings.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-campus-border bg-campus-card">
            <CalendarCheck className="w-12 h-12 text-campus-primary/50 mx-auto mb-3" />
            <h3 className="font-display font-semibold text-campus-text text-base">
              No matching bookings found
            </h3>
            <p className="text-xs text-campus-textMuted mt-1">
              No reservation records under the selected tab and status filter.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((b) => (
              <div
                key={b._id}
                className="bg-campus-card rounded-2xl border border-campus-border p-5 sm:p-6 transition-all hover:border-campus-borderGlow flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-campus-surface border border-campus-border flex items-center justify-center text-campus-primary flex-shrink-0 shadow-sm mt-0.5">
                    {b.bookingType === 'faculty_session' ? (
                      <GraduationCap className="w-6 h-6" />
                    ) : (
                      <Building2 className="w-6 h-6" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-white/5 text-campus-textSubtle">
                        {b.bookingType === 'faculty_session' ? 'Faculty Doubt' : 'Campus Resource'}
                      </span>
                      <StatusBadge status={b.status} />
                    </div>
                    <h3 className="font-display font-bold text-base text-campus-text">
                      {b.subject}
                    </h3>
                    <p className="text-xs text-campus-textMuted">
                      {b.bookingType === 'faculty_session'
                        ? `Professor: ${b.faculty?.fullName || 'Faculty Member'} (${b.faculty?.department || ''})`
                        : `Facility: ${b.resource?.name || 'Classroom/Lab'} (${b.resource?.building || ''})`}
                    </p>
                    <p className="text-xs text-campus-textSubtle line-clamp-2 max-w-xl">
                      "{b.description}"
                    </p>

                    {b.rejectionReason && (
                      <div className="mt-2 p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
                        <strong>Reason:</strong> {b.rejectionReason}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right metadata & Action */}
                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-campus-border/60 flex-shrink-0">
                  <div className="text-left md:text-right font-mono text-xs text-campus-textMuted">
                    <p>📅 {new Date(b.date).toLocaleDateString()}</p>
                    <p className="text-campus-text font-semibold">
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
                      className="text-campus-danger hover:bg-rose-500/10 text-xs"
                    >
                      Cancel Booking
                    </Button>
                  )}
                </div>
              </div>
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
          <p className="text-xs text-campus-textMuted">
            Please optionally share why you are cancelling this appointment:
          </p>
          <textarea
            rows={3}
            placeholder="e.g. Schedule conflict with assignment submission..."
            value={cancelModal.reason}
            onChange={(e) => setCancelModal({ ...cancelModal, reason: e.target.value })}
            className="w-full bg-campus-surface border border-campus-border rounded-xl p-3 text-sm text-campus-text focus:outline-none focus:border-campus-primary"
          />
        </div>
      </Modal>
    </div>
  );
};

export default MyBookings;

