import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Ticket,
  Search,
  Download,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  User
} from 'lucide-react';
import { bookingAPI, analyticsAPI } from '../../services/api';

const MasterBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [exporting, setExporting] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (search) params.search = search;

      const res = await bookingAPI.getAll(params);
      if (res.data.success) {
        setBookings(res.data.bookings || []);
      }
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBookings();
  };

  const handleExportCSV = async () => {
    try {
      setExporting(true);
      const res = await analyticsAPI.exportCSV('bookings');
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'campusconnect_master_bookings.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to export CSV');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Ticket className="w-6 h-6 text-[#387ED1]" />
            <span>Master Ticket Bookings Directory</span>
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Global register of all student ticket issuances, cancellations, and door check-in states.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={exporting}
          className="px-4 py-2.5 rounded-xl bg-[#387ED1] hover:bg-[#2563EB] disabled:opacity-50 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>{exporting ? 'Exporting...' : 'Export to CSV'}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative max-w-md w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ticket code, student name, or ID..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#0F172A] border border-[#1E293B] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#387ED1]"
          />
        </form>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0F172A] border border-[#1E293B]">
          {[
            { id: 'all', label: 'All' },
            { id: 'confirmed', label: 'Confirmed' },
            { id: 'attended', label: 'Attended' },
            { id: 'cancelled', label: 'Cancelled' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === tab.id
                  ? 'bg-[#387ED1] text-white shadow-sm'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="rounded-2xl bg-[#0F172A] border border-[#1E293B] overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#111827] text-[#94A3B8] uppercase text-[10px] tracking-wider border-b border-[#1E293B]">
              <tr>
                <th className="py-3 px-4">Ticket & Booking ID</th>
                <th className="py-3 px-4">Attendee Details</th>
                <th className="py-3 px-4">Event Details</th>
                <th className="py-3 px-4">Booking Status</th>
                <th className="py-3 px-4">Door Check-In</th>
                <th className="py-3 px-4 text-right">Date Issued</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#64748B]">
                    Loading master bookings...
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#64748B]">
                    No bookings found matching filters.
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-[#1E293B]/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono">
                      <p className="font-bold text-[#60A5FA]">{b.ticketCode}</p>
                      <p className="text-[10px] text-[#64748B]">{b.bookingId}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-white">{b.attendeeDetails?.fullName || b.user?.fullName}</p>
                      <p className="text-[10px] text-[#64748B]">
                        ID: {b.attendeeDetails?.studentOrEmployeeId || b.user?.studentOrEmployeeId} • {b.attendeeDetails?.department || b.user?.department}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 text-[#94A3B8]">
                      <p className="font-medium text-white line-clamp-1">{b.event?.title}</p>
                      <p className="text-[10px] text-[#64748B]">
                        {b.event?.eventDate ? new Date(b.event.eventDate).toLocaleDateString() : 'TBD'} • {b.event?.venue}
                      </p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          b.status === 'confirmed'
                            ? 'bg-[#10B981]/20 text-[#10B981]'
                            : b.status === 'attended'
                            ? 'bg-[#387ED1]/20 text-[#60A5FA]'
                            : 'bg-[#EF4444]/20 text-[#EF4444]'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          b.checkInStatus === 'checked_in'
                            ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30'
                            : 'bg-[#1E293B] text-[#64748B]'
                        }`}
                      >
                        {b.checkInStatus === 'checked_in' ? 'Checked In' : 'Unchecked'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-[#64748B] font-mono text-[11px]">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MasterBookings;
