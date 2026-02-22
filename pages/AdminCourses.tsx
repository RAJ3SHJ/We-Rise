
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Course, CourseLevel, CourseStatus } from '../types';
import { Plus, Trash2, Save, X, Globe, Youtube, ExternalLink, Link2, Info, Library, ArrowLeft } from 'lucide-react';
import { DEFAULT_COURSES } from '../src/constants';

const AdminCourses: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<Partial<Course>>({
    title: '',
    source: '',
    url: '',
    level: CourseLevel.BASIC,
    durationHours: 1,
    description: '',
    category: 'Product Owner'
  });

  useEffect(() => {
    const saved = localStorage.getItem('we_rise_admin_courses');
    if (saved) {
      setCourses(JSON.parse(saved));
    } else {
      setCourses(DEFAULT_COURSES);
      localStorage.setItem('we_rise_admin_courses', JSON.stringify(DEFAULT_COURSES));
    }
  }, []);

  const saveCourses = (data: Course[]) => {
    setCourses(data);
    localStorage.setItem('we_rise_admin_courses', JSON.stringify(data));
  };

  const handleCreate = () => {
    if (!form.title || !form.source) {
      alert("Title and Source are mandatory.");
      return;
    }
    const newCourse: Course = {
      id: Date.now().toString(),
      title: form.title!,
      source: form.source!,
      url: form.url || '',
      level: form.level!,
      category: form.category || 'Product Owner',
      durationHours: form.durationHours || 1,
      status: CourseStatus.NOT_STARTED,
      progress: 0,
      description: form.description || ''
    };
    saveCourses([...courses, newCourse]);
    setIsAdding(false);
    setForm({ title: '', source: '', url: '', level: CourseLevel.BASIC, durationHours: 1, description: '', category: 'Product Owner' });
  };

  const deleteCourse = (id: string) => {
    if (window.confirm("Are you sure you want to remove this course from the library?")) {
      saveCourses(courses.filter(q => q.id !== id));
    }
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
          <h1 className="text-[12px] font-black text-slate-900 tracking-tight">Library Curation</h1>
          <p className="text-slate-500 font-medium text-lg mt-2 italic">Add YouTube links or web courses to the master library.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)} 
          className="px-10 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-indigo-100 flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus size={20}/> New Master Course
        </button>
      </header>

      {isAdding && (
        <div className="bg-white p-12 rounded-[3.5rem] border border-indigo-100 shadow-[0_32px_64px_-12px_rgba(79,70,229,0.15)] space-y-10 animate-in zoom-in-95">
          <div className="flex justify-between items-center">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center">
                  <Library size={24} />
                </div>
                <h2 className="text-3xl font-black text-slate-800">Add to Library</h2>
             </div>
             <button onClick={()=>setIsAdding(false)} className="p-3 hover:bg-slate-50 rounded-full transition-colors text-slate-300 hover:text-red-500"><X size={28}/></button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Course Title</label>
              <input className="w-full p-5 border border-slate-100 rounded-2xl bg-slate-50 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all font-bold" value={form.title} onChange={e=>setForm({...form, title: e.target.value})} placeholder="e.g. Master Backlog Prioritization"/>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Platform Source</label>
              <div className="flex gap-2">
                <button onClick={() => setForm({...form, source: 'YouTube'})} className={`flex-1 py-4 px-2 rounded-2xl border-2 flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all ${form.source === 'YouTube' ? 'bg-red-50 border-red-500 text-red-600' : 'bg-slate-50 border-slate-50 text-slate-400 hover:border-slate-200'}`}>
                   <Youtube size={16} /> YouTube
                </button>
                <button onClick={() => setForm({...form, source: 'Web'})} className={`flex-1 py-4 px-2 rounded-2xl border-2 flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all ${form.source === 'Web' ? 'bg-indigo-50 border-indigo-500 text-indigo-600' : 'bg-slate-50 border-slate-50 text-slate-400 hover:border-slate-200'}`}>
                   <Globe size={16} /> Web
                </button>
                <input className="flex-1 p-4 border border-slate-100 rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-sm" value={form.source !== 'YouTube' && form.source !== 'Web' ? form.source : ''} onChange={e=>setForm({...form, source: e.target.value})} placeholder="Other..."/>
              </div>
            </div>
            <div className="space-y-3 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">URL (YouTube Link or Website)</label>
              <div className="relative">
                <Link2 className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input className="w-full pl-14 pr-6 py-5 border border-slate-100 rounded-2xl bg-slate-50 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all font-bold" value={form.url} onChange={e=>setForm({...form, url: e.target.value})} placeholder="https://www.youtube.com/watch?v=..."/>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8 md:col-span-2">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Course Level</label>
                <select className="w-full p-5 border border-slate-100 rounded-2xl bg-slate-50 outline-none font-bold appearance-none cursor-pointer" value={form.level} onChange={e=>setForm({...form, level: e.target.value as CourseLevel})}>
                  <option value={CourseLevel.BASIC}>Basic</option>
                  <option value={CourseLevel.INTERMEDIATE}>Intermediate</option>
                  <option value={CourseLevel.ADVANCED}>Advanced</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Est. Duration (Hrs)</label>
                <input type="number" className="w-full p-5 border border-slate-100 rounded-2xl bg-slate-50 outline-none font-bold" value={form.durationHours} onChange={e=>setForm({...form, durationHours: parseInt(e.target.value)})}/>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
              <Info size={14}/> Course Description (Used for smart matching)
            </label>
            <textarea className="w-full p-6 border border-slate-100 rounded-[2rem] bg-slate-50 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all font-bold h-40 resize-none leading-relaxed" value={form.description} onChange={e=>setForm({...form, description: e.target.value})} placeholder="What are the key takeaways of this course? Be specific for better curriculum matching..."/>
          </div>

          <button onClick={handleCreate} className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl shadow-indigo-100 flex items-center justify-center gap-3 hover:scale-101 active:scale-0.99 transition-all"><Save size={24}/> Add Course to Master Library</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
        {courses.length === 0 ? (
          <div className="col-span-full py-32 text-center bg-white/40 backdrop-blur-sm rounded-[4rem] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center space-y-6">
             <div className="w-24 h-24 bg-slate-100 text-slate-300 rounded-[2rem] flex items-center justify-center">
                <Link2 size={48}/>
             </div>
             <div>
                <p className="text-2xl font-black text-slate-400">Library is Empty</p>
                <p className="text-slate-400 font-medium max-w-sm mt-2">Start adding YouTube or web courses to power the smart roadmap generator.</p>
             </div>
          </div>
        ) : (
          courses.map((c) => (
            <div key={c.id} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-900/5 hover:-translate-y-2 transition-all group relative overflow-hidden flex flex-col">
               <div className="flex justify-between items-start mb-8">
                  <div className={`p-4 rounded-[1.5rem] transition-colors ${c.source.toLowerCase().includes('youtube') ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'}`}>
                    {c.source.toLowerCase().includes('youtube') ? <Youtube size={28}/> : <Globe size={28}/>}
                  </div>
                  <button onClick={() => deleteCourse(c.id)} className="text-slate-200 hover:text-red-500 transition-all p-3 hover:bg-red-50 rounded-2xl"><Trash2 size={24}/></button>
               </div>
               <div className="flex-1">
                 <h3 className="text-2xl font-black text-slate-800 mb-4 leading-tight group-hover:text-indigo-600 transition-colors">{c.title}</h3>
                 <p className="text-sm text-slate-500 font-medium mb-8 line-clamp-4 leading-relaxed">{c.description}</p>
               </div>
               <div className="flex items-center justify-between pt-8 border-t border-slate-50 mt-auto">
                  <div className="flex gap-2">
                    <span className="text-[9px] font-black uppercase tracking-widest px-4 py-1.5 bg-slate-100 text-slate-500 rounded-xl">{c.level}</span>
                    <span className="text-[9px] font-black uppercase tracking-widest px-4 py-1.5 bg-slate-100 text-slate-500 rounded-xl">{c.durationHours}H</span>
                  </div>
                  {c.url && (
                    <a href={c.url} target="_blank" rel="noreferrer" className="w-12 h-12 bg-slate-50 text-slate-400 hover:bg-indigo-600 hover:text-white rounded-2xl flex items-center justify-center transition-all">
                      <ExternalLink size={20}/>
                    </a>
                  )}
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminCourses;
