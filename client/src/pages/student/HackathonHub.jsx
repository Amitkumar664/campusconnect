import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2,
  Users,
  Trophy,
  Calendar,
  Clock,
  Plus,
  LogIn,
  Send,
  GitBranch,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';
import { eventAPI, teamAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const HackathonHub = () => {
  const { user } = useAuth();
  const [hackathons, setHackathons] = useState([]);
  const [myTeams, setMyTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);

  // Form states
  const [newTeamName, setNewTeamName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [copiedCode, setCopiedCode] = useState(null);

  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', isError: false });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [eventsRes, teamsRes] = await Promise.all([
        eventAPI.getAll({ eventType: 'hackathon' }),
        teamAPI.getMy()
      ]);

      if (eventsRes.data.success) {
        setHackathons(eventsRes.data.events || []);
      }
      if (teamsRes.data.success) {
        setMyTeams(teamsRes.data.teams || []);
      }
    } catch (err) {
      console.error('Failed to load hackathon hub data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      setMessage({ text: '', isError: false });

      const res = await teamAPI.create({
        teamName: newTeamName,
        eventId: selectedHackathon._id
      });

      if (res.data.success) {
        setMessage({ text: res.data.message, isError: false });
        setNewTeamName('');
        setShowCreateModal(false);
        fetchData();
      }
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Failed to create team', isError: true });
    } finally {
      setActionLoading(false);
    }
  };

  const handleJoinTeam = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      setMessage({ text: '', isError: false });

      const res = await teamAPI.join({ teamCode: joinCode });
      if (res.data.success) {
        setMessage({ text: res.data.message, isError: false });
        setJoinCode('');
        setShowJoinModal(false);
        fetchData();
      }
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Failed to join team', isError: true });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitProject = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      const res = await teamAPI.submitProject(selectedTeam._id, {
        title: projectTitle,
        repoUrl,
        demoUrl,
        description
      });

      if (res.data.success) {
        setMessage({ text: 'Project submitted successfully for judging!', isError: false });
        setShowSubmitModal(false);
        fetchData();
      }
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Failed to submit project', isError: true });
    } finally {
      setActionLoading(false);
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Code2 className="w-6 h-6 text-[#387ED1]" />
            <span>Collegiate Hackathons Hub</span>
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Build software, form multi-disciplinary teams, tackle industry problem statements, and submit projects.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setShowJoinModal(true);
              setMessage({ text: '', isError: false });
            }}
            className="px-4 py-2.5 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-white text-xs font-semibold border border-[#334155] flex items-center gap-2 transition-all"
          >
            <LogIn className="w-4 h-4 text-[#387ED1]" />
            <span>Join Team with Code</span>
          </button>
        </div>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
            message.isError
              ? 'bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#EF4444]'
              : 'bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981]'
          }`}
        >
          {message.isError ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* My Active Teams Section */}
      {myTeams.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-base font-display font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-[#387ED1]" />
            <span>My Registered Teams ({myTeams.length})</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myTeams.map((team) => (
              <div
                key={team._id}
                className="p-5 rounded-2xl bg-[#0F172A] border border-[#1E293B] space-y-4 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">{team.teamName}</h3>
                    <p className="text-xs text-[#60A5FA] mt-0.5">{team.event?.title}</p>
                  </div>

                  {/* Team Invite Code */}
                  <div className="flex items-center gap-2 bg-[#1E293B] px-3 py-1.5 rounded-xl border border-[#334155]">
                    <span className="text-[11px] font-mono font-bold text-white">{team.teamCode}</span>
                    <button
                      onClick={() => copyToClipboard(team.teamCode)}
                      className="text-[#64748B] hover:text-[#387ED1] transition-colors"
                      title="Copy Team Code"
                    >
                      {copiedCode === team.teamCode ? (
                        <Check className="w-3.5 h-3.5 text-[#10B981]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Team Roster */}
                <div>
                  <div className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-2">
                    Roster ({team.members?.length || 0} / {team.maxMembers || 4} members)
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {team.members?.map((m) => (
                      <span
                        key={m.user?._id}
                        className="px-2.5 py-1 rounded-lg bg-[#1E293B]/70 border border-[#334155] text-xs text-white flex items-center gap-1.5"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                        <span>{m.user?.fullName}</span>
                        {m.role === 'leader' && (
                          <span className="text-[9px] font-bold uppercase text-[#F59E0B]">(Leader)</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Submission Status or Action */}
                <div className="pt-3 border-t border-[#1E293B] flex items-center justify-between">
                  {team.projectSubmission?.title ? (
                    <div className="text-xs text-[#10B981] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Project Submitted: "{team.projectSubmission.title}"</span>
                    </div>
                  ) : (
                    <div className="text-xs text-[#F59E0B]">
                      Pending project submission
                    </div>
                  )}

                  {team.leader?._id === user?._id && (
                    <button
                      onClick={() => {
                        setSelectedTeam(team);
                        setShowSubmitModal(true);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-[#387ED1] hover:bg-[#2563EB] text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{team.projectSubmission?.title ? 'Update Submission' : 'Submit Project'}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Hackathons */}
      <div className="space-y-4">
        <h2 className="text-base font-display font-bold text-white flex items-center gap-2">
          <Trophy className="w-4 h-4 text-[#F59E0B]" />
          <span>Active & Upcoming Hackathons ({hackathons.length})</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hackathons.map((hackathon) => (
            <div
              key={hackathon._id}
              className="rounded-2xl bg-[#0F172A] border border-[#1E293B] overflow-hidden flex flex-col justify-between shadow-md"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#387ED1]/20 text-[#60A5FA] border border-[#387ED1]/30">
                      Hackathon
                    </span>
                    <h3 className="text-lg font-bold text-white mt-2">{hackathon.title}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#10B981]">
                      {hackathon.prizes?.[0]?.reward || 'Prizes & Grants'}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-3">
                  {hackathon.description}
                </p>

                {/* Problem Statement Preview */}
                {hackathon.problemStatement && (
                  <div className="p-3.5 rounded-xl bg-[#1E293B]/60 border border-[#334155]/60 text-xs space-y-1">
                    <span className="font-semibold text-white">Tracks & Challenge:</span>
                    <p className="text-[#94A3B8] line-clamp-2">{hackathon.problemStatement}</p>
                  </div>
                )}

                {/* Hackathon Specs */}
                <div className="grid grid-cols-2 gap-2 text-xs text-[#64748B] pt-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#387ED1]" />
                    <span>{new Date(hackathon.eventDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-[#387ED1]" />
                    <span>Teams of {hackathon.minTeamSize || 2} - {hackathon.maxTeamSize || 4}</span>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-4 border-t border-[#1E293B] bg-[#0B0F19] flex items-center justify-between">
                <div className="text-xs text-[#64748B]">
                  Deadline: <span className="font-semibold text-white">{new Date(hackathon.registrationDeadline).toLocaleDateString()}</span>
                </div>

                <button
                  onClick={() => {
                    setSelectedHackathon(hackathon);
                    setShowCreateModal(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#387ED1] hover:bg-[#2563EB] text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Team</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Create Team */}
      {showCreateModal && selectedHackathon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-2xl bg-[#0F172A] border border-[#1E293B] p-6 shadow-2xl space-y-5"
          >
            <div>
              <h3 className="text-lg font-bold text-white">Form a New Hackathon Team</h3>
              <p className="text-xs text-[#94A3B8] mt-1">For {selectedHackathon.title}</p>
            </div>

            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Team Name</label>
                <input
                  type="text"
                  required
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="e.g. AlgoRhythms, CyberGuard"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E293B] border border-[#334155] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#387ED1]"
                />
              </div>

              <p className="text-[11px] text-[#64748B]">
                As creator, you will be assigned as Team Leader and receive a shareable 6-character team invite code.
              </p>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-[#387ED1] hover:bg-[#2563EB] text-white text-xs font-semibold shadow-md"
                >
                  {actionLoading ? 'Creating...' : 'Create Team'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Modal: Join Team */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-2xl bg-[#0F172A] border border-[#1E293B] p-6 shadow-2xl space-y-5"
          >
            <div>
              <h3 className="text-lg font-bold text-white">Join an Existing Team</h3>
              <p className="text-xs text-[#94A3B8] mt-1">Enter the 6-character code shared by your team leader.</p>
            </div>

            <form onSubmit={handleJoinTeam} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Team Invite Code</label>
                <input
                  type="text"
                  required
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  placeholder="e.g. TEAM-NK88"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E293B] border border-[#334155] text-xs text-white uppercase placeholder-[#64748B] focus:outline-none focus:border-[#387ED1] font-mono text-center tracking-widest text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-[#387ED1] hover:bg-[#2563EB] text-white text-xs font-semibold shadow-md"
                >
                  {actionLoading ? 'Joining...' : 'Join Roster'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Modal: Submit Project */}
      {showSubmitModal && selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg rounded-2xl bg-[#0F172A] border border-[#1E293B] p-6 shadow-2xl space-y-5"
          >
            <div>
              <h3 className="text-lg font-bold text-white">Submit Hackathon Project</h3>
              <p className="text-xs text-[#94A3B8] mt-1">Team: {selectedTeam.teamName}</p>
            </div>

            <form onSubmit={handleSubmitProject} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="e.g. CampuSync Sensor Mesh"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-xs text-white focus:outline-none focus:border-[#387ED1]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1">GitHub / Code Repository URL</label>
                <input
                  type="url"
                  required
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/org/repo"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-xs text-white focus:outline-none focus:border-[#387ED1]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1">Live Demo / Loom Video URL</label>
                <input
                  type="url"
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  placeholder="https://demo-app.vercel.app or YouTube link"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-xs text-white focus:outline-none focus:border-[#387ED1]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1">Brief Description & Tech Stack</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your technical architecture, models, and real-world impact..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-xs text-white focus:outline-none focus:border-[#387ED1]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-[#387ED1] hover:bg-[#2563EB] text-white text-xs font-semibold shadow-md"
                >
                  {actionLoading ? 'Submitting...' : 'Submit to Judges'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default HackathonHub;
