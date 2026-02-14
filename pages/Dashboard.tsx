
import React, { useState } from 'react';
import { UserProfile, LearningPath, CourseStatus } from '../types';
import { Clock, TrendingUp, Trophy, ArrowRight, Bell, FileText, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface DashboardProps {
  profile: UserProfile | null;
  path: LearningPath | null;
  notifications: string[];
}

const Dashboard: React.FC<DashboardProps> = ({ profile, path, notifications }) => {
  const [hasSkipped, setHasSkipped] = useState(false);
  const navigate = useNavigate();

  // Empty State: User has no profile details or no learning path yet
  if ((!profile || !path) && !hasSkipped) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center max-w-4xl mx-auto space-y-12 animate-in fade-in zoom-in-95 duration-500">
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-[2rem] text-indigo-600 shadow-xl shadow-indigo-50">
            <Sparkles size={40} />
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Welcome to PO-Path</h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Your journey to becoming a high-impact Product Owner starts here. 
            Choose how you'd like to begin your transition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
          {/* Skill Assessment Card */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 transition-all group flex flex-col text-left">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Skill Assessment</h3>
            <p className="text-slate-500 text-sm mb-8 flex-1">
              Generate a personalized learning roadmap based on your current background and professional goals.
            </p>
            <Link 
              to="/assessment" 
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              Start Skill Assessment <ChevronRight size={18} />
            </Link>
          </div>

          {/* Conduct Assessment Card */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 transition-all group flex flex-col text-left">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <FileText size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Conduct Assessment</h3>
            <p className="text-slate-500 text-sm mb-8 flex-1">
              Skip the roadmap and jump straight into a knowledge exam to evaluate your PO fundamentals.
            </p>
            <button 
              onClick={() => navigate('/evaluation')}
              className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
            >
              Start Conduct Assessment <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <button 
          onClick={() => setHasSkipped(true)}
          className="text-slate-400 font-bold hover:text-slate-600 transition-colors uppercase text-xs tracking-[0.2em] flex items-center gap-2"
        >
          Skip for now <ArrowRight size={14} />
        </button>
      </div>
    );
  }

  // Basic Dashboard if skipped or path exists
  const completedCourses = path?.courses.filter(c => c.status === CourseStatus.COMPLETED).length || 0;
  const totalCourses = path?.courses.length || 0;
  const progressPercent = totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome back, {profile?.name}!</h1>
          <p className="text-slate-500">
            {path 
              ? `You're transitioning from ${profile?.background} to Product Owner.` 
              : "Explore the platform and start an assessment when you're ready."}
          </p>
        </div>
        <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-400">Next milestone in 3 days</span>
            <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                <Trophy className="text-amber-500" size={20} />
            </div>
        </div>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={<Clock className="text-blue-500" />} 
          label="Weekly Target" 
          value={`${profile?.availabilityHoursPerWeek || 0}h`} 
          subValue="Commitment maintained"
        />
        <StatCard 
          icon={<TrendingUp className="text-emerald-500" />} 
          label="Path Progress" 
          value={`${progressPercent}%`} 
          subValue={path ? `${completedCourses} of ${totalCourses} courses completed` : "No roadmap active"}
        />
        <StatCard 
          icon={<Trophy className="text-amber-500" />} 
          label="Skill Level" 
          value="Junior PO" 
          subValue="Approaching Intermediate"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 min-h-[300px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Current Courses</h3>
              {path && (
                <Link to="/roadmap" className="text-sm text-indigo-600 font-semibold hover:underline flex items-center gap-1">
                  View Roadmap <ArrowRight size={14} />
                </Link>
              )}
            </div>
            
            {path ? (
              <div className="space-y-4">
                {path.courses.slice(0, 3).map(course => (
                  <div key={course.id} className="flex items-center gap-4 p-4 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors">
                    <div className={`w-2 h-12 rounded-full ${
                      course.status === CourseStatus.COMPLETED ? 'bg-emerald-500' : 
                      course.status === CourseStatus.IN_PROGRESS ? 'bg-indigo-500' : 'bg-slate-200'
                    }`} />
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800">{course.title}</h4>
                      <p className="text-xs text-slate-400">{course.source} • {course.durationHours}h • {course.level}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${
                        course.status === CourseStatus.COMPLETED ? 'bg-emerald-50 text-emerald-600' : 
                        course.status === CourseStatus.IN_PROGRESS ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {course.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
                 <div className="p-4 bg-slate-50 rounded-full text-slate-300">
                    <Sparkles size={32} />
                 </div>
                 <p className="text-slate-400 text-sm font-medium">No courses in your current path yet.</p>
                 <Link to="/assessment" className="text-indigo-600 text-sm font-bold hover:underline">Generate Roadmap now →</Link>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-700 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2">Mentor Quick Tip</h3>
              <p className="text-indigo-100 text-sm italic">"As a PO, focus on prioritizing based on value, not just feature requests. User stories are about outcomes!"</p>
              <button className="mt-4 text-xs font-bold uppercase tracking-wider bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg transition-colors">
                Read More
              </button>
            </div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
             <div className="flex items-center gap-2 mb-4">
                <Bell size={18} className="text-indigo-600" />
                <h3 className="font-bold">Recent Alerts</h3>
             </div>
             <div className="space-y-4">
                {notifications.map((n, i) => (
                  <div key={i} className="flex gap-3 text-sm border-b border-slate-50 pb-3 last:border-0">
                    <div className="w-1 h-1 mt-2 rounded-full bg-indigo-500 flex-shrink-0" />
                    <p className="text-slate-600">{n}</p>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: string, subValue: string }> = ({ icon, label, value, subValue }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5">
    <div className="p-3 bg-slate-50 rounded-xl">
      {icon}
    </div>
    <div>
      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{label}</p>
      <h4 className="text-2xl font-bold text-slate-800">{value}</h4>
      <p className="text-[10px] text-slate-400 mt-0.5">{subValue}</p>
    </div>
  </div>
);

export default Dashboard;
