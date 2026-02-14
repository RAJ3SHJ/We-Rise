
import React from 'react';
import { LearningPath, CourseStatus, UserProfile } from '../types';
import { CheckCircle2, Circle, Clock, ExternalLink, Calendar, ChevronRight } from 'lucide-react';

interface RoadmapProps {
  path: LearningPath | null;
  profile: UserProfile | null;
  setPath: (p: LearningPath) => void;
}

const LearningRoadmap: React.FC<RoadmapProps> = ({ path, setPath, profile }) => {
  if (!path) return <div className="p-12 text-center text-slate-400">Please complete an assessment first.</div>;

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
    <div className="space-y-8 max-w-5xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{path.title}</h1>
          <p className="text-slate-500 mt-2">A curriculum designed specifically for a former <span className="text-indigo-600 font-semibold">{profile?.background}</span> professional.</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
           <div>
             <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Total Mastery</p>
             <p className="text-2xl font-bold text-indigo-600">{path.overallProgress}%</p>
           </div>
           <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-indigo-500 relative flex items-center justify-center">
              <span className="text-[10px] font-bold">{path.overallProgress}%</span>
           </div>
        </div>
      </header>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-slate-200 hidden md:block" />

        <div className="space-y-12">
          {path.courses.map((course, idx) => (
            <div key={course.id} className="relative flex flex-col md:flex-row gap-8 items-start">
              {/* Dot */}
              <div className={`hidden md:flex absolute left-[32px] -translate-x-1/2 w-8 h-8 rounded-full border-4 border-slate-50 items-center justify-center z-10 transition-colors duration-500 ${
                course.status === CourseStatus.COMPLETED ? 'bg-emerald-500' : 
                course.status === CourseStatus.IN_PROGRESS ? 'bg-indigo-500' : 'bg-slate-300'
              }`}>
                {course.status === CourseStatus.COMPLETED ? <CheckCircle2 size={16} className="text-white" /> : <div className="w-2 h-2 rounded-full bg-white" />}
              </div>

              <div className="md:ml-16 w-full group">
                <div className={`bg-white p-6 rounded-2xl shadow-sm border transition-all duration-300 ${
                    course.status === CourseStatus.COMPLETED ? 'border-emerald-100 opacity-80' : 
                    course.status === CourseStatus.IN_PROGRESS ? 'border-indigo-200 shadow-indigo-100 scale-[1.02]' : 'border-slate-100'
                }`}>
                  <div className="flex flex-col lg:flex-row justify-between gap-6">
                    <div className="space-y-3 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                           <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                             course.level === 'Basic' ? 'bg-emerald-50 text-emerald-600' :
                             course.level === 'Intermediate' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'
                           }`}>{course.level}</span>
                           <span className="text-xs text-slate-400 flex items-center gap-1"><Clock size={12} /> {course.durationHours}h estimated</span>
                           <span className="text-xs text-slate-400 flex items-center gap-1"><Calendar size={12} /> Week {idx + 1}</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">{course.title}</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">{course.description}</p>
                        <div className="flex items-center gap-4 pt-2">
                           <button className="text-indigo-600 text-sm font-semibold flex items-center gap-1 hover:underline">
                              Start Lesson <ExternalLink size={14} />
                           </button>
                        </div>
                    </div>

                    <div className="flex flex-row lg:flex-col gap-3 justify-between items-center lg:items-end">
                       <select 
                         value={course.status}
                         onChange={(e) => updateCourseStatus(course.id, e.target.value as CourseStatus)}
                         className={`text-sm font-semibold p-2 rounded-lg outline-none cursor-pointer border ${
                           course.status === CourseStatus.COMPLETED ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                           course.status === CourseStatus.IN_PROGRESS ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-slate-50 text-slate-600 border-slate-100'
                         }`}
                       >
                         <option value={CourseStatus.NOT_STARTED}>Not Started</option>
                         <option value={CourseStatus.IN_PROGRESS}>In Progress</option>
                         <option value={CourseStatus.COMPLETED}>Completed</option>
                       </select>
                       <p className="text-[10px] text-slate-400 font-medium">Source: {course.source}</p>
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
