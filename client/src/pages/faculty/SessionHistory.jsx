import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, Clock, User, Filter, CheckCircle } from 'lucide-react';
import { bookingAPI } from '../../services/api';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';

const SessionHistory = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await bookingAPI.getFacultySessions();
        if (res.data.success) {
          setSessions(res.data.sessions);
        }
      } catch (error) {
        console.error('Failed to load session history:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filtered = sessions.filter((s) => {
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-campus-text">
            Doubt Session Registry & History
          </h1>
          <p className="text-sm text-campus-textMuted mt-1">
            Complete record of student doubts, resolutions, and past academic mentorship meetings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-campus-textSubtle" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-campus-surface border border-campus-border rounded-xl px-3 py-1.5 text-xs text-campus-text focus:outline-none focus:border-campus-primary"
          >
            <option value="all">All Records</option>
            <option value="approved">Approved & Scheduled</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-sm text-campus-textMuted flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-campus-primary border-t-transparent rounded-full animate-spin" />
          Loading session history...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-campus-border bg-campus-card">
          <BookOpen className="w-12 h-12 text-campus-primary/50 mx-auto mb-3" />
          <h3 className="font-display font-semibold text-campus-text text-base">
            No session history records
          </h3>
          <p className="text-xs text-campus-textMuted mt-1">
            Sessions you review and attend will be archived here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((s) => (
            <div
              key={s._id}
              className="bg-campus-card rounded-2xl border border-campus-border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-campus-borderGlow transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-display font-semibold text-sm text-campus-text">
                    {s.requester?.fullName}
                  </span>
                  <span className="text-xs font-mono text-campus-primary">
                    ({s.requester?.studentOrEmployeeId})
                  </span>
                  <StatusBadge status={s.status} size="sm" />
                </div>
                <h4 className="font-semibold text-xs sm:text-sm text-campus-text">
                  {s.subject}
                </h4>
                <p className="text-xs text-campus-textMuted max-w-2xl line-clamp-2">
                  "{s.description}"
                </p>
              </div>

              <div className="font-mono text-xs text-campus-textMuted text-left sm:text-right flex-shrink-0">
                <p>📅 {new Date(s.date).toLocaleDateString()}</p>
                <p className="text-campus-text font-semibold">
                  ⏰ {s.startTime} - {s.endTime}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SessionHistory;

