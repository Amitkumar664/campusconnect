import React, { useState, useEffect } from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Search,
  Tag,
  CheckCircle,
  Ticket,
  AlertCircle,
  XCircle,
  Sparkles
} from 'lucide-react';
import { eventAPI } from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';

const EventBrowse = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const [activeActionId, setActiveActionId] = useState(null);
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });
  const [ticketModal, setTicketModal] = useState({ open: false, event: null, code: '' });

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
    let result = events;
    if (selectedCategory !== 'all') {
      result = result.filter((e) => e.category === selectedCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.venue.toLowerCase().includes(q) ||
          e.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }
    setFilteredEvents(result);
  }, [search, selectedCategory, events]);

  const handleRegister = async (event) => {
    setActiveActionId(event._id);
    setActionMessage({ type: '', text: '' });
    try {
      const res = await eventAPI.register(event._id);
      if (res.data.success) {
        setTicketModal({
          open: true,
          event,
          code: res.data.ticketCode
        });
        await loadEvents();
      }
    } catch (error) {
      setActionMessage({
        type: 'error',
        text: error.response?.data?.message || 'Event registration failed.'
      });
    } finally {
      setActiveActionId(null);
    }
  };

  const handleCancelRegistration = async (eventId) => {
    if (!window.confirm('Are you sure you want to cancel your event registration ticket?')) {
      return;
    }
    setActiveActionId(eventId);
    setActionMessage({ type: '', text: '' });
    try {
      const res = await eventAPI.cancelRegistration(eventId);
      if (res.data.success) {
        setActionMessage({
          type: 'success',
          text: 'Registration cancelled. Seat has been made available to others.'
        });
        await loadEvents();
      }
    } catch (error) {
      setActionMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to cancel registration.'
      });
    } finally {
      setActiveActionId(null);
    }
  };

  const categories = [
    { label: 'All Categories', value: 'all' },
    { label: 'Hackathons', value: 'hackathon' },
    { label: 'Masterclasses & Workshops', value: 'workshop' },
    { label: 'Seminars & Symposia', value: 'seminar' },
    { label: 'Technical Contests', value: 'technical' },
    { label: 'Cultural & Arts', value: 'cultural' }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-campus-text">
          Campus Events & Workshops
        </h1>
        <p className="text-sm text-campus-textMuted mt-1">
          Explore technical hackathons, guest lectures, and student symposiums with instant digital ticketing.
        </p>
      </div>

      {actionMessage.text && (
        <div
          className={`p-4 rounded-xl border text-sm font-medium flex items-center gap-3 ${
            actionMessage.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}
        >
          {actionMessage.type === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
        <div className="sm:col-span-8">
          <Input
            placeholder="Search events by title, keyword, tech tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={Search}
          />
        </div>
        <div className="sm:col-span-4">
          <Input
            type="select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            options={categories}
          />
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="py-16 text-center text-campus-textMuted text-sm flex items-center justify-center gap-2">
          <div className="w-5 h-5 border-2 border-campus-primary border-t-transparent rounded-full animate-spin" />
          Loading campus events...
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-campus-border bg-campus-card">
          <Calendar className="w-12 h-12 text-campus-primary/50 mx-auto mb-3" />
          <h3 className="font-display font-semibold text-campus-text text-base">
            No events found
          </h3>
          <p className="text-xs text-campus-textMuted mt-1">
            Try adjusting your search query or selecting another category filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => {
            const fillRatio = Math.min(100, Math.round((evt.registeredCount / evt.capacity) * 100));
            const isFull = evt.registeredCount >= evt.capacity;
            const isRegistered = evt.isRegistered;

            return (
              <div
                key={evt._id}
                className="bg-campus-card rounded-2xl border border-campus-border overflow-hidden hover:border-campus-borderGlow transition-all duration-300 flex flex-col group"
              >
                {/* Banner image or category top banner */}
                <div className="relative h-44 bg-campus-surface overflow-hidden">
                  {evt.bannerUrl ? (
                    <img
                      src={evt.bannerUrl}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-campus-surface to-campus-card">
                      <Calendar className="w-12 h-12 text-campus-primary/30" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-semibold text-campus-primary uppercase tracking-wider">
                      {evt.category}
                    </span>
                  </div>

                  {isRegistered && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-campus-amber text-campus-bg text-[11px] font-bold shadow-glow-amber">
                      <Ticket className="w-3.5 h-3.5" /> Confirmed Pass
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-display font-bold text-base text-campus-text group-hover:text-campus-primary transition-colors line-clamp-1">
                    {evt.title}
                  </h3>
                  <p className="text-xs text-campus-textMuted mt-1.5 line-clamp-2 leading-relaxed flex-1">
                    {evt.description}
                  </p>

                  {/* Metadata */}
                  <div className="mt-4 pt-3 border-t border-campus-border/60 space-y-1.5 text-xs text-campus-textMuted">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-campus-primary flex-shrink-0" />
                      <span>{new Date(evt.eventDate).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-campus-amber flex-shrink-0" />
                      <span>{evt.startTime} - {evt.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-campus-mint flex-shrink-0" />
                      <span className="truncate">{evt.venue}</span>
                    </div>
                  </div>

                  {/* Capacity progress */}
                  <div className="mt-4 space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-campus-textSubtle">Seats Reserved</span>
                      <span className="font-mono font-medium text-campus-text">
                        {evt.registeredCount} / {evt.capacity} ({fillRatio}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-campus-surface overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          fillRatio >= 90 ? 'bg-rose-500' : fillRatio >= 60 ? 'bg-campus-amber' : 'bg-campus-primary'
                        }`}
                        style={{ width: `${fillRatio}%` }}
                      />
                    </div>
                  </div>

                  {/* Registered Ticket Banner or Register CTA */}
                  <div className="mt-5 pt-3 border-t border-campus-border">
                    {isRegistered ? (
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-campus-primary">
                          <Ticket className="w-4 h-4" />
                          <span>{evt.ticketCode || 'PASS ACTIVE'}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          loading={activeActionId === evt._id}
                          onClick={() => handleCancelRegistration(evt._id)}
                          className="text-campus-danger hover:bg-rose-500/10 text-xs"
                        >
                          Cancel Pass
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant={isFull ? 'secondary' : 'amber'}
                        size="md"
                        disabled={isFull}
                        loading={activeActionId === evt._id}
                        onClick={() => handleRegister(evt)}
                        className="w-full"
                      >
                        {isFull ? 'Registration Full' : 'Register Now (Free Pass)'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Ticket Pass Confirmation Modal */}
      <Modal
        isOpen={ticketModal.open}
        onClose={() => setTicketModal({ open: false, event: null, code: '' })}
        title="Event Registration Confirmed!"
      >
        <div className="text-center py-4 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center text-campus-amber mx-auto shadow-glow-amber">
            <Ticket className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-campus-textSubtle">
              Official University Admission Ticket
            </span>
            <h3 className="font-display font-bold text-lg text-campus-text mt-1">
              {ticketModal.event?.title}
            </h3>
            <p className="text-xs text-campus-textMuted mt-1">
              📍 {ticketModal.event?.venue} • {ticketModal.event?.startTime} - {ticketModal.event?.endTime}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-campus-surface border-2 border-dashed border-campus-primary/40 font-mono text-center">
            <p className="text-[10px] text-campus-textSubtle uppercase">Digital Pass Code</p>
            <p className="text-2xl font-black text-campus-primary tracking-widest mt-0.5">
              {ticketModal.code}
            </p>
          </div>

          <p className="text-xs text-campus-textMuted max-w-sm mx-auto">
            Please present this ticket code or save a screenshot for gate attendance verification on event day.
          </p>

          <Button
            variant="primary"
            onClick={() => setTicketModal({ open: false, event: null, code: '' })}
            className="w-full"
          >
            Done
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default EventBrowse;

