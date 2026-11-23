import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Sparkles,
  Users,
  Calendar,
  Ticket,
  BrainCircuit,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Download
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { analyticsAPI } from '../../services/api';

const COLORS = ['#387ED1', '#10B981', '#F59E0B', '#6366F1', '#EC4899', '#06B6D4', '#8B5CF6'];

const AnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [trends, setTrends] = useState(null);
  const [popularity, setPopularity] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [kpiRes, trendsRes, popRes, predRes, insRes] = await Promise.all([
          analyticsAPI.getOverview(),
          analyticsAPI.getTrends(),
          analyticsAPI.getPopularity(),
          analyticsAPI.getPredictions(),
          analyticsAPI.getInsights()
        ]);

        if (kpiRes.data.success) setOverview(kpiRes.data.kpis);
        if (trendsRes.data.success) setTrends(trendsRes.data);
        if (popRes.data.success) setPopularity(popRes.data);
        if (predRes.data.success) setPredictions(predRes.data);
        if (insRes.data.success) setInsights(insRes.data.insights || []);
      } catch (err) {
        console.error('Failed to load AI analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // Format prediction data for Bar chart: Current Registered vs Predicted Registrations
  const predictionChartData = (predictions?.predictions || []).map((p) => ({
    title: p.title.length > 18 ? p.title.substring(0, 18) + '...' : p.title,
    current: p.currentRegistered,
    predicted: p.predictedRegistrations,
    capacity: p.capacity,
    turnout: p.predictedTurnoutPct
  }));

  const categoryChartData = (popularity?.categories || []).map((c) => ({
    name: c.category.toUpperCase(),
    registered: c.totalRegistered,
    capacity: c.totalCapacity,
    utilization: c.utilizationRate
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#387ED1]/20 border border-[#387ED1]/40 text-xs font-semibold text-[#60A5FA] mb-2">
            <BrainCircuit className="w-4 h-4" />
            <span>Scikit-Learn Machine Learning Analytics</span>
          </div>
          <h1 className="text-2xl font-display font-extrabold text-white tracking-tight">
            AI-Powered Registration Forecasting & Intelligence
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1 max-w-2xl">
            Predictive modeling predicts upcoming student turnout, analyzes category demand velocity, and synthesizes data-backed campus insights.
          </p>
        </div>

        {predictions?.modelAccuracyScore && (
          <div className="p-3 rounded-2xl bg-[#0F172A] border border-[#1E293B] text-right flex items-center gap-3">
            <div>
              <p className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider">Model R² Accuracy</p>
              <p className="text-xl font-bold font-mono text-[#10B981]">{predictions.modelAccuracyScore}%</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 text-[#10B981] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="py-24 text-center text-sm text-[#94A3B8]">
          <div className="w-8 h-8 border-2 border-[#387ED1] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Running Scikit-learn regression pipeline on MongoDB events...
        </div>
      ) : (
        <>
          {/* AI Executive Insights Grid */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-[#F59E0B]" />
              <span>AI-Generated Executive Insights</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {insights.map((ins, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#0F172A] border border-[#1E293B] shadow-md space-y-2 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#387ED1] block mb-1">
                      {ins.type?.replace(/_/g, ' ')}
                    </span>
                    <h3 className="text-xs font-bold text-white">{ins.title}</h3>
                    <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed">{ins.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 1: Scikit-learn Predictions Chart (Current vs Predicted Registrations) */}
          <div className="p-6 rounded-2xl bg-[#0F172A] border border-[#1E293B] shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#387ED1]" />
                  <span>Predicted vs. Actual Registrations (Upcoming Events)</span>
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Trained via Random Forest Regression across category, lead time, and collegiate turnout history
                </p>
              </div>

              <span className="text-xs font-mono px-2.5 py-1 rounded bg-[#1E293B] text-[#94A3B8]">
                {predictions?.engine || 'Scikit-Learn ML'}
              </span>
            </div>

            {predictionChartData.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#64748B]">
                No upcoming events requiring predictive forecasting.
              </div>
            ) : (
              <div className="h-80 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={predictionChartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis dataKey="title" stroke="#64748B" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#64748B" tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#FFFFFF' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Bar dataKey="current" name="Current Registrations" fill="#387ED1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="predicted" name="Predicted Final Turnout" fill="#10B981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="capacity" name="Total Capacity Limit" fill="#64748B" opacity={0.4} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Section 2: Trends and Category Breakdown Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Monthly Registration Volume Trend */}
            <div className="p-6 rounded-2xl bg-[#0F172A] border border-[#1E293B] shadow-xl space-y-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#10B981]" />
                  <span>Monthly Registration Velocity & Check-Ins</span>
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">Aggregated student passes booked across the academic year</p>
              </div>

              <div className="h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trends?.monthlyData || []}>
                    <defs>
                      <linearGradient id="regGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#387ED1" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#387ED1" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis dataKey="month" stroke="#64748B" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#64748B" tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#FFFFFF' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Area type="monotone" dataKey="registrations" name="Tickets Booked" stroke="#387ED1" fillOpacity={1} fill="url(#regGrad)" />
                    <Area type="monotone" dataKey="attended" name="Door Verified" stroke="#10B981" fillOpacity={1} fill="url(#attGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Demand Distribution */}
            <div className="p-6 rounded-2xl bg-[#0F172A] border border-[#1E293B] shadow-xl space-y-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#F59E0B]" />
                  <span>Category Demand & Capacity Utilization</span>
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">Participation volumes across hackathons, technical, and sports</p>
              </div>

              <div className="h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryChartData} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis type="number" stroke="#64748B" tick={{ fontSize: 11 }} />
                    <YAxis dataKey="name" type="category" stroke="#64748B" tick={{ fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#FFFFFF' }}
                    />
                    <Bar dataKey="registered" name="Total Registered" fill="#387ED1" radius={[0, 4, 4, 0]}>
                      {categoryChartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
