
import React, { useState, useEffect } from 'react';
import { UserProfile, Question } from '../types';
import { evaluatePerformance } from '../services/geminiService';
import { 
  Trophy, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  Loader2,
  BrainCircuit,
  XCircle,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DEFAULT_EXAM: Question[] = [
  {
    id: '1',
    text: "Which of the following best describes the Product Owner's primary responsibility?",
    options: [
      "Managing the development team's daily tasks",
      "Maximizing the value of the product resulting from work of the Development Team",
      "Ensuring the Scrum Master is following the rules",
      "Writing technical documentation for the code"
    ],
    correctIndex: 1
  },
  {
    id: '2',
    text: "Who has the final say on the order of the Product Backlog?",
    options: ["The Stakeholders", "The Development Team", "The Product Owner", "The Scrum Master"],
    correctIndex: 2
  }
];

const Evaluation: React.FC<{ profile: UserProfile }> = ({ profile }) => {
  const [gameState, setGameState] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [aiFeedback, setAiFeedback] = useState('');
  const [finalScore, setFinalScore] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('po_exam_questions');
    if (saved) {
      setQuestions(JSON.parse(saved));
    } else {
      setQuestions(DEFAULT_EXAM);
      localStorage.setItem('po_exam_questions', JSON.stringify(DEFAULT_EXAM));
    }
  }, []);

  const startQuiz = () => {
    if (questions.length === 0) return;
    setGameState('quiz');
    setCurrentQuestionIndex(0);
    setAnswers([]);
  };

  const handleSelectOption = (index: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = index;
    setAnswers(newAnswers);
  };

  const handleNext = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateResult();
    }
  };

  const calculateResult = async () => {
    const score = answers.reduce((acc, curr, idx) => {
      return curr === questions[idx].correctIndex ? acc + 1 : acc;
    }, 0);
    setFinalScore(score);
    setGameState('result');
    setLoadingFeedback(true);
    
    try {
      const feedback = await evaluatePerformance(score, questions.length, profile);
      setAiFeedback(feedback || 'Great effort! Keep studying your PO fundamentals.');
    } catch (e) {
      setAiFeedback("Great job completing the assessment!");
    } finally {
      setLoadingFeedback(false);
    }
  };

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <AlertTriangle className="text-amber-500 mb-4" size={48} />
        <h2 className="text-xl font-bold">No questions available.</h2>
        <p className="text-slate-500">Please contact an admin to set up the assessment.</p>
        <button onClick={() => navigate('/')} className="mt-6 text-indigo-600 font-bold">Back to Dashboard</button>
      </div>
    );
  }

  if (gameState === 'intro') {
    return (
      <div className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-indigo-100 rounded-3xl flex items-center justify-center text-indigo-600 shadow-xl shadow-indigo-50 border border-white">
          <BrainCircuit size={48} />
        </div>
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Conduct Assessment</h1>
          <p className="text-slate-500 mt-3 text-lg leading-relaxed">
            Take a deep dive into PO principles. This assessment consists of curated questions designed by your learning admins.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <button 
            onClick={startQuiz}
            className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
          >
            Start Conduct Assessment <ChevronRight size={20} />
          </button>
          <button 
            onClick={() => navigate('/')}
            className="flex-1 py-4 bg-white text-slate-500 border border-slate-200 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all active:scale-95"
          >
            Skip for Now
          </button>
        </div>

        <div className="pt-8 border-t border-slate-100 w-full text-left">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Exam Stats</h3>
          <div className="grid grid-cols-2 gap-4">
             <div className="flex items-center gap-3 text-slate-600 font-medium">
               <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle size={16} /></div>
               {questions.length} Questions
             </div>
             <div className="flex items-center gap-3 text-slate-600 font-medium">
               <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Trophy size={16} /></div>
               AI Analysis
             </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'quiz') {
    const q = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-300">
        <header className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
           <div className="space-y-1">
             <h2 className="text-lg font-bold text-slate-900">Question {currentQuestionIndex + 1} of {questions.length}</h2>
             <div className="w-48 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${progress}%` }} />
             </div>
           </div>
           <button onClick={() => setGameState('intro')} className="p-2 text-slate-400 hover:text-red-500"><XCircle size={24} /></button>
        </header>

        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
          <h3 className="text-2xl font-bold text-slate-800 leading-snug mb-8">{q.text}</h3>
          <div className="space-y-4">
            {q.options.map((opt, idx) => {
              const isSelected = answers[currentQuestionIndex] === idx;
              return (
                <button 
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-5 text-left rounded-2xl border-2 transition-all flex items-center justify-between group ${
                    isSelected ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900' : 'border-slate-100 hover:border-slate-200 text-slate-600'
                  }`}
                >
                  <span className="font-semibold text-lg">{opt}</span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-200'}`}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-between items-center">
           <button disabled={currentQuestionIndex === 0} onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)} className="flex items-center gap-2 px-6 py-3 font-bold text-slate-400 disabled:opacity-0"><ChevronLeft size={20} /> Previous</button>
           <button disabled={answers[currentQuestionIndex] === undefined} onClick={handleNext} className="flex items-center gap-2 px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg disabled:opacity-50">
             {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'} <ChevronRight size={20} />
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl border border-slate-100 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-indigo-500" />
        <div className="relative z-10 space-y-6">
          <Trophy size={64} className="text-amber-500 mx-auto" />
          <h2 className="text-4xl font-extrabold text-slate-900">Score: {finalScore} / {questions.length}</h2>
          <div className="max-w-2xl mx-auto p-8 bg-slate-50 rounded-3xl text-left border border-slate-100">
            <h4 className="font-bold mb-3 flex items-center gap-2 text-lg"><BrainCircuit className="text-indigo-600" size={20} /> Mentor Feedback</h4>
            {loadingFeedback ? <div className="flex items-center gap-2 text-slate-400"><Loader2 className="animate-spin" size={20} /> Thinking...</div> : <p className="text-slate-600 italic">"{aiFeedback}"</p>}
          </div>
          <div className="flex gap-4 justify-center">
            <button onClick={startQuiz} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center gap-2"><RotateCcw size={20} /> Retake</button>
            <button onClick={() => navigate('/')} className="px-8 py-4 bg-white text-indigo-600 border border-indigo-100 rounded-2xl font-bold">Go Home</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Evaluation;
