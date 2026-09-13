import React, { useState } from 'react';
import { ScreenType, User } from '../types';
import { LOGO_URL } from '../data/mockData';
import { loginApi, signupApi } from '../services/api';

interface AuthScreenProps {
  initialTab?: 'login' | 'signup';
  onNavigate: (screen: ScreenType) => void;
  onShowToast: (message: string) => void;
  onAuthSuccess: (user: User) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  initialTab = 'login',
  onNavigate,
  onShowToast,
  onAuthSuccess
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(initialTab);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'attendee' | 'organizer'>('attendee');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      if (activeTab === 'login') {
        const res = await loginApi(email, password);
        if (res?.user) {
          onShowToast(`Welcome back, ${res.user.name}!`);
          onAuthSuccess(res.user);
        }
      } else {
        const res = await signupApi(name, email, password, role);
        if (res?.user) {
          onShowToast(`Account created successfully for ${res.user.name}!`);
          onAuthSuccess(res.user);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async (demoRole: 'organizer' | 'attendee') => {
    setErrorMessage(null);
    setIsSubmitting(true);
    const targetEmail = demoRole === 'organizer' ? 'atharva@eventpulse.io' : 'attendee@eventpulse.io';
    try {
      const res = await loginApi(targetEmail, 'password123');
      if (res?.user) {
        onShowToast(`Signed in as ${res.user.name} (${res.user.role.toUpperCase()})`);
        onAuthSuccess(res.user);
      }
    } catch (err: any) {
      setErrorMessage('Demo login failed. Make sure backend API server is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#292524] font-sans-body flex flex-col items-center justify-center p-4">
      {/* Container Card */}
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#E7E2D8] shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header Header */}
        <div className="p-6 bg-[#FAF7F2] border-b border-[#E7E2D8] flex flex-col items-center text-center">
          <div className="flex items-center gap-2 cursor-pointer mb-2" onClick={() => onNavigate('landing')}>
            <img src={LOGO_URL} alt="EventPulse Logo" className="h-8 w-auto object-contain" />
            <span className="font-display-command text-2xl font-bold text-[#292524]">EventPulse</span>
          </div>
          <p className="text-xs text-[#78716C]">Real-time Summit Companion & Incident Triage</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#E7E2D8] bg-[#F5F1E8] p-1 font-semibold text-xs">
          <button
            onClick={() => { setActiveTab('login'); setErrorMessage(null); }}
            className={`flex-1 py-2.5 rounded-xl transition-all ${
              activeTab === 'login'
                ? 'bg-white text-[#292524] shadow-2xs font-bold'
                : 'text-[#78716C] hover:text-[#292524]'
            }`}
            type="button"
          >
            Sign In
          </button>
          <button
            onClick={() => { setActiveTab('signup'); setErrorMessage(null); }}
            className={`flex-1 py-2.5 rounded-xl transition-all ${
              activeTab === 'signup'
                ? 'bg-white text-[#292524] shadow-2xs font-bold'
                : 'text-[#78716C] hover:text-[#292524]'
            }`}
            type="button"
          >
            Create Account
          </button>
        </div>

        {/* Form Area */}
        <div className="p-4 sm:p-6">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-[#FDF2EF] border border-[#F5C2B8] text-[#B4533C] text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] shrink-0">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 sm:gap-4">
            {activeTab === 'signup' && (
              <div className="flex flex-col gap-1">
                <label className="text-[10px] sm:text-[11px] font-mono-code text-[#78716C] uppercase font-semibold">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Atharva"
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E7E2D8] rounded-xl text-xs text-[#292524] focus:outline-none focus:border-[#71472F] transition-colors"
                />
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-[10px] sm:text-[11px] font-mono-code text-[#78716C] uppercase font-semibold">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@eventpulse.io"
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E7E2D8] rounded-xl text-xs text-[#292524] focus:outline-none focus:border-[#71472F] transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] sm:text-[11px] font-mono-code text-[#78716C] uppercase font-semibold">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E7E2D8] rounded-xl text-xs text-[#292524] focus:outline-none focus:border-[#71472F] transition-colors"
              />
            </div>

            {activeTab === 'signup' && (
              <div className="flex flex-col gap-1">
                <label className="text-[10px] sm:text-[11px] font-mono-code text-[#78716C] uppercase font-semibold">
                  Account Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('attendee')}
                    className={`py-2 px-1.5 rounded-xl text-[11px] sm:text-xs font-semibold border transition-all ${
                      role === 'attendee'
                        ? 'bg-[#71472F] text-white border-[#5C3925]'
                        : 'bg-[#FAF8F5] text-[#78716C] border-[#E7E2D8]'
                    }`}
                  >
                    Attendee
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('organizer')}
                    className={`py-2 px-1.5 rounded-xl text-[11px] sm:text-xs font-semibold border transition-all ${
                      role === 'organizer'
                        ? 'bg-[#71472F] text-white border-[#5C3925]'
                        : 'bg-[#FAF8F5] text-[#78716C] border-[#E7E2D8]'
                    }`}
                  >
                    Organizer Coordinator
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 sm:mt-2 w-full py-3 rounded-xl bg-[#71472F] hover:bg-[#5C3925] text-white text-xs font-semibold tracking-wide transition-all active:scale-[0.99] shadow-xs flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
              ) : (
                <span>{activeTab === 'login' ? 'Sign In to EventPulse' : 'Create Account'}</span>
              )}
            </button>
          </form>

          {/* Quick Demo Section */}
          <div className="relative my-5 sm:my-6 flex items-center justify-center">
            <span className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[#E7E2D8]"></span>
            </span>
            <span className="relative bg-white px-2.5 font-mono-code text-[9px] sm:text-[10px] text-[#A8A29E] uppercase font-semibold">
              Or One-Click Demo
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('organizer')}
              className="w-full py-2.5 rounded-xl border border-[#DAE2FD] bg-[#F2F3FF] hover:bg-[#E2E7FF] text-[#131B2E] text-xs font-semibold transition-colors flex items-center justify-between px-3"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="material-symbols-outlined text-[18px] text-[#4225D0] shrink-0">admin_panel_settings</span>
                <span className="truncate">Demo as Atharva (Lead Organizer)</span>
              </div>
              <span className="material-symbols-outlined text-[16px] shrink-0">chevron_right</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('attendee')}
              className="w-full py-2.5 rounded-xl border border-[#E7E2D8] bg-[#FAF8F5] hover:bg-[#F3EFE6] text-[#292524] text-xs font-semibold transition-colors flex items-center justify-between px-3"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="material-symbols-outlined text-[18px] text-[#71472F] shrink-0">smartphone</span>
                <span className="truncate">Demo as Alex Rivera (Attendee)</span>
              </div>
              <span className="material-symbols-outlined text-[16px] shrink-0">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Footer Back */}
        <div className="p-4 bg-[#FAF7F2] border-t border-[#E7E2D8] text-center">
          <button
            onClick={() => onNavigate('landing')}
            className="text-xs text-[#78716C] hover:text-[#292524] font-medium"
            type="button"
          >
            ← Back to EventPulse Landing Page
          </button>
        </div>
      </div>
    </div>
  );
};
