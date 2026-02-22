
import React, { useState, useEffect } from 'react';
import { UserProfile, Mentor, Message, Course, LearningPath, PathStatus, CourseStatus } from '../types';
import { getMentorAdvice } from '../services/geminiService';
import { 
  Send, Loader2, MessageSquare, ShieldCheck, Mail, Users, 
  User, Calendar, RefreshCw, ClipboardList, Plus, X, CheckCircle2, Search, ExternalLink
} from 'lucide-react';
import { MOCK_MENTORS } from '../src/constants';

const Mentors: React.FC<{ profile: UserProfile | null }> = ({ profile }) => {
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [assignments, setAssignments] = useState<any[]>([]);
  
  // Curation State
  const [curatingCandidate, setCuratingCandidate] = useState<any | null>(null);
  const [masterCourses, setMasterCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const isStaff = profile?.role === 'mentor' || profile?.role === 'admin';

  const loadAssignments = () => {
    const saved = localStorage.getItem('we_rise_mentor_assignments');
    if (saved) {
      const parsed = JSON.parse(saved);
      setAssignments(parsed);
    }
  };

  useEffect(() => {
    loadAssignments();
    
    const courses = JSON.parse(localStorage.getItem('we_rise_admin_courses') || '[]');
    setMasterCourses(courses);

    // Auto-select the mentor if the user is a mentor
    if (profile?.role === 'mentor' && profile.mentorId) {
      const me = MOCK_MENTORS.find(m => String(m.id) === String(profile.mentorId));
      if (me) setSelectedMentor(me);
    }
  }, [profile]);

  const handleStartCuration = (candidate: any) => {
    setCuratingCandidate(candidate);
    const allPaths = JSON.parse(localStorage.getItem('we_rise_all_paths') || '[]');
    const path = allPaths.find((p: any) => p.candidateEmail === candidate.candidateEmail);
    if (path) {
      setSelectedCourses(path.courses || []);
    } else {
      setSelectedCourses([]);
    }
  };

  const toggleCourseSelection = (course: Course) => {
    if (selectedCourses.some(c => c.id === course.id)) {
      setSelectedCourses(selectedCourses.filter(c => c.id !== course.id));
    } else {
      setSelectedCourses([...selectedCourses, { ...course, status: CourseStatus.NOT_STARTED, progress: 0 }]);
    }
  };

  const saveCuration = () => {
    if (!curatingCandidate) return;

    const allPaths = JSON.parse(localStorage.getItem('we_rise_all_paths') || '[]');
    const pathIndex = allPaths.findIndex((p: any) => p.candidateEmail === curatingCandidate.candidateEmail);
    
    if (pathIndex !== -1) {
      const updatedPath = {
        ...allPaths[pathIndex],
        courses: selectedCourses,
        status: PathStatus.ACTIVE,
        lastUpdated: new Date().toISOString()
      };
      allPaths[pathIndex] = updatedPath;
      localStorage.setItem('we_rise_all_paths', JSON.stringify(allPaths));

      // If this is the current user, update their local path too
      const currentUser = JSON.parse(localStorage.getItem('po_profile') || '{}');
      if (currentUser.email === curatingCandidate.candidateEmail) {
        localStorage.setItem('po_path', JSON.stringify(updatedPath));
      }

      // Update assignment status
      const updatedAssignments = assignments.map(a => 
        a.candidateEmail === curatingCandidate.candidateEmail ? { ...a, status: 'active' } : a
      );
      setAssignments(updatedAssignments);
      localStorage.setItem('we_rise_mentor_assignments', JSON.stringify(updatedAssignments));
      
      setCuratingCandidate(null);
      alert(`Roadmap curated successfully for ${curatingCandidate.candidateName}!`);
    }
  };

  const handleSendMessage = async () => {
    if (!input || !selectedMentor || !profile) return;
    
    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: input, timestamp: new Date().toLocaleTimeString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const reply = await getMentorAdvice(input, profile);
    const mentorMsg: Message = { id: (Date.now() + 1).toString(), sender: 'mentor', text: reply || '', timestamp: new Date().toLocaleTimeString() };
    setMessages(prev => [...prev, mentorMsg]);
    setLoading(false);
  };

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col lg:flex-row gap-6">
      {/* Mentor List */}
      <div className="w-full lg:w-80 space-y-4">
        <h2 className="text-[12px] font-black tracking-tight mb-6">Expert Mentors</h2>
        {MOCK_MENTORS.map(m => (
          <button 
            key={m.id} 
            onClick={() => setSelectedMentor(m)}
            className={`w-full p-6 rounded-[2rem] flex items-center gap-4 transition-all duration-300 border-2 text-left ${
              selectedMentor?.id === m.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-200 scale-[1.02]' : 'bg-white border-slate-50 text-slate-900 hover:border-indigo-100 hover:shadow-lg'
            }`}
          >
            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white/20">
              <img src={m.avatar} alt={m.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-black tracking-tight">{m.name}</p>
              <p className={`text-[10px] font-bold uppercase tracking-widest ${selectedMentor?.id === m.id ? 'text-indigo-100' : 'text-slate-400'}`}>{m.role}</p>
            </div>
          </button>
        ))}
        
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm mt-8">
            <ShieldCheck className="text-indigo-600 mb-3" size={28} />
            <h4 className="font-black text-slate-800 text-sm tracking-tight">Verified Mentorship</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">Our mentors are industry veterans committed to helping you transition. Questions are addressed by our internal expert curator system.</p>
        </div>
      </div>

      {/* Chat Area or Mentor Dashboard */}
      <div className="flex-1 bg-white rounded-[3.5rem] shadow-sm border border-slate-50 flex flex-col overflow-hidden">
        {selectedMentor ? (
          <>
            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white shadow-sm">
                  <img src={selectedMentor.avatar} alt={selectedMentor.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 tracking-tight text-lg">{selectedMentor.name}</h3>
                  <div className="flex gap-1.5 mt-1">
                    {selectedMentor.expertise.map(e => (
                      <span key={e} className="text-[8px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-lg uppercase font-black">{e}</span>
                    ))}
                  </div>
                </div>
              </div>
              {!isStaff && (
                <button title="Email Mentor" className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center">
                  <Mail size={20} />
                </button>
              )}
            </div>

            {isStaff ? (
              <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/10">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <User className="text-indigo-600" size={24} />
                    Linked Candidates
                  </h4>
                  <button 
                    onClick={loadAssignments}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-all shadow-sm"
                  >
                    <RefreshCw size={14} /> Refresh Data
                  </button>
                </div>
                
                <div className="grid gap-4">
                    {assignments.filter(a => String(a.mentorId) === String(selectedMentor.id)).length === 0 ? (
                      <div className="py-12 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                        <p className="text-slate-400 font-medium italic">No candidates linked to this mentor yet.</p>
                      </div>
                    ) : (
                      assignments.filter(a => String(a.mentorId) === String(selectedMentor.id)).map((a, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-lg">
                              {a.candidateName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-black text-slate-900">{a.candidateName}</p>
                              <p className="text-xs text-slate-400 font-medium">{a.candidateEmail}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                              <Calendar size={12} />
                              Linked on {new Date(a.timestamp).toLocaleDateString()}
                            </div>
                            <div className="flex gap-2 mt-2">
                              <button 
                                onClick={() => handleStartCuration(a)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                  a.status === 'pending_curation' 
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                                    : 'bg-emerald-50 text-emerald-600'
                                }`}
                              >
                                {a.status === 'pending_curation' ? 'Curate Roadmap' : 'Update Roadmap'}
                              </button>
                              <button className="px-4 py-2 bg-slate-50 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">
                                View Profile
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                </div>

                <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white relative overflow-hidden">
                  <div className="relative z-10">
                    <h4 className="text-lg font-black mb-2">Staff Insights</h4>
                    <p className="text-indigo-100 text-sm font-medium leading-relaxed">
                      You are currently viewing the roster for {selectedMentor.name}. 
                      As a staff member, you can track candidate progress and provide guidance through the curriculum review portal.
                    </p>
                  </div>
                  <ShieldCheck className="absolute -right-4 -bottom-4 text-white/10" size={120} />
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/10">
                   {messages.length === 0 && (
                     <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                        <MessageSquare size={56} className="text-indigo-600" />
                        <div>
                           <p className="font-black text-slate-800 text-lg">Direct Channel Open</p>
                           <p className="text-sm font-medium">Ask {selectedMentor.name.split(' ')[0]} anything about your PO transition!</p>
                        </div>
                     </div>
                   )}
                   {messages.map(m => (
                     <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                       <div className={`max-w-[75%] p-6 rounded-[2rem] text-sm font-medium leading-relaxed shadow-sm ${
                         m.sender === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none border border-slate-50'
                       }`}>
                         {m.text}
                         <p className={`text-[10px] mt-3 font-black uppercase tracking-widest opacity-60 ${m.sender === 'user' ? 'text-right' : 'text-left'}`}>{m.timestamp}</p>
                       </div>
                     </div>
                   ))}
                   {loading && (
                     <div className="flex justify-start">
                       <div className="bg-white p-6 rounded-[2rem] rounded-tl-none border border-slate-50 flex gap-2">
                         <span className="w-2 h-2 bg-indigo-200 rounded-full animate-bounce" />
                         <span className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                         <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                       </div>
                     </div>
                   )}
                </div>

                <div className="p-8 bg-white border-t border-slate-50">
                  <div className="flex gap-4">
                    <input 
                      type="text" 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder={`Ask ${selectedMentor.name.split(' ')[0]} for advice...`}
                      className="flex-1 p-5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all font-bold"
                    />
                    <button 
                      onClick={handleSendMessage}
                      disabled={!input || loading}
                      className="w-16 h-16 bg-indigo-600 text-white rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center shadow-xl shadow-indigo-100 disabled:opacity-50"
                    >
                      <Send size={24} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-300 space-y-6">
            <div className="w-32 h-32 bg-slate-50 rounded-[3rem] flex items-center justify-center">
               <Users size={64} className="opacity-20" />
            </div>
            <div className="text-center">
               <p className="font-black text-xl text-slate-800 tracking-tight">{isStaff ? 'Mentor Administration' : 'Mentorship Dashboard'}</p>
               <p className="font-medium text-slate-400">{isStaff ? 'Select a mentor to manage their linked candidates' : 'Select a mentor to start your expert conversation'}</p>
            </div>
          </div>
        )}
      </div>
      {/* Curation Modal */}
      {curatingCandidate && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-10">
          <div className="bg-white rounded-[3rem] w-full max-w-5xl h-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 border border-white/20">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-indigo-600 text-white rounded-3xl flex items-center justify-center font-black text-2xl shadow-lg shadow-indigo-200">
                  {curatingCandidate.candidateName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Curating Roadmap for {curatingCandidate.candidateName}</h2>
                  <p className="text-slate-500 font-medium text-sm italic">Targeting: {curatingCandidate.targetRole || 'Product Owner'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden md:block">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Career Goal</p>
                  <p className="text-xs font-bold text-slate-600 max-w-xs truncate">{curatingCandidate.careerGoal || 'No goal specified'}</p>
                </div>
                <button onClick={() => setCuratingCandidate(null)} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-red-500 transition-all shadow-sm">
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="bg-white px-8 py-4 border-b border-slate-100 flex flex-wrap gap-2 items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-2">Skills:</span>
              {curatingCandidate.skills?.map((s: string) => (
                <span key={s} className="px-3 py-1 bg-slate-50 text-slate-600 text-[10px] font-bold rounded-full border border-slate-100">{s}</span>
              ))}
            </div>

            <div className="flex-1 flex overflow-hidden">
              {/* Library Side */}
              <div className="flex-[1.5] border-r border-slate-100 flex flex-col bg-white">
                <div className="p-6 border-b border-slate-50">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text"
                      placeholder="Search master library..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 outline-none transition-all font-bold"
                    />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                  {masterCourses
                    .filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.category.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(course => {
                      const isSelected = selectedCourses.some(sc => sc.id === course.id);
                      return (
                        <div 
                          key={course.id} 
                          onClick={() => toggleCourseSelection(course)}
                          className={`p-5 rounded-3xl border-2 cursor-pointer transition-all flex items-center justify-between group ${
                            isSelected ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-50 bg-white hover:border-indigo-100 hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                              isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600'
                            }`}>
                              {isSelected ? <CheckCircle2 size={24} /> : <Plus size={24} />}
                            </div>
                            <div>
                              <p className="font-black text-slate-800 text-sm">{course.title}</p>
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{course.category} • {course.level}</p>
                            </div>
                          </div>
                          <a 
                            href={course.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 text-slate-300 hover:text-indigo-600 transition-colors"
                          >
                            <ExternalLink size={16} />
                          </a>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Selection Side */}
              <div className="flex-1 flex flex-col bg-slate-50/30">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-black text-slate-900 flex items-center gap-2">
                    <ClipboardList className="text-indigo-600" size={20} />
                    Selected Curriculum
                  </h3>
                  <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black rounded-full">{selectedCourses.length} Courses</span>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
                  {selectedCourses.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-30">
                      <Plus size={48} className="text-slate-400 mb-4" />
                      <p className="font-bold text-slate-400 italic">Select courses from the library to build the roadmap.</p>
                    </div>
                  ) : (
                    selectedCourses.map((course, idx) => (
                      <div key={course.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between animate-in slide-in-from-right-2 duration-200">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 bg-slate-900 text-white rounded-lg flex items-center justify-center text-[10px] font-black">{idx + 1}</span>
                          <p className="font-bold text-slate-800 text-xs truncate max-w-[150px]">{course.title}</p>
                        </div>
                        <button onClick={() => toggleCourseSelection(course)} className="text-slate-300 hover:text-red-500 transition-colors">
                          <X size={16} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-8 bg-white border-t border-slate-100">
                  <button 
                    onClick={saveCuration}
                    disabled={selectedCourses.length === 0}
                    className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-100 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
                  >
                    Finalize & Activate Path
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mentors;
