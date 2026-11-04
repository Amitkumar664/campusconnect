import React, { useState, useEffect } from 'react';
import {
  Clock,
  Calendar,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Save,
  Ban,
  ShieldAlert
} from 'lucide-react';
import { facultyAPI, authAPI } from '../../services/api';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const AvailabilityManager = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  const [weeklyAvailability, setWeeklyAvailability] = useState([]);
  const [blockedDates, setBlockedDates] = useState([]);
  const [acceptingBookings, setAcceptingBookings] = useState(true);
  const [newBlockDate, setNewBlockDate] = useState('');

  const [designation, setDesignation] = useState('');
  const [officeRoom, setOfficeRoom] = useState('');
  const [subjectsStr, setSubjectsStr] = useState('');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await authAPI.getMe();
        if (res.data.success && res.data.facultyProfile) {
          const fp = res.data.facultyProfile;
          setProfile(fp);
          setWeeklyAvailability(fp.weeklyAvailability || []);
          setBlockedDates(fp.blockedDates || []);
          setAcceptingBookings(fp.acceptingBookings !== false);
          setDesignation(fp.designation || '');
          setOfficeRoom(fp.officeRoom || '');
          setSubjectsStr((fp.subjects || []).join(', '));
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleAddSlot = () => {
    setWeeklyAvailability([
      ...weeklyAvailability,
      { dayOfWeek: 'Monday', startTime: '10:00', endTime: '13:00', slotDurationMinutes: 30 }
    ]);
  };

  const handleRemoveSlot = (index) => {
    setWeeklyAvailability(weeklyAvailability.filter((_, i) => i !== index));
  };

  const handleSlotChange = (index, field, value) => {
    const updated = [...weeklyAvailability];
    updated[index][field] = field === 'slotDurationMinutes' ? parseInt(value, 10) : value;
    setWeeklyAvailability(updated);
  };

  const handleAddBlockedDate = async () => {
    if (!newBlockDate) return;
    try {
      const res = await facultyAPI.blockDate(newBlockDate);
      if (res.data.success) {
        setBlockedDates(res.data.blockedDates);
        setNewBlockDate('');
      }
    } catch (error) {
      alert('Could not block date');
    }
  };

  const handleRemoveBlockedDate = async (date) => {
    try {
      const res = await facultyAPI.unblockDate(date);
      if (res.data.success) {
        setBlockedDates(res.data.blockedDates);
      }
    } catch (error) {
      alert('Could not unblock date');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback({ type: '', text: '' });
    try {
      const res = await facultyAPI.updateAvailability({
        weeklyAvailability,
        acceptingBookings,
        designation,
        officeRoom,
        subjects: subjectsStr.split(',').map((s) => s.trim()).filter(Boolean)
      });
      if (res.data.success) {
        setFeedback({ type: 'success', text: 'Office hours and schedule settings updated successfully!' });
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        text: error.response?.data?.message || 'Failed to save settings.'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-campus-text">
          Office Hours & Availability Planner
        </h1>
        <p className="text-sm text-campus-textMuted mt-1">
          Configure weekly recurring office hours, set slot resolution, and block dates for leave or exams.
        </p>
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

      <form onSubmit={handleSave} className="space-y-8">
        {/* Toggle Accepting Bookings */}
        <Card>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-semibold text-base text-campus-text">
                Accept Student Doubt Bookings
              </h3>
              <p className="text-xs text-campus-textMuted mt-0.5">
                Toggle off if you are traveling, on sabbatical, or temporarily not accepting new appointments.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAcceptingBookings(!acceptingBookings)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                acceptingBookings
                  ? 'bg-campus-primary text-campus-bg shadow-glow'
                  : 'bg-campus-surface text-campus-textMuted border border-campus-border'
              }`}
            >
              {acceptingBookings ? '✓ Accepting Appointments' : '⏸ Paused (Not Accepting)'}
            </button>
          </div>
        </Card>

        {/* Weekly Recurring Office Hours */}
        <Card
          title="Weekly Office Hours Schedule"
          subtitle="Define intervals when students can request 1-on-1 sessions"
          action={
            <Button type="button" variant="secondary" size="sm" icon={Plus} onClick={handleAddSlot}>
              Add Day Schedule
            </Button>
          }
        >
          <div className="space-y-3">
            {weeklyAvailability.map((slot, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-campus-surface border border-campus-border flex flex-col md:flex-row items-center gap-4"
              >
                <div className="w-full md:w-44">
                  <label className="block text-[11px] font-medium text-campus-textSubtle uppercase mb-1">
                    Day of Week
                  </label>
                  <select
                    value={slot.dayOfWeek}
                    onChange={(e) => handleSlotChange(index, 'dayOfWeek', e.target.value)}
                    className="w-full bg-campus-card border border-campus-border rounded-lg px-3 py-2 text-xs text-campus-text focus:outline-none focus:border-campus-primary"
                  >
                    {daysOfWeek.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-full md:w-32">
                  <label className="block text-[11px] font-medium text-campus-textSubtle uppercase mb-1">
                    Start (24h)
                  </label>
                  <input
                    type="text"
                    value={slot.startTime}
                    onChange={(e) => handleSlotChange(index, 'startTime', e.target.value)}
                    className="w-full bg-campus-card border border-campus-border rounded-lg px-3 py-2 text-xs text-campus-text focus:outline-none focus:border-campus-primary"
                  />
                </div>

                <div className="w-full md:w-32">
                  <label className="block text-[11px] font-medium text-campus-textSubtle uppercase mb-1">
                    End (24h)
                  </label>
                  <input
                    type="text"
                    value={slot.endTime}
                    onChange={(e) => handleSlotChange(index, 'endTime', e.target.value)}
                    className="w-full bg-campus-card border border-campus-border rounded-lg px-3 py-2 text-xs text-campus-text focus:outline-none focus:border-campus-primary"
                  />
                </div>

                <div className="w-full md:w-36">
                  <label className="block text-[11px] font-medium text-campus-textSubtle uppercase mb-1">
                    Slot Duration
                  </label>
                  <select
                    value={slot.slotDurationMinutes || 30}
                    onChange={(e) => handleSlotChange(index, 'slotDurationMinutes', e.target.value)}
                    className="w-full bg-campus-card border border-campus-border rounded-lg px-3 py-2 text-xs text-campus-text focus:outline-none focus:border-campus-primary"
                  >
                    <option value={15}>15 Minutes</option>
                    <option value={30}>30 Minutes</option>
                    <option value={45}>45 Minutes</option>
                    <option value={60}>60 Minutes</option>
                  </select>
                </div>

                <div className="md:mt-5 ml-auto">
                  <button
                    type="button"
                    onClick={() => handleRemoveSlot(index)}
                    className="p-2 text-campus-textSubtle hover:text-campus-danger hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Remove day"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Blocked Dates (Exams, Leaves) */}
        <Card
          title="Blocked Dates (Official Leave / Exam Duties)"
          subtitle="Students cannot book doubt sessions on these dates"
        >
          <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
            <input
              type="date"
              value={newBlockDate}
              onChange={(e) => setNewBlockDate(e.target.value)}
              className="bg-campus-surface border border-campus-border rounded-xl px-4 py-2.5 text-xs text-campus-text focus:outline-none focus:border-campus-primary w-full sm:w-64"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              icon={Ban}
              onClick={handleAddBlockedDate}
            >
              Block This Date
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {blockedDates.length === 0 ? (
              <p className="text-xs text-campus-textMuted">No dates blocked.</p>
            ) : (
              blockedDates.map((bDate, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-campus-surface border border-campus-border text-xs text-campus-text font-mono"
                >
                  <span>🔒 {new Date(bDate).toLocaleDateString()}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveBlockedDate(bDate)}
                    className="text-campus-textSubtle hover:text-campus-danger"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Profile details */}
        <Card title="Faculty Cabin & Academic Specializations">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Designation"
              name="designation"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
            />
            <Input
              label="Office / Cabin Room"
              name="officeRoom"
              value={officeRoom}
              onChange={(e) => setOfficeRoom(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <Input
              label="Mentoring Subjects (comma-separated)"
              name="subjects"
              value={subjectsStr}
              onChange={(e) => setSubjectsStr(e.target.value)}
              placeholder="e.g. Distributed Systems, Cloud Computing, Database Internals"
            />
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="lg" loading={saving} icon={Save}>
            Save Availability & Settings
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AvailabilityManager;

