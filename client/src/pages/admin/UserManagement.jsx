import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Edit,
  Power,
  X
} from 'lucide-react';
import { userAPI } from '../../services/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'student',
    department: 'Computer Science & Engineering',
    studentOrEmployeeId: '',
    phone: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await userAPI.getAll({
        role: roleFilter,
        search
      });
      if (res.data.success) {
        setUsers(res.data.users || []);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [roleFilter, search]);

  const handleToggleStatus = async (user) => {
    try {
      const res = await userAPI.updateStatus(user._id);
      if (res.data.success) {
        setFeedback({
          type: 'success',
          text: `Account for ${user.fullName} is now ${res.data.isActive ? 'Active' : 'Deactivated'}.`
        });
        loadUsers();
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update account status.'
      });
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback({ type: '', text: '' });

    try {
      const res = await userAPI.create(formData);
      if (res.data.success) {
        setFeedback({
          type: 'success',
          text: `${formData.role} account created successfully!`
        });
        setModalOpen(false);
        setFormData({
          fullName: '',
          email: '',
          password: '',
          role: 'student',
          department: 'Computer Science & Engineering',
          studentOrEmployeeId: '',
          phone: ''
        });
        loadUsers();
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        text: error.response?.data?.message || 'Failed to provision user.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-[#387ED1]" />
            <span>User & Student Directory</span>
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Manage authenticated campus users (strictly Students and Administrators).
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#387ED1] hover:bg-[#2563EB] text-white text-xs font-semibold shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Provision Account</span>
        </button>
      </div>

      {feedback.text && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
            feedback.type === 'error'
              ? 'bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#EF4444]'
              : 'bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981]'
          }`}
        >
          {feedback.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, institutional email, or ID..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#0F172A] border border-[#1E293B] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#387ED1]"
          />
        </div>

        {/* Strictly Two Roles */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0F172A] border border-[#1E293B]">
          {[
            { id: 'all', label: 'All Accounts' },
            { id: 'student', label: 'Students' },
            { id: 'admin', label: 'Administrators' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                roleFilter === tab.id
                  ? 'bg-[#387ED1] text-white shadow-sm'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl bg-[#0F172A] border border-[#1E293B] overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#111827] text-[#94A3B8] uppercase text-[10px] tracking-wider border-b border-[#1E293B]">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">ID Number</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#64748B]">
                    Loading directory...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#64748B]">
                    No accounts matching criteria.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="hover:bg-[#1E293B]/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#387ED1] to-[#2563EB] text-white font-bold flex items-center justify-center text-xs flex-shrink-0">
                          {u.fullName?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{u.fullName}</p>
                          <p className="text-[11px] text-[#64748B]">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.role === 'admin'
                            ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30'
                            : 'bg-[#387ED1]/20 text-[#60A5FA] border border-[#387ED1]/30'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#94A3B8]">{u.department}</td>
                    <td className="py-3.5 px-4 font-mono text-[#60A5FA]">{u.studentOrEmployeeId}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.isActive
                            ? 'bg-[#10B981]/15 text-[#10B981]'
                            : 'bg-[#EF4444]/15 text-[#EF4444]'
                        }`}
                      >
                        {u.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(u)}
                        title={u.isActive ? 'Deactivate Account' : 'Activate Account'}
                        className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          u.isActive
                            ? 'bg-[#EF4444]/15 text-[#EF4444] hover:bg-[#EF4444]/25'
                            : 'bg-[#10B981]/15 text-[#10B981] hover:bg-[#10B981]/25'
                        }`}
                      >
                        <Power className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provision User Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#0F172A] border border-[#1E293B] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <h3 className="text-base font-bold text-white">Provision Campus Account</h3>
              <button onClick={() => setModalOpen(false)} className="text-[#64748B] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#94A3B8] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Dr. Rajeshwar Rao or Riya Sen"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-white focus:outline-none focus:border-[#387ED1]"
                />
              </div>

              <div>
                <label className="block text-[#94A3B8] mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="user@campusconnect.edu"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-white focus:outline-none focus:border-[#387ED1]"
                />
              </div>

              <div>
                <label className="block text-[#94A3B8] mb-1">Temporary Password</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Min 6 characters"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-white focus:outline-none focus:border-[#387ED1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#94A3B8] mb-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-white focus:outline-none focus:border-[#387ED1]"
                  >
                    <option value="student">Student</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#94A3B8] mb-1">ID Number</label>
                  <input
                    type="text"
                    required
                    value={formData.studentOrEmployeeId}
                    onChange={(e) => setFormData({ ...formData, studentOrEmployeeId: e.target.value })}
                    placeholder="e.g. STU-2024-CS-001"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-white focus:outline-none focus:border-[#387ED1] uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#94A3B8] mb-1">Department</label>
                <input
                  type="text"
                  required
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-white focus:outline-none focus:border-[#387ED1]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-[#387ED1] hover:bg-[#2563EB] text-white font-semibold shadow-md"
                >
                  {submitting ? 'Creating...' : 'Provision User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
