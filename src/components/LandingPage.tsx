import React from 'react';
import { ScreenType } from '../types';
import { LOGO_URL, KEYNOTE_HERO_IMAGE, CONVENTION_FLOOR_IMAGE } from '../data/mockData';

interface LandingPageProps {
  onNavigate: (screen: ScreenType) => void;
  onQuickDemo: (role: 'organizer' | 'attendee') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  onQuickDemo
}) => {
  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#292524] font-sans-body flex flex-col selection:bg-[#71472F] selection:text-white">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-xl border-b border-[#E7E2D8]">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('landing')}>
            <img src={LOGO_URL} alt="EventPulse Logo" className="h-8 w-auto object-contain" />
            <span className="font-display-command text-xl font-bold text-[#292524] tracking-tight">
              EventPulse
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-[#78716C]">
            <a href="#features" className="hover:text-[#292524] transition-colors">Capabilities</a>
            <a href="#map" className="hover:text-[#292524] transition-colors">3D Wayfinding</a>
            <a href="#crowd" className="hover:text-[#292524] transition-colors">Crowd Radar</a>
            <a href="#sos" className="hover:text-[#292524] transition-colors">SOS Dispatch</a>
          </nav>

          {/* Auth Action CTAs */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onNavigate('login')}
              className="px-3.5 py-1.5 rounded-xl border border-[#E7E2D8] bg-white text-[#292524] text-xs font-semibold hover:bg-[#F3EFE6] transition-colors shadow-2xs"
              type="button"
            >
              Sign In
            </button>
            <button
              onClick={() => onNavigate('signup')}
              className="px-4 py-1.5 rounded-xl bg-[#71472F] hover:bg-[#5C3925] text-white text-xs font-semibold transition-all active:scale-95 shadow-xs"
              type="button"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4 bg-gradient-to-b from-[#FAF7F2] to-[#F7F4EE]">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          {/* Status Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F3EFE6] border border-[#E7E2D8] text-[#71472F] text-xs font-mono-code mb-6 font-semibold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#B4533C] animate-ping"></span>
            <span>SUMMIT 2025 TELEMETRY LIVE</span>
          </div>

          {/* Headline */}
          <h1 className="font-serif-headline text-4xl sm:text-5xl md:text-6xl font-normal text-[#292524] tracking-tight leading-[1.15] mb-5">
            Next-Generation Real-Time <br />
            <span className="italic font-serif-headline text-[#71472F]">Event Companion & SOS System</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#78716C] max-w-2xl leading-relaxed mb-8">
            Empower attendees and venue operations with live crowd congestion radar, 3D multi-level isometric map guidance, emergency SOS triage, and Gemini AI summit assistance.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            <button
              onClick={() => onQuickDemo('organizer')}
              className="px-6 py-3 rounded-2xl bg-[#71472F] hover:bg-[#5C3925] text-white text-sm font-semibold transition-all active:scale-95 shadow-md flex items-center gap-2"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
              <span>Launch Organizer Command Console</span>
            </button>

            <button
              onClick={() => onQuickDemo('attendee')}
              className="px-6 py-3 rounded-2xl bg-white border border-[#E7E2D8] hover:bg-[#F3EFE6] text-[#292524] text-sm font-semibold transition-all active:scale-95 shadow-xs flex items-center gap-2"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">smartphone</span>
              <span>Open Attendee Mobile App</span>
            </button>
          </div>

          {/* Live Telemetry Ticker Strip */}
          <div className="w-full max-w-3xl bg-white rounded-2xl p-4 border border-[#E7E2D8] shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono-code uppercase text-[#78716C]">On-Site Attendees</span>
              <span className="font-display-command text-2xl font-bold text-[#292524]">14,820</span>
              <span className="text-[11px] text-emerald-600 font-medium">92% Venue Cap</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-mono-code uppercase text-[#78716C]">Mesh Beacons</span>
              <span className="font-display-command text-2xl font-bold text-[#292524]">99.98%</span>
              <span className="text-[11px] text-[#78716C]">0 Dead Zones</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-mono-code uppercase text-[#78716C]">Monitored Zones</span>
              <span className="font-display-command text-2xl font-bold text-[#292524]">18 / 18</span>
              <span className="text-[11px] text-emerald-600 font-medium">Telemetry Synced</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-mono-code uppercase text-[#78716C]">Incident Response</span>
              <span className="font-display-command text-2xl font-bold text-[#B4533C]">&lt; 2 Min</span>
              <span className="text-[11px] text-[#78716C]">Paramedic Dispatch</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section Grid */}
      <section id="features" className="py-16 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="font-mono-code text-xs uppercase tracking-widest text-[#71472F] font-bold">
            Platform Capabilities
          </span>
          <h2 className="font-serif-headline text-3xl sm:text-4xl font-normal text-[#292524] mt-2">
            Built for Large-Scale Summits & Venues
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: 3D Map */}
          <div id="map" className="bg-white rounded-2xl p-6 border border-[#E7E2D8] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#F3EFE6] text-[#71472F] flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[26px]">view_in_ar</span>
              </div>
              <h3 className="font-serif-headline text-xl font-semibold text-[#292524] mb-2">
                3D Isometric Venue Map
              </h3>
              <p className="text-xs text-[#78716C] leading-relaxed mb-4">
                Multi-level (L1 & L2) interactive floorplans with 3D standing room markers, turn-by-turn route animation, and step-free accessibility paths.
              </p>
            </div>
            <button
              onClick={() => onQuickDemo('attendee')}
              className="text-xs font-semibold text-[#71472F] hover:underline inline-flex items-center gap-1"
              type="button"
            >
              <span>Explore 3D Map</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>

          {/* Card 2: Crowd Radar */}
          <div id="crowd" className="bg-white rounded-2xl p-6 border border-[#E7E2D8] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#F3EFE6] text-[#71472F] flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[26px]">radar</span>
              </div>
              <h3 className="font-serif-headline text-xl font-semibold text-[#292524] mb-2">
                Live Crowd Congestion Radar
              </h3>
              <p className="text-xs text-[#78716C] leading-relaxed mb-4">
                Real-time sensor mesh tracking room occupancy across main stages, dining concourses, and restrooms with instant clearance notifications.
              </p>
            </div>
            <button
              onClick={() => onQuickDemo('attendee')}
              className="text-xs font-semibold text-[#71472F] hover:underline inline-flex items-center gap-1"
              type="button"
            >
              <span>View Crowd Status</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>

          {/* Card 3: SOS Emergency */}
          <div id="sos" className="bg-white rounded-2xl p-6 border border-[#E7E2D8] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#FDF2EF] text-[#B4533C] flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[26px]">emergency</span>
              </div>
              <h3 className="font-serif-headline text-xl font-semibold text-[#292524] mb-2">
                Emergency SOS Dispatch
              </h3>
              <p className="text-xs text-[#78716C] leading-relaxed mb-4">
                Hold-to-dispatch SOS beacons for medical, accessibility, or security incidents with real-time field paramedic triage routing.
              </p>
            </div>
            <button
              onClick={() => onQuickDemo('organizer')}
              className="text-xs font-semibold text-[#B4533C] hover:underline inline-flex items-center gap-1"
              type="button"
            >
              <span>Inspect Command Console</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-[#E7E2D8] py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#78716C]">
          <div className="flex items-center gap-2">
            <img src={LOGO_URL} alt="EventPulse Logo" className="h-6 w-auto object-contain" />
            <span className="font-semibold text-[#292524]">EventPulse Inc.</span>
            <span>© 2025 Summit Platform</span>
          </div>
          <div className="flex items-center gap-4 font-mono-code text-[11px]">
            <span>Version 2.4.0</span>
            <span>•</span>
            <button onClick={() => onNavigate('login')} className="hover:underline">Sign In</button>
            <span>•</span>
            <button onClick={() => onNavigate('signup')} className="hover:underline">Register</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
