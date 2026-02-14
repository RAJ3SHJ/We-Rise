
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Route as RoadmapIcon, 
  Users, 
  UserCircle, 
  Bell,
  CheckCircle2,
  Plus,
  LogOut,
  Settings,
  Shield
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

const App: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('po_profile');
    return saved ? JSON.parse(saved) : null;
  });

  const [learningPath, setLearningPath] = useState<LearningPath | null>(() => {
    const saved = localStorage.getItem('po_path');
    return saved ? JSON.parse(saved) : null;
  });

  const [notifications, setNotifications] = useState<string[]>([
    "Welcome to PO-Path! Start your assessment to get a personalized roadmap.",
    "Reminder: Upcoming deadline for 'Agile Fundamentals' tomorrow."
  ]);

  useEffect(() => {
    if (userProfile) localStorage.setItem('po_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    if (learningPath) localStorage.setItem('po_path', JSON.stringify(learningPath));
  }, [learningPath]);

  const addNotification = (msg: string) => {
    setNotifications(prev => [msg, ...prev].slice(0, 5));
  };

  const handleSignIn = (userData: UserProfile) => {
    setUserProfile(userData);
  };

  const handleSignOut = () => {
    if (userProfile) {
        localStorage.setItem(`profile_${userProfile.email}`, JSON.stringify(userProfile));
    }
    setUserProfile(null);
    setLearningPath(null);
    localStorage.removeItem('po_profile');
    localStorage.removeItem('po_path');
  };

  if (!userProfile) {
    return <SignIn onSignIn={handleSignIn} />;
  }

  const isAdmin = userProfile.role === 'admin';

  return (
    <Router>
      <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
        {/* Mobile Navigation Header */}
        <header className="md:hidden bg-indigo-700 text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
          <h1 className="font-bold text-xl tracking-tight">PO-Path</h1>
          <button className="relative">
            <Bell size={24} />
            {notifications.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 text-[10px] flex items-center justify-center">!</span>}
          </button>
        </header>

        {/* Sidebar Navigation */}
        <nav className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0 p-6">
          <div className="mb-10">
            <h1 className="text-2xl font-bold text-indigo-700 flex items-center gap-2">
              <GraduationCap className="text-indigo-600" />
              PO-Path
            </h1>
            <p className="text-xs text-slate-400 mt-1 uppercase font-semibold tracking-wider">Product Owner Accelerator</p>
          </div>

          <div className="space-y-1 flex-1">
            <SidebarLink to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
            <SidebarLink to="/assessment" icon={<CheckCircle2 size={20} />} label="Skill Assessment" />
            <SidebarLink to="/roadmap" icon={<RoadmapIcon size={20} />} label="My Roadmap" />
            <SidebarLink to="/courses" icon={<Plus size={20} />} label="Course Library" />
            <SidebarLink to="/mentors" icon={<Users size={20} />} label="Mentors" />
            
            {isAdmin && (
              <div className="pt-4 mt-4 border-t border-slate-100">
                <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Administration</p>
                <SidebarLink to="/admin/questions" icon={<Settings size={20} />} label="Manage Exams" />
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-slate-100 space-y-1">
            <SidebarLink to="/profile" icon={<UserCircle size={20} />} label="Profile" />
            <button 
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-red-500 hover:bg-red-50 font-medium"
            >
                <LogOut size={20} />
                <span>Sign Out</span>
            </button>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard profile={userProfile} path={learningPath} notifications={notifications} />} />
            <Route path="/assessment/*" element={<Assessment profile={userProfile} setProfile={setUserProfile} setPath={setLearningPath} addNotify={addNotification} />} />
            <Route path="/evaluation" element={<Evaluation profile={userProfile} />} />
            <Route path="/roadmap" element={<LearningRoadmap path={learningPath} setPath={setLearningPath} profile={userProfile} />} />
            <Route path="/courses" element={<CourseLibrary path={learningPath} setPath={setLearningPath} />} />
            <Route path="/mentors" element={<Mentors profile={userProfile} />} />
            <Route path="/profile" element={<Profile profile={userProfile} setProfile={setUserProfile} />} />
            
            {/* Admin Routes */}
            {isAdmin && <Route path="/admin/questions" element={<AdminQuestions />} />}
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Mobile Nav Bottom Bar */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-3 z-50 shadow-2xl">
          <MobileLink to="/" icon={<LayoutDashboard size={24} />} />
          <MobileLink to="/assessment" icon={<CheckCircle2 size={24} />} />
          <MobileLink to="/roadmap" icon={<RoadmapIcon size={24} />} />
          <MobileLink to="/mentors" icon={<Users size={24} />} />
          <MobileLink to="/profile" icon={<UserCircle size={24} />} />
        </nav>
      </div>
    </Router>
  );
};

const SidebarLink: React.FC<{ to: string, icon: React.ReactNode, label: string }> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        isActive 
        ? 'bg-indigo-50 text-indigo-700 font-semibold' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

const MobileLink: React.FC<{ to: string, icon: React.ReactNode }> = ({ to, icon }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
  return (
    <Link to={to} className={`p-2 rounded-full ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
      {icon}
    </Link>
  );
};

export default App;
