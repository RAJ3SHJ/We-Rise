
import React, { useState, useEffect } from 'react';
import { Question, UserProfile } from '../types';
import { evaluatePerformance } from '../services/geminiService';
import { Trophy, BrainCircuit, RotateCcw, Loader2 } from 'lucide-react';
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
    setQuestions(saved ? JSON.parse(saved) : []);
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
      // Backend service handles the generation of performance feedback
      const res = await evaluatePerformance(newScore, questions.length, profile);
      setFeedback(res || "Great effort! Review your answers and keep rising.");
      setLoading(false);
    }
  };

  if (questions.length === 0) return <div className="text-center p-12">No exam questions available. Contact Admin.</div>;

  if (done) return (
    <div className="max-w-2xl mx-auto text-center bg-white p-12 rounded-[3rem] border border-slate-100 shadow-xl animate-in zoom-in-95 duration-500">
      <Trophy className="text-amber-500 mx-auto mb-6" size={64}/>
      <h2 className="text-[12px] font-black mb-2 tracking-tight">Score: {score} / {questions.length}</h2>
      <div className="bg-slate-50 p-6 rounded-2xl text-left my-8 border border-slate-100">
        <h4 className="font-bold flex items-center gap-2 mb-2 text-indigo-600 tracking-tight">
          <BrainCircuit size={18} /> Performance Insight
        </h4>
        {loading ? (
          <div className="flex items-center gap-2 py-4">
            <Loader2 className="animate-spin text-indigo-600" size={16} />
            <span className="text-slate-400 font-medium italic">Analyzing results...</span>
          </div>
        ) : (
          <p className="text-slate-600 font-medium leading-relaxed italic">"{feedback}"</p>
        )}
      </div>
      <div className="flex gap-4">
        <button onClick={() => window.location.reload()} className="flex-1 py-4 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
          <RotateCcw size={20}/> Retake
        </button>
        <button onClick={() => navigate('/')} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-xl font-bold hover:bg-slate-200 transition-all">
          Home
        </button>
      </div>
    </div>
  );

  const q = questions[current];
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="font-black text-slate-800 tracking-tight text-sm uppercase">Evaluation Stage {current + 1} / {questions.length}</h3>
        <div className="w-48 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-600 transition-all duration-500" style={{width: `${((current+1)/questions.length)*100}%`}}/>
        </div>
      </div>
      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
        <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight leading-tight">{q.text}</h2>
        <div className="space-y-3">
          {q.options.map((opt, i) => (
            <button 
              key={i} 
              onClick={() => handleAnswer(i)} 
              className="w-full p-6 text-left rounded-2xl border-2 border-slate-50 hover:border-indigo-600 hover:bg-indigo-50 transition-all font-bold text-slate-700 hover:text-indigo-700"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Evaluation;
