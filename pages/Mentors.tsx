
import React, { useState, useEffect } from 'react';
import { UserProfile, Mentor, Message } from '../types';
import { getMentorAdvice } from '../services/geminiService';
import { Send, Loader2, MessageSquare, ShieldCheck, Mail, Users } from 'lucide-react';

const DEFAULT_MENTORS: Mentor[] = [
  { id: '1', name: 'Priya Sharma', role: 'Principal PO @ FinTech Hub', expertise: ['Stakeholder Management', 'Visioning'], avatar: 'https://i.pravatar.cc/150?u=priya' },
  { id: '2', name: 'Arjun Mehta', role: 'Senior PM @ SaaS Collective', expertise: ['Technical Backlogs', 'Jira Mastery'], avatar: 'https://i.pravatar.cc/150?u=arjun' },
  { id: '3', name: 'Ananya Iyer', role: 'Product Strategy Lead', expertise: ['Market Analysis', 'Growth Hacking'], avatar: 'https://i.pravatar.cc/150?u=ananya' }
];

const Mentors: React.FC<{ profile: UserProfile | null }> = ({ profile }) => {
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mentors, setMentors] = useState<Mentor[]>(DEFAULT_MENTORS);

  useEffect(() => {
    const savedMentors = JSON.parse(localStorage.getItem('we_rise_mentors') || '[]');
    if (savedMentors.length > 0) {
      setMentors(savedMentors);
    }
  }, []);

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
        <h2 className="text-2xl font-black tracking-tight mb-6">Expert Mentors</h2>
        {mentors.map(m => (
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

      {/* Chat Area */}
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
              <button title="Email Mentor" className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center">
                <Mail size={20} />
              </button>
            </div>

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
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-300 space-y-6">
            <div className="w-32 h-32 bg-slate-50 rounded-[3rem] flex items-center justify-center">
               <Users size={64} className="opacity-20" />
            </div>
            <div className="text-center">
               <p className="font-black text-xl text-slate-800 tracking-tight">Mentorship Dashboard</p>
               <p className="font-medium text-slate-400">Select a mentor to start your expert conversation</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Mentors;
