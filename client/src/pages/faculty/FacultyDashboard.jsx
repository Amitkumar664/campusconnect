import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  Calendar,
  Users,
  GraduationCap,
  ArrowRight,
  Sparkles,
  BookOpen
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
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-campus-card via-campus-surface to-campus-card border border-campus-border overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-campus-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-campus-primary/10 border border-campus-primary/20 text-xs text-campus-primary font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Faculty Mentor Workspace
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-campus-text">
              Welcome, <span className="text-campus-primary">{user?.fullName}</span>
            </h1>
            <p className="text-xs sm:text-sm text-campus-textMuted max-w-xl">
              Manage student doubt-clearing sessions, customize weekly office hours, and review requests with zero scheduling conflicts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/faculty/requests">
              <Button variant="primary" icon={ClipboardList}>
                Review Requests ({pendingRequests.length})
              </Button>
            </Link>
            <Link to="/faculty/availability">
              <Button variant="secondary" icon={Clock}>
                Set Office Hours
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Requests"
          value={sessions.length}
          subtitle="All-time student inquiries"
          icon={ClipboardList}
          variant="emerald"
        />
        <StatCard
          title="Pending Review"
          value={pendingRequests.length}
          subtitle="Awaiting your decision"
          icon={Clock}
          variant="amber"
        />
        <StatCard
          title="Confirmed Sessions"
          value={approvedSessions.length}
          subtitle="Approved on calendar"
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
            title="Pending Doubt Requests"
            subtitle="Take quick action to confirm or decline with reasons"
            action={
              <Link to="/faculty/requests" className="text-xs text-campus-primary hover:underline flex items-center gap-1 font-medium">
                Manage all <ArrowRight className="w-3 h-3" />
              </Link>
            }
          >
            {pendingRequests.length === 0 ? (
              <div className="p-8 text-center text-sm text-campus-textMuted">
                ✓ No pending requests. All student inquiries have been resolved!
              </div>
            ) : (
              <div className="space-y-3">
                {pendingRequests.slice(0, 4).map((req) => (
                  <div
                    key={req._id}
                    className="p-4 rounded-xl bg-campus-surface border border-campus-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-campus-borderGlow transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-campus-text">
                          {req.requester?.fullName}
                        </span>
                        <span className="text-[10px] text-campus-textSubtle font-mono">
                          ({req.requester?.studentOrEmployeeId})
                        </span>
                      </div>
                      <h4 className="font-semibold text-sm text-campus-primary">
                        {req.subject}
                      </h4>
                      <p className="text-xs text-campus-textMuted line-clamp-1">
                        "{req.description}"
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-campus-textSubtle pt-1 font-mono">
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
            subtitle="Upcoming mentoring meetings"
            action={
              <Link to="/faculty/history" className="text-xs text-campus-primary hover:underline flex items-center gap-1 font-medium">
                Full schedule <ArrowRight className="w-3 h-3" />
              </Link>
            }
          >
            {approvedSessions.length === 0 ? (
              <div className="p-6 text-center text-sm text-campus-textMuted">
                No approved upcoming sessions scheduled currently.
              </div>
            ) : (
              <div className="space-y-3">
                {approvedSessions.slice(0, 4).map((session) => (
                  <div
                    key={session._id}
                    className="p-3.5 rounded-xl bg-campus-surface border border-campus-border/70 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-campus-text">
                        {session.requester?.fullName}
                      </span>
                      <StatusBadge status="approved" size="sm" />
                    </div>
                    <p className="text-xs text-campus-primary font-medium line-clamp-1">
                      {session.subject}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-campus-textSubtle font-mono">
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

