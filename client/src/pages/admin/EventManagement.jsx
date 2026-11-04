import React, { useState, useEffect } from 'react';
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
  Download
} from 'lucide-react';
import { eventAPI, resourceAPI } from '../../services/api';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'hackathon',
    venue: '',
    eventDate: '',
    startTime: '09:00',
    endTime: '17:00',
    capacity: 100,
    registrationDeadline: '',
    bannerUrl: '',
    tags: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  // Attendees modal
  const [attendeeModal, setAttendeeModal] = useState({ open: false, eventTitle: '', attendees: [] });
  const [loadingAttendees, setLoadingAttendees] = useState(false);

  const loadEvents = async () => {
    try {
      const res = await eventAPI.getAll();
      if (res.data.success) {
        setEvents(res.data.events);
        setFilteredEvents(res.data.events);
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

  useEffect(() => {
    if (search.trim()) {
      const q = search.toLowerCase();
      setFilteredEvents(
        events.filter(
          (e) =>
            e.title.toLowerCase().includes(q) ||
            e.category.toLowerCase().includes(q) ||
            e.venue.toLowerCase().includes(q)
        )
      );
    } else {
      setFilteredEvents(events);
    }
  }, [search, events]);

  const openCreateModal = () => {
    setEditingEvent(null);
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 5);

    setFormData({
      title: '',
      description: '',
      category: 'hackathon',
      venue: '',
      eventDate: futureDate.toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '17:00',
      capacity: 100,
      registrationDeadline: deadline.toISOString().split('T')[0],
      bannerUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80',
      tags: 'Tech, Innovation'
    });
    setModalOpen(true);
  };

  const openEditModal = (evt) => {
    setEditingEvent(evt);
    setFormData({
      title: evt.title,
      description: evt.description,
      category: evt.category,
      venue: evt.venue,
      eventDate: new Date(evt.eventDate).toISOString().split('T')[0],
      startTime: evt.startTime,
      endTime: evt.endTime,
      capacity: evt.capacity,
      registrationDeadline: new Date(evt.registrationDeadline).toISOString().split('T')[0],
      bannerUrl: evt.bannerUrl || '',
      tags: (evt.tags || []).join(', ')
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback({ type: '', text: '' });

    try {
      if (editingEvent) {
        const res = await eventAPI.update(editingEvent._id, formData);
        if (res.data.success) {
          setFeedback({ type: 'success', text: 'Event updated successfully!' });
        }
      } else {
        const res = await eventAPI.create(formData);
        if (res.data.success) {
          setFeedback({ type: 'success', text: 'New event published successfully!' });
        }
      }
      setModalOpen(false);
      await loadEvents();
    } catch (error) {
      setFeedback({
        type: 'error',
        text: error.response?.data?.message || 'Failed to save event.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event and its registrations?')) return;
    try {
      const res = await eventAPI.delete(id);
      if (res.data.success) {
        setFeedback({ type: 'success', text: 'Event removed.' });
        await loadEvents();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete event');
    }
  };

  const handleViewAttendees = async (event) => {
    setAttendeeModal({ open: true, eventTitle: event.title, attendees: [] });
    setLoadingAttendees(true);
    try {
      const res = await eventAPI.getAttendees(event._id);
      if (res.data.success) {
        setAttendeeModal({ open: true, eventTitle: event.title, attendees: res.data.attendees });
      }
    } catch (error) {
      alert('Could not fetch attendees');
    } finally {
      setLoadingAttendees(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-campus-text">
            College Event Management & Ticketing
          </h1>
          <p className="text-sm text-campus-textMuted mt-1">
            Publish hackathons, masterclasses, and seminars with digital ticketing and automated capacity tracking.
          </p>
        </div>

        <Button variant="primary" icon={Plus} onClick={openCreateModal}>
          Publish New Event
        </Button>
      </div>

      {feedback.text && (
        <div
          className={`p-4 rounded-xl border text-sm font-medium flex items-center gap-3 ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}
        >
          {feedback.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{feedback.text}</span>
        </div>
      )}

      <Input
        placeholder="Search events by title or venue..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        icon={Search}
      />

      {loading ? (
        <div className="py-16 text-center text-sm text-campus-textMuted flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-campus-primary border-t-transparent rounded-full animate-spin" />
          Loading events...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => {
            const fillRatio = Math.round((evt.registeredCount / evt.capacity) * 100);

            return (
              <div
                key={evt._id}
                className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between shadow-sm hover:border-blue-400 hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-lg bg-orange-50 text-[#FF5722] border border-orange-200">
                      {evt.category}
                    </span>
                    <span className="text-xs font-mono font-medium text-slate-500">
                      {evt.registeredCount} / {evt.capacity} seats ({fillRatio}%)
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-base text-slate-900 mt-3">
                    {evt.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {evt.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#387ED1]" />
                      <span>{new Date(evt.eventDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#FF5722]" />
                      <span>{evt.startTime} - {evt.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-campus-mint" />
                      <span className="truncate">{evt.venue}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-campus-border/60 flex items-center justify-between">
                  <button
                    onClick={() => handleViewAttendees(evt)}
                    className="text-xs font-semibold text-campus-primary hover:underline flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" /> Attendees ({evt.registeredCount})
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(evt)}
                      className="p-1.5 rounded-lg text-campus-textSubtle hover:text-campus-text hover:bg-white/5"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(evt._id)}
                      className="p-1.5 rounded-lg text-campus-textSubtle hover:text-campus-danger hover:bg-rose-500/10"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Publish Event Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingEvent ? 'Edit College Event' : 'Publish College Event'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Event Title"
            name="title"
            placeholder="e.g. National Hackathon 2026: CodeSpark"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Category"
              name="category"
              type="select"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={[
                { label: 'Hackathon', value: 'hackathon' },
                { label: 'Workshop', value: 'workshop' },
                { label: 'Seminar', value: 'seminar' },
                { label: 'Technical Contest', value: 'technical' },
                { label: 'Cultural', value: 'cultural' }
              ]}
            />
            <Input
              label="Venue"
              name="venue"
              placeholder="e.g. Central Auditorium / Turing Lab"
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Event Date"
              name="eventDate"
              type="date"
              value={formData.eventDate}
              onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
              required
            />
            <Input
              label="Start Time"
              name="startTime"
              placeholder="09:00"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              required
            />
            <Input
              label="End Time"
              name="endTime"
              placeholder="17:00"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Seating Capacity"
              name="capacity"
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              required
            />
            <Input
              label="Registration Deadline"
              name="registrationDeadline"
              type="date"
              value={formData.registrationDeadline}
              onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
              required
            />
          </div>

          <Input
            label="Banner Image URL"
            name="bannerUrl"
            placeholder="https://..."
            value={formData.bannerUrl}
            onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
          />

          <Input
            label="Description"
            name="description"
            type="textarea"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />

          <div className="flex justify-end gap-3 pt-3">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              {editingEvent ? 'Update Event' : 'Publish Event'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Attendees List Modal */}
      <Modal
        isOpen={attendeeModal.open}
        onClose={() => setAttendeeModal({ open: false, eventTitle: '', attendees: [] })}
        title={`Registered Attendees: ${attendeeModal.eventTitle}`}
        maxWidth="max-w-2xl"
      >
        {loadingAttendees ? (
          <div className="py-8 text-center text-xs text-campus-textMuted">
            Fetching ticket registrations...
          </div>
        ) : attendeeModal.attendees.length === 0 ? (
          <p className="text-center py-6 text-sm text-campus-textMuted">
            No students registered yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-campus-surface text-campus-textMuted font-mono text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Ticket Code</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Student ID</th>
                  <th className="py-2.5 px-3">Registered At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-campus-border/60">
                {attendeeModal.attendees.map((att) => (
                  <tr key={att._id} className="hover:bg-white/5">
                    <td className="py-2.5 px-3 font-mono font-bold text-campus-primary">
                      {att.ticketCode}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-campus-text">
                      {att.user?.fullName}
                    </td>
                    <td className="py-2.5 px-3 text-campus-textMuted">
                      {att.user?.department}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-campus-textSubtle">
                      {att.user?.studentOrEmployeeId}
                    </td>
                    <td className="py-2.5 px-3 text-campus-textSubtle font-mono">
                      {new Date(att.registeredAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EventManagement;

