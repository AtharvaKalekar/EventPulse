import React, { useState, useEffect } from 'react';
import { ScreenType, User } from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { VenueMapScreen } from './components/VenueMapScreen';
import { CrowdRadarScreen } from './components/CrowdRadarScreen';
import { ScheduleScreen } from './components/ScheduleScreen';
import { EmergencySOSScreen } from './components/EmergencySOSScreen';
import { OrganizerDashboard } from './components/OrganizerDashboard';
import { LandingPage } from './components/LandingPage';
import { AuthScreen } from './components/AuthScreen';
import { fetchMeApi, clearAuthToken, loginApi } from './services/api';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastTimeoutId, setToastTimeoutId] = useState<any>(null);
  const [accessibilityMode, setAccessibilityMode] = useState<boolean>(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);

  // Validate session token on mount
  useEffect(() => {
    fetchMeApi().then(currUser => {
      setIsLoadingAuth(false);
      if (currUser) {
        setUser(currUser);
        setCurrentScreen(currUser.role === 'organizer' ? 'organizer' : 'home');
      }
    }).catch(() => {
      setIsLoadingAuth(false);
    });
  }, []);

  const showToast = (message: string) => {
    if (toastTimeoutId) clearTimeout(toastTimeoutId);
    setToastMessage(message);
    const id = setTimeout(() => {
      setToastMessage(null);
    }, 3200);
    setToastTimeoutId(id);
  };

  const handleToggleAccessibility = () => {
    setAccessibilityMode(prev => {
      const next = !prev;
      showToast(next ? 'Accessibility high-contrast & screen reader routing ON' : 'Accessibility settings updated');
      return next;
    });
  };

  const handleAuthSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    if (authenticatedUser.role === 'organizer') {
      setCurrentScreen('organizer');
    } else {
      setCurrentScreen('home');
    }
  };

  const handleLogout = () => {
    clearAuthToken();
    setUser(null);
    setCurrentScreen('landing');
    showToast('Signed out of EventPulse session.');
  };

  const handleQuickDemo = async (demoRole: 'organizer' | 'attendee') => {
    const demoEmail = demoRole === 'organizer' ? 'atharva@eventpulse.io' : 'attendee@eventpulse.io';
    try {
      const res = await loginApi(demoEmail, 'password123');
      if (res?.user) {
        setUser(res.user);
        showToast(`Welcome! Signed in as ${res.user.name} (${res.user.role.toUpperCase()})`);
        setCurrentScreen(demoRole === 'organizer' ? 'organizer' : 'home');
      } else {
        setCurrentScreen(demoRole === 'organizer' ? 'organizer' : 'home');
      }
    } catch {
      setCurrentScreen(demoRole === 'organizer' ? 'organizer' : 'home');
    }
  };

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-[#F7F4EE] flex flex-col items-center justify-center text-[#292524] font-sans-body">
        <div className="flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-3xl text-[#71472F] animate-spin">refresh</span>
          <span className="font-mono-code text-xs font-semibold text-[#78716C]">Loading EventPulse...</span>
        </div>
      </div>
    );
  }

  // Render Public Landing Page
  if (currentScreen === 'landing') {
    return (
      <LandingPage
        onNavigate={setCurrentScreen}
        onQuickDemo={handleQuickDemo}
      />
    );
  }

  // Render Login or Signup Screen
  if (currentScreen === 'login' || currentScreen === 'signup') {
    return (
      <AuthScreen
        initialTab={currentScreen}
        onNavigate={setCurrentScreen}
        onShowToast={showToast}
        onAuthSuccess={handleAuthSuccess}
      />
    );
  }

  // Render Organizer Command Dashboard
  if (currentScreen === 'organizer') {
    return (
      <div className="min-h-screen bg-[#FAF8FF]">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#131B2E] text-white px-4 py-2 rounded-xl shadow-lg font-sans-body text-xs flex items-center gap-2 border border-[#DAE2FD]/30 animate-in fade-in slide-in-from-top-2 duration-200">
            <span className="material-symbols-outlined text-[16px] text-indigo-400">info</span>
            <span>{toastMessage}</span>
          </div>
        )}
        <OrganizerDashboard
          onNavigate={setCurrentScreen}
          onShowToast={showToast}
        />
      </div>
    );
  }

  // Render Attendee Mobile Viewport
  return (
    <div className={`min-h-screen bg-[#F7F4EE] text-[#292524] font-sans-body flex flex-col items-center selection:bg-[#71472F] selection:text-white ${
      accessibilityMode ? 'accessibility-high-contrast' : ''
    }`}>
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[90%] bg-[#292524] text-white px-4 py-2.5 rounded-xl shadow-lg font-sans-body text-xs flex items-center justify-between gap-3 border border-white/10 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-[17px] text-[#C49B71] shrink-0">
              check_circle
            </span>
            <span className="truncate">{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-white/60 hover:text-white shrink-0"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Persistent Attendee Header */}
      <Header
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        unreadCount={3}
        user={user}
        onLogout={handleLogout}
        onToggleOrganizer={() => setCurrentScreen(currentScreen === 'organizer' ? 'home' : 'organizer')}
      />

      {/* Main Dynamic Viewport */}
      <main className="w-full flex-1 flex flex-col items-center pt-14">
        {currentScreen === 'home' && (
          <HomeScreen
            onNavigate={setCurrentScreen}
            onShowToast={showToast}
            accessibilityMode={accessibilityMode}
            onToggleAccessibility={handleToggleAccessibility}
          />
        )}

        {currentScreen === 'map' && (
          <VenueMapScreen
            onShowToast={showToast}
            accessibilityMode={accessibilityMode}
            onToggleAccessibility={handleToggleAccessibility}
          />
        )}

        {currentScreen === 'crowd' && (
          <CrowdRadarScreen
            onNavigate={setCurrentScreen}
            onShowToast={showToast}
          />
        )}

        {currentScreen === 'schedule' && (
          <ScheduleScreen
            onShowToast={showToast}
            onNavigate={setCurrentScreen}
          />
        )}

        {currentScreen === 'sos' && (
          <EmergencySOSScreen
            onBack={() => setCurrentScreen('home')}
            onNavigate={setCurrentScreen}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Persistent Bottom Navigation with SOS Action */}
      <BottomNav
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
      />
    </div>
  );
}
