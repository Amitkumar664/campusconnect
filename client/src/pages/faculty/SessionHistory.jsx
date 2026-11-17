import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, Clock, User, Filter, CheckCircle, Sparkles } from 'lucide-react';
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
    <div className="space-y-6 font-sans animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#13111C] border border-[#262135] text-xs text-[#A78BFA] font-semibold mb-2 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" /> Academic Mentorship Ledger
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Doubt Session Registry & History
          </h1>
          <p className="text-sm text-[#9E98AE] mt-1">
            Complete record of student doubts, resolutions, and past academic mentorship meetings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#716B82]" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0D0C15] border border-[#262135] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#8B5CF6] shadow-inner cursor-pointer"
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
        <div className="py-16 text-center text-sm text-[#9E98AE] flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
          Loading session history...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-[#262135] bg-[#0D0C15]/50">
          <BookOpen className="w-12 h-12 text-[#7C3AED]/40 mx-auto mb-3" />
          <h3 className="font-display font-semibold text-white text-base">
            No session history records
          </h3>
          <p className="text-xs text-[#9E98AE] mt-1">
            Sessions you review and attend will be archived here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((s) => (
            <div
              key={s._id}
              className="bg-[#0D0C15] rounded-2xl border border-[#262135] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#7C3AED]/40 transition-all shadow-[0_15px_35px_rgba(0,0,0,0.85)]"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-display font-semibold text-sm text-white">
                    {s.requester?.fullName}
                  </span>
                  <span className="text-xs font-mono text-[#A78BFA]">
                    ({s.requester?.studentOrEmployeeId})
                  </span>
                  <StatusBadge status={s.status} size="sm" />
                </div>
                <h4 className="font-semibold text-xs sm:text-sm text-[#ECE8F5]">
                  {s.subject}
                </h4>
                <p className="text-xs text-[#9E98AE] max-w-2xl line-clamp-2">
                  "{s.description}"
                </p>
              </div>

              <div className="font-mono text-xs text-[#716B82] text-left sm:text-right flex-shrink-0">
                <p>📅 {new Date(s.date).toLocaleDateString()}</p>
                <p className="text-white font-semibold">
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
