
import React, { useState, useEffect } from 'react';
import { UserProfile, CourseStatus } from '../types';
import { generateLearningPath } from '../services/geminiService';
import { Loader2, Sparkles, ChevronRight, Brain, ClipboardCheck, ArrowLeft, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AssessmentProps {
  profile: UserProfile | null;
  setProfile: (p: UserProfile) => void;
  setPath: (p: any) => void;
  addNotify: (m: string) => void;
}

type AssessmentFlow = 'selection' | 'skill-wizard';

const Assessment: React.FC<AssessmentProps> = ({ profile, setProfile, setPath, addNotify }) => {
  const [flow, setFlow] = useState<AssessmentFlow>('selection');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: profile?.name || '',
    background: profile?.background || 'Operations',
    skills: profile?.skills || [] as string[],
    availability: profile?.availabilityHoursPerWeek || 10,
    newSkill: ''
  });

  useEffect(() => {
    if (profile?.name && !formData.name) {
      setFormData(prev => ({ ...prev, name: profile.name }));
    }
  }, [profile?.name]);

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const addSkill = () => {
    if (formData.newSkill && !formData.skills.includes(formData.newSkill)) {
      setFormData({ ...formData, skills: [...formData.skills, formData.newSkill], newSkill: '' });
    }
  };

  const handleSubmitSkillAssessment = async () => {
    setLoading(true);
    // Added missing 'role' property to satisfy UserProfile interface
    const newProfile: UserProfile = {
      name: formData.name,
      email: profile?.email || '',
      background: formData.background,
      skills: formData.skills,
      availabilityHoursPerWeek: formData.availability,
      targetRole: 'Product Owner',
      role: profile?.role || 'user'
    };

    const aiResult = await generateLearningPath(newProfile);
    if (aiResult) {
      const fullPath = {
        id: Math.random().toString(36).substr(2, 9),
        title: aiResult.title,
        overallProgress: 0,
        lastUpdated: new Date().toISOString(),
        courses: aiResult.courses.map((c: any) => ({
          ...c,
          status: CourseStatus.NOT_STARTED,
          progress: 0
        }))
      };
      setProfile(newProfile);
      setPath(fullPath);
      addNotify("Personalized roadmap generated! Check your dashboard.");
      navigate('/');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
        <h2 className="text-xl font-bold">AI is crafting your personal PO path...</h2>
        <p className="text-slate-500">Analyzing your background in {formData.background}</p>
      </div>
    );
  }

  // --- SELECTION HUB ---
  if (flow === 'selection') {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Assessment Center</h1>
          <p className="text-slate-500 text-lg">Choose how you would like to evaluate your progress and build your path.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Skill Assessment Choice */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 transition-all group flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
              <Brain size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Skill Assessment</h2>
            <p className="text-slate-500 mb-8 flex-1">
              Complete a profile wizard to generate a personalized AI-powered learning roadmap based on your professional background.
            </p>
            <button 
              onClick={() => setFlow('skill-wizard')}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              Start Skill Assessment <ChevronRight size={20} />
            </button>
          </div>

          {/* Conduct Assessment Choice */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-emerald-100/50 transition-all group flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
              <ClipboardCheck size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Conduct Assessment</h2>
            <p className="text-slate-500 mb-8 flex-1">
              Take a specific set of knowledge-based questions to evaluate your current understanding of PO principles.
            </p>
            <button 
              onClick={() => navigate('/evaluation')}
              className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
            >
              Start Conduct Assessment <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-8 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold hover:bg-slate-200 transition-all"
          >
            <X size={18} /> Skip for Now
          </button>
        </div>
      </div>
    );
  }

  // --- SKILL WIZARD ---
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <button 
          onClick={() => setFlow('selection')}
          className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold transition-colors"
        >
          <ArrowLeft size={18} /> Back to Selection
        </button>
        <div className="flex gap-2">
            {[1, 2, 3].map(i => (
                <div key={i} className={`h-2 w-8 rounded-full ${step >= i ? 'bg-indigo-600' : 'bg-slate-200'}`} />
            ))}
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Skill Onboarding Wizard</h1>
          <p className="text-slate-500 text-sm">Step {step} of 3</p>
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">What's your name?</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter full name"
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Current Background</label>
              <select 
                value={formData.background}
                onChange={(e) => setFormData({...formData, background: e.target.value})}
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              >
                <option>Operations</option>
                <option>QA/Testing</option>
                <option>Banking/Finance</option>
                <option>Project Management</option>
                <option>Marketing</option>
                <option>Development</option>
                <option>Customer Support</option>
              </select>
            </div>
            <button onClick={handleNext} disabled={!formData.name} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors">
              Next Step <ChevronRight size={20} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Your current skills</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={formData.newSkill}
                  onChange={(e) => setFormData({...formData, newSkill: e.target.value})}
                  placeholder="e.g., SQL, JIRA"
                  className="flex-1 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                />
                <button onClick={addSkill} className="px-4 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">Add</button>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {formData.skills.map(s => (
                  <span key={s} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium flex items-center gap-1">
                    {s} 
                    <button onClick={() => setFormData({...formData, skills: formData.skills.filter(sk => sk !== s)})} className="hover:text-red-500">×</button>
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={handleBack} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors">Back</button>
              <button onClick={handleNext} className="flex-1 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors">Continue</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
             <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Weekly Commitment (Hours)</label>
              <div className="flex items-center gap-4">
                <input 
                  type="range" min="5" max="40" step="5"
                  value={formData.availability}
                  onChange={(e) => setFormData({...formData, availability: parseInt(e.target.value)})}
                  className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <span className="font-bold text-xl text-indigo-700 w-12">{formData.availability}h</span>
              </div>
            </div>

            <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 flex items-start gap-4">
                <Sparkles className="text-indigo-600 mt-1 flex-shrink-0" size={24} />
                <div>
                    <h4 className="font-bold text-indigo-900">Ready to AI-Craft your path?</h4>
                    <p className="text-sm text-indigo-700">We will build a roadmap based on your {formData.background} experience.</p>
                </div>
            </div>

            <div className="flex gap-4">
              <button onClick={handleBack} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors">Back</button>
              <button onClick={handleSubmitSkillAssessment} className="flex-1 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                Generate My Path <Sparkles size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assessment;
