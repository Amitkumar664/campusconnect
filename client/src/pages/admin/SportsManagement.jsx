import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Calendar,
  Plus,
  Medal,
  Clock,
  Save,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { eventAPI } from '../../services/api';

const SportsManagement = () => {
  const [sportsEvents, setSportsEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  // New Match Form
  const [showAddMatch, setShowAddMatch] = useState(false);
  const [matchData, setMatchData] = useState({
    round: 'Quarterfinal',
    team1: '',
    team2: '',
    matchTime: '10:00 AM',
    courtOrField: 'Main Turf',
    score: '',
    winner: '',
    status: 'scheduled'
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const loadSports = async () => {
    try {
      setLoading(true);
      const res = await eventAPI.getAll({ eventType: 'sports' });
      if (res.data.success && res.data.events?.length > 0) {
        setSportsEvents(res.data.events);
        if (!selectedEventId) {
          setSelectedEventId(res.data.events[0]._id);
          setSelectedEvent(res.data.events[0]);
        } else {
          const current = res.data.events.find((e) => e._id === selectedEventId);
          setSelectedEvent(current || res.data.events[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load sports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSports();
  }, [selectedEventId]);

  const handleSelectEvent = (id) => {
    setSelectedEventId(id);
    const found = sportsEvents.find((e) => e._id === id);
    setSelectedEvent(found || null);
  };

  const handleAddMatch = async (e) => {
    e.preventDefault();
    if (!selectedEvent) return;

    try {
      setSaving(true);
      setMessage('');
      const currentMatches = selectedEvent.matchSchedule || [];
      const newMatchNumber = currentMatches.length + 1;

      const updatedSchedule = [
        ...currentMatches,
        { ...matchData, matchNumber: newMatchNumber }
      ];

      await eventAPI.update(selectedEvent._id, { matchSchedule: updatedSchedule });
      setMessage('Match fixture added successfully!');
      setShowAddMatch(false);
      setMatchData({
        round: 'Quarterfinal',
        team1: '',
        team2: '',
        matchTime: '10:00 AM',
        courtOrField: 'Main Turf',
        score: '',
        winner: '',
        status: 'scheduled'
      });
      loadSports();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save match');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateMatchScore = async (idx, updatedMatch) => {
    try {
      const schedule = [...selectedEvent.matchSchedule];
      schedule[idx] = updatedMatch;
      await eventAPI.update(selectedEvent._id, { matchSchedule: schedule });
      loadSports();
    } catch (err) {
      alert('Failed to update score');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-[#F59E0B]" />
            <span>Athletics & Sports Championship Desk</span>
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Publish match fixtures, track live tournament scores, and declare champions across inter-department cups.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedEventId}
            onChange={(e) => handleSelectEvent(e.target.value)}
            className="px-4 py-2 rounded-xl bg-[#0F172A] border border-[#1E293B] text-xs font-semibold text-white focus:outline-none focus:border-[#387ED1]"
          >
            {sportsEvents.map((s) => (
              <option key={s._id} value={s._id}>
                {s.title} ({s.sportType})
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowAddMatch(true)}
            className="px-4 py-2 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-black text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Fixture</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-[#10B981]/20 border border-[#10B981]/30 text-xs text-[#10B981] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{message}</span>
        </div>
      )}

      {/* Match Fixtures List */}
      <div className="rounded-2xl bg-[#0F172A] border border-[#1E293B] overflow-hidden shadow-lg">
        <div className="p-4 border-b border-[#1E293B] bg-[#0B0F19] flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">
            {selectedEvent?.title} • Match Brackets ({selectedEvent?.matchSchedule?.length || 0})
          </h3>
          <span className="text-xs text-[#F59E0B] font-semibold">{selectedEvent?.sportType}</span>
        </div>

        <div className="divide-y divide-[#1E293B]">
          {selectedEvent?.matchSchedule?.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#64748B]">
              No match fixtures scheduled yet. Click "Add Fixture" to create one.
            </div>
          ) : (
            selectedEvent?.matchSchedule?.map((match, idx) => (
              <div key={idx} className="p-4 hover:bg-[#1E293B]/30 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{match.round}</span>
                    <span className="text-[#64748B]">•</span>
                    <span className="text-[#94A3B8]">{match.matchTime} ({match.courtOrField})</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold mt-1 text-white">
                    <span>{match.team1}</span>
                    <span className="text-[#64748B] text-xs font-normal">vs</span>
                    <span>{match.team2}</span>
                  </div>
                </div>

                {/* Score and Winner Controls */}
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    defaultValue={match.score}
                    placeholder="Enter score e.g. 3-1, 120/4"
                    onBlur={(e) => handleUpdateMatchScore(idx, { ...match, score: e.target.value })}
                    className="px-3 py-1.5 rounded-lg bg-[#1E293B] border border-[#334155] text-white focus:outline-none focus:border-[#F59E0B] font-mono text-xs w-40"
                  />

                  <select
                    defaultValue={match.winner || ''}
                    onChange={(e) => handleUpdateMatchScore(idx, { ...match, winner: e.target.value, status: e.target.value ? 'completed' : 'scheduled' })}
                    className="px-3 py-1.5 rounded-lg bg-[#1E293B] border border-[#334155] text-white focus:outline-none focus:border-[#F59E0B] text-xs"
                  >
                    <option value="">Winner (TBD)</option>
                    <option value={match.team1}>{match.team1}</option>
                    <option value={match.team2}>{match.team2}</option>
                  </select>

                  <span
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                      match.status === 'completed'
                        ? 'bg-[#10B981]/20 text-[#10B981]'
                        : 'bg-[#1E293B] text-[#94A3B8]'
                    }`}
                  >
                    {match.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Match Modal */}
      {showAddMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-2xl bg-[#0F172A] border border-[#1E293B] p-6 shadow-2xl space-y-4"
          >
            <h3 className="text-base font-bold text-white">Add Tournament Match Fixture</h3>

            <form onSubmit={handleAddMatch} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#94A3B8] mb-1">Round / Stage</label>
                <input
                  type="text"
                  required
                  value={matchData.round}
                  onChange={(e) => setMatchData({ ...matchData, round: e.target.value })}
                  placeholder="e.g. Quarterfinal 1, Semifinal, Grand Final"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-white focus:outline-none focus:border-[#F59E0B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#94A3B8] mb-1">Team 1</label>
                  <input
                    type="text"
                    required
                    value={matchData.team1}
                    onChange={(e) => setMatchData({ ...matchData, team1: e.target.value })}
                    placeholder="e.g. CSE Strikers"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-white focus:outline-none focus:border-[#F59E0B]"
                  />
                </div>
                <div>
                  <label className="block text-[#94A3B8] mb-1">Team 2</label>
                  <input
                    type="text"
                    required
                    value={matchData.team2}
                    onChange={(e) => setMatchData({ ...matchData, team2: e.target.value })}
                    placeholder="e.g. ECE Dynamos"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-white focus:outline-none focus:border-[#F59E0B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#94A3B8] mb-1">Match Time</label>
                  <input
                    type="text"
                    required
                    value={matchData.matchTime}
                    onChange={(e) => setMatchData({ ...matchData, matchTime: e.target.value })}
                    placeholder="e.g. 10:00 AM"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-white focus:outline-none focus:border-[#F59E0B]"
                  />
                </div>
                <div>
                  <label className="block text-[#94A3B8] mb-1">Pitch / Court</label>
                  <input
                    type="text"
                    required
                    value={matchData.courtOrField}
                    onChange={(e) => setMatchData({ ...matchData, courtOrField: e.target.value })}
                    placeholder="e.g. Pavilion Pitch A"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-white focus:outline-none focus:border-[#F59E0B]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddMatch(false)}
                  className="px-4 py-2 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-black font-bold uppercase tracking-wider shadow-md"
                >
                  {saving ? 'Adding...' : 'Save Fixture'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SportsManagement;
