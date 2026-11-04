import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Building2,
  Users,
  MapPin,
  CheckCircle,
  AlertCircle,
  Check,
  Search,
  Filter,
  Sparkles,
  Clock
} from 'lucide-react';
import { resourceAPI, bookingAPI } from '../../services/api';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

const BookResource = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [search, setSearch] = useState('');

  const [selectedResource, setSelectedResource] = useState(null);
  const [bookingDate, setBookingDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('16:00');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const [availabilityData, setAvailabilityData] = useState(null);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const navigate = useNavigate();

  // Load campus resources
  useEffect(() => {
    const loadResources = async () => {
      try {
        const res = await resourceAPI.getAll({ isActive: 'true' });
        if (res.data.success) {
          setResources(res.data.resources);
          setFilteredResources(res.data.resources);
        }
      } catch (error) {
        console.error('Failed to load resources:', error);
      }
    };
    loadResources();
  }, []);

  // Filter resources
  useEffect(() => {
    let result = resources;
    if (selectedType !== 'all') {
      result = result.filter((r) => r.type === selectedType);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.code.toLowerCase().includes(q) ||
          r.building.toLowerCase().includes(q) ||
          r.amenities.some((a) => a.toLowerCase().includes(q))
      );
    }
    setFilteredResources(result);
  }, [selectedType, search, resources]);

  // Load availability schedule for selected resource on date
  useEffect(() => {
    if (!selectedResource || !bookingDate) return;

    const fetchAvailability = async () => {
      setLoadingAvailability(true);
      try {
        const res = await resourceAPI.getAvailability(selectedResource._id, bookingDate);
        if (res.data.success) {
          setAvailabilityData(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch resource availability:', error);
      } finally {
        setLoadingAvailability(false);
      }
    };

    fetchAvailability();
  }, [selectedResource, bookingDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!selectedResource) {
      setErrorMessage('Please select a campus classroom or laboratory.');
      return;
    }
    if (!subject.trim() || !description.trim()) {
      setErrorMessage('Please enter both the project/event subject and purpose.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await bookingAPI.create({
        bookingType: 'resource_booking',
        resourceId: selectedResource._id,
        date: bookingDate,
        startTime,
        endTime,
        subject,
        description
      });

      if (res.data.success) {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10B981', '#38BDF8', '#F59E0B']
        });
        setSuccessModalOpen(true);
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || 'Failed to submit resource reservation request.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resourceTypes = [
    { label: 'All Resource Types', value: 'all' },
    { label: 'Laboratories', value: 'laboratory' },
    { label: 'Classrooms / Lecture Halls', value: 'classroom' },
    { label: 'Seminar Halls & Auditoriums', value: 'seminar_hall' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-400 font-semibold mb-2 shadow-glow-sm">
          <Sparkles className="w-3.5 h-3.5" /> High-Performance Infrastructure
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Classroom & Laboratory Resource Booking
        </h1>
        <p className="text-xs sm:text-sm text-campus-textMuted mt-1">
          Reserve high-performance GPU labs, smart lecture amphitheaters, and seminar halls with automated collision avoidance.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs sm:text-sm font-medium flex items-center gap-3 shadow-glass">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Resource Browsing & Selection (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card title="1. Select Facility / Lab" subtitle="Check capacity and hardware equipment">
            <div className="space-y-3 mb-4">
              <Input
                placeholder="Search labs, building, GPUs, smartboard..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={Search}
              />
              <Input
                type="select"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                options={resourceTypes}
              />
            </div>

            <div className="max-h-[520px] overflow-y-auto space-y-2.5 pr-1">
              {filteredResources.length === 0 ? (
                <p className="text-xs text-campus-textMuted text-center py-8">
                  No resources matching your criteria.
                </p>
              ) : (
                filteredResources.map((res) => {
                  const isSelected = selectedResource?._id === res._id;
                  return (
                    <motion.div
                      key={res._id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setSelectedResource(res)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-500/10 border-emerald-500/50 shadow-glow'
                          : 'bg-white/[0.02] border-white/[0.06] hover:border-emerald-500/30 hover:bg-white/[0.035]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-bold">
                              {res.code}
                            </span>
                            <span className="text-[10px] text-campus-textSubtle uppercase tracking-wider font-mono">
                              {res.type}
                            </span>
                          </div>
                          <h4 className="font-display font-semibold text-sm text-white mt-1.5 tracking-tight">
                            {res.name}
                          </h4>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20 flex-shrink-0">
                          <Users className="w-3.5 h-3.5" />
                          <span>{res.capacity}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-campus-textMuted mt-2 font-mono">
                        <MapPin className="w-3 h-3 text-campus-textSubtle" />
                        <span>{res.building}, {res.floor}</span>
                      </div>

                      {res.amenities && res.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2.5">
                          {res.amenities.slice(0, 3).map((a, i) => (
                            <span
                              key={i}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-campus-textMuted"
                            >
                              ✓ {a}
                            </span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  );
                })
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Time Slot & Booking Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {selectedResource ? (
            <Card
              title={`2. Reserve ${selectedResource.name}`}
              subtitle={`${selectedResource.code} • Capacity: ${selectedResource.capacity} seats`}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date Picker */}
                <div>
                  <label className="block text-[11px] font-semibold text-campus-textMuted uppercase tracking-wider mb-2">
                    Date of Reservation
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 shadow-glass"
                  />
                </div>

                {/* Start & End Times */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Start Time (24h)"
                    name="startTime"
                    placeholder="e.g. 14:00"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />

                  <Input
                    label="End Time (24h)"
                    name="endTime"
                    placeholder="e.g. 16:00"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                </div>

                {/* Existing Bookings Schedule Bar */}
                <div>
                  <label className="block text-[11px] font-semibold text-campus-textMuted uppercase tracking-wider mb-2">
                    Confirmed Schedule on {bookingDate}
                  </label>
                  {loadingAvailability ? (
                    <div className="py-4 text-center text-xs text-campus-textMuted">
                      Checking room schedule...
                    </div>
                  ) : availabilityData?.occupiedBookings?.length === 0 ? (
                    <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-medium flex items-center gap-2">
                      <Check className="w-4 h-4" /> This facility is completely free with no confirmed sessions on this date.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-xs text-campus-textSubtle">
                        Already booked intervals (conflicts will be rejected):
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {availabilityData?.occupiedBookings?.map((occ, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs font-mono font-medium"
                          >
                            🔒 {occ.startTime} - {occ.endTime} ({occ.subject})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Purpose and details */}
                <div className="space-y-4 pt-4 border-t border-white/[0.07]">
                  <Input
                    label="Booking Subject / Project Title"
                    name="subject"
                    placeholder="e.g. Senior Capstone Project Team AI Model Training"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />

                  <Input
                    label="Detailed Purpose & Expected Attendees"
                    name="description"
                    type="textarea"
                    rows={3}
                    placeholder="Explain the academic rationale and resource equipment needed..."
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
                  className="w-full"
                >
                  Submit Resource Reservation Request
                </Button>
              </form>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center p-14 text-center rounded-3xl border border-dashed border-white/10 bg-white/[0.015]">
              <Building2 className="w-12 h-12 text-emerald-400/40 mb-3 animate-pulse" />
              <h3 className="font-display font-semibold text-white text-base">
                Please select a classroom or laboratory
              </h3>
              <p className="text-xs text-campus-textMuted mt-1 max-w-sm">
                Choose any facility from the left column to view its capacity, equipment list, and schedule a reservation.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={successModalOpen}
        onClose={() => {
          setSuccessModalOpen(false);
          navigate('/student/my-bookings');
        }}
        title="Resource Reservation Submitted!"
      >
        <div className="text-center py-4 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-glow">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div>
            <h4 className="font-display font-bold text-lg text-white">
              Request Sent for {selectedResource?.name}
            </h4>
            <p className="text-xs text-campus-textMuted mt-1.5 max-w-md mx-auto leading-relaxed">
              Your request for <strong>{bookingDate}</strong> from <strong>{startTime} to {endTime}</strong> has been logged. Admin review will be notified to your account shortly.
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
            View in My Bookings
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default BookResource;
