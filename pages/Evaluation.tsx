
import React, { useState, useEffect } from 'react';
import { Question, UserProfile } from '../types';
import { evaluatePerformance } from '../services/geminiService';
import { Trophy, BrainCircuit, RotateCcw, Loader2, UserPlus, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Evaluation: React.FC<{ profile: UserProfile }> = ({ profile }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('po_exam_questions');
    // If no questions in local storage, use a default set for the demo if admin hasn't added any
    const defaultQuestions = [
      { id: '1', text: 'What is the primary responsibility of a Product Owner?', options: ['Writing code', 'Prioritizing the backlog', 'Designing UI', 'Managing HR'], correctIndex: 1 },
      { id: '2', text: 'Who defines the "Definition of Done"?', options: ['The PO', 'The Scrum Master', 'The Developers', 'The whole Scrum Team'], correctIndex: 3 }
    ];
    setQuestions(saved && JSON.parse(saved).length > 0 ? JSON.parse(saved) : defaultQuestions);
  }, []);

  const handleAnswer = async (idx: number) => {
    let newScore = score;
    if (idx === questions[current].correctIndex) newScore += 1;
    
    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setScore(newScore);
    } else {
      setScore(newScore);
      setDone(true);
      setLoading(true);
      const res = await evaluatePerformance(newScore, questions.length, profile);
      setFeedback(res || "Great effort! Review your answers and keep rising.");
      setLoading(false);
    }
  };

  const handleLinkMentor = () => {
    // Navigate to assessment page and signal to start at the mentor step
    navigate('/assessment?startAtMentor=true');
  };

  if (questions.length === 0) return (
    <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
      <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
        <BrainCircuit size={40} />
      </div>
      <h2 className="text-2xl font-black text-slate-800">No Questions Available</h2>
      <p className="text-slate-400 font-medium mt-2">The Admin hasn't curated the exam bank yet.</p>
      <button onClick={() => navigate('/')} className="mt-8 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs">Return Home</button>
    </div>
  );

  if (done) return (
    <div className="max-w-2xl mx-auto text-center bg-white p-12 rounded-[4rem] border border-slate-100 shadow-2xl shadow-indigo-500/5 animate-in zoom-in-95 duration-500">
      <div className="w-24 h-24 bg-amber-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
        <Trophy className="text-amber-500" size={48}/>
      </div>
      <h2 className="text-4xl font-black mb-2 tracking-tight text-slate-900">Score: {score} / {questions.length}</h2>
      <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Evaluation Complete</p>
      
      <div className="bg-slate-50/80 p-8 rounded-[2.5rem] text-left my-10 border border-white">
        <h4 className="font-black flex items-center gap-2 mb-4 text-indigo-600 tracking-tight uppercase text-xs">
          <BrainCircuit size={18} /> Smart Insight
        </h4>
        {loading ? (
          <div className="flex items-center gap-3 py-6">
            <Loader2 className="animate-spin text-indigo-600" size={20} />
            <span className="text-slate-400 font-medium italic">Generating system feedback...</span>
          </div>
        ) : (
          <p className="text-slate-700 font-medium leading-relaxed italic text-lg">"{feedback}"</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        <button 
          onClick={handleLinkMentor}
          className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-indigo-100"
        >
          <UserPlus size={20}/> Connect with a Mentor <ArrowRight size={18} />
        </button>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <button onClick={() => window.location.reload()} className="py-5 bg-slate-100 text-slate-500 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-slate-200 transition-all">
            <RotateCcw size={16}/> Retake Exam
          </button>
          <button onClick={() => navigate('/')} className="py-5 bg-white text-slate-400 border border-slate-100 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all">
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );

  const q = questions[current];
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div>
          <h3 className="font-black text-indigo-600 tracking-widest text-[10px] uppercase mb-1">In Progress</h3>
          <p className="text-2xl font-black text-slate-900">Question {current + 1} of {questions.length}</p>
        </div>
        <div className="w-32 h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
          <div className="h-full bg-indigo-600 transition-all duration-500" style={{width: `${((current+1)/questions.length)*100}%`}}/>
        </div>
      </div>
      <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-slate-100">
        <h2 className="text-3xl font-black text-slate-900 mb-10 tracking-tight leading-tight">{q.text}</h2>
        <div className="space-y-4">
          {q.options.map((opt, i) => (
            <button 
              key={i} 
              onClick={() => handleAnswer(i)} 
              className="group w-full p-6 text-left rounded-[2rem] border-2 border-slate-50 bg-slate-50/30 hover:border-indigo-600 hover:bg-indigo-50 transition-all flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-200 font-black transition-all">
                {String.fromCharCode(65 + i)}
              </div>
              <span className="font-bold text-slate-700 group-hover:text-indigo-700 transition-colors flex-1">{opt}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Evaluation;
