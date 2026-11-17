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
  Phone,
  Sparkles
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
    <div className="space-y-6 font-sans animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#13111C] border border-[#262135] text-xs text-[#A78BFA] font-semibold mb-2 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" /> Student Inquiries Desk
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Doubt-Clearing Session Requests
          </h1>
          <p className="text-sm text-[#9E98AE] mt-1">
            Review incoming student inquiries and manage scheduled appointments.
          </p>
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center gap-2 bg-[#13111C] p-1 rounded-xl border border-[#262135]">
          {['pending', 'approved', 'rejected', 'all'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                statusFilter === tab
                  ? 'bg-[#7C3AED] text-white shadow-[0_0_12px_rgba(124,58,237,0.4)]'
                  : 'text-[#9E98AE] hover:text-white hover:bg-white/5'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {feedback.text && (
        <div
          className={`p-4 rounded-xl border text-sm font-medium flex items-center gap-3 shadow-inner ${
            feedback.type === 'success'
              ? 'bg-[#10B981]/15 border-[#10B981]/30 text-[#34D399]'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}
        >
          {feedback.type === 'success' ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          <span>{feedback.text}</span>
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center text-sm text-[#9E98AE] flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
          Loading student session requests...
        </div>
      ) : sessions.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-[#262135] bg-[#0D0C15]/50">
          <ClipboardList className="w-12 h-12 text-[#7C3AED]/40 mx-auto mb-3" />
          <h3 className="font-display font-semibold text-white text-base">
            No {statusFilter !== 'all' ? statusFilter : ''} requests found
          </h3>
          <p className="text-xs text-[#9E98AE] mt-1">
            There are currently no session requests matching this view filter.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((req) => (
            <div
              key={req._id}
              className="bg-[#0D0C15] rounded-2xl border border-[#262135] p-5 sm:p-6 shadow-[0_15px_35px_rgba(0,0,0,0.85)] hover:border-[#7C3AED]/40 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              {/* Student and Request Details */}
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-display font-bold text-base text-white">
                    {req.requester?.fullName}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#7C3AED]/15 border border-[#7C3AED]/30 font-mono text-[#A78BFA] font-semibold">
                    {req.requester?.studentOrEmployeeId}
                  </span>
                  <span className="text-xs text-[#716B82]">• {req.requester?.department}</span>
                  <StatusBadge status={req.status} />
                </div>

                <div className="bg-[#13111C] p-3.5 rounded-xl border border-[#262135]">
                  <h4 className="font-semibold text-sm text-[#A78BFA]">
                    Topic: {req.subject}
                  </h4>
                  <p className="text-xs text-[#C7C3D6] mt-1 leading-relaxed">
                    "{req.description}"
                  </p>
                </div>

                {req.rejectionReason && (
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400">
                    <strong>Declined Reason:</strong> {req.rejectionReason}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#9E98AE] font-mono pt-1">
                  <span>📅 {new Date(req.date).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <span>⏰ {req.startTime} - {req.endTime} ({req.durationMinutes} mins)</span>
                  {req.requester?.email && (
                    <span className="flex items-center gap-1 font-sans">
                      <Mail className="w-3 h-3 text-[#716B82]" /> {req.requester?.email}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {req.status === 'pending' && (
                <div className="flex items-center gap-3 flex-shrink-0 self-end lg:self-center pt-3 lg:pt-0 border-t lg:border-t-0 border-[#262135]">
                  <Button
                    variant="ghost"
                    size="md"
                    onClick={() => {
                      setActiveSession(req);
                      setRejectModalOpen(true);
                    }}
                    className="text-rose-400 hover:bg-rose-500/10 border border-rose-500/30"
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
          <p className="text-xs text-[#9E98AE]">
            Please provide a constructive explanation for the student (e.g. Schedule clash with departmental meeting, Please submit doubt during lab hour):
          </p>
          <textarea
            rows={3}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Enter reason..."
            className="w-full bg-[#0D0C15] border border-[#262135] rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#8B5CF6] shadow-inner resize-none font-medium"
          />
        </div>
      </Modal>
    </div>
  );
};

export default SessionRequests;
