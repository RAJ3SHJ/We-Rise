
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, Library, ArrowRight, ShieldCheck, Database, FileCheck } from 'lucide-react';

const AdminHub: React.FC = () => {
  const [stats, setStats] = useState({ courses: 0, questions: 0, mentors: 0 });

  useEffect(() => {
    const courses = JSON.parse(localStorage.getItem('we_rise_admin_courses') || '[]');
    const questions = JSON.parse(localStorage.getItem('po_exam_questions') || '[]');
    setStats({ courses: courses.length, questions: questions.length, mentors: 3 });
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-12 space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
          <ShieldCheck size={14} className="text-indigo-400" /> Administrative Control Center
        </div>
        <h1 className="text-[12px] font-black text-slate-900 tracking-tighter">System Curation</h1>
        <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto">Manage the knowledge base and validation assessments that power the student experience.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        <Link to="/admin/questions" className="group">
          <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm flex flex-col items-center text-center group-hover:border-indigo-200 transition-all group-hover:shadow-2xl group-hover:-translate-y-2 h-full">
            <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[2.5rem] flex items-center justify-center mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm">
              <ClipboardList size={54} />
            </div>
            <h2 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">Exam Management</h2>
            <p className="text-slate-500 mb-10 flex-1 font-medium leading-relaxed text-lg">Build and refine the written evaluation database. Current bank: <span className="text-indigo-600 font-black">{stats.questions} Questions</span>.</p>
            <div className="w-full py-6 bg-slate-50 text-slate-600 rounded-[2rem] font-black uppercase tracking-widest text-xs group-hover:bg-indigo-600 group-hover:text-white transition-all flex items-center justify-center gap-3">
              Configure Exams <ArrowRight size={20} />
            </div>
          </div>
        </Link>

        <Link to="/admin/courses" className="group">
          <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm flex flex-col items-center text-center group-hover:border-emerald-200 transition-all group-hover:shadow-2xl group-hover:-translate-y-2 h-full">
            <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-sm">
              <Library size={54} />
            </div>
            <h2 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">Library Curation</h2>
            <p className="text-slate-500 mb-10 flex-1 font-medium leading-relaxed text-lg">Manage YouTube and web links in the master curriculum. Active repository: <span className="text-emerald-600 font-black">{stats.courses} Resources</span>.</p>
            <div className="w-full py-6 bg-slate-50 text-slate-600 rounded-[2rem] font-black uppercase tracking-widest text-xs group-hover:bg-emerald-600 group-hover:text-white transition-all flex items-center justify-center gap-3">
              Crate Master Library <ArrowRight size={20} />
            </div>
          </div>
        </Link>
      </div>

      <div className="bg-slate-900 rounded-[3rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 border border-white/5">
        <div className="flex items-center gap-6">
           <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-indigo-400">
             <Database size={32} />
           </div>
           <div>
             <h4 className="text-white font-black text-xl tracking-tight">Infrastructure Health</h4>
             <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">All content syncing to smart matching engine</p>
           </div>
        </div>
        <div className="flex gap-4">
           <div className="px-6 py-4 bg-white/5 rounded-2xl text-center">
             <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Questions</p>
             <p className="text-white font-black text-2xl">{stats.questions}</p>
           </div>
           <div className="px-6 py-4 bg-white/5 rounded-2xl text-center">
             <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Courses</p>
             <p className="text-white font-black text-2xl">{stats.courses}</p>
           </div>
           <div className="px-6 py-4 bg-white/5 rounded-2xl text-center">
             <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Mentors</p>
             <p className="text-white font-black text-2xl">{stats.mentors}</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHub;
