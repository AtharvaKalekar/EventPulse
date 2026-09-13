import React from 'react';
import { ScreenType, User } from '../types';
import { ALEX_VANCE_AVATAR } from '../data/mockData';

interface HeaderProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  unreadCount?: number;
  onOpenNotifications?: () => void;
  onToggleOrganizer?: () => void;
  isOrganizerView?: boolean;
  user?: User | null;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  unreadCount = 3,
  onOpenNotifications,
  onToggleOrganizer,
  isOrganizerView = false,
  user,
  onLogout
}) => {
  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'home':
        return "TechSummit '25";
      case 'map':
        return 'Venue Map';
      case 'schedule':
        return 'Schedule';
      case 'crowd':
        return 'Crowd Radar';
      case 'sos':
        return 'Emergency SOS';
      case 'organizer':
        return 'Command Center';
      default:
        return "TechSummit '25";
    }
  };

  return (
    <header className="fixed top-0 w-full z-40 pt-safe bg-[#F7F4EE]/90 backdrop-blur-md border-b border-[#E7E2D8]/80 transition-all">
      <div className="h-14 px-4 flex items-center justify-between max-w-5xl mx-auto">
        {/* Brand & Subtitle */}
        <div 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-7 h-7 rounded-lg bg-[#3D2B1F] text-[#F7F4EE] flex items-center justify-center font-serif-headline text-sm font-semibold tracking-wider group-hover:bg-[#71472F] transition-colors">
            E
          </div>
          <span className="font-serif-headline text-lg font-medium text-[#292524] tracking-tight">
            EventPulse
          </span>
          <span className="text-[#E7E2D8]">/</span>
          <span className="text-xs font-medium text-[#78716C] tracking-wide truncate max-w-[130px] sm:max-w-none">
            {getScreenTitle()}
          </span>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Switcher between Attendee & Organizer Command */}
          <button
            onClick={onToggleOrganizer}
            title={isOrganizerView ? "Switch to Attendee Mobile App" : "Switch to Organizer Incident Command Center"}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold font-sans-body transition-all border border-[#E7E2D8] bg-[#F3EFE6] text-[#292524] hover:bg-[#EAE4D8] active:scale-95"
          >
            <span className="material-symbols-outlined text-[15px] text-[#71472F]">
              {isOrganizerView ? 'smartphone' : 'monitoring'}
            </span>
            <span>{isOrganizerView ? 'Attendee App' : 'Incident Console'}</span>
          </button>

          {/* Notifications Trigger */}
          <button
            onClick={onOpenNotifications}
            className="relative w-9 h-9 flex items-center justify-center text-[#78716C] hover:text-[#292524] rounded-full hover:bg-[#EAE4D8]/50 transition-colors"
            title="View Live Notifications"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#B4533C]"></span>
            )}
          </button>

          {/* Avatar Profile */}
          <button
            onClick={onToggleOrganizer}
            title={`${user?.name || 'Atharva'} (${user?.role.toUpperCase() || 'Coordinator'}) - Tap to toggle Organizer Console`}
            className="w-8 h-8 rounded-full bg-[#F3EFE6] border border-[#E7E2D8] overflow-hidden flex items-center justify-center text-[#292524] font-medium text-xs ml-0.5 hover:ring-2 hover:ring-[#71472F]/30 transition-all"
            type="button"
          >
            <img 
              src={user?.avatarUrl || ALEX_VANCE_AVATAR} 
              alt={`${user?.name || 'User'} Profile`} 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span className="font-semibold text-[11px] text-[#292524]">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </span>
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              title="Sign Out of EventPulse"
              className="w-8 h-8 rounded-full bg-white border border-[#E7E2D8] text-[#78716C] hover:text-[#B4533C] hover:bg-[#FDF2EF] flex items-center justify-center transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
