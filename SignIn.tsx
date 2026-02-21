
import React, { useState } from 'react';
import { GraduationCap, ArrowRight, Mail, Lock, User, ArrowLeft, CheckCircle, Shield } from 'lucide-react';
import { UserProfile } from '../types';

interface SignInProps {
  onSignIn: (userData: UserProfile) => void;
}

type AuthMode = 'signin' | 'signup' | 'forgot';

const SignIn: React.FC<SignInProps> = ({ onSignIn }) => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Hardcoded check for admin login for demonstration purposes
    if (mode === 'signin' && email === 'admin@werise.app' && password === 'admin123') {
      onSignIn({ 
        name: 'System Admin', 
        email: 'admin@werise.app',
        role: 'admin',
        background: 'Administration',
        skills: ['Curriculum Management'],
        availabilityHoursPerWeek: 40,
        targetRole: 'Admin'
      });
      return;
    }

    const storedUsers = JSON.parse(localStorage.getItem('po_registered_users') || '[]');

    if (mode === 'signup') {
      if (storedUsers.find((u: any) => u.email === email)) {
        setMessage({ type: 'error', text: 'Email already registered.' });
        return;
      }
      const newUser = { name, email, password, role: 'user' };
      localStorage.setItem('po_registered_users', JSON.stringify([...storedUsers, newUser]));
      setMessage({ type: 'success', text: 'Account created! Please sign in.' });
      setMode('signin');
      setPassword('');
    } else if (mode === 'signin') {
      const user = storedUsers.find((u: any) => u.email === email && u.password === password);
      if (user) {
        onSignIn({ 
          name: user.name, 
          email: user.email,
          role: user.role,
          background: '',
          skills: [],
          availabilityHoursPerWeek: 0,
          targetRole: 'Product Owner'
        });
      } else {
        setMessage({ type: 'error', text: 'Invalid email or password.' });
      }
    } else if (mode === 'forgot') {
      const user = storedUsers.find((u: any) => u.email === email);
      if (user) {
        setMessage({ type: 'success', text: `A reset link has been simulated for ${email}.` });
      } else {
        setMessage({ type: 'error', text: 'Email not found.' });
      }
    }
  };

  const loginAsAdmin = () => {
    setEmail('admin@werise.app');
    setPassword('admin123');
    setMode('signin');
    setMessage({ type: 'success', text: 'Admin credentials pre-filled.' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
      {/* Immersive background elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />

      <div className="max-w-md w-full relative z-10 space-y-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2rem] bg-indigo-600 text-white shadow-2xl shadow-indigo-200 mb-6 transition-transform hover:scale-105 cursor-pointer">
            <GraduationCap size={48} />
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">We Rise</h1>
          <p className="text-slate-400 font-black uppercase text-xs tracking-[0.3em] mt-3">Rise to Your Potential</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[3rem] shadow-2xl shadow-indigo-900/10 border border-white transition-all">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">
              {mode === 'signin' && 'Welcome Back'}
              {mode === 'signup' && 'Join the Path'}
              {mode === 'forgot' && 'Reset Password'}
            </h2>
            <p className="text-slate-500 text-sm mt-2 font-medium">
              {mode === 'signin' && "Sign in to continue your journey."}
              {mode === 'signup' && "Create an account to start your transition."}
              {mode === 'forgot' && "Enter your email to receive a reset link."}
            </p>
          </div>

          {message && (
            <div className={`mb-8 p-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-in fade-in zoom-in-95 duration-300 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
              <CheckCircle size={18} />
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Rising"
                    className="w-full pl-14 pr-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all font-bold"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-14 pr-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all font-bold"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div className="space-y-1">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                  {mode === 'signin' && (
                    <button 
                      type="button" 
                      onClick={() => setMode('forgot')}
                      className="text-[10px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-14 pr-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all font-bold"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-5 text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-100 active:scale-[0.98] mt-4"
            >
              {mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Link'} 
              <ArrowRight size={20} />
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50">
            {mode === 'signin' ? (
              <p className="text-xs text-slate-500 font-bold text-center">
                New to We Rise?{' '}
                <button onClick={() => setMode('signup')} className="text-indigo-600 hover:underline">
                  Create an account
                </button>
              </p>
            ) : (
              <button 
                onClick={() => setMode('signin')} 
                className="text-xs text-slate-500 font-black hover:text-indigo-600 flex items-center justify-center gap-3 mx-auto uppercase tracking-widest"
              >
                <ArrowLeft size={18} /> Back to Login
              </button>
            )}
          </div>
        </div>

        {/* Administrative Access Portal */}
        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl flex items-center justify-between group cursor-pointer hover:bg-slate-800 transition-all border border-white/10" onClick={loginAsAdmin}>
           <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <Shield size={24} />
              </div>
              <div>
                <h4 className="text-white font-black text-sm tracking-tight">Administrative Portal</h4>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">Authorized Access Only</p>
              </div>
           </div>
           <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-white transition-colors">
              <ArrowRight size={18} />
           </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
