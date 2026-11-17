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

const COLORS = ['#7C3AED', '#10B981', '#F59E0B', '#EF4444', '#06B6D4'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0D0C15] border border-[#262135] p-3.5 rounded-xl shadow-[0_15px_35px_rgba(0,0,0,0.85)] text-xs space-y-1.5 z-50 ring-1 ring-white/10 font-mono">
        <p className="font-semibold text-white tracking-tight">{label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color }} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-[#9E98AE]">{entry.name}:</span>
            <span className="font-mono font-bold text-white ml-auto">{entry.value}</span>
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
    <div className="space-y-8 animate-in fade-in duration-300 font-sans">
      {/* Header and Export Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#13111C] border border-[#262135] text-xs text-[#A78BFA] font-semibold mb-2 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" /> MongoDB Live Aggregation Pipeline
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Institutional Analytics & Operations Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-[#9E98AE] mt-1">
            Real-time campus utilization, booking velocity, and capacity trends calculated directly from operational records.
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
            variant="white"
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
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3.5 sm:gap-4">
        <StatCard
          title="Total Bookings"
          value={kpiData?.totalBookings || 0}
          icon={TrendingUp}
          variant="purple"
        />
        <StatCard
          title="Event Passes"
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
          title="Lab Bookings"
          value={kpiData?.totalResourceBookings || 0}
          icon={Building2}
          variant="purple"
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
          title="Resource Load"
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
                      <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorResource" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262135" />
                  <XAxis dataKey="date" stroke="#716B82" fontSize={11} fontMono />
                  <YAxis stroke="#716B82" fontSize={11} fontMono />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Area
                    type="monotone"
                    dataKey="facultySessions"
                    name="Faculty Doubt Sessions"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorFaculty)"
                  />
                  <Area
                    type="monotone"
                    dataKey="resourceBookings"
                    name="Lab/Room Bookings"
                    stroke="#06B6D4"
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
                <p className="text-xs text-[#716B82]">No status records.</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {statusPieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          stroke="#0D0C15"
                          strokeWidth={3}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px', color: '#9E98AE' }} />
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
                <p className="text-xs text-[#716B82] py-8 text-center">
                  No resource booking records.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={resourceStats.topResources} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#262135" />
                    <XAxis type="number" stroke="#716B82" fontSize={11} fontMono />
                    <YAxis dataKey="code" type="category" stroke="#716B82" fontSize={11} width={80} fontMono />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Bar
                      dataKey="totalHours"
                      name="Hours Occupied"
                      fill="#7C3AED"
                      radius={[0, 6, 6, 0]}
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
                <p className="text-xs text-[#716B82] py-8 text-center">
                  No event records.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={eventStats.topEvents}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#262135" />
                    <XAxis
                      dataKey="title"
                      stroke="#716B82"
                      fontSize={10}
                      tickFormatter={(val) => (val.length > 14 ? `${val.substring(0, 14)}...` : val)}
                    />
                    <YAxis stroke="#716B82" fontSize={11} fontMono />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="capacity" name="Total Capacity" fill="#262135" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="registered" name="Confirmed Attendees" fill="#10B981" radius={[4, 4, 0, 0]} />
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
            <thead className="bg-[#13111C] text-[#9E98AE] uppercase font-mono text-[10px] border-b border-[#262135]">
              <tr>
                <th className="py-3 px-4">Faculty Member</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4 text-center">Total Requests</th>
                <th className="py-3 px-4 text-center">Approved Sessions</th>
                <th className="py-3 px-4 text-center">Declined</th>
                <th className="py-3 px-4 text-right">Fulfillment Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262135]">
              {facultyDemand.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-[#716B82]">
                    No faculty mentorship session records.
                  </td>
                </tr>
              ) : (
                facultyDemand.map((f) => (
                  <tr key={f._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {f.name}
                    </td>
                    <td className="py-3.5 px-4 text-[#9E98AE]">
                      {f.department}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-medium text-white">
                      {f.totalRequests}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-[#34D399] font-medium">
                      {f.approvedSessions}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-rose-400">
                      {f.rejectedSessions}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="font-mono font-bold text-[#A78BFA]">
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
