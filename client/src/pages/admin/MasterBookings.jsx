import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Check,
  X,
  Filter,
  Search,
  Building2,
  GraduationCap,
  Clock,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { bookingAPI } from '../../services/api';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

const MasterBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const [activeBooking, setActiveBooking] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  const loadBookings = async () => {
    try {
      const res = await bookingAPI.getAll({
        bookingType: typeFilter,
        status: statusFilter
      });
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (error) {
      console.error('Failed to load master bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [typeFilter, statusFilter]);

  const handleApprove = async (booking) => {
    setActionLoading(true);
    setFeedback({ type: '', text: '' });
    try {
      const res = await bookingAPI.updateStatus(booking._id, { status: 'approved' });
      if (res.data.success) {
        setFeedback({
          type: 'success',
          text: `Booking "${booking.subject}" marked as APPROVED!`
        });
        await loadBookings();
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        text: error.response?.data?.message || 'Could not approve booking.'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejecting the booking.');
      return;
    }

    setActionLoading(true);
    setFeedback({ type: '', text: '' });
    try {
      const res = await bookingAPI.updateStatus(activeBooking._id, {
        status: 'rejected',
        rejectionReason
      });
      if (res.data.success) {
        setFeedback({
          type: 'success',
          text: `Booking rejected. Requester has been notified.`
        });
        setRejectModalOpen(false);
        setRejectionReason('');
        await loadBookings();
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        text: error.response?.data?.message || 'Could not reject booking.'
      });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-campus-text">
            Master Campus Bookings Registry
          </h1>
          <p className="text-sm text-campus-textMuted mt-1">
            Global administrative supervision across faculty doubt appointments and room reservations.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#387ED1] shadow-sm"
          >
            <option value="all">All Booking Types</option>
            <option value="faculty_session">Faculty Doubts</option>
            <option value="resource_booking">Lab & Room Bookings</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#387ED1] shadow-sm"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {feedback.text && (
        <div
          className={`p-4 rounded-xl border text-sm font-medium flex items-center gap-3 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-rose-50 border-rose-200 text-rose-700'
          }`}
        >
          {feedback.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Bookings Table Card */}
      <Card>
        {loading ? (
          <div className="py-16 text-center text-sm text-slate-500 flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-[#387ED1] border-t-transparent rounded-full animate-spin" />
            Loading master registry...
          </div>
        ) : bookings.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-500">
            No bookings found under the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-mono text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Requester</th>
                  <th className="py-3 px-4">Target Resource/Faculty</th>
                  <th className="py-3 px-4">Scheduled Slot</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-[10px]">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 uppercase">
                        {b.bookingType === 'faculty_session' ? 'Faculty Doubt' : 'Lab / Room'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-xs">
                      <div>{b.subject}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        "{b.description}"
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="font-medium text-slate-900">{b.requester?.fullName}</div>
                      <div className="text-[10px] font-mono text-slate-400">{b.requester?.studentOrEmployeeId}</div>
                    </td>
                    <td className="py-3.5 px-4 text-[#387ED1] font-medium">
                      {b.bookingType === 'faculty_session'
                        ? b.faculty?.fullName
                        : `${b.resource?.name} (${b.resource?.code})`}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                      <div>📅 {new Date(b.date).toLocaleDateString()}</div>
                      <div>⏰ {b.startTime} - {b.endTime}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={b.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {b.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="primary"
                            loading={actionLoading}
                            onClick={() => handleApprove(b)}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => {
                              setActiveBooking(b);
                              setRejectModalOpen(true);
                            }}
                          >
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-campus-textSubtle font-mono">
                          Actioned
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Reject Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Booking Request"
        subtitle={`Booking: ${activeBooking?.subject}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" loading={actionLoading} onClick={handleRejectConfirm}>
              Confirm Rejection
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-xs text-campus-textMuted">
            Enter the mandatory rejection explanation (sent to the user via notification):
          </p>
          <textarea
            rows={3}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="e.g. Facility is reserved for scheduled maintenance..."
            className="w-full bg-campus-surface border border-campus-border rounded-xl p-3 text-sm text-campus-text focus:outline-none focus:border-campus-primary"
          />
        </div>
      </Modal>
    </div>
  );
};

export default MasterBookings;

