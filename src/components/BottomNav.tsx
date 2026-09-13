import React from 'react';
import { ScreenType } from '../types';

interface BottomNavProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  return (
    <nav className="fixed bottom-0 w-full z-40 pb-safe bg-[#F7F4EE]/95 backdrop-blur-md border-t border-[#E7E2D8]/80 transition-all">
      <div className="h-16 px-4 flex items-center justify-around max-w-md mx-auto">
        {/* Home */}
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center min-w-[48px] transition-colors ${
            currentScreen === 'home' ? 'text-[#292524] font-semibold' : 'text-[#78716C] hover:text-[#292524]'
          }`}
        >
          <span className="material-symbols-outlined text-[21px]">home</span>
          <span className="text-[11px] font-medium mt-0.5">Home</span>
          <span
            className={`w-1 h-1 rounded-full mt-0.5 transition-all ${
              currentScreen === 'home' ? 'bg-[#292524]' : 'bg-transparent'
            }`}
          />
        </button>

        {/* Map */}
        <button
          onClick={() => onNavigate('map')}
          className={`flex flex-col items-center justify-center min-w-[48px] transition-colors ${
            currentScreen === 'map' ? 'text-[#71472F] font-semibold' : 'text-[#78716C] hover:text-[#292524]'
          }`}
        >
          <span className="material-symbols-outlined text-[21px]">map</span>
          <span className="text-[11px] font-medium mt-0.5">Map</span>
          <span
            className={`w-1 h-1 rounded-full mt-0.5 transition-all ${
              currentScreen === 'map' ? 'bg-[#71472F]' : 'bg-transparent'
            }`}
          />
        </button>

        {/* Center Prominent SOS Button */}
        <button
          onClick={() => onNavigate('sos')}
          className="flex flex-col items-center justify-center -mt-3.5 group min-w-[48px] px-1"
          title="Emergency SOS Dispatch"
        >
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center shadow-md transition-all active:scale-95 border border-white/40 ${
              currentScreen === 'sos'
                ? 'bg-[#9E4530] text-white ring-2 ring-[#B4533C]/40'
                : 'bg-[#B4533C] text-white hover:bg-[#9E4530]'
            }`}
          >
            <span className="material-symbols-outlined text-[21px]">emergency</span>
          </div>
          <span className="text-[10px] font-semibold tracking-wider uppercase text-[#B4533C] mt-0.5">
            SOS
          </span>
        </button>

        {/* Schedule */}
        <button
          onClick={() => onNavigate('schedule')}
          className={`flex flex-col items-center justify-center min-w-[48px] transition-colors ${
            currentScreen === 'schedule' ? 'text-[#292524] font-semibold' : 'text-[#78716C] hover:text-[#292524]'
          }`}
        >
          <span className="material-symbols-outlined text-[21px]">calendar_today</span>
          <span className="text-[11px] font-medium mt-0.5">Schedule</span>
          <span
            className={`w-1 h-1 rounded-full mt-0.5 transition-all ${
              currentScreen === 'schedule' ? 'bg-[#292524]' : 'bg-transparent'
            }`}
          />
        </button>

        {/* Crowd */}
        <button
          onClick={() => onNavigate('crowd')}
          className={`flex flex-col items-center justify-center min-w-[48px] transition-colors ${
            currentScreen === 'crowd' ? 'text-[#292524] font-semibold' : 'text-[#78716C] hover:text-[#292524]'
          }`}
        >
          <span className="material-symbols-outlined text-[21px]">groups</span>
          <span className="text-[11px] font-medium mt-0.5">Crowd</span>
          <span
            className={`w-1 h-1 rounded-full mt-0.5 transition-all ${
              currentScreen === 'crowd' ? 'bg-[#292524]' : 'bg-transparent'
            }`}
          />
        </button>
      </div>
    </nav>
  );
};
