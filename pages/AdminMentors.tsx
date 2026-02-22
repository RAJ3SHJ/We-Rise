
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mentor } from '../types';
import { Plus, Trash2, Save, X, UserCircle, ArrowLeft, Briefcase, Award } from 'lucide-react';

const AdminMentors: React.FC = () => {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<Partial<Mentor>>({
    name: '',
    role: '',
    expertise: [],
    avatar: ''
  });
  const [expertiseInput, setExpertiseInput] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('we_rise_mentors');
    if (saved) {
      setMentors(JSON.parse(saved));
    } else {
      // Seed with some default mentors if none exist
      const defaultMentors: Mentor[] = [
        { id: '1', name: 'Sarah Chen', role: 'Senior Product Manager', expertise: ['Agile', 'Product Strategy'], avatar: 'https://picsum.photos/seed/sarah/200' },
        { id: '2', name: 'Marcus Thorne', role: 'Technical Product Owner', expertise: ['System Design', 'Backlog Management'], avatar: 'https://picsum.photos/seed/marcus/200' }
      ];
      setMentors(defaultMentors);
      localStorage.setItem('we_rise_mentors', JSON.stringify(defaultMentors));
    }
  }, []);

  const saveMentors = (data: Mentor[]) => {
    setMentors(data);
    localStorage.setItem('we_rise_mentors', JSON.stringify(data));
  };

  const handleCreate = () => {
    if (!form.name || !form.role) {
      alert("Name and Role are mandatory.");
      return;
    }
    const newMentor: Mentor = {
      id: Date.now().toString(),
      name: form.name!,
      role: form.role!,
      expertise: form.expertise || [],
      avatar: form.avatar || `https://picsum.photos/seed/${Date.now()}/200`
    };
    saveMentors([...mentors, newMentor]);
    setIsAdding(false);
    setForm({ name: '', role: '', expertise: [], avatar: '' });
    setExpertiseInput('');
  };

  const deleteMentor = (id: string) => {
    if (window.confirm("Are you sure you want to remove this mentor?")) {
      saveMentors(mentors.filter(m => m.id !== id));
    }
  };

  const addExpertise = () => {
    if (expertiseInput.trim() && !form.expertise?.includes(expertiseInput.trim())) {
      setForm({ ...form, expertise: [...(form.expertise || []), expertiseInput.trim()] });
      setExpertiseInput('');
    }
  };

  const removeExpertise = (skill: string) => {
    setForm({ ...form, expertise: form.expertise?.filter(s => s !== skill) });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700">
      <button 
        onClick={() => navigate('/admin')}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors mb-4"
      >
        <ArrowLeft size={20} /> Back to Admin Hub
      </button>

      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">Mentor Management</h1>
          <p className="text-slate-500 font-medium text-lg mt-2 italic">Add and manage industry experts who guide our students.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)} 
          className="px-10 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-indigo-100 flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus size={20}/> New Mentor
        </button>
      </header>

      {isAdding && (
        <div className="bg-white p-12 rounded-[3.5rem] border border-indigo-100 shadow-[0_32px_64px_-12px_rgba(79,70,229,0.15)] space-y-10 animate-in zoom-in-95">
          <div className="flex justify-between items-center">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center">
                  <UserCircle size={24} />
                </div>
                <h2 className="text-3xl font-black text-slate-800">Add New Mentor</h2>
             </div>
             <button onClick={()=>setIsAdding(false)} className="p-3 hover:bg-slate-50 rounded-full transition-colors text-slate-300 hover:text-red-500"><X size={28}/></button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
              <input className="w-full p-5 border border-slate-100 rounded-2xl bg-slate-50 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all font-bold" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} placeholder="e.g. Jane Doe"/>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Current Role</label>
              <div className="relative">
                <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input className="w-full pl-14 pr-6 py-5 border border-slate-100 rounded-2xl bg-slate-50 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all font-bold" value={form.role} onChange={e=>setForm({...form, role: e.target.value})} placeholder="e.g. Senior Product Manager"/>
              </div>
            </div>
            <div className="space-y-3 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Expertise / Skills</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Award className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  <input 
                    className="w-full pl-14 pr-6 py-5 border border-slate-100 rounded-2xl bg-slate-50 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all font-bold" 
                    value={expertiseInput} 
                    onChange={e=>setExpertiseInput(e.target.value)} 
                    onKeyPress={e => e.key === 'Enter' && addExpertise()}
                    placeholder="Add a skill (e.g. Agile, UX Design) and press Enter"
                  />
                </div>
                <button onClick={addExpertise} className="px-8 bg-slate-900 text-white rounded-2xl font-bold">Add</button>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {form.expertise?.map(skill => (
                  <span key={skill} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    {skill}
                    <button onClick={() => removeExpertise(skill)} className="hover:text-red-500"><X size={14}/></button>
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-3 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Avatar URL (Optional)</label>
              <input className="w-full p-5 border border-slate-100 rounded-2xl bg-slate-50 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all font-bold" value={form.avatar} onChange={e=>setForm({...form, avatar: e.target.value})} placeholder="https://picsum.photos/..."/>
            </div>
          </div>

          <button onClick={handleCreate} className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl shadow-indigo-100 flex items-center justify-center gap-3 hover:scale-101 active:scale-0.99 transition-all"><Save size={24}/> Save Mentor Profile</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
        {mentors.length === 0 ? (
          <div className="col-span-full py-32 text-center bg-white/40 backdrop-blur-sm rounded-[4rem] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center space-y-6">
             <div className="w-24 h-24 bg-slate-100 text-slate-300 rounded-[2rem] flex items-center justify-center">
                <UserCircle size={48}/>
             </div>
             <div>
                <p className="text-2xl font-black text-slate-400">No Mentors Found</p>
                <p className="text-slate-400 font-medium max-w-sm mt-2">Start adding industry experts to build your mentorship network.</p>
             </div>
          </div>
        ) : (
          mentors.map((m) => (
            <div key={m.id} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-900/5 hover:-translate-y-2 transition-all group relative overflow-hidden flex flex-col">
               <div className="flex justify-between items-start mb-8">
                  <img 
                    src={m.avatar} 
                    alt={m.name} 
                    className="w-20 h-20 rounded-[1.5rem] object-cover border-4 border-slate-50"
                    referrerPolicy="no-referrer"
                  />
                  <button onClick={() => deleteMentor(m.id)} className="text-slate-200 hover:text-red-500 transition-all p-3 hover:bg-red-50 rounded-2xl"><Trash2 size={24}/></button>
               </div>
               <div className="flex-1">
                 <h3 className="text-2xl font-black text-slate-800 mb-1 leading-tight group-hover:text-indigo-600 transition-colors">{m.name}</h3>
                 <p className="text-indigo-600 font-bold text-sm mb-6">{m.role}</p>
                 <div className="flex flex-wrap gap-2">
                   {m.expertise.map(skill => (
                     <span key={skill} className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-slate-100 text-slate-500 rounded-lg">{skill}</span>
                   ))}
                 </div>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminMentors;
