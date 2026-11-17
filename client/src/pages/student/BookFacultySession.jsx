import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Search,
  GraduationCap,
  Calendar,
  Clock,
  BookOpen,
  MapPin,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Check
} from 'lucide-react';
import { facultyAPI, bookingAPI } from '../../services/api';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

const BookFacultySession = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [filteredFaculty, setFilteredFaculty] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');

  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });

  const [slotsData, setSlotsData] = useState(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const navigate = useNavigate();

  // Load faculty members
  useEffect(() => {
    const loadFaculty = async () => {
      try {
        const res = await facultyAPI.getAll();
        if (res.data.success) {
          setFacultyList(res.data.faculty);
          setFilteredFaculty(res.data.faculty);
        }
      } catch (error) {
        console.error('Failed to load faculty:', error);
      }
    };
    loadFaculty();
  }, []);

  // Filter faculty on search or department change
  useEffect(() => {
    let result = facultyList;
    if (selectedDept !== 'all') {
      result = result.filter((f) => f.department === selectedDept);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (f) =>
          f.fullName.toLowerCase().includes(q) ||
          f.department.toLowerCase().includes(q) ||
          f.profile?.subjects?.some((s) => s.toLowerCase().includes(q))
      );
    }
    setFilteredFaculty(result);
  }, [search, selectedDept, facultyList]);

  // Fetch slots whenever faculty or date changes
  useEffect(() => {
    if (!selectedFaculty || !selectedDate) return;

    const fetchSlots = async () => {
      setSlotsLoading(true);
      setErrorMessage('');
      setSelectedSlot(null);
      try {
        const res = await facultyAPI.getSlots(selectedFaculty._id, selectedDate);
        if (res.data.success) {
          setSlotsData(res.data);
        }
      } catch (error) {
        setSlotsData(null);
        setErrorMessage(error.response?.data?.message || 'Could not fetch faculty slots.');
      } finally {
        setSlotsLoading(false);
      }
    };

    fetchSlots();
  }, [selectedFaculty, selectedDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!selectedSlot) {
      setErrorMessage('Please select an available time slot.');
      return;
    }

    if (!subject.trim() || !description.trim()) {
      setErrorMessage('Please enter both the subject and a description of your doubt.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await bookingAPI.create({
        bookingType: 'faculty_session',
        facultyId: selectedFaculty._id,
        date: selectedDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        subject,
        description
      });

      if (res.data.success) {
        // Trigger celebratory confetti burst with violet palette!
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#7C3AED', '#8B5CF6', '#10B981']
        });
        setSuccessModalOpen(true);
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || 'Failed to submit doubt session request.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const departments = [
    { label: 'All Departments', value: 'all' },
    { label: 'Computer Science & Engineering', value: 'Computer Science & Engineering' },
    { label: 'Information Technology', value: 'Information Technology' },
    { label: 'Artificial Intelligence & Data Science', value: 'Artificial Intelligence & Data Science' },
    { label: 'Electronics & Communication', value: 'Electronics & Communication' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 font-sans">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#13111C] border border-[#262135] text-xs text-[#A78BFA] font-semibold mb-2 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" /> 1-on-1 Academic Mentorship
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Book Faculty Doubt-Clearing Session
        </h1>
        <p className="text-xs sm:text-sm text-[#9E98AE] mt-1">
          Select a professor, check live available slots, and schedule 1-on-1 academic mentoring with zero collisions.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs sm:text-sm font-medium flex items-center gap-3 shadow-inner">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Step 1: Faculty Selection List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card title="1. Select Faculty Member" subtitle="Filter by name, department, or subject">
            <div className="space-y-3 mb-4">
              <Input
                placeholder="Search faculty name, subject..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={Search}
              />
              <Input
                type="select"
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                options={departments}
              />
            </div>

            <div className="max-h-[520px] overflow-y-auto space-y-2.5 pr-1">
              {filteredFaculty.length === 0 ? (
                <p className="text-xs text-[#716B82] text-center py-8">
                  No faculty found matching the search query.
                </p>
              ) : (
                filteredFaculty.map((fac) => {
                  const isSelected = selectedFaculty?._id === fac._id;
                  return (
                    <motion.div
                      key={fac._id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setSelectedFaculty(fac)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#7C3AED]/20 border-[#7C3AED] shadow-[0_0_15px_rgba(124,58,237,0.3)]'
                          : 'bg-[#13111C] border-[#262135] hover:border-[#7C3AED]/40 hover:bg-white/[0.02]'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-[#7C3AED] text-white flex items-center justify-center font-extrabold text-base flex-shrink-0 shadow-[0_0_12px_rgba(124,58,237,0.4)]">
                          {fac.fullName.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-display font-semibold text-sm text-white truncate tracking-tight">
                            {fac.fullName}
                          </h4>
                          <p className="text-xs text-[#9E98AE] mt-0.5">
                            {fac.profile?.designation || 'Faculty Member'}
                          </p>
                          <p className="text-xs text-[#A78BFA] mt-0.5 font-medium truncate">
                            {fac.department}
                          </p>

                          <div className="flex items-center gap-1.5 text-[11px] text-[#716B82] mt-2 font-mono">
                            <MapPin className="w-3 h-3 text-[#7C3AED]" />
                            <span className="truncate">{fac.profile?.officeRoom || 'Academic Block'}</span>
                          </div>

                          {fac.profile?.subjects && fac.profile.subjects.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2.5">
                              {fac.profile.subjects.slice(0, 3).map((sub, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] px-2 py-0.5 rounded-md bg-[#1B1828] border border-[#262135] text-[#C7C3D6]"
                                >
                                  {sub}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </Card>
        </div>

        {/* Step 2 & 3: Slot Picker & Doubt Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {selectedFaculty ? (
            <Card
              title={`2. Booking Details with ${selectedFaculty.fullName}`}
              subtitle={selectedFaculty.profile?.officeRoom}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date Picker */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#9E98AE] uppercase tracking-wider mb-2">
                    Select Preferred Date
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-[#0D0C15] border border-[#262135] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 shadow-inner font-mono"
                  />
                </div>

                {/* Available Slots Grid */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#9E98AE] uppercase tracking-wider mb-2">
                    Available Time Slots on {selectedDate}
                  </label>

                  {slotsLoading ? (
                    <div className="py-8 text-center text-xs text-[#9E98AE] flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
                      Checking faculty schedule & conflicts...
                    </div>
                  ) : !slotsData?.isAvailable ? (
                    <div className="p-4 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#FBBF24] text-xs font-medium">
                      ⚠️ {slotsData?.reason || 'Faculty member has no available office hours on this day.'}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {slotsData.slots.map((slot, idx) => {
                        const isSelected = selectedSlot?.startTime === slot.startTime;
                        return (
                          <motion.button
                            type="button"
                            key={idx}
                            disabled={!slot.isAvailable}
                            onClick={() => setSelectedSlot(slot)}
                            whileHover={slot.isAvailable ? { scale: 1.03 } : {}}
                            whileTap={slot.isAvailable ? { scale: 0.97 } : {}}
                            className={`p-3 rounded-xl border text-xs font-medium transition-all text-center cursor-pointer ${
                              !slot.isAvailable
                                ? 'bg-[#13111C]/40 border-[#262135] text-[#716B82] line-through opacity-50 cursor-not-allowed'
                                : isSelected
                                ? 'bg-[#7C3AED] text-white font-bold border-[#7C3AED] shadow-[0_0_15px_rgba(124,58,237,0.5)]'
                                : 'bg-[#13111C] text-[#ECE8F5] border-[#262135] hover:border-[#7C3AED]/50 hover:bg-white/[0.02]'
                            }`}
                          >
                            <span className="block text-xs sm:text-sm font-semibold tracking-tight">
                              {slot.startTime} - {slot.endTime}
                            </span>
                            <span className="text-[10px] opacity-80 mt-0.5 block font-mono">
                              {slot.isAvailable ? '✓ Available' : 'Occupied'}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Doubt Subject & Description */}
                <div className="space-y-4 pt-4 border-t border-[#262135]">
                  <Input
                    label="Doubt Subject / Topic"
                    name="subject"
                    placeholder="e.g. Distributed Consensus & Raft Algorithm Clarification"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />

                  <Input
                    label="Detailed Explanation / Questions"
                    name="description"
                    type="textarea"
                    rows={3}
                    placeholder="Explain the specific doubts or problem sets you want guidance on..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={submitting}
                  disabled={!selectedSlot || !subject || !description}
                  className="w-full"
                >
                  Confirm & Submit Doubt Request
                </Button>
              </form>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center p-14 text-center rounded-2xl border border-dashed border-[#262135] bg-[#0D0C15]/50">
              <GraduationCap className="w-12 h-12 text-[#7C3AED]/40 mb-3 animate-pulse" />
              <h3 className="font-display font-semibold text-white text-base">
                Please select a faculty member from the list
              </h3>
              <p className="text-xs text-[#9E98AE] mt-1 max-w-sm">
                Click any professor on the left column to view their schedule, available time intervals, and submit your doubt session.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Success Confirmation Modal */}
      <Modal
        isOpen={successModalOpen}
        onClose={() => {
          setSuccessModalOpen(false);
          navigate('/student/my-bookings');
        }}
        title="Doubt Session Request Submitted!"
      >
        <div className="text-center py-4 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#7C3AED]/20 border border-[#7C3AED]/40 flex items-center justify-center text-[#A78BFA] mx-auto shadow-[0_0_15px_rgba(124,58,237,0.3)]">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div>
            <h4 className="font-display font-bold text-lg text-white">
              Request Sent to {selectedFaculty?.fullName}
            </h4>
            <p className="text-xs text-[#9E98AE] mt-1.5 max-w-md mx-auto leading-relaxed">
              Your request for <strong>{selectedDate}</strong> from <strong>{selectedSlot?.startTime} to {selectedSlot?.endTime}</strong> is now pending faculty approval. You will receive an in-app notification when reviewed.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => {
              setSuccessModalOpen(false);
              navigate('/student/my-bookings');
            }}
            className="w-full"
          >
            Go to My Bookings
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default BookFacultySession;
