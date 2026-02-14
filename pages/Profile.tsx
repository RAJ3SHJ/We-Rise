
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, Mail, Briefcase, Clock, Shield, Save, Key, AlertTriangle } from 'lucide-react';

interface ProfileProps {
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
}

const Profile: React.FC<ProfileProps> = ({ profile, setProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...profile });
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(formData);
    setIsEditing(false);
    setMessage({ type: 'success', text: 'Profile updated successfully!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleResetPassword = () => {
    setMessage({ type: 'success', text: 'A password reset link has been simulated for your email.' });
    setTimeout(() => setMessage(null), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Account Settings</h1>
          <p className="text-slate-500 font-medium">Manage your profile and account preferences.</p>
        </div>
      </header>

      {message && (
        <div className={`p-4 rounded-xl text-sm font-bold flex items-center gap-2 ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-4 border-4 border-white shadow-inner">
              <User size={40} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">{profile.name}</h2>
            <p className="text-slate-400 text-sm font-medium">{profile.email}</p>
            <div className="mt-6 w-full pt-6 border-t border-slate-50 space-y-3 text-left">
              <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                <Briefcase size={16} className="text-slate-300" />
                <span>{profile.background || 'Background not set'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                <Clock size={16} className="text-slate-300" />
                <span>{profile.availabilityHoursPerWeek}h / week</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Shield size={18} className="text-indigo-500" />
              Account Security
            </h3>
            <button 
              onClick={handleResetPassword}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group"
            >
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                <Key size={16} />
                Update Password
              </div>
              <Save size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button 
              onClick={() => { localStorage.clear(); window.location.reload(); }}
              className="w-full flex items-center gap-3 p-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors text-sm font-bold"
            >
              <AlertTriangle size={16} />
              Reset All Application Data
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-slate-800">Personal Information</h3>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-bold hover:bg-indigo-100 transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      disabled={!isEditing}
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-100 disabled:bg-slate-50 disabled:text-slate-500 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      disabled={!isEditing}
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-100 disabled:bg-slate-50 disabled:text-slate-500 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Current Background</label>
                <select 
                  disabled={!isEditing}
                  value={formData.background}
                  onChange={(e) => setFormData({...formData, background: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-100 disabled:bg-slate-50 disabled:text-slate-500 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none bg-white transition-all appearance-none"
                >
                  <option value="">Select Background</option>
                  <option>Operations</option>
                  <option>QA/Testing</option>
                  <option>Banking/Finance</option>
                  <option>Project Management</option>
                  <option>Marketing</option>
                  <option>Development</option>
                  <option>Customer Support</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Availability (Hours / Week)</label>
                <div className="flex items-center gap-4">
                  <input 
                    disabled={!isEditing}
                    type="range" min="5" max="40" step="5"
                    value={formData.availabilityHoursPerWeek}
                    onChange={(e) => setFormData({...formData, availabilityHoursPerWeek: parseInt(e.target.value)})}
                    className="flex-1 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <span className="font-bold text-lg text-indigo-700 w-12 text-center">{formData.availabilityHoursPerWeek}h</span>
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-4 pt-6">
                  <button 
                    type="button"
                    onClick={() => { setIsEditing(false); setFormData({...profile}); }}
                    className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2"
                  >
                    <Save size={18} /> Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
