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
      setErrorMessage('Please select a resource first.');
      return;
    }

    if (!subject.trim() || !description.trim()) {
      setErrorMessage('Please provide a project subject and detailed description.');
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
          colors: ['#7C3AED', '#8B5CF6', '#10B981']
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
    <div className="space-y-8 animate-in fade-in duration-300 font-sans">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#13111C] border border-[#262135] text-xs text-[#A78BFA] font-semibold mb-2 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" /> High-Performance Infrastructure
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Classroom & Laboratory Resource Booking
        </h1>
        <p className="text-xs sm:text-sm text-[#9E98AE] mt-1">
          Reserve high-performance GPU labs, smart lecture amphitheaters, and seminar halls with automated collision avoidance.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs sm:text-sm font-medium flex items-center gap-3 shadow-inner">
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
                <p className="text-xs text-[#716B82] text-center py-8">
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
                          ? 'bg-[#7C3AED]/20 border-[#7C3AED] shadow-[0_0_15px_rgba(124,58,237,0.3)]'
                          : 'bg-[#13111C] border-[#262135] hover:border-[#7C3AED]/40 hover:bg-white/[0.02]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-lg bg-[#7C3AED]/20 border border-[#7C3AED]/40 text-[#C4B5FD] font-bold">
                              {res.code}
                            </span>
                            <span className="text-[10px] text-[#716B82] uppercase tracking-wider font-mono">
                              {res.type}
                            </span>
                          </div>
                          <h4 className="font-display font-semibold text-sm text-white mt-1.5 tracking-tight">
                            {res.name}
                          </h4>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-[#A78BFA] font-semibold bg-[#7C3AED]/15 px-2.5 py-1 rounded-xl border border-[#7C3AED]/30 flex-shrink-0">
                          <Users className="w-3.5 h-3.5" />
                          <span>{res.capacity}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-[#9E98AE] mt-2 font-mono">
                        <MapPin className="w-3 h-3 text-[#716B82]" />
                        <span>{res.building}, {res.floor}</span>
                      </div>

                      {res.amenities && res.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2.5">
                          {res.amenities.slice(0, 3).map((a, i) => (
                            <span
                              key={i}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-[#1B1828] border border-[#262135] text-[#C7C3D6]"
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
                  <label className="block text-[11px] font-semibold text-[#9E98AE] uppercase tracking-wider mb-2">
                    Date of Reservation
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-[#0D0C15] border border-[#262135] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 shadow-inner font-mono"
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
                  <label className="block text-[11px] font-semibold text-[#9E98AE] uppercase tracking-wider mb-2">
                    Confirmed Schedule on {bookingDate}
                  </label>
                  {loadingAvailability ? (
                    <div className="py-4 text-center text-xs text-[#9E98AE]">
                      Checking room schedule...
                    </div>
                  ) : availabilityData?.occupiedBookings?.length === 0 ? (
                    <div className="p-3.5 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 text-[#34D399] text-xs font-medium flex items-center gap-2">
                      <Check className="w-4 h-4" /> This facility is completely free with no confirmed sessions on this date.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-xs text-[#9E98AE]">
                        Already booked intervals (conflicts will be rejected):
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {availabilityData?.occupiedBookings?.map((occ, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono font-medium"
                          >
                            🔒 {occ.startTime} - {occ.endTime} ({occ.subject})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Purpose and details */}
                <div className="space-y-4 pt-4 border-t border-[#262135]">
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
            <div className="flex flex-col items-center justify-center p-14 text-center rounded-2xl border border-dashed border-[#262135] bg-[#0D0C15]/50">
              <Building2 className="w-12 h-12 text-[#7C3AED]/40 mb-3 animate-pulse" />
              <h3 className="font-display font-semibold text-white text-base">
                Please select a classroom or laboratory
              </h3>
              <p className="text-xs text-[#9E98AE] mt-1 max-w-sm">
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
          <div className="w-16 h-16 rounded-2xl bg-[#7C3AED]/20 border border-[#7C3AED]/40 flex items-center justify-center text-[#A78BFA] mx-auto shadow-[0_0_15px_rgba(124,58,237,0.3)]">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div>
            <h4 className="font-display font-bold text-lg text-white">
              Request Sent for {selectedResource?.name}
            </h4>
            <p className="text-xs text-[#9E98AE] mt-1.5 max-w-md mx-auto leading-relaxed">
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
