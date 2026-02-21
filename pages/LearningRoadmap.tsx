
import React from 'react';
import { LearningPath, CourseStatus, UserProfile } from '../types';
import { CheckCircle2, Clock, ExternalLink, Calendar, Star } from 'lucide-react';

interface RoadmapProps {
  path: LearningPath | null;
  profile: UserProfile | null;
  setPath: (p: LearningPath) => void;
}

const LearningRoadmap: React.FC<RoadmapProps> = ({ path, setPath, profile }) => {
  if (!path) return (
    <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-4">
      <Star className="text-slate-200" size={64}/>
      <h2 className="text-2xl font-black text-slate-400">No active path.</h2>
      <p className="text-slate-400 font-medium max-w-sm">Complete your skill assessment to generate a custom rise roadmap.</p>
    </div>
  );

  const updateCourseStatus = (courseId: string, newStatus: CourseStatus) => {
    const newCourses = path.courses.map(c => 
      c.id === courseId ? { ...c, status: newStatus, progress: newStatus === CourseStatus.COMPLETED ? 100 : 0 } : c
    );
    const completedCount = newCourses.filter(c => c.status === CourseStatus.COMPLETED).length;
    setPath({
      ...path,
      courses: newCourses,
      overallProgress: Math.round((completedCount / newCourses.length) * 100),
      lastUpdated: new Date().toISOString()
    });
  };

  return (
    <div className="space-y-12 max-w-5xl mx-auto animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">{path.title}</h1>
          <p className="text-slate-500 mt-4 text-lg font-medium italic">Empowering your {profile?.background} background to rise higher.</p>
        </div>
        <div className="bg-white px-8 py-5 rounded-[2rem] shadow-xl border border-slate-50 flex items-center gap-6">
           <div>
             <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em] mb-1">Path Mastery</p>
             <p className="text-4xl font-black text-indigo-600 tracking-tighter">{path.overallProgress}%</p>
           </div>
           <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-indigo-600 flex items-center justify-center relative shadow-inner">
              <span className="text-xs font-black">{path.overallProgress}%</span>
           </div>
        </div>
      </header>

      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-1.5 bg-slate-100 hidden md:block rounded-full" />

        <div className="space-y-16">
          {path.courses.map((course, idx) => (
            <div key={course.id} className="relative flex flex-col md:flex-row gap-10 items-start group">
              <div className={`hidden md:flex absolute left-[32px] -translate-x-1/2 w-10 h-10 rounded-2xl border-4 border-white items-center justify-center z-10 transition-all duration-500 shadow-lg ${
                course.status === CourseStatus.COMPLETED ? 'bg-emerald-500 scale-110' : 
                course.status === CourseStatus.IN_PROGRESS ? 'bg-indigo-600 scale-125' : 'bg-slate-300'
              }`}>
                {course.status === CourseStatus.COMPLETED ? <CheckCircle2 size={20} className="text-white" /> : <div className="w-2.5 h-2.5 rounded-full bg-white" />}
              </div>

              <div className="md:ml-20 w-full">
                <div className={`bg-white p-10 rounded-[3rem] shadow-sm border transition-all duration-500 hover:shadow-xl ${
                    course.status === CourseStatus.COMPLETED ? 'border-emerald-100 bg-slate-50/50' : 
                    course.status === CourseStatus.IN_PROGRESS ? 'border-indigo-200 shadow-indigo-100/50 ring-4 ring-indigo-50' : 'border-slate-100'
                }`}>
                  <div className="flex flex-col lg:flex-row justify-between gap-10">
                    <div className="space-y-4 flex-1">
                        <div className="flex flex-wrap items-center gap-4">
                           <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                             course.level === 'Basic' ? 'bg-emerald-50 text-emerald-600' :
                             course.level === 'Intermediate' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'
                           }`}>{course.level}</span>
                           <span className="text-xs text-slate-400 font-bold flex items-center gap-1.5"><Clock size={16} className="text-slate-300"/> {course.durationHours}H</span>
                           <span className="text-xs text-slate-400 font-bold flex items-center gap-1.5"><Calendar size={16} className="text-slate-300"/> Stage {idx + 1}</span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">{course.title}</h3>
                        <p className="text-slate-500 font-medium leading-relaxed">{course.description}</p>
                        
                        <div className="pt-6">
                           {course.url ? (
                             <a href={course.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-100 hover:scale-105 transition-all">
                                Launch Course <ExternalLink size={16} />
                             </a>
                           ) : (
                             <button className="inline-flex items-center gap-3 px-6 py-3 bg-slate-100 text-slate-400 rounded-2xl font-black uppercase tracking-widest text-[10px] cursor-not-allowed">
                                Link Unavailable
                             </button>
                           )}
                        </div>
                    </div>

                    <div className="flex flex-row lg:flex-col gap-6 justify-between items-center lg:items-end">
                       <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-300 block text-right">Progress Status</label>
                         <select 
                           value={course.status}
                           onChange={(e) => updateCourseStatus(course.id, e.target.value as CourseStatus)}
                           className={`text-sm font-black p-4 rounded-2xl outline-none cursor-pointer border transition-all ${
                             course.status === CourseStatus.COMPLETED ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                             course.status === CourseStatus.IN_PROGRESS ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-slate-50 text-slate-600 border-slate-200'
                           }`}
                         >
                           <option value={CourseStatus.NOT_STARTED}>Not Started</option>
                           <option value={CourseStatus.IN_PROGRESS}>Learning</option>
                           <option value={CourseStatus.COMPLETED}>Mastered</option>
                         </select>
                       </div>
                       <div className="text-right">
                         <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Source</p>
                         <p className="font-bold text-slate-600">{course.source}</p>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearningRoadmap;
