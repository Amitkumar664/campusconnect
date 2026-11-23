import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  QrCode,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  User,
  Ticket,
  Undo2,
  RefreshCw,
  ShieldCheck,
  Check
} from 'lucide-react';
import { ticketAPI, eventAPI } from '../../services/api';

const TicketVerification = () => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [doorData, setDoorData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Scanner / Quick search input
  const [scanQuery, setScanQuery] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  // Filter within door list
  const [listFilter, setListFilter] = useState('all'); // all, checked_in, unattended

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const res = await eventAPI.getAll();
        if (res.data.success && res.data.events?.length > 0) {
          setEvents(res.data.events);
          setSelectedEventId(res.data.events[0]._id);
        }
      } catch (err) {
        console.error('Failed to load events for door verification:', err);
      }
    };
    loadEvents();
  }, []);

  const fetchDoorList = async (eventId, filter = listFilter) => {
    if (!eventId) return;
    try {
      setLoading(true);
      const res = await ticketAPI.getDoorList(eventId, { filter });
      if (res.data.success) {
        setDoorData(res.data);
      }
    } catch (err) {
      console.error('Failed to load door list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedEventId) {
      fetchDoorList(selectedEventId, listFilter);
    }
  }, [selectedEventId, listFilter]);

  const handleVerifyScan = async (e) => {
    e.preventDefault();
    if (!scanQuery.trim()) return;

    try {
      setVerifying(true);
      setScanResult(null);

      const res = await ticketAPI.verify(scanQuery.trim(), selectedEventId);
      setScanResult(res.data);
      setScanQuery('');
      // Refresh door counts and list
      fetchDoorList(selectedEventId, listFilter);
    } catch (err) {
      setScanResult({
        success: false,
        verificationStatus: 'invalid',
        message: err.response?.data?.message || 'Verification network failure'
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleToggleCheckIn = async (attendee) => {
    try {
      if (attendee.checkInStatus === 'checked_in') {
        // Undo check in
        await ticketAPI.undoCheckIn(attendee._id);
      } else {
        // Check in
        await ticketAPI.verify(attendee.ticketCode, selectedEventId);
      }
      fetchDoorList(selectedEventId, listFilter);
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10B981]/20 border border-[#10B981]/30 text-xs font-semibold text-[#10B981] mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Front Door Live Check-In</span>
          </div>
          <h1 className="text-2xl font-display font-extrabold text-white tracking-tight">
            Door Staff Verification Desk
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Scan physical or digital QR passes, search student tickets, and prevent duplicate door entry.
          </p>
        </div>

        {/* Event Selector Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#64748B]">Active Event:</span>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="px-4 py-2 rounded-xl bg-[#0F172A] border border-[#1E293B] text-xs font-semibold text-white focus:outline-none focus:border-[#387ED1]"
          >
            {events.map((e) => (
              <option key={e._id} value={e._id}>
                {e.title} ({new Date(e.eventDate).toLocaleDateString()})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Live Door Stats Bar (Inspired directly by the Hi.events reference image!) */}
      {doorData?.stats && (
        <div className="grid grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-[#1E293B] shadow-md text-center">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Total Passes</span>
            <h3 className="text-3xl font-display font-bold text-white mt-1">{doorData.stats.total}</h3>
            <p className="text-[11px] text-[#94A3B8] mt-0.5">Registered attendees</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0F172A] border border-[#10B981]/30 shadow-md text-center bg-gradient-to-b from-[#10B981]/10 to-transparent">
            <span className="text-[11px] font-bold text-[#10B981] uppercase tracking-wider">Checked In</span>
            <h3 className="text-3xl font-display font-bold text-[#10B981] mt-1">{doorData.stats.checkedIn}</h3>
            <p className="text-[11px] text-[#10B981]/80 mt-0.5">Inside the venue</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0F172A] border border-[#1E293B] shadow-md text-center">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Remaining</span>
            <h3 className="text-3xl font-display font-bold text-[#F59E0B] mt-1">{doorData.stats.remaining}</h3>
            <p className="text-[11px] text-[#94A3B8] mt-0.5">Expected to arrive</p>
          </div>
        </div>
      )}

      {/* Fast QR / Code Scanner Input */}
      <div className="p-6 rounded-2xl bg-[#0F172A] border border-[#1E293B] shadow-xl space-y-4">
        <form onSubmit={handleVerifyScan} className="flex gap-2">
          <div className="relative flex-1">
            <QrCode className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#387ED1]" />
            <input
              type="text"
              autoFocus
              value={scanQuery}
              onChange={(e) => setScanQuery(e.target.value)}
              placeholder="Search by student name, order #, ticket code (e.g. CC-TKT-HACK01) or scan QR..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#1E293B] border border-[#334155] text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[#387ED1]"
            />
          </div>
          <button
            type="submit"
            disabled={verifying}
            className="px-6 py-3 rounded-xl bg-[#387ED1] hover:bg-[#2563EB] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center gap-2"
          >
            {verifying ? 'Scanning...' : 'Verify Ticket'}
          </button>
        </form>

        {/* Verification Alert Banner */}
        {scanResult && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl text-xs flex items-center justify-between border ${
              scanResult.verificationStatus === 'valid'
                ? 'bg-[#10B981]/20 border-[#10B981]/40 text-[#10B981]'
                : scanResult.verificationStatus === 'already_used'
                ? 'bg-[#F59E0B]/20 border-[#F59E0B]/40 text-[#F59E0B]'
                : 'bg-[#EF4444]/20 border-[#EF4444]/40 text-[#EF4444]'
            }`}
          >
            <div className="flex items-center gap-3">
              {scanResult.verificationStatus === 'valid' ? (
                <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
              ) : scanResult.verificationStatus === 'already_used' ? (
                <Clock className="w-6 h-6 flex-shrink-0" />
              ) : (
                <XCircle className="w-6 h-6 flex-shrink-0" />
              )}
              <div>
                <p className="font-bold text-sm">{scanResult.message}</p>
                {scanResult.ticket && (
                  <p className="text-[11px] opacity-80 mt-0.5">
                    Holder: {scanResult.ticket.attendeeDetails?.fullName || scanResult.ticket.user?.fullName} (
                    {scanResult.ticket.attendeeDetails?.studentOrEmployeeId || scanResult.ticket.user?.studentOrEmployeeId})
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => setScanResult(null)}
              className="text-xs font-semibold underline ml-4"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </div>

      {/* Door Staff Attendee List (Matching Hi.events reference layout: Aoife Brennan, Marcus Whitfield style check-in list) */}
      <div className="rounded-2xl bg-[#0F172A] border border-[#1E293B] overflow-hidden shadow-xl">
        <div className="p-4 border-b border-[#1E293B] bg-[#0B0F19] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Attendee Door List</span>
            <span className="text-xs text-[#64748B]">({doorData?.attendees?.length || 0} loaded)</span>
          </div>

          <div className="flex items-center gap-2">
            {[
              { id: 'all', label: 'All Attendees' },
              { id: 'unattended', label: 'Remaining To Arrive' },
              { id: 'checked_in', label: 'Already Checked In' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setListFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  listFilter === f.id
                    ? 'bg-[#1E293B] text-white border border-[#334155]'
                    : 'text-[#64748B] hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-[#1E293B]">
          {loading ? (
            <div className="py-12 text-center text-xs text-[#64748B]">
              Loading door roster...
            </div>
          ) : doorData?.attendees?.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#64748B]">
              No matching attendees found for this filter.
            </div>
          ) : (
            doorData?.attendees?.map((att) => {
              const isCheckedIn = att.checkInStatus === 'checked_in';
              return (
                <div
                  key={att._id}
                  className="p-4 hover:bg-[#1E293B]/40 transition-colors flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                        isCheckedIn
                          ? 'bg-[#10B981] text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                          : 'bg-[#1E293B] text-[#94A3B8] border border-[#334155]'
                      }`}
                    >
                      {isCheckedIn ? (
                        <Check className="w-4 h-4 stroke-[3]" />
                      ) : (
                        att.attendeeDetails?.fullName?.charAt(0) || att.user?.fullName?.charAt(0) || 'U'
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white">
                        {att.attendeeDetails?.fullName || att.user?.fullName}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-[#64748B] font-mono mt-0.5">
                        <span className="text-[#60A5FA] font-bold">{att.ticketCode}</span>
                        <span>•</span>
                        <span>{att.attendeeDetails?.department || att.user?.department || 'Student'}</span>
                        {isCheckedIn && att.checkedInAt && (
                          <>
                            <span>•</span>
                            <span className="text-[#10B981]">
                              Checked in at {new Date(att.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Fast Door Action Button */}
                  <button
                    onClick={() => handleToggleCheckIn(att)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm ${
                      isCheckedIn
                        ? 'bg-[#EF4444]/20 hover:bg-[#EF4444] text-[#EF4444] hover:text-white border border-[#EF4444]/40'
                        : 'bg-[#10B981] hover:bg-[#059669] text-white'
                    }`}
                  >
                    {isCheckedIn ? 'Check Out / Undo' : 'Check In'}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketVerification;
