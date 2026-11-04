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
  Power
} from 'lucide-react';
import { userAPI } from '../../services/api';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';

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
    role: 'faculty',
    department: 'Computer Science & Engineering',
    studentOrEmployeeId: '',
    phone: '',
    designation: 'Assistant Professor',
    officeRoom: 'Main Faculty Wing'
  });
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  const loadUsers = async () => {
    try {
      const res = await userAPI.getAll({
        role: roleFilter,
        search
      });
      if (res.data.success) {
        setUsers(res.data.users);
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
          text: `Account for ${user.fullName} is now ${res.data.user.isActive ? 'Active' : 'Deactivated'}.`
        });
        await loadUsers();
      }
    } catch (error) {
      alert('Could not update user status');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback({ type: '', text: '' });

    try {
      const res = await userAPI.create(formData);
      if (res.data.success) {
        setFeedback({ type: 'success', text: `User account created for ${formData.fullName}!` });
        setModalOpen(false);
        await loadUsers();
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        text: error.response?.data?.message || 'Failed to create user.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-campus-text">
            Institutional User Directory
          </h1>
          <p className="text-sm text-campus-textMuted mt-1">
            Manage students, faculty members, and administrative accounts across academic departments.
          </p>
        </div>

        <Button
          variant="primary"
          icon={UserPlus}
          onClick={() => {
            setFormData({
              fullName: '',
              email: '',
              password: 'TempPassword@123',
              role: 'faculty',
              department: 'Computer Science & Engineering',
              studentOrEmployeeId: '',
              phone: '',
              designation: 'Assistant Professor',
              officeRoom: 'Main Faculty Wing'
            });
            setModalOpen(true);
          }}
        >
          Provision User Account
        </Button>
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

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          <Input
            placeholder="Search by name, email, or Student/Employee ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={Search}
          />
        </div>

        <div className="w-full sm:w-48">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full bg-campus-surface border border-campus-border rounded-xl px-4 py-2.5 text-xs text-campus-text focus:outline-none focus:border-campus-primary cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="faculty">Faculty</option>
            <option value="admin">Administrators</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <Card>
        {loading ? (
          <div className="py-16 text-center text-sm text-campus-textMuted flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-campus-primary border-t-transparent rounded-full animate-spin" />
            Loading user records...
          </div>
        ) : users.length === 0 ? (
          <div className="py-12 text-center text-sm text-campus-textMuted">
            No users found matching query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-mono text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Institutional ID</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{u.fullName}</div>
                      <div className="text-[11px] text-slate-500">{u.email}</div>
                    </td>
                    <td className="py-3.5 px-4 capitalize font-mono text-[11px]">
                      <span
                        className={`px-2 py-0.5 rounded-md border ${
                          u.role === 'admin'
                            ? 'bg-orange-50 text-[#FF5722] border-orange-200'
                            : u.role === 'faculty'
                            ? 'bg-blue-50 text-[#387ED1] border-blue-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#387ED1]">
                      {u.studentOrEmployeeId}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {u.department}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={u.isActive ? 'active' : 'inactive'} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-all ${
                          u.isActive
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                        }`}
                      >
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Provision User Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Provision New University Account"
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <Input
            label="Full Name"
            name="fullName"
            placeholder="e.g. Prof. Ramesh Nair"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Official Email"
              name="email"
              type="email"
              placeholder="e.g. ramesh.nair@campusconnect.edu"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              label="ID (Student / Employee)"
              name="studentOrEmployeeId"
              placeholder="e.g. FAC-CSE-205"
              value={formData.studentOrEmployeeId}
              onChange={(e) => setFormData({ ...formData, studentOrEmployeeId: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Assign Role"
              name="role"
              type="select"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              options={[
                { label: 'Faculty', value: 'faculty' },
                { label: 'Student', value: 'student' },
                { label: 'Administrator', value: 'admin' }
              ]}
            />
            <Input
              label="Initial Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <Input
            label="Department"
            name="department"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            required
          />

          {formData.role === 'faculty' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-campus-border/60">
              <Input
                label="Designation"
                name="designation"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              />
              <Input
                label="Office Cabin"
                name="officeRoom"
                value={formData.officeRoom}
                onChange={(e) => setFormData({ ...formData, officeRoom: e.target.value })}
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-3">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              Create Account
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserManagement;

