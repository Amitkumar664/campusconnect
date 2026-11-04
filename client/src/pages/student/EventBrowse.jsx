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
  Sparkles,
  Flame,
  Check
} from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
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
        // Confetti celebration
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#387ED1', '#4CAF50', '#FF5722']
        });

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
          text: 'Event ticket cancelled successfully.'
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
    { label: 'All Event Categories', value: 'all' },
    { label: 'Hackathons', value: 'hackathon' },
    { label: 'Technical Workshops', value: 'workshop' },
    { label: 'Academic Seminars', value: 'seminar' },
    { label: 'Annual College Fest', value: 'fest' },
    { label: 'Campus Placement Drives', value: 'placement' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs text-[#387ED1] font-semibold mb-2 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" /> Campus Life & Activities
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          College Events & Hackathon Passes
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Explore upcoming technology symposia, claim free university digital passes, and attend college workshops.
        </p>
      </div>

      {actionMessage.text && (
        <div
          className={`p-4 rounded-xl border text-xs sm:text-sm font-medium flex items-center gap-3 shadow-sm ${
            actionMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-rose-50 border-rose-200 text-rose-700'
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
        <div className="py-16 text-center text-slate-500 text-xs flex items-center justify-center gap-2">
          <div className="w-5 h-5 border-2 border-[#387ED1] border-t-transparent rounded-full animate-spin" />
          Loading campus events...
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="p-14 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
          <Calendar className="w-12 h-12 text-[#387ED1]/40 mx-auto mb-3" />
          <h3 className="font-display font-semibold text-slate-900 text-base">
            No events found
          </h3>
          <p className="text-xs text-slate-500 mt-1">
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
              <motion.div
                key={evt._id}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-md hover:border-blue-300 transition-all"
              >
                {/* Banner image or category top banner */}
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  {evt.bannerUrl ? (
                    <img
                      src={evt.bannerUrl}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100">
                      <Calendar className="w-12 h-12 text-[#387ED1]/30" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  <div className="absolute top-3.5 left-3.5">
                    <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 text-[10px] font-semibold text-[#387ED1] uppercase tracking-wider font-mono shadow-sm">
                      {evt.category}
                    </span>
                  </div>

                  {isRegistered && (
                    <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF5722] text-white text-[11px] font-bold shadow-sm">
                      <Ticket className="w-3.5 h-3.5" /> Digital Pass Active
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 group-hover:text-[#387ED1] transition-colors line-clamp-1 tracking-tight">
                      {evt.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                      {evt.description}
                    </p>

                    {/* Metadata */}
                    <div className="mt-4 pt-3.5 border-t border-slate-100 space-y-2 text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#387ED1] flex-shrink-0" />
                        <span>{new Date(evt.eventDate).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#FF5722] flex-shrink-0" />
                        <span>{evt.startTime} - {evt.endTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{evt.venue}</span>
                      </div>
                    </div>

                    {/* Capacity progress */}
                    <div className="mt-4 space-y-1.5">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-500">Seating Capacity</span>
                        <span className="font-mono font-semibold text-slate-800">
                          {evt.registeredCount} / {evt.capacity} ({fillRatio}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            fillRatio >= 90
                              ? 'bg-rose-500'
                              : fillRatio >= 60
                              ? 'bg-amber-400'
                              : 'bg-[#387ED1]'
                          }`}
                          style={{ width: `${fillRatio}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Registered Ticket Banner or Register CTA */}
                  <div className="mt-5 pt-3.5 border-t border-slate-100">
                    {isRegistered ? (
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#387ED1] bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
                          <Ticket className="w-3.5 h-3.5" />
                          <span>{evt.ticketCode || 'PASS ACTIVE'}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          loading={activeActionId === evt._id}
                          onClick={() => handleCancelRegistration(evt._id)}
                          className="text-rose-600 hover:bg-rose-50 text-xs"
                        >
                          Cancel Pass
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant={isFull ? 'secondary' : 'primary'}
                        size="md"
                        disabled={isFull}
                        loading={activeActionId === evt._id}
                        onClick={() => handleRegister(evt)}
                        className="w-full font-semibold"
                      >
                        {isFull ? 'Registration Full' : 'Claim Free Pass'}
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Ticket Pass Confirmation Modal */}
      <Modal
        isOpen={ticketModal.open}
        onClose={() => setTicketModal({ open: false, event: null, code: '' })}
        title="Event Admission Pass Issued!"
      >
        <div className="text-center py-4 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#FF5722] mx-auto shadow-sm">
            <Ticket className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
              Official University Admission Pass
            </span>
            <h3 className="font-display font-bold text-lg text-slate-900 mt-1">
              {ticketModal.event?.title}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              📍 {ticketModal.event?.venue} • {ticketModal.event?.startTime} - {ticketModal.event?.endTime}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/50 border-2 border-dashed border-blue-300 font-mono text-center shadow-sm">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Digital Pass Code</p>
            <p className="text-2xl font-black text-[#387ED1] tracking-widest mt-0.5">
              {ticketModal.code}
            </p>
          </div>

          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Please present this ticket pass code on event day for rapid check-in at the entrance.
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
