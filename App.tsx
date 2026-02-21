
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, GraduationCap, Route as RoadmapIcon, Users, UserCircle, 
  Bell, CheckCircle2, Plus, LogOut, Settings, Library, Shield, Layout, ClipboardList
} from 'lucide-react';
import { UserProfile, LearningPath } from './types';
import Dashboard from './pages/Dashboard';
import Assessment from './pages/Assessment';
import LearningRoadmap from './pages/LearningRoadmap';
import Mentors from './pages/Mentors';
import CourseLibrary from './pages/CourseLibrary';
import SignIn from './pages/SignIn';
import Profile from './pages/Profile';
import Evaluation from './pages/Evaluation';
import AdminQuestions from './pages/AdminQuestions';
import AdminCourses from './pages/AdminCourses';
import AdminHub from './pages/AdminHub';
import AdminMentors from './pages/AdminMentors';

const App: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('po_profile');
    return saved ? JSON.parse(saved) : null;
  });

  const [learningPath, setLearningPath] = useState<LearningPath | null>(() => {
    const saved = localStorage.getItem('po_path');
    return saved ? JSON.parse(saved) : null;
  });

  const [notifications] = useState<string[]>(["Welcome to We Rise!"]);

  const handleSignOut = () => {
    setUserProfile(null);
    setLearningPath(null);
    localStorage.removeItem('po_profile');
    localStorage.removeItem('po_path');
  };

  useEffect(() => {
    const color = userProfile?.themeColor || '#4f46e5';
    const themeStyles = `
      :root { 
        --theme-primary: ${color}; 
        --theme-primary-alpha: ${color}25; 
        --theme-bg: ${color}08; 
      }
      body { 
        background-color: var(--theme-bg) !important; 
        background-image: 
          radial-gradient(at 0% 0%, ${color}12 0px, transparent 50%),
          radial-gradient(at 100% 100%, ${color}08 0px, transparent 50%);
        background-attachment: fixed;
        transition: background-color 0.5s ease;
      }
      .app-container { 
        background-color: transparent; 
        min-height: 100vh;
      }
      .text-indigo-600 { color: var(--theme-primary) !important; }
      .text-indigo-700 { color: var(--theme-primary) !important; filter: brightness(0.85); }
      .bg-indigo-600 { background-color: var(--theme-primary) !important; }
      .bg-indigo-700 { background-color: var(--theme-primary) !important; filter: brightness(0.9); }
      .bg-indigo-50 { background-color: var(--theme-primary-alpha) !important; }
      .border-indigo-600 { border-color: var(--theme-primary) !important; }
      .border-indigo-100 { border-color: var(--theme-primary-alpha) !important; }
      .accent-indigo-600 { accent-color: var(--theme-primary) !important; }
      .shadow-indigo-100 { --tw-shadow-color: var(--theme-primary-alpha) !important; }
      
      .nav-active {
        background-color: var(--theme-primary-alpha) !important;
        color: var(--theme-primary) !important;
        font-weight: 700;
      }
    `;
    let styleTag = document.getElementById('dynamic-theme');
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'dynamic-theme';
      document.head.appendChild(styleTag);
    }
    styleTag.innerHTML = themeStyles;
  }, [userProfile?.themeColor]);

  useEffect(() => {
    if (userProfile) localStorage.setItem('po_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    if (learningPath) localStorage.setItem('po_path', JSON.stringify(learningPath));
  }, [learningPath]);

  if (!userProfile) return <SignIn onSignIn={setUserProfile} />;

  const isAdmin = userProfile.role === 'admin';

  return (
    <Router>
      <div className="flex flex-col md:flex-row min-h-screen app-container text-slate-900">
        <nav className="hidden md:flex flex-col w-64 bg-white/70 backdrop-blur-xl border-r border-slate-200 h-screen sticky top-0 p-6 shadow-sm z-20">
          <div className="mb-10">
            <h1 className="text-2xl font-black text-indigo-700 flex items-center gap-2">
              <GraduationCap className="text-indigo-600" />
              We Rise
            </h1>
            <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-[0.2em]">Rise to Your Potential</p>
          </div>
          <div className="space-y-1 flex-1 overflow-y-auto custom-scrollbar">
            {isAdmin ? (
               <>
                 <SidebarLink to="/admin" icon={<Shield size={20} />} label="Admin Hub" />
                 <SidebarLink to="/admin/courses" icon={<Library size={20} />} label="Library Curation" />
                 <SidebarLink to="/admin/questions" icon={<ClipboardList size={20} />} label="Exam Management" />
                 <SidebarLink to="/admin/mentors" icon={<Users size={20} />} label="Mentor Curation" />
               </>
            ) : (
               <>
                 <SidebarLink to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
                 <SidebarLink to="/assessment" icon={<CheckCircle2 size={20} />} label="Assessments" />
                 <SidebarLink to="/roadmap" icon={<RoadmapIcon size={20} />} label="Roadmap" />
                 <SidebarLink to="/courses" icon={<Library size={20} />} label="Library" />
                 <SidebarLink to="/mentors" icon={<Users size={20} />} label="Mentors" />
               </>
            )}
          </div>
          <div className="pt-6 border-t border-slate-100 space-y-1">
            <SidebarLink to="/profile" icon={<UserCircle size={20} />} label="Profile" />
            <button 
              onClick={handleSignOut} 
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 font-medium transition-colors"
            >
              <LogOut size={20} /> Sign Out
            </button>
          </div>
        </nav>
        
        <main className="flex-1 p-6 md:p-12 overflow-y-auto">
          <Routes>
            <Route path="/" element={isAdmin ? <Navigate to="/admin" replace /> : <Dashboard profile={userProfile} path={learningPath} notifications={notifications} />} />
            <Route path="/admin" element={isAdmin ? <AdminHub /> : <Navigate to="/" replace />} />
            <Route path="/assessment/*" element={<Assessment profile={userProfile} setProfile={setUserProfile} setPath={setLearningPath} addNotify={()=>{}} />} />
            <Route path="/evaluation" element={<Evaluation profile={userProfile} />} />
            <Route path="/roadmap" element={<LearningRoadmap path={learningPath} setPath={setLearningPath} profile={userProfile} />} />
            <Route path="/courses" element={<CourseLibrary path={learningPath} setPath={setLearningPath} />} />
            <Route path="/mentors" element={<Mentors profile={userProfile} />} />
            <Route path="/profile" element={<Profile profile={userProfile} setProfile={setUserProfile} />} />
            {isAdmin && <Route path="/admin/questions" element={<AdminQuestions />} />}
            {isAdmin && <Route path="/admin/courses" element={<AdminCourses />} />}
            {isAdmin && <Route path="/admin/mentors" element={<AdminMentors />} />}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

const SidebarLink: React.FC<{ to: string, icon: React.ReactNode, label: string }> = ({ to, icon, label }) => {
  const loc = useLocation();
  const active = loc.pathname === to || (to !== '/' && loc.pathname.startsWith(to));
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${active ? 'nav-active shadow-sm' : 'text-slate-500 hover:bg-slate-100/50 hover:text-indigo-600'}`}
    >
      {icon} <span className="text-sm">{label}</span>
    </Link>
  );
};

export default App;
