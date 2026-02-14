
import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import { Plus, Trash2, Edit3, Save, X, ClipboardList, CheckCircle2 } from 'lucide-react';

const AdminQuestions: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Question>>({
    text: '',
    options: ['', '', '', ''],
    correctIndex: 0
  });

  useEffect(() => {
    const saved = localStorage.getItem('po_exam_questions');
    if (saved) setQuestions(JSON.parse(saved));
  }, []);

  const saveToStorage = (updated: Question[]) => {
    setQuestions(updated);
    localStorage.setItem('po_exam_questions', JSON.stringify(updated));
  };

  const handleSave = () => {
    if (!formData.text || formData.options?.some(o => !o)) return;

    if (editingId) {
      const updated = questions.map(q => 
        q.id === editingId ? { ...q, ...formData as Question } : q
      );
      saveToStorage(updated);
    } else {
      const newQuestion: Question = {
        id: Math.random().toString(36).substr(2, 9),
        text: formData.text!,
        options: formData.options as string[],
        correctIndex: formData.correctIndex!
      };
      saveToStorage([...questions, newQuestion]);
    }

    resetForm();
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ text: '', options: ['', '', '', ''], correctIndex: 0 });
  };

  const deleteQuestion = (id: string) => {
    saveToStorage(questions.filter(q => q.id !== id));
  };

  const editQuestion = (q: Question) => {
    setFormData(q);
    setEditingId(q.id);
    setIsAdding(true);
  };

  const updateOption = (idx: number, val: string) => {
    const opts = [...(formData.options || [])];
    opts[idx] = val;
    setFormData({ ...formData, options: opts });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Exam Management</h1>
          <p className="text-slate-500 font-medium">Create and refine the "Conduct Assessment" knowledge base.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg"
        >
          <Plus size={20} /> Add Question
        </button>
      </header>

      {isAdding && (
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-indigo-100 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800">{editingId ? 'Edit Question' : 'New Question'}</h2>
            <button onClick={resetForm} className="text-slate-400 hover:text-red-500"><X size={24} /></button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Question Text</label>
              <textarea 
                value={formData.text}
                onChange={e => setFormData({ ...formData, text: e.target.value })}
                className="w-full p-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
                placeholder="Enter the question here..."
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.options?.map((opt, idx) => (
                <div key={idx} className="relative">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1 ml-1">Option {idx + 1}</label>
                  <div className="flex gap-2 items-center">
                    <input 
                      type="text"
                      value={opt}
                      onChange={e => updateOption(idx, e.target.value)}
                      className="flex-1 p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder={`Choice ${idx + 1}`}
                    />
                    <button 
                      onClick={() => setFormData({ ...formData, correctIndex: idx })}
                      className={`p-3 rounded-xl border transition-all ${formData.correctIndex === idx ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-slate-50 border-slate-200 text-slate-300'}`}
                      title="Set as correct answer"
                    >
                      <CheckCircle2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
             <button onClick={resetForm} className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl">Cancel</button>
             <button onClick={handleSave} className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 flex items-center justify-center gap-2 shadow-lg">
                <Save size={18} /> {editingId ? 'Update' : 'Create'} Question
             </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex items-center gap-3">
          <ClipboardList className="text-indigo-600" size={20} />
          <h3 className="font-bold text-slate-800">Current Question Bank ({questions.length})</h3>
        </div>
        
        <div className="divide-y divide-slate-100">
          {questions.length === 0 ? (
            <div className="p-12 text-center text-slate-400 italic">No questions created yet. Click "Add Question" to begin.</div>
          ) : (
            questions.map((q, i) => (
              <div key={q.id} className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row gap-6 items-start">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-black flex-shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 space-y-3">
                  <h4 className="font-bold text-slate-800 text-lg leading-snug">{q.text}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, idx) => (
                      <div key={idx} className={`text-sm p-2 rounded-lg border ${q.correctIndex === idx ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-bold' : 'bg-white border-slate-100 text-slate-500'}`}>
                        {idx + 1}. {opt}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 md:self-center">
                  <button onClick={() => editQuestion(q)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit"><Edit3 size={18} /></button>
                  <button onClick={() => deleteQuestion(q.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete"><Trash2 size={18} /></button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminQuestions;
