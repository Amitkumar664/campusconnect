import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Lock, Mail, User, Building, IdCard, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'student',
    department: 'Computer Science & Engineering',
    studentOrEmployeeId: '',
    phone: '',
    designation: 'Assistant Professor',
    officeRoom: 'Academic Block'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName || !formData.email || !formData.password || !formData.studentOrEmployeeId) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const result = await register(formData);
    setLoading(false);

    if (result.success) {
      if (result.user.role === 'faculty') {
        navigate('/faculty/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } else {
      setError(result.message);
    }
  };

  const departments = [
    { label: 'Computer Science & Engineering', value: 'Computer Science & Engineering' },
    { label: 'Information Technology', value: 'Information Technology' },
    { label: 'Artificial Intelligence & Data Science', value: 'Artificial Intelligence & Data Science' },
    { label: 'Electronics & Communication', value: 'Electronics & Communication' },
    { label: 'Mechanical Engineering', value: 'Mechanical Engineering' },
    { label: 'Civil Engineering', value: 'Civil Engineering' }
  ];

  return (
    <div className="min-h-screen bg-campus-bg flex items-center justify-center p-4 relative overflow-hidden my-8">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-campus-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-6">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-campus-primary/10 border border-campus-primary/30 items-center justify-center text-campus-primary shadow-glow mb-3">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h1 className="font-display font-extrabold text-2xl text-campus-text">
            Join Campus<span className="text-campus-primary">Connect</span>
          </h1>
          <p className="text-xs text-campus-textMuted mt-1">
            Create your university account for room booking & faculty doubts
          </p>
        </div>

        <div className="bg-campus-card rounded-2xl border border-campus-border p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-campus-danger/10 border border-campus-danger/30 text-xs text-campus-danger font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role switch toggle */}
            <div>
              <label className="block text-xs font-medium text-campus-textMuted uppercase tracking-wider mb-1.5">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-2 bg-campus-surface p-1 rounded-xl border border-campus-border">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'student' })}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                    formData.role === 'student'
                      ? 'bg-campus-primary text-campus-bg shadow-glow'
                      : 'text-campus-textMuted hover:text-campus-text'
                  }`}
                >
                  Student Account
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'faculty' })}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                    formData.role === 'faculty'
                      ? 'bg-campus-primary text-campus-bg shadow-glow'
                      : 'text-campus-textMuted hover:text-campus-text'
                  }`}
                >
                  Faculty Account
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                name="fullName"
                placeholder="e.g. Aarav Mehta"
                value={formData.fullName}
                onChange={handleChange}
                icon={User}
                required
              />

              <Input
                label="Official Email"
                name="email"
                type="email"
                placeholder="e.g. name@campusconnect.edu"
                value={formData.email}
                onChange={handleChange}
                icon={Mail}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={formData.role === 'student' ? 'Student ID / Roll No' : 'Employee ID'}
                name="studentOrEmployeeId"
                placeholder={formData.role === 'student' ? 'e.g. STU-2023-CS-042' : 'e.g. FAC-CSE-101'}
                value={formData.studentOrEmployeeId}
                onChange={handleChange}
                icon={IdCard}
                required
              />

              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={handleChange}
                icon={Lock}
                required
              />
            </div>

            <Input
              label="Academic Department"
              name="department"
              type="select"
              value={formData.department}
              onChange={handleChange}
              options={departments}
              required
            />

            {formData.role === 'faculty' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-campus-border/60">
                <Input
                  label="Designation"
                  name="designation"
                  placeholder="e.g. Associate Professor"
                  value={formData.designation}
                  onChange={handleChange}
                />
                <Input
                  label="Office Cabin"
                  name="officeRoom"
                  placeholder="e.g. Block B, Cabin 302"
                  value={formData.officeRoom}
                  onChange={handleChange}
                />
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full mt-4"
            >
              Create Account <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-campus-textMuted mt-5">
          Already registered?{' '}
          <Link to="/login" className="text-campus-primary hover:underline font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

