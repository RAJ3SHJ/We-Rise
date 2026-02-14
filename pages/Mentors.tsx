
import React, { useState } from 'react';
import { UserProfile, Mentor, Message } from '../types';
import { getMentorAdvice } from '../services/geminiService';
// Added missing 'Users' icon import to fix line 131 error
import { Send, Loader2, MessageSquare, ShieldCheck, Mail, Users } from 'lucide-react';

const MOCK_MENTORS: Mentor[] = [
  { id: '1', name: 'Sarah Jenkins', role: 'Principal PO at FinTech Hub', expertise: ['Stakeholder Management', 'Capital Markets'], avatar: 'https://picsum.photos/seed/sarah/100/100' },
  { id: '2', name: 'Mark Wu', role: 'Senior Product Manager', expertise: ['User Stories', 'Technical Backlogs'], avatar: 'https://picsum.photos/seed/mark/100/100' }
];

const Mentors: React.FC<{ profile: UserProfile | null }> = ({ profile }) => {
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

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
        <h2 className="text-2xl font-bold mb-6">Expert Mentors</h2>
        {MOCK_MENTORS.map(m => (
          <button 
            key={m.id} 
            onClick={() => setSelectedMentor(m)}
            className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all duration-200 border text-left ${
              selectedMentor?.id === m.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-900 hover:border-indigo-200'
            }`}
          >
            <img src={m.avatar} alt={m.name} className="w-12 h-12 rounded-full border-2 border-white/20" />
            <div>
              <p className="font-bold">{m.name}</p>
              <p className={`text-[10px] ${selectedMentor?.id === m.id ? 'text-indigo-100' : 'text-slate-400'}`}>{m.role}</p>
            </div>
          </button>
        ))}
        
        <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 mt-8">
            <ShieldCheck className="text-indigo-600 mb-2" size={24} />
            <h4 className="font-bold text-indigo-900 text-sm">Verified Mentorship</h4>
            <p className="text-xs text-indigo-700 leading-relaxed mt-1">Our mentors are industry veterans committed to helping you transition. Questions are also delivered to their official Gmail accounts.</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
        {selectedMentor ? (
          <>
            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <img src={selectedMentor.avatar} alt={selectedMentor.name} className="w-10 h-10 rounded-full" />
                <div>
                  <h3 className="font-bold">{selectedMentor.name}</h3>
                  <div className="flex gap-1">
                    {selectedMentor.expertise.map(e => (
                      <span key={e} className="text-[8px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full uppercase font-bold">{e}</span>
                    ))}
                  </div>
                </div>
              </div>
              <button title="Email Mentor" className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                <Mail size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
               {messages.length === 0 && (
                 <div className="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-40">
                    <MessageSquare size={48} />
                    <p>Ask {selectedMentor.name} anything about your transition!</p>
                 </div>
               )}
               {messages.map(m => (
                 <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                     m.sender === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-tl-none'
                   }`}>
                     {m.text}
                     <p className={`text-[10px] mt-2 opacity-60 ${m.sender === 'user' ? 'text-right' : 'text-left'}`}>{m.timestamp}</p>
                   </div>
                 </div>
               ))}
               {loading && (
                 <div className="flex justify-start">
                   <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none flex gap-2">
                     <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" />
                     <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                     <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                   </div>
                 </div>
               )}
            </div>

            <div className="p-6 bg-slate-50/50">
              <div className="flex gap-3">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={`Ask ${selectedMentor.name.split(' ')[0]} for advice...`}
                  className="flex-1 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={!input || loading}
                  className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <Users size={64} className="mb-4 opacity-20" />
            <p>Select a mentor to start a conversation</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Mentors;
