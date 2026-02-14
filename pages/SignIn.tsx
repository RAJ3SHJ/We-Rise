
import React, { useState } from 'react';
import { GraduationCap, ArrowRight, Sparkles, Mail, Lock, User, ArrowLeft, Shield } from 'lucide-react';
import { UserProfile, UserRole } from '../types';

interface SignInProps {
  onSignIn: (userData: UserProfile) => void;
}

type AuthMode = 'signin' | 'signup' | 'forgot';

const SignIn: React.FC<SignInProps> = ({ onSignIn }) => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const storedUsers = JSON.parse(localStorage.getItem('po_registered_users') || '[]');

    if (mode === 'signup') {
      if (storedUsers.find((u: any) => u.email === email)) {
        setMessage({ type: 'error', text: 'Email already registered.' });
        return;
      }
      const newUser = { name, email, password, role };
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

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-200 mb-4 transition-transform hover:scale-105 cursor-pointer">
            <GraduationCap size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">PO-Path</h1>
          <p className="text-slate-500 font-medium">Product Owner Accelerator</p>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-2xl shadow-slate-200/60 border border-slate-100 transition-all">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800">
              {mode === 'signin' && 'Welcome Back'}
              {mode === 'signup' && 'Join the Path'}
              {mode === 'forgot' && 'Reset Password'}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {mode === 'signin' && "Sign in to continue your PO journey."}
              {mode === 'signup' && "Create an account to start your transition."}
              {mode === 'forgot' && "Enter your email to receive a reset link."}
            </p>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div className="space-y-1">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
                  {mode === 'signin' && (
                    <button 
                      type="button" 
                      onClick={() => setMode('forgot')}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <Shield size={18} className="text-indigo-600" />
                <span className="text-sm font-medium text-slate-600 mr-auto">Register as Admin</span>
                <input 
                  type="checkbox" 
                  checked={role === 'admin'}
                  onChange={(e) => setRole(e.target.checked ? 'admin' : 'user')}
                  className="w-5 h-5 accent-indigo-600 cursor-pointer"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-[0.98] mt-2"
            >
              {mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'} 
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-8 text-center space-y-4">
            {mode === 'signin' ? (
              <p className="text-sm text-slate-500 font-medium">
                New to PO-Path?{' '}
                <button onClick={() => setMode('signup')} className="text-indigo-600 font-bold hover:underline">
                  Create an account
                </button>
              </p>
            ) : (
              <button 
                onClick={() => setMode('signin')} 
                className="text-sm text-slate-500 font-bold hover:text-indigo-600 flex items-center justify-center gap-2 mx-auto"
              >
                <ArrowLeft size={16} /> Back to Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
