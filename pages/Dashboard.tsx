
import React from 'react';
import { UserProfile, LearningPath, CourseStatus } from '../types';
import { Clock, TrendingUp, Trophy, ArrowRight, CheckCircle2, Sparkles, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardProps {
  profile: UserProfile | null;
  path: LearningPath | null;
  notifications: string[];
}

const Dashboard: React.FC<DashboardProps> = ({ profile, path, notifications }) => {
  const completedCourses = path?.courses.filter(c => c.status === CourseStatus.COMPLETED).length || 0;
  const totalCourses = path?.courses.length || 0;
  const progressPercent = totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Rise High, {profile?.name}!</h1>
          <p className="text-slate-500 font-medium">
            {path 
              ? `Your personalized path to Product Owner is active.` 
              : "Welcome to We Rise. Start by building your tailored roadmap."}
          </p>
        </div>
        <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                <Trophy className="text-amber-500" size={24} />
            </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={<Clock className="text-blue-500" />} 
          label="Commitment" 
          value={`${profile?.availabilityHoursPerWeek || 0}h`} 
          subValue="Hours per week"
        />
        <StatCard 
          icon={<TrendingUp className="text-emerald-500" />} 
          label="Progress" 
          value={`${progressPercent}%`} 
          subValue={`${completedCourses} of ${totalCourses} units`}
        />
        <StatCard 
          icon={<Trophy className="text-amber-500" />} 
          label="Level" 
          value="Rising PO" 
          subValue="Building fundamentals"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/80 backdrop-blur-md p-8 rounded-[3rem] shadow-sm border border-white/50 min-h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Learning Track</h3>
              {path && (
                <Link to="/roadmap" className="px-5 py-2.5 bg-indigo-50 text-indigo-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-colors flex items-center gap-2">
                  View Roadmap <ArrowRight size={14} />
                </Link>
              )}
            </div>
            
            {path ? (
              <div className="space-y-4">
                {path.courses.slice(0, 5).map(course => (
                  <div key={course.id} className="flex items-center gap-5 p-6 rounded-[2rem] border border-slate-50 bg-white/50 hover:bg-white transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-500/5 group">
                    <div className={`w-1.5 h-12 rounded-full transition-all group-hover:h-14 ${
                      course.status === CourseStatus.COMPLETED ? 'bg-emerald-500' : 
                      course.status === CourseStatus.IN_PROGRESS ? 'bg-indigo-500' : 'bg-slate-200'
                    }`} />
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{course.title}</h4>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">{course.source} • {course.level}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-[9px] uppercase font-black px-4 py-1.5 rounded-xl border ${
                        course.status === CourseStatus.COMPLETED ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                        course.status === CourseStatus.IN_PROGRESS ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                      }`}>
                        {course.status}
                      </span>
                    </div>
                  </div>
                ))}
                {path.courses.length > 5 && (
                  <Link to="/roadmap" className="block text-center py-4 text-slate-400 font-bold hover:text-indigo-600 transition-colors text-xs uppercase tracking-widest">
                    + {path.courses.length - 5} more courses in roadmap
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-6">
                 <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center animate-bounce shadow-xl shadow-indigo-100">
                    <Sparkles size={40} />
                 </div>
                 <div>
                    <h4 className="text-xl font-black text-slate-800">Your Path Awaits</h4>
                    <p className="text-slate-400 font-medium max-w-xs mx-auto mt-2 italic">Catalog your skills or take an evaluation to generate your smart curriculum.</p>
                 </div>
                 <Link to="/assessment" className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-100 hover:scale-105 transition-all">
                   Go to Assessments
                 </Link>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-700 text-white p-8 rounded-[3rem] shadow-2xl shadow-indigo-900/20 relative overflow-hidden group border border-indigo-500/30">
            <div className="relative z-10">
              <h3 className="text-xl font-black mb-3 flex items-center gap-2">
                <Sparkles size={20} className="text-indigo-300" />
                Daily Wisdom
              </h3>
              <p className="text-indigo-100 text-sm italic font-medium leading-relaxed">
                "Product Ownership is about the 'Why' and the 'What'. Let the team handle the 'How'. Empower them with clear vision and prioritized value."
              </p>
              <div className="mt-8 pt-6 border-t border-indigo-600/50">
                <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">Focus Area</p>
                <p className="font-bold text-sm">Vision & Strategy</p>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000" />
          </div>

          <div className="bg-white/80 backdrop-blur-md p-8 rounded-[3rem] shadow-sm border border-white/50">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                  <Bell size={20} className="text-indigo-600" />
                </div>
                <h3 className="font-black text-slate-800 tracking-tight">Rising Alerts</h3>
             </div>
             <div className="space-y-5">
                {notifications.length > 0 ? notifications.map((n, i) => (
                  <div key={i} className="flex gap-4 items-start pb-5 border-b border-slate-50 last:border-0 last:pb-0">
                    <div className="w-2 h-2 mt-2 rounded-full bg-indigo-500 flex-shrink-0 animate-pulse" />
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">{n}</p>
                  </div>
                )) : (
                  <p className="text-xs text-slate-400 italic text-center py-4">No new notifications</p>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: string, subValue: string }> = ({ icon, label, value, subValue }) => (
  <div className="bg-white/70 backdrop-blur-md p-8 rounded-[2.5rem] shadow-sm border border-white/50 flex items-center gap-6 group hover:border-indigo-100 transition-all hover:shadow-xl hover:shadow-indigo-500/5">
    <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all group-hover:rotate-3 group-hover:scale-110 shadow-sm">
      {icon}
    </div>
    <div>
      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{label}</p>
      <h4 className="text-3xl font-black text-slate-800 tracking-tighter group-hover:text-indigo-600 transition-colors">{value}</h4>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest opacity-60">{subValue}</p>
    </div>
  </div>
);

export default Dashboard;
