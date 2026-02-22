
import React, { useState, useEffect } from 'react';
import { UserProfile, CourseStatus, Course, Mentor, PathStatus, LearningPath } from '../types';
import { 
  Loader2, Brain, ClipboardCheck, ArrowLeft, ArrowRight, 
  Sparkles, CheckCircle2, UserCheck, Search, ShieldCheck, 
  GraduationCap, MessageSquare, Plus, X, Tag, UserPlus, Database, FileCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_MENTORS } from '../src/constants';

const Assessment: React.FC<{ profile: UserProfile, setProfile: any, setPath: any, addNotify: any }> = ({ profile, setProfile, setPath, addNotify }) => {
  const [view, setView] = useState<'portal' | 'skill-assessment'>('portal');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ courses: 0, questions: 0 });
  
  // Skill Assessment State
  const [careerGoal, setCareerGoal] = useState(profile.careerGoal || '');
  const [skillTags, setSkillTags] = useState<string[]>(profile.skills || []);
  const [currentSkillInput, setCurrentSkillInput] = useState('');
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const courses = JSON.parse(localStorage.getItem('we_rise_admin_courses') || '[]');
    const questions = JSON.parse(localStorage.getItem('po_exam_questions') || '[]');
    setStats({ courses: courses.length, questions: questions.length });
  }, []);

  const handleAddSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = currentSkillInput.trim();
    if (trimmed && !skillTags.includes(trimmed)) {
      setSkillTags([...skillTags, trimmed]);
      setCurrentSkillInput('');
    }
  };

  const handleRemoveSkill = (tag: string) => {
    setSkillTags(skillTags.filter(t => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const startSkillAssessment = () => {
    setView('skill-assessment');
    setStep(1);
  };

  const handleNextStep = () => {
    if (step === 1 && !careerGoal.trim()) {
      alert("Please define your primary career goal.");
      return;
    }
    if (step === 2 && skillTags.length === 0) {
      alert("Please add at least one skill to proceed.");
      return;
    }
    if (step === 3 && !selectedMentor) {
      alert("Please select a mentor to guide your journey.");
      return;
    }
    setStep(step + 1);
  };

  const finalizeSkillAssessment = async () => {
    if (!selectedMentor) return;

    setLoading(true);
    const updatedProfile = { 
      ...profile, 
      skills: skillTags, 
      careerGoal: careerGoal,
      background: profile.background || "Professional",
      mentorId: selectedMentor.id
    };

    // Create a PENDING path for the mentor to curate manually
    const newPath: LearningPath = {
      id: Date.now().toString(),
      title: `Path to ${updatedProfile.targetRole}`,
      courses: [], // Empty, to be filled by mentor
      overallProgress: 0,
      lastUpdated: new Date().toISOString(),
      status: PathStatus.PENDING,
      candidateEmail: updatedProfile.email
    };

    try {
      // Simulate a small delay for "processing"
      await new Promise(resolve => setTimeout(resolve, 1500));

      setPath(newPath);
      setProfile(updatedProfile);
      
      // Store assignment in global registry
      const assignments = JSON.parse(localStorage.getItem('we_rise_mentor_assignments') || '[]');
      const newAssignment = {
        candidateName: updatedProfile.name,
        candidateEmail: updatedProfile.email,
        mentorId: selectedMentor.id,
        mentorName: selectedMentor.name,
        timestamp: new Date().toISOString(),
        status: 'pending_curation',
        skills: updatedProfile.skills,
        careerGoal: updatedProfile.careerGoal,
        targetRole: updatedProfile.targetRole
      };
      
      // Avoid duplicates
      const filtered = assignments.filter((a: any) => a.candidateEmail !== updatedProfile.email);
      localStorage.setItem('we_rise_mentor_assignments', JSON.stringify([...filtered, newAssignment]));

      // Also store the pending path in a global registry for mentors to access
      const allPaths = JSON.parse(localStorage.getItem('we_rise_all_paths') || '[]');
      const filteredPaths = allPaths.filter((p: any) => p.candidateEmail !== updatedProfile.email);
      localStorage.setItem('we_rise_all_paths', JSON.stringify([...filteredPaths, newPath]));

      localStorage.setItem('assigned_mentor', JSON.stringify(selectedMentor));
      navigate('/');
    } catch (err) {
      console.error(err);
      alert("An error occurred while setting up your mentorship.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in fade-in duration-700">
      <div className="relative">
        <div className="w-24 h-24 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-200 animate-bounce">
          <Brain size={48} />
        </div>
        <Loader2 className="absolute -bottom-2 -right-2 text-indigo-600 animate-spin" size={32} />
      </div>
      <div className="text-center max-w-sm">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Linking with Mentor</h2>
        <p className="text-slate-500 font-medium mt-3 italic leading-relaxed">"Notifying {selectedMentor?.name} of your request. Your personalized path will be curated manually by your mentor..."</p>
      </div>
    </div>
  );

  if (view === 'portal') return (
    <div className="max-w-6xl mx-auto py-12 space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-black text-slate-900 tracking-tighter">Assessment Center</h1>
        <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto">Validate your existing expertise or build a new roadmap to PO success.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm flex flex-col items-center text-center group hover:border-indigo-200 transition-all hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden">
          <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[2.5rem] flex items-center justify-center mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm">
            <Brain size={54} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">Skill Assessment</h2>
          <p className="text-slate-500 mb-10 flex-1 font-medium leading-relaxed text-lg">Catalog your current skill set, link with an industry mentor, and receive a tailored learning roadmap.</p>
          
          <div className="mb-8 flex items-center gap-3 bg-indigo-50/50 px-5 py-3 rounded-2xl border border-indigo-100">
             <Database size={16} className="text-indigo-600" />
             <span className="text-[10px] font-black uppercase tracking-widest text-indigo-700">{stats.courses} Curated Resources Available</span>
          </div>

          <button 
            onClick={startSkillAssessment}
            className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl shadow-indigo-100 hover:scale-[1.03] active:scale-[0.97] transition-all flex items-center justify-center gap-3"
          >
            Start Skill Entry <ArrowRight size={20} />
          </button>
        </div>

        <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm flex flex-col items-center text-center group hover:border-emerald-200 transition-all hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden">
          <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-sm">
            <ClipboardCheck size={54} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">Conduct Assessment</h2>
          <p className="text-slate-500 mb-10 flex-1 font-medium leading-relaxed text-lg">Test your Product Owner knowledge with a formal written evaluation powered by the Master Curriculum.</p>
          
          <div className="mb-8 flex items-center gap-3 bg-emerald-50/50 px-5 py-3 rounded-2xl border border-emerald-100">
             <FileCheck size={16} className="text-emerald-600" />
             <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">{stats.questions} Active Validation Questions</span>
          </div>

          <button 
            onClick={() => navigate('/evaluation')}
            className="w-full py-6 bg-emerald-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl shadow-emerald-100 hover:scale-[1.03] active:scale-[0.97] transition-all flex items-center justify-center gap-3"
          >
            Launch Written Exam <ClipboardCheck size={20} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-8 animate-in fade-in duration-500">
      <button 
        onClick={() => setView('portal')} 
        className="flex items-center gap-2 text-slate-400 mb-10 hover:text-indigo-600 font-black uppercase tracking-widest text-xs transition-colors"
      >
        <ArrowLeft size={18}/> Back to Portal
      </button>

      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em]">Step {step} of 4</span>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`h-1.5 w-16 rounded-full transition-all duration-500 ${step >= i ? 'bg-indigo-600 shadow-sm' : 'bg-slate-100'}`} />
            ))}
          </div>
        </div>
        <h2 className="text-[12px] font-black text-slate-900 tracking-tight">
          {step === 1 && "Define your Goal"}
          {step === 2 && "Catalog your Skills"}
          {step === 3 && "Link with a Mentor"}
          {step === 4 && "Generate your Rise Path"}
        </h2>
      </div>

      <div className="space-y-10">
        {step === 1 && (
          <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-8 animate-in slide-in-from-right-4 duration-500">
            <div className="space-y-6">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">What is your primary objective?</label>
              <textarea 
                value={careerGoal}
                onChange={(e) => setCareerGoal(e.target.value)}
                className="w-full p-8 border border-slate-100 bg-slate-50 rounded-[2rem] focus:bg-white focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 outline-none transition-all font-bold text-lg h-48 resize-none leading-relaxed"
                placeholder="e.g. I want to transition from a QA Engineer to a Technical Product Owner in a FinTech company within 6 months."
              />
              <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-5 py-3 rounded-2xl">
                <Sparkles size={18} />
                <p className="text-xs font-bold italic">Being specific about your target industry or timeline helps our AI tailor your curriculum.</p>
              </div>
            </div>

            <button 
              onClick={handleNextStep}
              className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-indigo-100"
            >
              Next: Catalog Skills <ArrowRight size={20} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-8 animate-in slide-in-from-right-4 duration-500">
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Expertise Registry</label>
                <span className="text-[10px] font-bold text-indigo-600">{skillTags.length} skills added</span>
              </div>
              
              <div className="relative group">
                <input 
                  type="text"
                  value={currentSkillInput}
                  onChange={(e) => setCurrentSkillInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-12 pr-12 py-6 border border-slate-100 bg-slate-50 rounded-[2rem] focus:bg-white focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 outline-none transition-all font-bold text-lg"
                  placeholder="Type a skill and press 'Enter' to add..."
                />
                <Tag className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <button 
                  onClick={handleAddSkill}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-indigo-600 text-white rounded-xl hover:scale-110 active:scale-95 transition-all shadow-lg shadow-indigo-100"
                >
                  <Plus size={20} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                <p className="w-full text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Quick Add</p>
                {['Agile', 'SQL', 'Java', 'Business Analysis'].map(skill => (
                  <button
                    key={skill}
                    onClick={() => {
                      if (!skillTags.includes(skill)) {
                        setSkillTags([...skillTags, skill]);
                      }
                    }}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      skillTags.includes(skill) 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                        : 'bg-white border border-slate-100 text-slate-500 hover:border-indigo-600 hover:text-indigo-600'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>

              <div className="min-h-[160px] p-6 bg-slate-50/50 rounded-[2.5rem] border border-dashed border-slate-200 flex flex-wrap gap-3 items-start content-start">
                {skillTags.length === 0 ? (
                  <div className="w-full h-full flex flex-col items-center justify-center py-8 opacity-30 text-slate-400">
                     <Plus size={32} className="mb-2" />
                     <p className="font-bold text-sm italic">Add your skills to see them here...</p>
                  </div>
                ) : (
                  skillTags.map((skill) => (
                    <div 
                      key={skill} 
                      className="group flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-100 rounded-full shadow-sm hover:shadow-md hover:border-indigo-200 transition-all animate-in zoom-in-90"
                    >
                      <span className="text-xs font-black text-slate-700 tracking-tight">{skill}</span>
                      <button 
                        onClick={() => handleRemoveSkill(skill)}
                        className="p-1 hover:text-red-500 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
              
              <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-5 py-3 rounded-2xl">
                <CheckCircle2 size={18} />
                <p className="text-xs font-bold italic">Adding specific skills like "Jira", "User Stories", or "Stakeholder Management" results in a better matched experience.</p>
              </div>
            </div>

            <div className="flex gap-4">
               <button onClick={() => setStep(1)} className="flex-1 py-6 bg-slate-100 text-slate-500 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all">Previous</button>
               <button 
                 onClick={handleNextStep}
                 className="flex-[2] py-6 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-indigo-100"
               >
                 Link to Mentor <ArrowRight size={20} />
               </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {MOCK_MENTORS.map(m => (
                <button 
                  key={m.id}
                  onClick={() => setSelectedMentor(m)}
                  className={`bg-white p-8 rounded-[3rem] border-4 text-center flex flex-col items-center transition-all duration-300 relative overflow-hidden ${
                    selectedMentor?.id === m.id ? 'border-indigo-600 shadow-2xl scale-105' : 'border-transparent shadow-sm hover:border-indigo-100'
                  }`}
                >
                  <div className="w-24 h-24 rounded-[2.5rem] overflow-hidden mb-6 border-4 border-white shadow-xl">
                    <img src={m.avatar} className="w-full h-full object-cover" alt={m.name} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-1">{m.name}</h3>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-4">{m.role}</p>
                  <div className="flex flex-wrap justify-center gap-1.5 mt-auto">
                    {m.expertise.map(exp => (
                      <span key={exp} className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[8px] font-black uppercase rounded-lg">
                        {exp}
                      </span>
                    ))}
                  </div>
                  {selectedMentor?.id === m.id && (
                    <div className="absolute top-4 right-4 text-indigo-600 bg-white p-1 rounded-full shadow-sm">
                      <CheckCircle2 size={24} />
                    </div>
                  )}
                </button>
              ))}
            </div>
            
            <div className="flex gap-4">
               <button onClick={() => setStep(2)} className="flex-1 py-6 bg-slate-100 text-slate-500 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all">Previous</button>
               <button 
                 onClick={handleNextStep}
                 className="flex-[2] py-6 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl shadow-indigo-100"
               >
                 Confirm Selection <ArrowRight size={20} />
               </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-8 animate-in zoom-in-95 duration-500">
             <div className="bg-indigo-600 p-12 rounded-[4rem] text-white flex flex-col md:flex-row items-center gap-10 relative overflow-hidden shadow-2xl shadow-indigo-200 border border-indigo-500">
                <div className="z-10 text-center md:text-left space-y-6 flex-1">
                   <div className="inline-flex items-center gap-3 bg-white/10 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/20">
                     <GraduationCap size={16} /> Finalize Path
                   </div>
                   <h3 className="text-5xl font-black tracking-tighter leading-none">Confirm Setup</h3>
                   <div className="space-y-2">
                      <p className="text-indigo-100 text-lg font-medium">Assigned Mentor: <span className="text-white font-black">{selectedMentor?.name}</span></p>
                      <p className="text-indigo-100 text-lg font-medium">Skills Captured: <span className="text-white font-black">{skillTags.length} identified</span></p>
                      <p className="text-indigo-100 text-lg font-medium">Primary Goal: <span className="text-white font-black line-clamp-1">{careerGoal}</span></p>
                   </div>
                </div>
                <div className="z-10 relative">
                   <div className="w-48 h-48 rounded-[3.5rem] border-[12px] border-white/10 overflow-hidden shadow-2xl">
                     <img src={selectedMentor?.avatar} className="w-full h-full object-cover" alt="Mentor" />
                   </div>
                   <div className="absolute -bottom-4 -right-4 bg-white text-indigo-600 p-4 rounded-[1.5rem] shadow-xl">
                      <UserCheck size={24} />
                   </div>
                </div>
             </div>

             <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm flex flex-col items-center text-center space-y-8">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-[2rem] flex items-center justify-center">
                   <ShieldCheck size={40} />
                </div>
                <div className="space-y-2">
                   <h4 className="text-3xl font-black text-slate-900 tracking-tight">Generate Learning Roadmap</h4>
                   <p className="text-slate-500 font-medium max-w-md mx-auto leading-relaxed">The system will now analyze your skill registry, career goal, and the Master Library to construct your personalized 6-course curriculum.</p>
                </div>
                <div className="flex gap-4 w-full">
                  <button onClick={() => setStep(3)} className="flex-1 py-6 bg-slate-50 text-slate-400 rounded-[2.5rem] font-black uppercase tracking-widest text-xs hover:bg-slate-100 transition-all">Review Mentor</button>
                  <button 
                    onClick={finalizeSkillAssessment}
                    className="flex-[2] py-6 bg-emerald-600 text-white rounded-[2.5rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-emerald-100"
                  >
                    Build My Roadmap <Sparkles size={20} />
                  </button>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assessment;
