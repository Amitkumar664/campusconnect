import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  ChevronRight,
  Medal,
  Activity
} from 'lucide-react';
import { eventAPI } from '../../services/api';

const SPORTS_CATEGORIES = ['All', 'Cricket', 'Football', 'Basketball', 'Badminton', 'Volleyball', 'Table Tennis'];

const SportsHub = () => {
  const [sportsEvents, setSportsEvents] = useState([]);
  const [selectedSport, setSelectedSport] = useState('All');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tournaments'); // 'tournaments' | 'matches' | 'standings'

  const fetchSportsEvents = async () => {
    try {
      setLoading(true);
      const params = { eventType: 'sports' };
      if (selectedSport !== 'All') params.sportType = selectedSport;

      const res = await eventAPI.getAll(params);
      if (res.data.success) {
        setSportsEvents(res.data.events || []);
      }
    } catch (err) {
      console.error('Failed to load sports events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSportsEvents();
  }, [selectedSport]);

  // Aggregate all matches across sports events
  const allMatches = [];
  sportsEvents.forEach((ev) => {
    if (ev.matchSchedule && Array.isArray(ev.matchSchedule)) {
      ev.matchSchedule.forEach((m) => {
        allMatches.push({ ...m, eventTitle: ev.title, sportType: ev.sportType });
      });
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-[#F59E0B]" />
            <span>Collegiate Sports Arena & Tournaments</span>
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Follow inter-department championship matches, live scores, tournament brackets, and register for varsity trials.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0F172A] border border-[#1E293B]">
          <button
            onClick={() => setActiveTab('tournaments')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'tournaments'
                ? 'bg-[#387ED1] text-white shadow-sm'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            Tournaments
          </button>
          <button
            onClick={() => setActiveTab('matches')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'matches'
                ? 'bg-[#387ED1] text-white shadow-sm'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            Live Match Schedule ({allMatches.length})
          </button>
        </div>
      </div>

      {/* Sport Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full custom-scrollbar">
        {SPORTS_CATEGORIES.map((sport) => (
          <button
            key={sport}
            onClick={() => setSelectedSport(sport)}
            className={`px-4 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              selectedSport === sport
                ? 'bg-[#F59E0B] text-black font-bold shadow-md'
                : 'bg-[#0F172A] border border-[#1E293B] text-[#94A3B8] hover:text-white hover:bg-[#1E293B]'
            }`}
          >
            {sport}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center text-sm text-[#94A3B8]">
          <div className="w-8 h-8 border-2 border-[#F59E0B] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading sports fixtures...
        </div>
      ) : activeTab === 'tournaments' ? (
        /* Tournaments Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sportsEvents.length === 0 ? (
            <div className="col-span-full py-16 text-center rounded-2xl bg-[#0F172A] border border-[#1E293B]">
              <Trophy className="w-10 h-10 text-[#64748B] mx-auto mb-2 opacity-50" />
              <p className="text-xs text-[#94A3B8]">No tournaments currently scheduled for {selectedSport}.</p>
            </div>
          ) : (
            sportsEvents.map((event) => (
              <div
                key={event._id}
                className="rounded-2xl bg-[#0F172A] border border-[#1E293B] overflow-hidden hover:border-[#F59E0B]/50 transition-all shadow-md flex flex-col justify-between"
              >
                <div className="h-40 relative bg-[#1E293B] overflow-hidden">
                  <img
                    src={event.bannerUrl || 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=600&q=80'}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md text-white border border-white/10">
                      {event.sportType || 'Sports'}
                    </span>
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#F59E0B]/90 text-black">
                      {event.tournamentFormat || 'Knockout'}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white line-clamp-1">{event.title}</h3>
                    <p className="text-xs text-[#94A3B8] mt-1 line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>

                    <div className="mt-4 space-y-2 text-xs text-[#64748B]">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#F59E0B]" />
                        <span>{new Date(event.eventDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#F59E0B]" />
                        <span className="truncate">{event.venue}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#1E293B] flex items-center justify-between">
                    <span className="text-xs text-[#64748B]">
                      {event.matchSchedule?.length || 0} Fixtures
                    </span>
                    <button
                      onClick={() => setActiveTab('matches')}
                      className="px-3.5 py-1.5 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-white text-xs font-semibold border border-[#334155] transition-all flex items-center gap-1"
                    >
                      <span>View Matches</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Match Schedule Table */
        <div className="rounded-2xl bg-[#0F172A] border border-[#1E293B] overflow-hidden shadow-lg">
          <div className="p-4 border-b border-[#1E293B] bg-[#0B0F19] flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#F59E0B]" />
              <span>Fixtures & Live Match Results</span>
            </h3>
            <span className="text-xs text-[#64748B] font-mono">Updated in real-time</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#111827] text-[#94A3B8] uppercase text-[10px] tracking-wider border-b border-[#1E293B]">
                <tr>
                  <th className="py-3 px-4">Match / Round</th>
                  <th className="py-3 px-4">Matchup (Team 1 vs Team 2)</th>
                  <th className="py-3 px-4">Time & Pitch</th>
                  <th className="py-3 px-4">Score & Outcome</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]">
                {allMatches.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-[#64748B]">
                      No match schedules published yet.
                    </td>
                  </tr>
                ) : (
                  allMatches.map((m, idx) => (
                    <tr key={idx} className="hover:bg-[#1E293B]/40 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-white">
                        <span>{m.round || `Match ${m.matchNumber}`}</span>
                        <p className="text-[10px] text-[#64748B] font-normal">{m.eventTitle}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2 text-sm font-bold">
                          <span className={m.winner === m.team1 ? 'text-[#10B981]' : 'text-white'}>
                            {m.team1}
                          </span>
                          <span className="text-[#64748B] font-normal text-xs">vs</span>
                          <span className={m.winner === m.team2 ? 'text-[#10B981]' : 'text-white'}>
                            {m.team2}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-[#94A3B8]">
                        <p className="font-semibold text-white">{m.matchTime}</p>
                        <p className="text-[11px] text-[#64748B]">{m.courtOrField}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        {m.score ? (
                          <div>
                            <span className="font-mono font-bold text-white text-xs">{m.score}</span>
                            {m.winner && (
                              <p className="text-[10px] text-[#10B981] font-semibold flex items-center gap-1 mt-0.5">
                                <Medal className="w-3 h-3" />
                                <span>Winner: {m.winner}</span>
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-[#64748B] italic">Awaiting kickoff</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            m.status === 'completed'
                              ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30'
                              : m.status === 'in_progress'
                              ? 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30 animate-pulse'
                              : 'bg-[#1E293B] text-[#94A3B8]'
                          }`}
                        >
                          {m.status === 'in_progress' ? 'Live' : m.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SportsHub;
