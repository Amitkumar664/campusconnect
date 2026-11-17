import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  Calendar,
  Users,
  GraduationCap,
  ArrowRight,
  Sparkles,
  BookOpen,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { bookingAPI } from '../../services/api';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';

const FacultyDashboard = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await bookingAPI.getFacultySessions();
        if (res.data.success) {
          setSessions(res.data.sessions);
        }
      } catch (error) {
        console.error('Failed to load faculty sessions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const pendingRequests = sessions.filter((s) => s.status === 'pending');
  const approvedSessions = sessions.filter((s) => s.status === 'approved');

  return (
    <div className="space-y-8 animate-in fade-in duration-300 font-sans">
      {/* Obsidian Violet Bento Hero Header */}
      <div className="relative rounded-2xl p-6 sm:p-8 bg-[#0D0C15] border border-[#262135] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.85)] group">
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#8B5CF6] to-transparent opacity-60" />
        <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-gradient-to-bl from-[#7C3AED]/[0.08] to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#13111C] border border-[#262135] text-xs text-[#A78BFA] font-semibold shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" /> Faculty Academic Mentor Workspace
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-tight">
              Welcome, <span className="text-[#A78BFA]">{user?.fullName}</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#9E98AE] max-w-xl leading-relaxed">
              Manage student doubt-clearing sessions, customize weekly office hours, and review requests with zero scheduling conflicts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3.5 self-start lg:self-center">
            <Link to="/faculty/requests">
              <Button variant="primary" size="lg" icon={ClipboardList}>
                Review Requests ({pendingRequests.length})
              </Button>
            </Link>
            <Link to="/faculty/availability">
              <Button variant="secondary" size="lg" icon={Clock}>
                Set Office Hours
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="Total Inquiries"
          value={sessions.length}
          subtitle="All-time student requests"
          icon={ClipboardList}
          variant="purple"
        />
        <StatCard
          title="Pending Decisions"
          value={pendingRequests.length}
          subtitle="Awaiting your approval"
          icon={Clock}
          variant="amber"
        />
        <StatCard
          title="Confirmed Sessions"
          value={approvedSessions.length}
          subtitle="Scheduled on calendar"
          icon={CheckCircle2}
          variant="emerald"
        />
        <StatCard
          title="Department"
          value={user?.department?.split(' ')[0] || 'Eng'}
          subtitle={user?.department}
          icon={GraduationCap}
          variant="cyan"
        />
      </div>

      {/* Main Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Pending Actions (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card
            title="Pending Doubt Inquiries"
            subtitle="Take quick action to confirm or decline with reasons"
            action={
              <Link to="/faculty/requests" className="text-xs text-[#A78BFA] hover:text-white flex items-center gap-1 font-semibold group transition-colors">
                <span>Manage all</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            }
          >
            {loading ? (
              <div className="py-12 text-center text-xs text-[#9E98AE] flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
                <span>Loading pending requests...</span>
              </div>
            ) : pendingRequests.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#9E98AE] flex flex-col items-center justify-center gap-2">
                <CheckCircle2 className="w-8 h-8 text-[#10B981]" />
                <span>No pending requests. All student inquiries have been resolved!</span>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingRequests.slice(0, 4).map((req) => (
                  <div
                    key={req._id}
                    className="p-4 rounded-xl bg-[#13111C] border border-[#262135] hover:border-[#7C3AED]/40 hover:bg-white/[0.02] flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 transition-all group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white">
                          {req.requester?.fullName}
                        </span>
                        <span className="text-[10px] text-[#716B82] font-mono">
                          ({req.requester?.studentOrEmployeeId})
                        </span>
                      </div>
                      <h4 className="font-semibold text-xs sm:text-sm text-[#A78BFA]">
                        {req.subject}
                      </h4>
                      <p className="text-xs text-[#9E98AE] line-clamp-1">
                        "{req.description}"
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-[#716B82] pt-1 font-mono">
                        <span>📅 {new Date(req.date).toLocaleDateString()}</span>
                        <span>⏰ {req.startTime} - {req.endTime}</span>
                      </div>
                    </div>

                    <Link to="/faculty/requests" className="flex-shrink-0 self-start sm:self-center">
                      <Button size="sm" variant="primary">
                        Review Request
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Confirmed Upcoming Sessions (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card
            title="Confirmed Calendar Schedule"
            subtitle="Upcoming mentoring appointments"
            action={
              <Link to="/faculty/history" className="text-xs text-[#A78BFA] hover:text-white flex items-center gap-1 font-semibold group transition-colors">
                <span>Full schedule</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            }
          >
            {approvedSessions.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#716B82]">
                No approved upcoming sessions scheduled currently.
              </div>
            ) : (
              <div className="space-y-3">
                {approvedSessions.slice(0, 4).map((session) => (
                  <div
                    key={session._id}
                    className="p-3.5 rounded-xl bg-[#13111C] border border-[#262135] space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">
                        {session.requester?.fullName}
                      </span>
                      <StatusBadge status="approved" size="sm" />
                    </div>
                    <p className="text-xs text-[#A78BFA] font-medium line-clamp-1">
                      {session.subject}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-[#716B82] font-mono">
                      <span>📅 {new Date(session.date).toLocaleDateString()}</span>
                      <span>⏰ {session.startTime} - {session.endTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
