import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Ticket,
  QrCode,
  Download,
  Calendar,
  MapPin,
  Clock,
  Printer,
  CheckCircle2,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { bookingAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const MyTickets = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const res = await bookingAPI.getMy();
        if (res.data.success) {
          // Show confirmed & attended tickets
          const validTickets = (res.data.bookings || []).filter(
            (b) => b.status === 'confirmed' || b.status === 'attended'
          );
          setTickets(validTickets);
        }
      } catch (err) {
        console.error('Failed to load tickets:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Ticket className="w-6 h-6 text-[#387ED1]" />
            <span>Digital Ticket Wallet</span>
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Official verifiable event credentials with cryptographically bound QR codes. Present to door staff for instant check-in.
          </p>
        </div>

        {tickets.length > 0 && (
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-white text-xs font-semibold border border-[#334155] flex items-center gap-2 transition-all self-start md:self-auto"
          >
            <Printer className="w-4 h-4 text-[#387ED1]" />
            <span>Print Passes</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-20 text-center text-sm text-[#94A3B8]">
          <div className="w-8 h-8 border-2 border-[#387ED1] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading digital passes...
        </div>
      ) : tickets.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-[#0F172A] border border-[#1E293B]">
          <Ticket className="w-10 h-10 text-[#64748B] mx-auto mb-2 opacity-50" />
          <h3 className="text-base font-bold text-white">No active tickets</h3>
          <p className="text-xs text-[#94A3B8] mt-1">Book events to receive your official QR passes.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tickets.map((ticket) => (
            <div
              key={ticket._id}
              className="rounded-2xl bg-[#0F172A] border border-[#1E293B] overflow-hidden shadow-xl flex flex-col justify-between relative print:bg-white print:text-black print:border-black"
            >
              {/* Ticket Top Notch */}
              <div className="p-6 bg-gradient-to-r from-[#1E293B] to-[#0F172A] border-b border-[#1E293B] flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-[#60A5FA]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>CampusConnect Verified Pass</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1 line-clamp-1">
                    {ticket.event?.title}
                  </h3>
                  <p className="text-xs text-[#94A3B8] mt-0.5">
                    Category: <span className="text-white capitalize">{ticket.event?.category}</span>
                  </p>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                    ticket.checkInStatus === 'checked_in'
                      ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30'
                      : 'bg-[#387ED1]/20 text-[#60A5FA] border border-[#387ED1]/30'
                  }`}
                >
                  {ticket.checkInStatus === 'checked_in' ? 'Checked In' : 'Active Pass'}
                </span>
              </div>

              {/* Ticket Center Grid */}
              <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                {/* Left 2 Cols: Details */}
                <div className="sm:col-span-2 space-y-3.5 text-xs">
                  <div>
                    <span className="text-[#64748B]">Ticket Holder</span>
                    <p className="font-bold text-white text-sm">
                      {ticket.attendeeDetails?.fullName || user?.fullName}
                    </p>
                    <p className="text-[11px] text-[#94A3B8]">
                      ID: {ticket.attendeeDetails?.studentOrEmployeeId || user?.studentOrEmployeeId} • {ticket.attendeeDetails?.department || user?.department}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#1E293B]">
                    <div>
                      <span className="text-[#64748B]">Event Date</span>
                      <p className="font-semibold text-white">
                        {ticket.event?.eventDate ? new Date(ticket.event.eventDate).toLocaleDateString() : 'TBD'}
                      </p>
                    </div>
                    <div>
                      <span className="text-[#64748B]">Time</span>
                      <p className="font-semibold text-white">
                        {ticket.event?.startTime} - {ticket.event?.endTime}
                      </p>
                    </div>
                  </div>

                  <div>
                    <span className="text-[#64748B]">Venue</span>
                    <p className="font-semibold text-white truncate">{ticket.event?.venue}</p>
                  </div>
                </div>

                {/* Right Col: QR Code Card */}
                <div className="sm:col-span-1 text-center flex flex-col items-center justify-center p-3 rounded-xl bg-white shadow-inner">
                  {ticket.qrCode ? (
                    <img src={ticket.qrCode} alt="Ticket QR" className="w-28 h-28 mx-auto" />
                  ) : (
                    <QrCode className="w-20 h-20 text-[#0F172A] mx-auto" />
                  )}
                  <span className="font-mono text-[10px] font-bold text-[#0F172A] mt-1 block">
                    {ticket.ticketCode}
                  </span>
                </div>
              </div>

              {/* Ticket Perforated Tear Line & Barcode footer */}
              <div className="px-6 py-3.5 border-t border-dashed border-[#334155] bg-[#0B0F19] flex items-center justify-between text-[11px] font-mono text-[#64748B]">
                <span>BOOKING ID: {ticket.bookingId}</span>
                <span>ENTRY: MAIN GATE CHECK-IN</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTickets;
