import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Building2,
  GraduationCap,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  Ticket
} from 'lucide-react';
import { analyticsAPI } from '../../services/api';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#6B7280', '#38BDF8'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-campus-surface border border-campus-border p-3 rounded-xl shadow-2xl text-xs space-y-1">
        <p className="font-semibold text-campus-text">{label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {entry.name}: <span className="font-bold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AnalyticsDashboard = () => {
  const [kpiData, setKpiData] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [resourceStats, setResourceStats] = useState({ topResources: [], typeBreakdown: [] });
  const [eventStats, setEventStats] = useState({ topEvents: [], categoryStats: [] });
  const [facultyDemand, setFacultyDemand] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchAllAnalytics = async () => {
      try {
        const [kpisRes, trendsRes, resourcesRes, eventsRes, facultyRes] = await Promise.all([
          analyticsAPI.getOverview(),
          analyticsAPI.getTrends({ days: 30 }),
          analyticsAPI.getResourceUtilization(),
          analyticsAPI.getEventPerformance(),
          analyticsAPI.getFacultyDemand()
        ]);

        if (kpisRes.data.success) setKpiData(kpisRes.data.kpis);
        if (trendsRes.data.success) setTrendData(trendsRes.data.trends);
        if (resourcesRes.data.success) setResourceStats(resourcesRes.data);
        if (eventsRes.data.success) setEventStats(eventsRes.data);
        if (facultyRes.data.success) setFacultyDemand(facultyRes.data.facultyDemand);
      } catch (error) {
        console.error('Analytics aggregation fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllAnalytics();
  }, []);

  const handleExportCSV = async (type) => {
    setExporting(true);
    try {
      const res = await analyticsAPI.exportCSV(type);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `campusconnect_${type}_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert(`Export failed for ${type}`);
    } finally {
      setExporting(false);
    }
  };

  const statusPieData = kpiData
    ? [
        { name: 'Approved', value: kpiData.statusBreakdown?.approved || 0 },
        { name: 'Pending', value: kpiData.statusBreakdown?.pending || 0 },
        { name: 'Rejected', value: kpiData.statusBreakdown?.rejected || 0 },
        { name: 'Cancelled', value: kpiData.statusBreakdown?.cancelled || 0 }
      ].filter((d) => d.value > 0)
    : [];

  return (
    <div className="space-y-8">
      {/* Header and Export Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-campus-amber/10 border border-campus-amber/30 text-xs text-campus-amber font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> MongoDB Live Aggregation Engine
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-campus-text">
            Business Analytics & Intelligence Dashboard
          </h1>
          <p className="text-sm text-campus-textMuted mt-1">
            Real-time campus utilization, booking velocity, and capacity trends calculated from operational records.
          </p>
        </div>

        {/* CSV Export Action Buttons */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            icon={Download}
            loading={exporting}
            onClick={() => handleExportCSV('bookings')}
          >
            Export Bookings CSV
          </Button>
          <Button
            variant="amber"
            size="sm"
            icon={Download}
            loading={exporting}
            onClick={() => handleExportCSV('events')}
          >
            Export Events CSV
          </Button>
        </div>
      </div>

      {/* Primary KPI Ribbon (All 7 Master KPIs) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
        <StatCard
          title="Total Bookings"
          value={kpiData?.totalBookings || 0}
          icon={TrendingUp}
          variant="emerald"
        />
        <StatCard
          title="Event Registrations"
          value={kpiData?.totalEventRegistrations || 0}
          icon={Ticket}
          variant="amber"
        />
        <StatCard
          title="Faculty Doubts"
          value={kpiData?.totalFacultySessions || 0}
          icon={GraduationCap}
          variant="cyan"
        />
        <StatCard
          title="Lab & Room Bookings"
          value={kpiData?.totalResourceBookings || 0}
          icon={Building2}
          variant="emerald"
        />
        <StatCard
          title="Active Students"
          value={kpiData?.totalStudents || 0}
          icon={Users}
          variant="cyan"
        />
        <StatCard
          title="Approval Rate"
          value={`${kpiData?.approvalRate || 0}%`}
          subtitle="Confirmed ratio"
          icon={CheckCircle2}
          variant="emerald"
        />
        <StatCard
          title="Resource Utilization"
          value={`${kpiData?.resourceUtilizationRate || 0}%`}
          subtitle="Hours occupied"
          icon={Clock}
          variant="amber"
        />
      </div>

      {/* Row 1: Booking Trends & Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Booking Trends AreaChart (8 cols) */}
        <div className="lg:col-span-8">
          <Card
            title="A. Booking Trajectory & Category Demand"
            subtitle="Daily volume comparison: Faculty Doubt Sessions vs Resource Reservations"
          >
            <div className="h-80 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorFaculty" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorResource" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="date" stroke="#6B7280" fontSize={11} />
                  <YAxis stroke="#6B7280" fontSize={11} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Area
                    type="monotone"
                    dataKey="facultySessions"
                    name="Faculty Doubt Sessions"
                    stroke="#10B981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorFaculty)"
                  />
                  <Area
                    type="monotone"
                    dataKey="resourceBookings"
                    name="Lab/Room Bookings"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorResource)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Booking Status Donut Chart (4 cols) */}
        <div className="lg:col-span-4">
          <Card
            title="E. Status Allocation"
            subtitle="Approval vs Pending vs Rejected"
          >
            <div className="h-80 w-full flex flex-col items-center justify-center">
              {statusPieData.length === 0 ? (
                <p className="text-xs text-campus-textMuted">No status records.</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusPieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          stroke="rgba(0,0,0,0.5)"
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Row 2: Resource Utilization & Event Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Most frequently booked classrooms & labs (6 cols) */}
        <div className="lg:col-span-6">
          <Card
            title="D. Resource Utilization Ranking"
            subtitle="Most frequently booked facilities by total hours reserved"
          >
            <div className="h-80 w-full pt-4">
              {resourceStats.topResources.length === 0 ? (
                <p className="text-xs text-campus-textMuted py-8 text-center">
                  No resource booking records.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={resourceStats.topResources} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis type="number" stroke="#6B7280" fontSize={11} />
                    <YAxis dataKey="code" type="category" stroke="#6B7280" fontSize={11} width={80} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Bar
                      dataKey="totalHours"
                      name="Hours Occupied"
                      fill="#10B981"
                      radius={[0, 8, 8, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>
        </div>

        {/* Event Capacity vs Actual Registrations (6 cols) */}
        <div className="lg:col-span-6">
          <Card
            title="B. Event Performance & Capacity Fill Rate"
            subtitle="Registration turnout versus maximum seating limit"
          >
            <div className="h-80 w-full pt-4">
              {eventStats.topEvents.length === 0 ? (
                <p className="text-xs text-campus-textMuted py-8 text-center">
                  No event records.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={eventStats.topEvents}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis
                      dataKey="title"
                      stroke="#6B7280"
                      fontSize={10}
                      tickFormatter={(val) => (val.length > 14 ? `${val.substring(0, 14)}...` : val)}
                    />
                    <YAxis stroke="#6B7280" fontSize={11} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="capacity" name="Total Capacity" fill="#374151" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="registered" name="Confirmed Attendees" fill="#F59E0B" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Row 3: Faculty Demand Analysis Table */}
      <Card
        title="C. Faculty Mentorship Analytics & Resolution Performance"
        subtitle="Departmental inquiry volume and student request satisfaction rate"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-campus-surface/70 text-campus-textMuted uppercase font-mono text-[10px]">
              <tr>
                <th className="py-3 px-4">Faculty Member</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4 text-center">Total Requests</th>
                <th className="py-3 px-4 text-center">Approved Sessions</th>
                <th className="py-3 px-4 text-center">Declined</th>
                <th className="py-3 px-4 text-right">Fulfillment Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-campus-border/60">
              {facultyDemand.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-campus-textMuted">
                    No faculty mentorship session records.
                  </td>
                </tr>
              ) : (
                facultyDemand.map((f) => (
                  <tr key={f._id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-campus-text">
                      {f.name}
                    </td>
                    <td className="py-3.5 px-4 text-campus-textMuted">
                      {f.department}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-medium text-campus-text">
                      {f.totalRequests}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-emerald-400 font-medium">
                      {f.approvedSessions}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-rose-400">
                      {f.rejectedSessions}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="font-mono font-bold text-campus-primary">
                        {f.resolutionRate}%
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;

