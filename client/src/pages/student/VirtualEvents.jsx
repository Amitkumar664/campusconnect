import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Video,
  Lock,
  Unlock,
  ExternalLink,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Ticket,
  Sparkles
} from 'lucide-react';
import { eventAPI } from '../../services/api';

const VirtualEvents = () => {
  const [virtualEvents, setVirtualEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVirtualEvents = async () => {
    try {
      setLoading(true);
      const res = await eventAPI.getAll({ eventType: 'virtual' });
      if (res.data.success) {
        setVirtualEvents(res.data.events || []);
      }
    } catch (err) {
      console.error('Failed to load virtual events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVirtualEvents();
  }, []);

  const handleRegister = async (eventId) => {
    try {
      const res = await eventAPI.register(eventId);
      if (res.data.success) {
        fetchVirtualEvents();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to register for virtual event');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Video className="w-6 h-6 text-[#10B981]" />
          <span>Virtual Webinars & Online Workshops</span>
        </h1>
        <p className="text-xs text-[#94A3B8] mt-1">
          Access high-caliber virtual tech talks, industry webinars, and coding masterclasses. Meeting links unlock automatically upon registration.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-sm text-[#94A3B8]">
          <div className="w-8 h-8 border-2 border-[#10B981] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading virtual sessions...
        </div>
      ) : virtualEvents.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-[#0F172A] border border-[#1E293B]">
          <Video className="w-10 h-10 text-[#64748B] mx-auto mb-3 opacity-50" />
          <h3 className="text-base font-bold text-white">No virtual events scheduled</h3>
          <p className="text-xs text-[#94A3B8] mt-1">Check back soon for upcoming webinars and live-streamed hackathons.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {virtualEvents.map((event) => {
            const hasAccess = event.isRegistered && event.virtualMeetingUrl;

            return (
              <div
                key={event._id}
                className="rounded-2xl bg-[#0F172A] border border-[#1E293B] overflow-hidden hover:border-[#10B981]/50 transition-all shadow-md flex flex-col justify-between"
              >
                {/* Banner */}
                <div className="h-40 relative bg-[#1E293B] overflow-hidden">
                  <img
                    src={event.bannerUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80'}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md text-white border border-white/10">
                      {event.platform || 'Online'}
                    </span>
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#10B981]/90 text-white">
                      Live Stream
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white line-clamp-1">{event.title}</h3>
                    <p className="text-xs text-[#94A3B8] mt-1 line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>

                    <div className="mt-4 space-y-2 text-xs text-[#64748B]">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#10B981]" />
                        <span>{new Date(event.eventDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#10B981]" />
                        <span>{event.startTime} - {event.endTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Private Meeting Access Control */}
                  <div className="pt-3 border-t border-[#1E293B]">
                    {hasAccess ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-xs text-[#10B981] font-semibold">
                          <Unlock className="w-4 h-4" />
                          <span>Meeting Link Unlocked</span>
                        </div>
                        <a
                          href={event.virtualMeetingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
                        >
                          <span>Join Live Meeting</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    ) : event.isRegistered ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-xs text-[#60A5FA]">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Pass Confirmed</span>
                        </div>
                        <p className="text-[11px] text-[#64748B]">
                          Meeting URL will be broadcasted to attendees 30 mins before kickoff.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Meeting Link Locked (Registered attendees only)</span>
                        </div>
                        <button
                          onClick={() => handleRegister(event._id)}
                          className="w-full py-2.5 rounded-xl bg-[#387ED1] hover:bg-[#2563EB] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
                        >
                          <Ticket className="w-4 h-4" />
                          <span>Register to Unlock Link</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VirtualEvents;
