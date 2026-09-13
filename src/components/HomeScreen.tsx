import React, { useState, useEffect } from 'react';
import { ScreenType, Announcement } from '../types';
import { KEYNOTE_HERO_IMAGE, INITIAL_ANNOUNCEMENTS } from '../data/mockData';
import { fetchAnnouncements } from '../services/api';

interface HomeScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onShowToast: (message: string) => void;
  accessibilityMode: boolean;
  onToggleAccessibility: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  onShowToast,
  accessibilityMode,
  onToggleAccessibility
}) => {
  const [showQrModal, setShowQrModal] = useState(false);
  const [wifiCopied, setWifiCopied] = useState(false);
  const [streamActive, setStreamActive] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);

  useEffect(() => {
    fetchAnnouncements().then(data => {
      if (data && data.length > 0) {
        setAnnouncements(data);
      }
    });
  }, []);

  const handleCopyWifi = () => {
    navigator.clipboard.writeText('PULSE-VIP25').catch(() => {});
    setWifiCopied(true);
    onShowToast('Wi-Fi Password PULSE-VIP25 copied to clipboard');
    setTimeout(() => setWifiCopied(false), 2200);
  };

  return (
    <div className="flex flex-col w-full pb-28 max-w-lg mx-auto">
      {/* Calm Event Context Pill Strip */}
      <section className="px-4 pt-3 pb-2">
        <div className="flex items-center justify-between bg-[#FBF9F5] border border-[#E7E2D8]/80 px-3.5 py-2 rounded-xl text-xs shadow-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B4533C] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B4533C]"></span>
            </span>
            <span className="font-mono-code text-[11px] text-[#78716C] uppercase tracking-wider truncate">
              Main Hall • Day 2 Active
            </span>
          </div>
          <span className="font-mono-code text-[11px] text-[#A8A29E] shrink-0 font-medium">
            10:28 AM
          </span>
        </div>
      </section>

      {/* Simplified Calming Announcement Strip */}
      <section className="mb-4">
        <div className="px-4 flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B4533C]"></span>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#78716C]">
              Live Announcements
            </h2>
          </div>
          <span className="text-[11px] font-mono-code text-[#A8A29E]">{announcements.length} Updates</span>
        </div>

        <div className="flex overflow-x-auto gap-3 px-4 pb-1 snap-x snap-mandatory no-scrollbar">
          {announcements.map((ann) => (
            <div key={ann.id} className="snap-start shrink-0 w-[84vw] max-w-[320px] bg-white border border-[#E7E2D8] rounded-xl p-4 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FDF2EF] text-[#B4533C] text-[11px] font-semibold tracking-wide">
                    {ann.tag}
                  </span>
                  <span className="font-mono-code text-[11px] text-[#A8A29E]">{ann.timeAgo}</span>
                </div>
                <h3 className="font-serif-headline text-base font-semibold text-[#292524] leading-snug mb-1">
                  {ann.title}
                </h3>
                <p className="text-xs text-[#78716C] leading-relaxed line-clamp-2">
                  {ann.description}
                </p>
              </div>
              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#E7E2D8]/50">
                <span className="text-xs font-medium text-[#292524] flex items-center gap-1">
                  {ann.location && <span className="material-symbols-outlined text-[15px] text-[#78716C]">location_on</span>}
                  {ann.location || ann.badgeMeta || 'Summit Ground'}
                </span>
                <button
                  onClick={() => {
                    if (ann.actionType === 'route') onNavigate('map');
                    else if (ann.actionType === 'stream') {
                      setStreamActive(!streamActive);
                      onShowToast(streamActive ? 'Closed livestream feed' : 'Connecting to Stage low-latency feed...');
                    } else onNavigate('schedule');
                  }}
                  className="bg-[#292524] hover:bg-[#3D2B1F] text-[#F7F4EE] text-xs font-medium px-3 py-1 rounded-lg active:scale-95 transition-transform"
                  type="button"
                >
                  {ann.actionLabel}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Elegant Warm Pass Card */}
      <section className="px-4 mb-5">
        <div className="relative overflow-hidden bg-[#3D2B1F] text-[#F7F4EE] rounded-2xl p-4 shadow-md border border-[#292524]">
          <div className="relative z-10 flex items-start justify-between mb-3">
            <div className="min-w-0 pr-2">
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-sm text-[#D6C7B2] text-[10px] font-mono-code uppercase tracking-wider mb-1.5">
                VIP All-Access
              </div>
              <h2 className="font-serif-headline text-xl font-medium text-[#F7F4EE] tracking-tight truncate">
                Atharva
              </h2>
              <p className="text-xs text-[#D6C7B2]/80 font-mono-code">ID: EP-2025-9981</p>
            </div>

            {/* Interactive Fast QR Preview Trigger */}
            <button
              onClick={() => setShowQrModal(true)}
              className="shrink-0 flex flex-col items-center justify-center p-2 rounded-xl bg-[#FBF9F5] text-[#292524] hover:bg-white active:scale-95 transition-transform shadow-xs"
              type="button"
            >
              <span className="material-symbols-outlined text-[24px]">qr_code_2</span>
              <span className="font-mono-code text-[9px] font-bold mt-0.5 tracking-wider">PASS</span>
            </button>
          </div>

          {/* Perforated Divider Detail */}
          <div className="relative my-2 flex items-center justify-between opacity-20">
            <span className="w-full border-t border-dashed border-[#F7F4EE]"></span>
          </div>

          {/* Pass Telemetry & Wi-Fi Token */}
          <div className="relative z-10 flex items-center justify-between gap-2 pt-0.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-[#D6C7B2]">
                <span className="material-symbols-outlined text-[15px]">wifi</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono-code text-[#D6C7B2]/80 leading-none">Venue Wi-Fi</span>
                <span className="font-mono-code text-xs font-semibold text-[#F7F4EE] tracking-wide">
                  PULSE-VIP25
                </span>
              </div>
            </div>
            <button
              onClick={handleCopyWifi}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs transition-colors active:scale-95 font-medium ${
                wifiCopied
                  ? 'bg-white/30 text-white'
                  : 'bg-white/10 hover:bg-white/20 text-[#F7F4EE]'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[13px]">
                {wifiCopied ? 'check' : 'content_copy'}
              </span>
              <span>{wifiCopied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Refined 2x2 Feature Navigation Grid */}
      <section className="px-4 mb-5">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="font-serif-headline text-base font-semibold text-[#292524] tracking-tight">
            Main Console
          </h2>
          <span className="text-[11px] font-mono-code uppercase tracking-wider text-[#A8A29E]">
            Quick Access
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Card 1: Venue Map */}
          <button
            onClick={() => onNavigate('map')}
            className="group flex flex-col justify-between text-left bg-white border border-[#E7E2D8] p-4 rounded-xl shadow-xs hover:border-[#A8A29E] active:scale-[0.98] transition-all"
            type="button"
          >
            <div className="flex items-center justify-between mb-3 w-full">
              <div className="w-10 h-10 rounded-lg bg-[#F3EFE6] border border-[#E7E2D8]/80 flex items-center justify-center text-[#292524]">
                <span className="material-symbols-outlined text-[20px]">explore</span>
              </div>
              <span className="material-symbols-outlined text-[#A8A29E] group-hover:text-[#292524] transition-colors text-[18px]">
                arrow_outward
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-[#292524] mb-0.5">Venue Map</h3>
              <p className="text-xs text-[#78716C] line-clamp-2">
                Interactive 3D floors & accessible routes
              </p>
            </div>
          </button>

          {/* Card 2: Schedule */}
          <button
            onClick={() => onNavigate('schedule')}
            className="group flex flex-col justify-between text-left bg-white border border-[#E7E2D8] p-4 rounded-xl shadow-xs hover:border-[#A8A29E] active:scale-[0.98] transition-all"
            type="button"
          >
            <div className="flex items-center justify-between mb-3 w-full">
              <div className="w-10 h-10 rounded-lg bg-[#F3EFE6] border border-[#E7E2D8]/80 flex items-center justify-center text-[#292524]">
                <span className="material-symbols-outlined text-[20px]">calendar_today</span>
              </div>
              <span className="material-symbols-outlined text-[#A8A29E] group-hover:text-[#292524] transition-colors text-[18px]">
                arrow_outward
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-[#292524] mb-0.5">Schedule</h3>
              <p className="text-xs text-[#78716C] line-clamp-2">Next: AI Keynote at 10:30 AM</p>
            </div>
          </button>

          {/* Card 3: Crowd Status */}
          <button
            onClick={() => onNavigate('crowd')}
            className="group flex flex-col justify-between text-left bg-white border border-[#E7E2D8] p-4 rounded-xl shadow-xs hover:border-[#A8A29E] active:scale-[0.98] transition-all"
            type="button"
          >
            <div className="flex items-center justify-between mb-3 w-full">
              <div className="relative w-10 h-10 rounded-lg bg-[#F3EFE6] border border-[#E7E2D8]/80 flex items-center justify-center text-[#292524]">
                <span className="material-symbols-outlined text-[20px]">radar</span>
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#B4533C]"></span>
              </div>
              <span className="material-symbols-outlined text-[#A8A29E] group-hover:text-[#292524] transition-colors text-[18px]">
                arrow_outward
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-[#292524] mb-0.5">Crowd Radar</h3>
              <p className="text-xs text-[#78716C] line-clamp-2">
                Low congestion at Stage A & Courtyard
              </p>
            </div>
          </button>

          {/* Card 4: Accessibility Mode Toggle */}
          <button
            onClick={() => {
              onToggleAccessibility();
              onShowToast(
                accessibilityMode
                  ? 'Standard accessibility view restored'
                  : 'High-contrast accessible routing enabled'
              );
            }}
            className="group flex flex-col justify-between text-left bg-white border border-[#E7E2D8] p-4 rounded-xl shadow-xs hover:border-[#A8A29E] active:scale-[0.98] transition-all"
            type="button"
          >
            <div className="flex items-center justify-between mb-3 w-full">
              <div className="w-10 h-10 rounded-lg bg-[#F3EFE6] border border-[#E7E2D8]/80 flex items-center justify-center text-[#292524]">
                <span className="material-symbols-outlined text-[20px]">accessible</span>
              </div>
              <div
                className={`px-2 py-0.5 rounded-full font-mono-code text-[10px] font-semibold ${
                  accessibilityMode
                    ? 'bg-[#292524] text-white'
                    : 'bg-[#F3EFE6] text-[#78716C]'
                }`}
              >
                {accessibilityMode ? 'Active' : 'Standard'}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-[#292524] mb-0.5">Accessibility</h3>
              <p className="text-xs text-[#78716C] line-clamp-2">
                High contrast, wheelchair paths & audio
              </p>
            </div>
          </button>
        </div>
      </section>

      {/* Live Venue Ambient Glance */}
      <section className="px-4 mb-4">
        <div 
          onClick={() => onNavigate('map')}
          className="cursor-pointer relative w-full rounded-xl overflow-hidden border border-[#E7E2D8] bg-[#3D2B1F] text-[#F7F4EE] group"
        >
          <img
            src={KEYNOTE_HERO_IMAGE}
            alt="Vibrant modern technology summit conference hall with warm ambient lighting"
            className="w-full h-36 object-cover opacity-50 group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#3D2B1F] via-[#3D2B1F]/60 to-transparent p-4 flex flex-col justify-end">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-[#D6C7B2] text-[11px] font-mono-code uppercase tracking-wider mb-0.5 font-medium">
                  <span className="material-symbols-outlined text-[14px]">podium</span>
                  <span>Stage Alpha Now</span>
                </div>
                <p className="font-serif-headline text-base text-[#F7F4EE] font-medium">
                  Opening Remarks & Keynote
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-mono-code text-xs font-semibold text-[#D6C7B2]">10:30 AM</span>
                <span className="text-[11px] text-[#F7F4EE]/70">Grand Ballroom</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic QR Code Detail Modal */}
      {showQrModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#292524]/40 backdrop-blur-sm"
          onClick={() => setShowQrModal(false)}
        >
          <div 
            className="w-full max-w-xs bg-white border border-[#E7E2D8] rounded-2xl p-6 shadow-2xl flex flex-col items-center text-center animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 rounded-full bg-[#E7E2D8] mb-4"></div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F3EFE6] border border-[#E7E2D8] text-[#78716C] font-mono-code text-[11px] mb-2 font-medium">
              VIP GATE SCANNER
            </div>
            <h3 className="font-serif-headline text-lg text-[#292524] font-semibold mb-0.5">
              Atharva
            </h3>
            <p className="text-xs text-[#78716C] mb-4">
              Present at turnstiles and VIP lounges
            </p>

            {/* QR Code Presentation */}
            <div className="p-3 bg-[#FBF9F5] border border-[#E7E2D8] rounded-xl mb-4">
              <svg className="w-40 h-40 text-[#292524]" fill="currentColor" viewBox="0 0 100 100">
                <rect fill="currentColor" height="28" rx="3" width="28" x="5" y="5"></rect>
                <rect fill="#FFFFFF" height="20" rx="1.5" width="20" x="9" y="9"></rect>
                <rect fill="currentColor" height="12" rx="1" width="12" x="13" y="13"></rect>
                <rect fill="currentColor" height="28" rx="3" width="28" x="67" y="5"></rect>
                <rect fill="#FFFFFF" height="20" rx="1.5" width="20" x="71" y="9"></rect>
                <rect fill="currentColor" height="12" rx="1" width="12" x="75" y="13"></rect>
                <rect fill="currentColor" height="28" rx="3" width="28" x="5" y="67"></rect>
                <rect fill="#FFFFFF" height="20" rx="1.5" width="20" x="9" y="71"></rect>
                <rect fill="currentColor" height="12" rx="1" width="12" x="13" y="75"></rect>
                <rect fill="currentColor" height="6" width="6" x="40" y="8"></rect>
                <rect fill="currentColor" height="6" width="6" x="52" y="14"></rect>
                <rect fill="currentColor" height="6" width="8" x="44" y="26"></rect>
                <rect fill="currentColor" height="10" width="6" x="8" y="42"></rect>
                <rect fill="currentColor" height="6" width="8" x="22" y="46"></rect>
                <rect fill="#71472F" height="16" rx="2" width="16" x="40" y="40"></rect>
                <rect fill="currentColor" height="12" width="6" x="64" y="44"></rect>
                <rect fill="currentColor" height="6" width="12" x="76" y="40"></rect>
                <rect fill="currentColor" height="8" width="8" x="42" y="68"></rect>
                <rect fill="currentColor" height="14" width="6" x="58" y="72"></rect>
                <rect fill="currentColor" height="6" width="16" x="74" y="68"></rect>
                <rect fill="currentColor" height="10" width="8" x="84" y="80"></rect>
              </svg>
            </div>

            <div className="w-full flex items-center justify-between bg-[#F3EFE6] px-3 py-1.5 rounded-lg mb-4 text-xs font-mono-code">
              <span className="text-[#A8A29E]">TOKEN</span>
              <span className="text-[#292524] font-semibold">EP-2025-9981</span>
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#292524] text-[#F7F4EE] hover:bg-[#3D2B1F] text-xs font-semibold tracking-wide transition-colors"
              type="button"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Refined Emergency SOS Floating Pill Button */}
      <aside className="fixed right-4 bottom-20 z-40">
        <button
          onClick={() => onNavigate('sos')}
          className="group inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-[#B4533C] text-white shadow-lg border border-white/20 active:scale-95 transition-all hover:bg-[#9E4530]"
          type="button"
          title="Direct Emergency SOS"
        >
          <span className="material-symbols-outlined text-[18px]">emergency</span>
          <span className="text-[11px] font-mono-code font-bold tracking-wider uppercase">SOS</span>
        </button>
      </aside>
    </div>
  );
};
