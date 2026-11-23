import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Send,
  Users,
  CheckCircle2,
  AlertCircle,
  Mail,
  Calendar
} from 'lucide-react';
import { notificationAPI, eventAPI } from '../../services/api';

const NotificationManagement = () => {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'announcement',
    target: 'all', // 'all' | 'event_attendees'
    eventId: '',
    sendAsEmail: true
  });

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const res = await eventAPI.getAll();
        if (res.data.success && res.data.events?.length > 0) {
          setEvents(res.data.events);
          setFormData((prev) => ({ ...prev, eventId: res.data.events[0]._id }));
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadEvents();
  }, []);

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setFeedback({ type: '', text: '' });

      const res = await notificationAPI.sendBroadcast(formData);
      if (res.data.success) {
        setFeedback({ type: 'success', text: res.data.message });
        setFormData((prev) => ({ ...prev, title: '', message: '' }));
      }
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.message || 'Failed to dispatch notification' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Bell className="w-6 h-6 text-[#387ED1]" />
          <span>Broadcasts & Notification Desk</span>
        </h1>
        <p className="text-xs text-[#94A3B8] mt-1">
          Send campus-wide event announcements, urgent registration deadlines, and schedule reminders with simultaneous email dispatch.
        </p>
      </div>

      {feedback.text && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
            feedback.type === 'error'
              ? 'bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#EF4444]'
              : 'bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981]'
          }`}
        >
          {feedback.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Broadcast Form */}
      <div className="p-6 rounded-2xl bg-[#0F172A] border border-[#1E293B] shadow-xl max-w-2xl">
        <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#94A3B8] font-medium mb-1">Target Audience</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, target: 'all' })}
                className={`p-3 rounded-xl border text-center transition-all ${
                  formData.target === 'all'
                    ? 'bg-[#387ED1]/20 border-[#387ED1] text-white font-bold'
                    : 'bg-[#1E293B] border-[#334155] text-[#94A3B8]'
                }`}
              >
                All Campus Students
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, target: 'event_attendees' })}
                className={`p-3 rounded-xl border text-center transition-all ${
                  formData.target === 'event_attendees'
                    ? 'bg-[#387ED1]/20 border-[#387ED1] text-white font-bold'
                    : 'bg-[#1E293B] border-[#334155] text-[#94A3B8]'
                }`}
              >
                Event Confirmed Attendees
              </button>
            </div>
          </div>

          {formData.target === 'event_attendees' && (
            <div>
              <label className="block text-[#94A3B8] font-medium mb-1">Select Event</label>
              <select
                value={formData.eventId}
                onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E293B] border border-[#334155] text-white focus:outline-none focus:border-[#387ED1]"
              >
                {events.map((e) => (
                  <option key={e._id} value={e._id}>
                    {e.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-[#94A3B8] font-medium mb-1">Notification Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-white focus:outline-none focus:border-[#387ED1]"
            >
              <option value="announcement">Announcement / General Notice</option>
              <option value="reminder">Event Reminder</option>
              <option value="urgent">Urgent Schedule Update</option>
            </select>
          </div>

          <div>
            <label className="block text-[#94A3B8] font-medium mb-1">Headline Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. HackNova Problem Statements Released!"
              className="w-full px-3.5 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-white focus:outline-none focus:border-[#387ED1]"
            />
          </div>

          <div>
            <label className="block text-[#94A3B8] font-medium mb-1">Message Content</label>
            <textarea
              rows={4}
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Type your notice or announcement..."
              className="w-full px-3.5 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-white focus:outline-none focus:border-[#387ED1]"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="sendEmailCheck"
              checked={formData.sendAsEmail}
              onChange={(e) => setFormData({ ...formData, sendAsEmail: e.target.checked })}
              className="rounded bg-[#1E293B] border-[#334155] text-[#387ED1] focus:ring-0"
            />
            <label htmlFor="sendEmailCheck" className="text-xs text-[#94A3B8]">
              Dispatch simultaneous email notice via Nodemailer
            </label>
          </div>

          <div className="pt-3 border-t border-[#1E293B]">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-[#387ED1] hover:bg-[#2563EB] disabled:opacity-50 text-white font-semibold shadow-md flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Dispatching...' : 'Broadcast Notice'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotificationManagement;
