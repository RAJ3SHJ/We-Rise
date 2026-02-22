
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, Palette, Check, Save } from 'lucide-react';

const THEMES = [
  { name: 'Indigo', color: '#4f46e5' },
  { name: 'Emerald', color: '#059669' },
  { name: 'Blue', color: '#2563eb' },
  { name: 'Rose', color: '#e11d48' },
];

const Profile: React.FC<{ profile: UserProfile, setProfile: any }> = ({ profile, setProfile }) => {
  const [form, setForm] = useState({ ...profile });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-[12px] font-bold">Profile Settings</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 flex flex-col items-center">
          <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-4"><User size={40}/></div>
          <h2 className="text-xl font-bold">{profile.name}</h2>
          <p className="text-slate-400">{profile.email}</p>
        </div>
        <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 space-y-6">
          <h3 className="text-lg font-bold flex items-center gap-2"><Palette className="text-indigo-500" size={20}/> Appearance</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {THEMES.map(t => (
              <button key={t.name} onClick={() => setProfile({...profile, themeColor: t.color})} className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${profile.themeColor === t.color ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100'}`}>
                <div className="w-8 h-8 rounded-full shadow-sm flex items-center justify-center" style={{backgroundColor: t.color}}>{profile.themeColor === t.color && <Check size={16} className="text-white"/>}</div>
                <span className="text-xs font-bold">{t.name}</span>
              </button>
            ))}
          </div>
          <hr className="border-slate-50"/>
          <button onClick={() => setProfile({...profile, ...form})} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2"><Save size={20}/> Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
