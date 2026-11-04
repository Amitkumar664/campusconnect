import React, { useState } from 'react';
import { User, Lock, Mail, Building, IdCard, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const Profile = () => {
  const { user, updateUserProfile } = useAuth();

  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    department: user?.department || '',
    designation: '',
    officeRoom: '',
    bio: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg({ type: '', text: '' });

    try {
      const res = await authAPI.updateProfile(profileData);
      if (res.data.success) {
        updateUserProfile(res.data.user);
        setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
      }
    } catch (error) {
      setProfileMsg({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update profile.'
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      if (res.data.success) {
        setPasswordMsg({ type: 'success', text: 'Password changed successfully.' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      setPasswordMsg({
        type: 'error',
        text: error.response?.data?.message || 'Failed to change password.'
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-campus-text">Account Settings</h1>
        <p className="text-sm text-campus-textMuted mt-1">
          Manage your personal university credentials and security preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Card info */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="text-center">
            <div className="w-20 h-20 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#387ED1] text-2xl font-bold shadow-sm mx-auto mb-4">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <h2 className="font-display font-semibold text-lg text-slate-900">
              {user?.fullName}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs text-[#387ED1] font-semibold mt-3 capitalize">
              {user?.role}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 text-left space-y-3 text-xs">
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Department</span>
                <span className="font-medium text-slate-900">{user?.department}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">ID Number</span>
                <span className="font-mono font-medium text-slate-900">
                  {user?.studentOrEmployeeId}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Status</span>
                <span className="text-emerald-600 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Update Profile & Password */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card title="Personal Information" subtitle="Update your contact and identification details">
            {profileMsg.text && (
              <div
                className={`p-3 rounded-xl mb-4 text-xs font-medium flex items-center gap-2 ${
                  profileMsg.type === 'success'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                }`}
              >
                {profileMsg.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                {profileMsg.text}
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  name="fullName"
                  value={profileData.fullName}
                  onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                  icon={User}
                  required
                />
                <Input
                  label="Phone Number"
                  name="phone"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                />
              </div>

              <Input
                label="Department"
                name="department"
                value={profileData.department}
                onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                icon={Building}
                required
              />

              <div className="flex justify-end pt-2">
                <Button type="submit" variant="primary" loading={profileLoading}>
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>

          {/* Change Password */}
          <Card title="Security & Password" subtitle="Ensure your account is using a secure password">
            {passwordMsg.text && (
              <div
                className={`p-3 rounded-xl mb-4 text-xs font-medium flex items-center gap-2 ${
                  passwordMsg.type === 'success'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                }`}
              >
                {passwordMsg.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                {passwordMsg.text}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <Input
                label="Current Password"
                name="currentPassword"
                type="password"
                placeholder="Enter current password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                icon={Lock}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="New Password"
                  name="newPassword"
                  type="password"
                  placeholder="Min 6 characters"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  icon={Lock}
                  required
                />

                <Input
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  placeholder="Re-enter new password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  icon={Lock}
                  required
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" variant="secondary" loading={passwordLoading}>
                  Update Password
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;

