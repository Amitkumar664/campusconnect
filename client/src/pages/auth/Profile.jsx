import React, { useState } from 'react';
import { User, Lock, Mail, Building, IdCard, Check, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';

const Profile = () => {
  const { user, updateUserProfile } = useAuth();

  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    department: user?.department || ''
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

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <User className="w-6 h-6 text-[#387ED1]" />
          <span>Account Settings & Profile</span>
        </h1>
        <p className="text-xs text-[#94A3B8] mt-1">
          Manage your personal campus profile and credentials.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="p-6 rounded-2xl bg-[#0F172A] border border-[#1E293B] shadow-xl flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#387ED1] to-[#2563EB] text-white font-extrabold text-2xl flex items-center justify-center shadow-lg">
          {user?.fullName?.charAt(0) || 'U'}
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">{user?.fullName}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#387ED1]/20 text-[#60A5FA] border border-[#387ED1]/30">
              {user?.role}
            </span>
            <span className="text-xs text-[#64748B] font-mono">ID: {user?.studentOrEmployeeId}</span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">{user?.email} • {user?.department}</p>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="p-6 rounded-2xl bg-[#0F172A] border border-[#1E293B] shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Update Profile Information</h3>

        {profileMsg.text && (
          <div
            className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
              profileMsg.type === 'error'
                ? 'bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#EF4444]'
                : 'bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981]'
            }`}
          >
            {profileMsg.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
            <span>{profileMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#94A3B8] font-medium mb-1">Full Name</label>
              <input
                type="text"
                required
                value={profileData.fullName}
                onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E293B] border border-[#334155] text-white focus:outline-none focus:border-[#387ED1]"
              />
            </div>

            <div>
              <label className="block text-[#94A3B8] font-medium mb-1">Contact Phone</label>
              <input
                type="text"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                placeholder="+91 98765 00000"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E293B] border border-[#334155] text-white focus:outline-none focus:border-[#387ED1]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#94A3B8] font-medium mb-1">Department</label>
            <input
              type="text"
              required
              value={profileData.department}
              onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E293B] border border-[#334155] text-white focus:outline-none focus:border-[#387ED1]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={profileLoading}
              className="px-5 py-2.5 rounded-xl bg-[#387ED1] hover:bg-[#2563EB] disabled:opacity-50 text-white font-semibold text-xs shadow-md transition-all"
            >
              {profileLoading ? 'Saving changes...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
