
import React, { useState, useEffect } from 'react';
import { Mentor } from '../types';
import { Plus, Trash2, Save, X, UserCircle, Briefcase, Award, Image as ImageIcon, Sparkles } from 'lucide-react';

const DEFAULT_MENTORS: Mentor[] = [
  { id: '1', name: 'Priya Sharma', role: 'Principal PO @ FinTech Hub', expertise: ['Stakeholder Management', 'Visioning'], avatar: 'https://i.pravatar.cc/150?u=priya' },
  { id: '2', name: 'Arjun Mehta', role: 'Senior PM @ SaaS Collective', expertise: ['Technical Backlogs', 'Jira Mastery'], avatar: 'https://i.pravatar.cc/150?u=arjun' },
  { id: '3', name: 'Ananya Iyer', role: 'Product Strategy Lead', expertise: ['Market Analysis', 'Growth Hacking'], avatar: 'https://i.pravatar.cc/150?u=ananya' }
];

const AdminMentors: React.FC = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [expertiseInput, setExpertiseInput] = useState('');
  const [form, setForm] = useState<Partial<Mentor>>({
    name: '',
    role: '',
    expertise: [],
    avatar: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('we_rise_mentors');
    if (saved) {
      setMentors(JSON.parse(saved));
    } else {
      setMentors(DEFAULT_MENTORS);
      localStorage.setItem('we_rise_mentors', JSON.stringify(DEFAULT_MENTORS));
    }
  }, []);

  const saveMentors = (data: Mentor[]) => {
    setMentors(data);
    localStorage.setItem('we_rise_mentors', JSON.stringify(data));
  };

  const handleAddExpertise = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && expertiseInput.trim()) {
      e.preventDefault();
      if (!form.expertise?.includes(expertiseInput.trim())) {
        setForm({ ...form, expertise: [...(form.expertise || []), expertiseInput.trim()] });
      }
      setExpertiseInput('');
    }
  };

  const removeExpertise = (tag: string) => {
    setForm({ ...form, expertise: form.expertise?.filter(t => t !== tag) });
  };

  const handleCreate = () => {
    if (!form.name || !form.role || !form.avatar) {
      alert("Name, Role, and Avatar URL are mandatory.");
      return;
    }

    const newMentor: Mentor = {
      id: Date.now().toString(),
      name: form.name,
      role: form.role,
      expertise: form.expertise || [],
      avatar: form.avatar
    };

    saveMentors([...mentors, newMentor]);
    setIsAdding(false);
    setForm({ name: '', role: '', expertise: [], avatar: '' });
  };

  const deleteMentor = (id: string) => {
    if (window.confirm("Are you sure you want to remove this mentor?")) {
      saveMentors(mentors.filter(m => m.id !== id));
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">Mentor Management</h1>
          <p className="text-slate-500 font-medium text-lg mt-2 italic">Curate the panel of Indian industry experts guiding our students.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)} 
          className="px-10 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-indigo-100 flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus size={20}/> Onboard New Mentor
        </button>
      </header>

      {isAdding && (
        <div className="bg-white p-12 rounded-[3.5rem] border border-indigo-100 shadow-[0_32px_64px_-12px_rgba(79,70,229,0.15)] space-y-10 animate-in zoom-in-95">
          <div className="flex justify-between items-center">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center">
                  <UserCircle size={24} />
                </div>
                <h2 className="text-3xl font-black text-slate-800">New Mentor Profile</h2>
             </div>
             <button onClick={()=>setIsAdding(false)} className="p-3 hover:bg-slate-50 rounded-full transition-colors text-slate-300 hover:text-red-500"><X size={28}/></button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name (Indian)</label>
              <div className="relative">
                <UserCircle className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input className="w-full pl-14 pr-6 py-5 border border-slate-100 rounded-2xl bg-slate-50 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all font-bold" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} placeholder="e.g. Rahul Verma"/>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Professional Role</label>
              <div className="relative">
                <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input className="w-full pl-14 pr-6 py-5 border border-slate-100 rounded-2xl bg-slate-50 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all font-bold" value={form.role} onChange={e=>setForm({...form, role: e.target.value})} placeholder="e.g. Senior PO @ TechMahindra"/>
              </div>
            </div>
            <div className="space-y-3 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Avatar Image URL</label>
              <div className="relative">
                <ImageIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input className="w-full pl-14 pr-6 py-5 border border-slate-100 rounded-2xl bg-slate-50 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all font-bold" value={form.avatar} onChange={e=>setForm({...form, avatar: e.target.value})} placeholder="https://i.pravatar.cc/150?u=unique-id"/>
              </div>
            </div>
            <div className="space-y-3 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Expertise Areas (Press Enter to add)</label>
              <div className="relative">
                <Award className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input className="w-full pl-14 pr-6 py-5 border border-slate-100 rounded-2xl bg-slate-50 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all font-bold" value={expertiseInput} onChange={e=>setExpertiseInput(e.target.value)} onKeyDown={handleAddExpertise} placeholder="e.g. User Stories, Agile Coaching..."/>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {form.expertise?.map(tag => (
                  <span key={tag} className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
                    {tag} <button onClick={()=>removeExpertise(tag)}><X size={12}/></button>
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <button onClick={handleCreate} className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl shadow-indigo-100 flex items-center justify-center gap-3 hover:scale-101 active:scale-0.99 transition-all"><Save size={24}/> Save Mentor Profile</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
        {mentors.map((m) => (
          <div key={m.id} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group relative flex flex-col items-center text-center">
             <button onClick={() => deleteMentor(m.id)} className="absolute top-6 right-6 text-slate-200 hover:text-red-500 transition-all p-3 hover:bg-red-50 rounded-2xl"><Trash2 size={24}/></button>
             
             <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden mb-6 border-4 border-slate-50 shadow-xl group-hover:scale-110 transition-transform duration-500">
                <img src={m.avatar} alt={m.name} className="w-full h-full object-cover" />
             </div>
             
             <h3 className="text-2xl font-black text-slate-800 tracking-tight">{m.name}</h3>
             <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-6">{m.role}</p>
             
             <div className="flex flex-wrap justify-center gap-2 mt-auto">
                {m.expertise.map(exp => (
                  <span key={exp} className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[8px] font-black uppercase rounded-lg">
                    {exp}
                  </span>
                ))}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminMentors;
