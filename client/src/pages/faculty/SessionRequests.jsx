import React, { useState, useEffect } from 'react';
import {
  ClipboardList,
  Check,
  X,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  Building,
  Mail,
  Phone
} from 'lucide-react';
import { bookingAPI } from '../../services/api';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

const SessionRequests = () => {
  const [sessions, setSessions] = useState([]);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [loading, setLoading] = useState(true);

  const [activeSession, setActiveSession] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  const loadRequests = async () => {
    try {
      const res = await bookingAPI.getFacultySessions({ status: statusFilter });
      if (res.data.success) {
        setSessions(res.data.sessions);
      }
    } catch (error) {
      console.error('Failed to load session requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [statusFilter]);

  const handleApprove = async (session) => {
    setActionLoading(true);
    setFeedback({ type: '', text: '' });
    try {
      const res = await bookingAPI.updateStatus(session._id, { status: 'approved' });
      if (res.data.success) {
        setFeedback({
          type: 'success',
          text: `Doubt session for ${session.requester?.fullName} approved successfully!`
        });
        await loadRequests();
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        text: error.response?.data?.message || 'Could not approve session.'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectionReason.trim() || rejectionReason.trim().length < 3) {
      alert('Please provide a meaningful reason for declining this request.');
      return;
    }

    setActionLoading(true);
    setFeedback({ type: '', text: '' });
    try {
      const res = await bookingAPI.updateStatus(activeSession._id, {
        status: 'rejected',
        rejectionReason
      });
      if (res.data.success) {
        setFeedback({
          type: 'success',
          text: `Request declined. Student has been notified with the provided reason.`
        });
        setRejectModalOpen(false);
        setRejectionReason('');
        await loadRequests();
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        text: error.response?.data?.message || 'Could not reject session.'
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
            Doubt-Clearing Session Requests
          </h1>
          <p className="text-sm text-campus-textMuted mt-1">
            Review incoming student inquiries and manage scheduled appointments.
          </p>
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center gap-2 bg-campus-card p-1 rounded-xl border border-campus-border">
          {['pending', 'approved', 'rejected', 'all'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                statusFilter === tab
                  ? 'bg-[#387ED1] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
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
          {feedback.type === 'success' ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          <span>{feedback.text}</span>
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center text-sm text-slate-500 flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-[#387ED1] border-t-transparent rounded-full animate-spin" />
          Loading student session requests...
        </div>
      ) : sessions.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
          <ClipboardList className="w-12 h-12 text-[#387ED1]/40 mx-auto mb-3" />
          <h3 className="font-display font-semibold text-slate-900 text-base">
            No {statusFilter !== 'all' ? statusFilter : ''} requests found
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            There are currently no session requests matching this view filter.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((req) => (
            <div
              key={req._id}
              className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:border-blue-300 hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              {/* Student and Request Details */}
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-display font-bold text-base text-slate-900">
                    {req.requester?.fullName}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 font-mono text-[#387ED1] font-semibold">
                    {req.requester?.studentOrEmployeeId}
                  </span>
                  <span className="text-xs text-slate-400">• {req.requester?.department}</span>
                  <StatusBadge status={req.status} />
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <h4 className="font-semibold text-sm text-[#387ED1]">
                    Topic: {req.subject}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    "{req.description}"
                  </p>
                </div>

                {req.rejectionReason && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                    <strong>Declined Reason:</strong> {req.rejectionReason}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-mono pt-1">
                  <span>📅 {new Date(req.date).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <span>⏰ {req.startTime} - {req.endTime} ({req.durationMinutes} mins)</span>
                  {req.requester?.email && (
                    <span className="flex items-center gap-1 font-sans">
                      <Mail className="w-3 h-3 text-slate-400" /> {req.requester?.email}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {req.status === 'pending' && (
                <div className="flex items-center gap-3 flex-shrink-0 self-end lg:self-center pt-3 lg:pt-0 border-t lg:border-t-0 border-campus-border/60">
                  <Button
                    variant="ghost"
                    size="md"
                    onClick={() => {
                      setActiveSession(req);
                      setRejectModalOpen(true);
                    }}
                    className="text-campus-danger hover:bg-rose-500/10 border border-campus-danger/30"
                  >
                    <X className="w-4 h-4 mr-1" /> Decline
                  </Button>

                  <Button
                    variant="primary"
                    size="md"
                    loading={actionLoading}
                    onClick={() => handleApprove(req)}
                  >
                    <Check className="w-4 h-4 mr-1" /> Accept & Schedule
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Rejection Reason Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Decline Doubt Session Request"
        subtitle={`Student: ${activeSession?.requester?.fullName}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setRejectModalOpen(false)}>
              Back
            </Button>
            <Button
              variant="danger"
              loading={actionLoading}
              onClick={handleRejectConfirm}
            >
              Confirm Decline
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-xs text-campus-textMuted">
            Please provide a constructive explanation for the student (e.g. Schedule clash with departmental meeting, Please submit doubt during lab hour):
          </p>
          <textarea
            rows={3}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Enter reason..."
            className="w-full bg-campus-surface border border-campus-border rounded-xl p-3 text-sm text-campus-text focus:outline-none focus:border-campus-primary"
          />
        </div>
      </Modal>
    </div>
  );
};

export default SessionRequests;

