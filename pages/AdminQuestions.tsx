
import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import { Plus, Trash2, Save, X, ClipboardList } from 'lucide-react';

const AdminQuestions: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<Partial<Question>>({ text: '', options: ['', '', '', ''], correctIndex: 0 });

  useEffect(() => {
    const saved = localStorage.getItem('po_exam_questions');
    if (saved) setQuestions(JSON.parse(saved));
  }, []);

  const save = (updated: Question[]) => {
    setQuestions(updated);
    localStorage.setItem('po_exam_questions', JSON.stringify(updated));
    setIsAdding(false);
  };

  const handleCreate = () => {
    const newQ: Question = { id: Date.now().toString(), text: form.text!, options: form.options!, correctIndex: form.correctIndex! };
    save([...questions, newQ]);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Exam Management</h1>
        <button onClick={() => setIsAdding(true)} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center gap-2"><Plus size={20}/> New Question</button>
      </header>

      {isAdding && (
        <div className="bg-white p-8 rounded-3xl border border-indigo-100 shadow-xl space-y-4">
          <div className="flex justify-between font-bold"><h2>Create Question</h2><button onClick={()=>setIsAdding(false)}><X/></button></div>
          <textarea className="w-full p-4 border rounded-xl" placeholder="Question text..." value={form.text} onChange={e=>setForm({...form, text: e.target.value})}/>
          <div className="grid grid-cols-2 gap-4">
            {form.options?.map((o, i) => (
              <div key={i} className="flex gap-2">
                <input className="flex-1 p-3 border rounded-xl" value={o} onChange={e=>{
                  const next = [...form.options!]; next[i] = e.target.value; setForm({...form, options: next});
                }}/>
                <button onClick={()=>setForm({...form, correctIndex: i})} className={`p-3 rounded-xl border ${form.correctIndex === i ? 'bg-emerald-500 text-white' : 'bg-slate-50'}`}>✓</button>
              </div>
            ))}
          </div>
          <button onClick={handleCreate} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2"><Save size={20}/> Save Question</button>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden divide-y">
        {questions.map((q, i) => (
          <div key={q.id} className="p-6 flex justify-between items-start">
            <div><p className="font-bold text-lg">{i+1}. {q.text}</p></div>
            <button onClick={() => save(questions.filter(x => x.id !== q.id))} className="text-red-500 p-2 hover:bg-red-50 rounded-lg"><Trash2 size={20}/></button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminQuestions;
