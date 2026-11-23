import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Plus,
  Users,
  Edit,
  Trash2,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
  Search,
  Eye,
  Download,
  Video,
  Code2,
  Trophy,
  X
} from 'lucide-react';
import { eventAPI } from '../../services/api';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  // Form Data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'technical',
    eventType: 'general',
    venue: '',
    isVirtual: false,
    virtualMeetingUrl: '',
    platform: 'In-Person',
    eventDate: '',
    startTime: '09:00',
    endTime: '17:00',
    capacity: 100,
    registrationDeadline: '',
    ticketPrice: 0,
    bannerUrl: '',
    status: 'open',
    // Hackathon fields
    minTeamSize: 2,
    maxTeamSize: 4,
    problemStatement: '',
    // Sports fields
    sportType: 'Cricket',
    tournamentFormat: 'Knockout'
  });

  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  // Attendees modal
  const [attendeeModal, setAttendeeModal] = useState({ open: false, eventTitle: '', attendees: [] });
  const [loadingAttendees, setLoadingAttendees] = useState(false);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const res = await eventAPI.getAll();
      if (res.data.success) {
        setEvents(res.data.events || []);
      }
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const openCreateModal = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      category: 'technical',
      eventType: 'general',
      venue: '',
      isVirtual: false,
      virtualMeetingUrl: '',
      platform: 'In-Person',
      eventDate: '',
      startTime: '09:00',
      endTime: '17:00',
      capacity: 100,
      registrationDeadline: '',
      ticketPrice: 0,
      bannerUrl: '',
      status: 'open',
      minTeamSize: 2,
      maxTeamSize: 4,
      problemStatement: '',
      sportType: 'Cricket',
      tournamentFormat: 'Knockout'
    });
    setModalOpen(true);
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      category: event.category,
      eventType: event.eventType || 'general',
      venue: event.venue,
      isVirtual: event.isVirtual || false,
      virtualMeetingUrl: event.virtualMeetingUrl || '',
      platform: event.platform || 'In-Person',
      eventDate: event.eventDate ? event.eventDate.split('T')[0] : '',
      startTime: event.startTime,
      endTime: event.endTime,
      capacity: event.capacity,
      registrationDeadline: event.registrationDeadline ? event.registrationDeadline.split('T')[0] : '',
      ticketPrice: event.ticketPrice || 0,
      bannerUrl: event.bannerUrl || '',
      status: event.status,
      minTeamSize: event.minTeamSize || 2,
      maxTeamSize: event.maxTeamSize || 4,
      problemStatement: event.problemStatement || '',
      sportType: event.sportType || 'Cricket',
      tournamentFormat: event.tournamentFormat || 'Knockout'
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback({ type: '', text: '' });

    try {
      const payload = { ...formData };
      if (payload.eventType === 'virtual') payload.isVirtual = true;

      if (editingEvent) {
        await eventAPI.update(editingEvent._id, payload);
        setFeedback({ type: 'success', text: 'Event updated successfully.' });
      } else {
        await eventAPI.create(payload);
        setFeedback({ type: 'success', text: 'Event published successfully.' });
      }

      setModalOpen(false);
      loadEvents();
    } catch (error) {
      setFeedback({ type: 'error', text: error.response?.data?.message || 'Failed to save event.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete event "${title}"? Associated bookings will be cancelled.`)) {
      return;
    }
    try {
      await eventAPI.delete(id);
      loadEvents();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete event');
    }
  };

  const openAttendees = async (event) => {
    setAttendeeModal({ open: true, eventTitle: event.title, attendees: [] });
    try {
      setLoadingAttendees(true);
      const res = await eventAPI.getAttendees(event._id);
      if (res.data.success) {
        setAttendeeModal({ open: true, eventTitle: event.title, attendees: res.data.attendees || [] });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAttendees(false);
    }
  };

  const filteredEvents = events.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.venue.toLowerCase().includes(search.toLowerCase()) ||
    e.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Calendar className="w-6 h-6 text-[#387ED1]" />
            <span>Campus Event Management</span>
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Create, configure capacity, publish, and oversee hackathons, sports championships, and workshops.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-[#387ED1] hover:bg-[#2563EB] text-white text-xs font-semibold shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Event</span>
        </button>
      </div>

      {feedback.text && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
            feedback.type === 'error'
              ? 'bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#EF4444]'
              : 'bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981]'
          }`}
        >
          {feedback.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter events by title, venue, or category..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#0F172A] border border-[#1E293B] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#387ED1]"
        />
      </div>

      {/* Events Table */}
      <div className="rounded-2xl bg-[#0F172A] border border-[#1E293B] overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#111827] text-[#94A3B8] uppercase text-[10px] tracking-wider border-b border-[#1E293B]">
              <tr>
                <th className="py-3 px-4">Event Title</th>
                <th className="py-3 px-4">Type / Category</th>
                <th className="py-3 px-4">Date & Venue</th>
                <th className="py-3 px-4">Capacity / Booked</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#64748B]">
                    Loading events...
                  </td>
                </tr>
              ) : filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#64748B]">
                    No events matching your search.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((evt) => (
                  <tr key={evt._id} className="hover:bg-[#1E293B]/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-white text-sm line-clamp-1">{evt.title}</p>
                      <p className="text-[11px] text-[#64748B]">
                        Deadline: {new Date(evt.registrationDeadline).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#1E293B] text-[#60A5FA] border border-[#334155]">
                        {evt.category}
                      </span>
                      {evt.eventType !== 'general' && (
                        <span className="ml-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#F59E0B]/20 text-[#F59E0B]">
                          {evt.eventType}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-[#94A3B8]">
                      <p className="text-white font-medium">{new Date(evt.eventDate).toLocaleDateString()}</p>
                      <p className="text-[11px] text-[#64748B] truncate max-w-xs">{evt.venue}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{evt.registeredCount}</span>
                        <span className="text-[#64748B]">/ {evt.capacity}</span>
                        <span className="text-[10px] text-[#10B981] font-mono">
                          ({evt.capacity > 0 ? Math.round((evt.registeredCount / evt.capacity) * 100) : 0}%)
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          evt.status === 'open'
                            ? 'bg-[#10B981]/20 text-[#10B981]'
                            : evt.status === 'filling_fast'
                            ? 'bg-[#F59E0B]/20 text-[#F59E0B]'
                            : evt.status === 'sold_out'
                            ? 'bg-[#EF4444]/20 text-[#EF4444]'
                            : 'bg-[#1E293B] text-[#64748B]'
                        }`}
                      >
                        {evt.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openAttendees(evt)}
                          title="View Attendee Roster"
                          className="p-1.5 rounded-lg bg-[#1E293B] hover:bg-[#334155] text-[#60A5FA] transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEditModal(evt)}
                          title="Edit Event"
                          className="p-1.5 rounded-lg bg-[#1E293B] hover:bg-[#334155] text-white transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(evt._id, evt.title)}
                          title="Delete Event"
                          className="p-1.5 rounded-lg bg-[#1E293B] hover:bg-[#EF4444]/20 text-[#EF4444] transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-[#0F172A] border border-[#1E293B] rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
            >
              <div className="p-5 border-b border-[#1E293B] bg-[#0B0F19] flex items-center justify-between">
                <h3 className="text-base font-bold text-white">
                  {editingEvent ? 'Edit Event Details' : 'Publish New Campus Event'}
                </h3>
                <button onClick={() => setModalOpen(false)} className="text-[#64748B] hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
                <div>
                  <label className="block text-[#94A3B8] font-medium mb-1">Event Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. HackNova 2026, Annual Cricket Cup"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-white focus:outline-none focus:border-[#387ED1]"
                  />
                </div>

                <div>
                  <label className="block text-[#94A3B8] font-medium mb-1">Description</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Provide details about expectations, prerequisites, and schedules..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-white focus:outline-none focus:border-[#387ED1]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#94A3B8] font-medium mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-white focus:outline-none focus:border-[#387ED1]"
                    >
                      <option value="technical">Technical</option>
                      <option value="cultural">Cultural</option>
                      <option value="workshop">Workshop</option>
                      <option value="seminar">Seminar</option>
                      <option value="guest_lecture">Guest Lecture</option>
                      <option value="competition">Competition</option>
                      <option value="festival">Festival</option>
                      <option value="hackathon">Hackathon</option>
                      <option value="sports">Sports</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#94A3B8] font-medium mb-1">Event Type Subsystem</label>
                    <select
                      value={formData.eventType}
                      onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-white focus:outline-none focus:border-[#387ED1]"
                    >
                      <option value="general">General Campus Event</option>
                      <option value="hackathon">Hackathon (Team builder enabled)</option>
                      <option value="sports">Sports (Match schedules enabled)</option>
                      <option value="virtual">Virtual (Protected meeting URL)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#94A3B8] font-medium mb-1">Venue or Location</label>
                    <input
                      type="text"
                      required
                      value={formData.venue}
                      onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                      placeholder="e.g. Main Auditorium, Pavilion Ground"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-white focus:outline-none focus:border-[#387ED1]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#94A3B8] font-medium mb-1">Capacity Limit</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value, 10) })}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-white focus:outline-none focus:border-[#387ED1]"
                    />
                  </div>
                </div>

                {/* If Virtual Event */}
                {formData.eventType === 'virtual' && (
                  <div>
                    <label className="block text-[#94A3B8] font-medium mb-1">Private Meeting URL (Zoom / Meet)</label>
                    <input
                      type="url"
                      value={formData.virtualMeetingUrl}
                      onChange={(e) => setFormData({ ...formData, virtualMeetingUrl: e.target.value })}
                      placeholder="https://meet.google.com/xyz-abc"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-white focus:outline-none focus:border-[#387ED1]"
                    />
                  </div>
                )}

                {/* If Hackathon Event */}
                {formData.eventType === 'hackathon' && (
                  <div>
                    <label className="block text-[#94A3B8] font-medium mb-1">Problem Statement / Tracks</label>
                    <textarea
                      rows={2}
                      value={formData.problemStatement}
                      onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
                      placeholder="Track 1: AI Analytics, Track 2: Sustainability..."
                      className="w-full px-3.5 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-white focus:outline-none focus:border-[#387ED1]"
                    />
                  </div>
                )}

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[#94A3B8] font-medium mb-1">Event Date</label>
                    <input
                      type="date"
                      required
                      value={formData.eventDate}
                      onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-white focus:outline-none focus:border-[#387ED1]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#94A3B8] font-medium mb-1">Start Time</label>
                    <input
                      type="time"
                      required
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-white focus:outline-none focus:border-[#387ED1]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#94A3B8] font-medium mb-1">End Time</label>
                    <input
                      type="time"
                      required
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-white focus:outline-none focus:border-[#387ED1]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#94A3B8] font-medium mb-1">Registration Deadline</label>
                    <input
                      type="date"
                      required
                      value={formData.registrationDeadline}
                      onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-white focus:outline-none focus:border-[#387ED1]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#94A3B8] font-medium mb-1">Status Override</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-white focus:outline-none focus:border-[#387ED1]"
                    >
                      <option value="open">Open</option>
                      <option value="filling_fast">Filling Fast</option>
                      <option value="sold_out">Sold Out</option>
                      <option value="closed">Closed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#1E293B] flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-white font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-xl bg-[#387ED1] hover:bg-[#2563EB] text-white font-semibold shadow-md"
                  >
                    {submitting ? 'Saving...' : 'Save & Publish'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Attendees Roster Modal */}
      <AnimatePresence>
        {attendeeModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAttendeeModal({ open: false, eventTitle: '', attendees: [] })}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-[#0F172A] border border-[#1E293B] rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[85vh] flex flex-col"
            >
              <div className="p-5 border-b border-[#1E293B] bg-[#0B0F19] flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Registered Attendee Roster</h3>
                  <p className="text-xs text-[#60A5FA] mt-0.5">{attendeeModal.eventTitle}</p>
                </div>
                <button
                  onClick={() => setAttendeeModal({ open: false, eventTitle: '', attendees: [] })}
                  className="text-[#64748B] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 overflow-y-auto divide-y divide-[#1E293B] flex-1">
                {loadingAttendees ? (
                  <div className="py-8 text-center text-xs text-[#64748B]">Loading roster...</div>
                ) : attendeeModal.attendees.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[#64748B]">No participants registered yet.</div>
                ) : (
                  attendeeModal.attendees.map((b) => (
                    <div key={b._id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-white">{b.attendeeDetails?.fullName || b.user?.fullName}</p>
                        <p className="text-[11px] text-[#64748B]">
                          ID: {b.attendeeDetails?.studentOrEmployeeId || b.user?.studentOrEmployeeId} • {b.attendeeDetails?.department || b.user?.department}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-[11px] font-bold text-[#60A5FA]">{b.ticketCode}</span>
                        <p className="text-[10px] text-[#10B981] capitalize mt-0.5">{b.checkInStatus}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventManagement;
