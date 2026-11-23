import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Code2,
  Users,
  Trophy,
  GitBranch,
  ExternalLink,
  CheckCircle2,
  Search,
  Filter,
  Check
} from 'lucide-react';
import { eventAPI, teamAPI } from '../../services/api';

const HackathonManagement = () => {
  const [hackathons, setHackathons] = useState([]);
  const [selectedHackathonId, setSelectedHackathonId] = useState('');
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHackathons = async () => {
      try {
        const res = await eventAPI.getAll({ eventType: 'hackathon' });
        if (res.data.success && res.data.events?.length > 0) {
          setHackathons(res.data.events);
          setSelectedHackathonId(res.data.events[0]._id);
        }
      } catch (err) {
        console.error('Failed to load hackathons:', err);
      }
    };
    loadHackathons();
  }, []);

  const loadTeams = async (eventId) => {
    if (!eventId) return;
    try {
      setLoading(true);
      const res = await teamAPI.getEventTeams(eventId);
      if (res.data.success) {
        setTeams(res.data.teams || []);
      }
    } catch (err) {
      console.error('Failed to load teams:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedHackathonId) {
      loadTeams(selectedHackathonId);
    }
  }, [selectedHackathonId]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Code2 className="w-6 h-6 text-[#387ED1]" />
            <span>Hackathon Administration & Submissions Desk</span>
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Review registered teams, inspect GitHub repositories, test live demo deployments, and score submissions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#64748B]">Select Hackathon:</span>
          <select
            value={selectedHackathonId}
            onChange={(e) => setSelectedHackathonId(e.target.value)}
            className="px-4 py-2 rounded-xl bg-[#0F172A] border border-[#1E293B] text-xs font-semibold text-white focus:outline-none focus:border-[#387ED1]"
          >
            {hackathons.map((h) => (
              <option key={h._id} value={h._id}>
                {h.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Teams Grid */}
      {loading ? (
        <div className="py-20 text-center text-sm text-[#94A3B8]">
          <div className="w-8 h-8 border-2 border-[#387ED1] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading registered hackathon teams...
        </div>
      ) : teams.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-[#0F172A] border border-[#1E293B]">
          <Users className="w-10 h-10 text-[#64748B] mx-auto mb-2 opacity-50" />
          <h3 className="text-base font-bold text-white">No teams formed yet</h3>
          <p className="text-xs text-[#94A3B8] mt-1">Students will appear here as they register and build teams.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teams.map((team) => (
            <div
              key={team._id}
              className="p-6 rounded-2xl bg-[#0F172A] border border-[#1E293B] space-y-4 shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white">{team.teamName}</h3>
                    <p className="text-xs text-[#64748B] mt-0.5">Leader: {team.leader?.fullName} ({team.leader?.email})</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase bg-[#387ED1]/20 text-[#60A5FA]">
                    {team.teamCode}
                  </span>
                </div>

                {/* Team Roster */}
                <div className="mt-4">
                  <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block mb-2">
                    Member Roster ({team.members?.length || 0})
                  </span>
                  <div className="space-y-1.5">
                    {team.members?.map((m) => (
                      <div key={m.user?._id} className="text-xs text-[#CBD5E1] flex items-center justify-between">
                        <span>{m.user?.fullName} ({m.user?.studentOrEmployeeId})</span>
                        <span className="text-[10px] text-[#64748B] capitalize">{m.role}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Project Submission Review */}
                {team.projectSubmission?.title ? (
                  <div className="mt-4 p-4 rounded-xl bg-[#1E293B]/70 border border-[#334155] space-y-2 text-xs">
                    <span className="font-bold text-[#10B981] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Submitted: {team.projectSubmission.title}</span>
                    </span>
                    <p className="text-[#94A3B8] leading-relaxed">{team.projectSubmission.description}</p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {team.projectSubmission.repoUrl && (
                        <a
                          href={team.projectSubmission.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-[#0F172A] text-white hover:text-[#387ED1] flex items-center gap-1.5 border border-[#334155]"
                        >
                          <GitBranch className="w-3.5 h-3.5" />
                          <span>Code Repository</span>
                        </a>
                      )}
                      {team.projectSubmission.demoUrl && (
                        <a
                          href={team.projectSubmission.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-[#0F172A] text-white hover:text-[#387ED1] flex items-center gap-1.5 border border-[#334155]"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Live Demo / Video</span>
                        </a>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 p-3 rounded-xl bg-[#1E293B]/30 border border-dashed border-[#334155] text-xs text-[#64748B] text-center">
                    No project submitted yet.
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#1E293B] flex items-center justify-between text-xs text-[#64748B]">
                <span>Status: <strong className="text-white capitalize">{team.status}</strong></span>
                <span>Registered: {new Date(team.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HackathonManagement;
