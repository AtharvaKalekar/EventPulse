import React, { useState, useMemo } from 'react';
import { POIData } from '../types';
import { VENUE_POIS } from '../data/mockData';

interface VenueMapScreenProps {
  onShowToast: (message: string) => void;
  accessibilityMode: boolean;
  onToggleAccessibility: () => void;
}

const LEVEL_2_POIS: POIData[] = [
  {
    id: 'vip-lounge',
    name: 'VIP Executive Lounge',
    zone: 'Level 2 Mezzanine',
    category: 'food',
    status: 'VIP Access Only',
    distance: '110 m',
    walkTime: '1.5 min',
    stepFree: true,
    icon: 'star',
    x: 95,
    y: 110,
    description: 'Exclusive executive lounge with complimentary espresso, high-speed private Wi-Fi, and networking bays.'
  },
  {
    id: 'speaker-room',
    name: 'Speaker Green Room',
    zone: 'Level 2 East Wing',
    category: 'help',
    status: 'Restricted',
    distance: '160 m',
    walkTime: '2.5 min',
    stepFree: true,
    icon: 'mic',
    x: 290,
    y: 114,
    description: 'Keynote speakers preparation suite with stage AV monitors and private rehearsal spaces.'
  },
  {
    id: 'skybridge-cafe',
    name: 'Skybridge Specialty Coffee',
    zone: 'Concourse Skywalk',
    category: 'food',
    status: 'Short Line (~2 min)',
    distance: '130 m',
    walkTime: '2 min',
    stepFree: true,
    icon: 'coffee',
    x: 140,
    y: 236,
    description: 'Artisanal pour-overs, nitro cold brew, and quiet seating overlooking the central atrium.'
  },
  {
    id: 'tech-lab-mezzanine',
    name: 'AI Innovation Hub',
    zone: 'Level 2 Tech Pavilion',
    category: 'stages',
    status: 'Open Demo',
    distance: '190 m',
    walkTime: '3 min',
    stepFree: true,
    icon: 'psychology',
    x: 108,
    y: 342,
    description: 'Hands-on edge computing stations, robotics demonstrations, and partner tech booths.'
  },
  {
    id: 'l2-restrooms',
    name: 'Level 2 Quiet Restrooms',
    zone: 'Level 2 East Wing',
    category: 'restrooms',
    status: 'Zero Wait',
    distance: '150 m',
    walkTime: '2 min',
    stepFree: true,
    icon: 'wc',
    x: 275,
    y: 340,
    description: 'Spacious all-gender accessible restrooms with automated sensory touchpoints.'
  }
];

export const VenueMapScreen: React.FC<VenueMapScreenProps> = ({
  onShowToast,
  accessibilityMode,
  onToggleAccessibility
}) => {
  const [currentFloor, setCurrentFloor] = useState<'L1' | 'L2'>('L1');
  const [is3dMode, setIs3dMode] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [showStepFreeRoutes, setShowStepFreeRoutes] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [bookmarkedPois, setBookmarkedPois] = useState<Record<string, boolean>>({ 'main-stage': true });
  const [navigatingToPoi, setNavigatingToPoi] = useState<POIData | null>(null);

  const activePoisList = currentFloor === 'L1' ? VENUE_POIS : LEVEL_2_POIS;

  const [selectedPoi, setSelectedPoi] = useState<POIData>(activePoisList[0]);

  // Handle floor switch
  const handleFloorChange = (floor: 'L1' | 'L2') => {
    setCurrentFloor(floor);
    const newList = floor === 'L1' ? VENUE_POIS : LEVEL_2_POIS;
    setSelectedPoi(newList[0]);
    onShowToast(`Switched to Floor ${floor}: ${floor === 'L1' ? 'Main Halls & Expo' : 'Mezzanine & VIP Lounges'}`);
  };

  const handleToggle3D = () => {
    setIs3dMode(prev => {
      const next = !prev;
      onShowToast(next ? '3D Isometric Architectural View ON' : '2D Top-Down Blueprint View ON');
      return next;
    });
  };

  const filteredPois = useMemo(() => {
    return activePoisList.filter(poi => {
      // Category filter
      if (activeFilter === 'stages' && poi.category !== 'stages') return false;
      if (activeFilter === 'food' && poi.category !== 'food') return false;
      if (activeFilter === 'restrooms' && poi.category !== 'restrooms') return false;
      if (activeFilter === 'help' && poi.category !== 'help') return false;
      if (activeFilter === 'accessible' && !poi.stepFree) return false;

      // Text Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          poi.name.toLowerCase().includes(q) ||
          poi.zone.toLowerCase().includes(q) ||
          poi.description.toLowerCase().includes(q) ||
          poi.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [activePoisList, activeFilter, searchQuery]);

  const handleToggleBookmark = (poiId: string, poiName: string) => {
    setBookmarkedPois(prev => {
      const next = !prev[poiId];
      onShowToast(next ? `Saved ${poiName} to bookmarks` : `Removed ${poiName} from bookmarks`);
      return { ...prev, [poiId]: next };
    });
  };

  const handleStartDirections = (poi: POIData) => {
    setNavigatingToPoi(poi);
    setSelectedPoi(poi);
    onShowToast(`Step-free route calculated to ${poi.name} (~${poi.walkTime})`);
  };

  const handleCancelNavigation = () => {
    setNavigatingToPoi(null);
    onShowToast('Turn-by-turn navigation ended');
  };

  const handleAudioGuide = (poi: POIData) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        `Proceed straight ahead 60 meters towards ${poi.name}. Located in ${poi.zone}.`
      );
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
    onShowToast(`Audio guide: Proceed straight ahead towards ${poi.name} (${poi.zone})`);
  };

  return (
    <div className="flex flex-col w-full pb-28 max-w-lg mx-auto relative select-none">
      {/* Top Search & Filter Bar Strip */}
      <div className="sticky top-14 z-30 bg-[#F7F4EE]/95 backdrop-blur-md px-4 py-2.5 border-b border-[#E7E2D8]/80 flex flex-col gap-2 shadow-xs">
        {/* Search Input Bar */}
        <div className="relative flex items-center w-full">
          <span className="material-symbols-outlined absolute left-3 text-[18px] text-[#78716C] pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${currentFloor} stages, restrooms, food, help...`}
            className="w-full pl-9 pr-8 py-2 bg-white border border-[#E7E2D8] rounded-xl text-xs text-[#292524] placeholder-[#A8A29E] focus:outline-none focus:border-[#71472F] transition-colors shadow-2xs font-sans-body"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 p-1 text-[#78716C] hover:text-[#292524]"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {[
            { id: 'all', label: 'All', icon: 'tune' },
            { id: 'stages', label: 'Stages', icon: 'theater_comedy' },
            { id: 'food', label: 'Food & Coffee', icon: 'restaurant' },
            { id: 'restrooms', label: 'Restrooms', icon: 'wc' },
            { id: 'help', label: 'Help & First-Aid', icon: 'support_agent' },
            { id: 'accessible', label: 'Accessible Only', icon: 'accessible_forward' }
          ].map(chip => (
            <button
              key={chip.id}
              onClick={() => setActiveFilter(chip.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-sans-body text-[11.5px] shrink-0 font-medium transition-all active:scale-95 ${
                activeFilter === chip.id
                  ? 'bg-[#71472F] text-[#FAF7F2] shadow-xs'
                  : 'bg-[#EAE1DA] text-[#51443E] hover:bg-[#E2D8D2]'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[14px]">{chip.icon}</span>
              <span>{chip.label}</span>
            </button>
          ))}
        </div>

        {/* Step-Free Path Toggle Switch Bar */}
        <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#F5F1E8] border border-[#E7DFD5]">
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-[17px] text-[#71472F]">accessible</span>
            <span className="font-sans-body text-[11.5px] text-[#292524] truncate font-medium">
              Step-free accessible guidance
            </span>
          </div>
          <button
            onClick={() => {
              setShowStepFreeRoutes(!showStepFreeRoutes);
              onShowToast(
                !showStepFreeRoutes
                  ? 'High-contrast step-free paths visible'
                  : 'Standard navigation mode active'
              );
            }}
            aria-checked={showStepFreeRoutes}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
              showStepFreeRoutes ? 'bg-[#71472F]' : 'bg-[#D5C3BA]'
            }`}
            role="switch"
            type="button"
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
                showStepFreeRoutes ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Active Navigation Banner Overlay */}
      {navigatingToPoi && (
        <div className="z-30 bg-[#3D2B1F] text-[#F7F4EE] px-4 py-3 border-b border-[#292524] shadow-md flex items-center justify-between gap-3 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#71472F] flex items-center justify-center shrink-0 border border-white/20">
              <span className="material-symbols-outlined text-[18px] text-[#F7F4EE]">navigation</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-mono-code text-[10px] text-[#D6C7B2] uppercase tracking-wider font-semibold">
                Live Wayfinding Active
              </span>
              <span className="font-serif-headline text-sm font-semibold truncate text-[#F7F4EE]">
                {navigatingToPoi.name}
              </span>
              <span className="text-[11px] text-[#D6C7B2]/90 truncate">
                {navigatingToPoi.distance} • ~{navigatingToPoi.walkTime} via step-free route
              </span>
            </div>
          </div>
          <button
            onClick={handleCancelNavigation}
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[#F7F4EE] text-xs font-semibold shrink-0 transition-colors"
            type="button"
          >
            End Route
          </button>
        </div>
      )}

      {/* Interactive Blueprint & 3D Isometric Canvas Container */}
      <div 
        className="relative w-full h-[470px] bg-[#F5F1E8] overflow-hidden touch-none"
        style={{ perspective: '1000px' }}
      >
        {/* SVG & Markers Wrapper Canvas */}
        <div 
          className="w-full h-full transition-transform duration-500 ease-out origin-center relative"
          style={{ 
            transform: is3dMode 
              ? `rotateX(52deg) rotateZ(-26deg) scale(${zoomLevel * 0.95}) translateY(-15px)` 
              : `scale(${zoomLevel})`,
            transformStyle: 'preserve-3d'
          }}
        >
          <svg
            className="w-full h-full"
            viewBox="0 0 390 470"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              filter: is3dMode ? 'drop-shadow(10px 18px 20px rgba(61,43,31,0.22))' : 'none'
            }}
          >
            <defs>
              <pattern id="gridPattern" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#E2D8D2" strokeOpacity="0.6" strokeWidth="0.75" />
              </pattern>
              <linearGradient id="routeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8C5E45" />
                <stop offset="50%" stopColor="#B4533C" />
                <stop offset="100%" stopColor="#71472F" />
              </linearGradient>
            </defs>

            {/* Background Blueprint Grid */}
            <rect width="100%" height="100%" fill="url(#gridPattern)" />

            {/* Outer Hall Perimeter Shell */}
            <path
              d="M 24 38 H 366 V 438 H 24 Z"
              fill="#FAF8F5"
              rx="14"
              stroke="#D8D0C4"
              strokeWidth="1.5"
            />

            {/* Room 1: Northwest Stage / Lounge */}
            <path
              d="M 38 52 H 210 V 162 H 38 Z"
              fill={selectedPoi.id === activePoisList[0].id ? '#EDE3D8' : '#F0EAE2'}
              rx="10"
              stroke={selectedPoi.id === activePoisList[0].id ? '#8C5E45' : '#D8D0C4'}
              strokeWidth={selectedPoi.id === activePoisList[0].id ? '2.5' : '1'}
              className="cursor-pointer transition-colors hover:fill-[#EDE3D8]/60"
              onClick={() => setSelectedPoi(activePoisList[0])}
            />
            <text x="50" y="74" fill="#68635F" fontFamily="Manrope" fontSize="10" fontWeight="700" letterSpacing="0.06em">
              {currentFloor === 'L1' ? 'HALL A • MAIN STAGE' : 'MEZZANINE • VIP LOUNGE'}
            </text>

            {/* Seating / Booth schematics */}
            <path d="M 52 94 Q 124 108 196 94" stroke="#D5C3BA" strokeWidth="1.5" strokeDasharray="3 3" strokeLinecap="round" />
            <path d="M 52 112 Q 124 126 196 112" stroke="#D5C3BA" strokeWidth="1.5" strokeDasharray="3 3" strokeLinecap="round" />
            <path d="M 52 130 Q 124 144 196 130" stroke="#D5C3BA" strokeWidth="1.5" strokeDasharray="3 3" strokeLinecap="round" />

            {/* Room 2: Northeast Workshop / Green Room */}
            <path
              d="M 230 52 H 352 V 162 H 230 Z"
              fill={selectedPoi.id === activePoisList[1].id ? '#EDE3D8' : '#F5F1E8'}
              rx="10"
              stroke={selectedPoi.id === activePoisList[1].id ? '#8C5E45' : '#D8D0C4'}
              strokeWidth={selectedPoi.id === activePoisList[1].id ? '2.5' : '1'}
              className="cursor-pointer transition-colors hover:fill-[#EDE3D8]/60"
              onClick={() => setSelectedPoi(activePoisList[1])}
            />
            <text x="240" y="74" fill="#78716C" fontFamily="Manrope" fontSize="9.5" fontWeight="600" letterSpacing="0.04em">
              {currentFloor === 'L1' ? 'WORKSHOP HALL B' : 'SPEAKER GREEN ROOM'}
            </text>
            <circle cx="260" cy="112" r="14" fill="#EAE1DA" fillOpacity="0.7" />
            <circle cx="316" cy="112" r="14" fill="#EAE1DA" fillOpacity="0.7" />

            {/* Central Atrium & Concourse */}
            <path
              d="M 38 184 H 352 V 264 H 38 Z"
              fill="#FFFFFF"
              rx="8"
              stroke="#E7DFD5"
              strokeWidth="1"
            />
            <text x="142" y="228" fill="#A8A29E" fontFamily="Manrope" fontSize="9" fontWeight="600" letterSpacing="0.12em">
              {currentFloor === 'L1' ? 'CENTRAL CONCOURSE' : 'SKYWALK CONCOURSE'}
            </text>

            {/* Room 3: Southwest Dining / AI Hub */}
            <path
              d="M 38 286 H 180 V 418 H 38 Z"
              fill={selectedPoi.id === activePoisList[3]?.id ? '#EDE3D8' : '#F5F1E8'}
              rx="10"
              stroke={selectedPoi.id === activePoisList[3]?.id ? '#8C5E45' : '#D8D0C4'}
              strokeWidth={selectedPoi.id === activePoisList[3]?.id ? '2.5' : '1'}
              className="cursor-pointer transition-colors hover:fill-[#EDE3D8]/60"
              onClick={() => activePoisList[3] && setSelectedPoi(activePoisList[3])}
            />
            <text x="50" y="306" fill="#78716C" fontFamily="Manrope" fontSize="9.5" fontWeight="600" letterSpacing="0.04em">
              {currentFloor === 'L1' ? 'FOOD & DRINK' : 'AI INNOVATION HUB'}
            </text>
            <rect x="52" y="324" width="46" height="22" rx="4" fill="#EAE1DA" fillOpacity="0.8" />
            <rect x="112" y="324" width="46" height="22" rx="4" fill="#EAE1DA" fillOpacity="0.8" />
            <rect x="52" y="364" width="106" height="16" rx="4" fill="#F0E6E0" />

            {/* Room 4: Southeast Amenities */}
            <path
              d="M 202 286 H 352 V 418 H 202 Z"
              fill="#F5F1E8"
              rx="10"
              stroke="#D8D0C4"
              strokeWidth="1"
            />
            <text x="216" y="306" fill="#78716C" fontFamily="Manrope" fontSize="9.5" fontWeight="600" letterSpacing="0.04em">
              AMENITIES WING
            </text>
            <line x1="202" y1="344" x2="352" y2="344" stroke="#D8D0C4" strokeWidth="1" />
            <line x1="277" y1="344" x2="277" y2="418" stroke="#D8D0C4" strokeWidth="1" />

            {/* Step-Free High-Contrast Accessible Route Paths */}
            {showStepFreeRoutes && (
              <g className="transition-opacity duration-300 opacity-100">
                {/* Main South Entrance to Concourse and Main Stage */}
                <path
                  d="M 195 440 L 195 242 L 124 242 L 124 162"
                  fill="none"
                  stroke="url(#routeGradient)"
                  strokeWidth="3.5"
                  strokeDasharray="8 6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={navigatingToPoi ? "animate-map-dash" : ""}
                />
                {/* Fork to First-Aid */}
                <path
                  d="M 195 382 L 314 382"
                  fill="none"
                  stroke="#8C5E45"
                  strokeWidth="3"
                  strokeDasharray="6 5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={navigatingToPoi ? "animate-map-dash" : ""}
                />
                {/* Fork to Accessible Restrooms */}
                <path
                  d="M 195 324 L 240 324"
                  fill="none"
                  opacity="0.85"
                  stroke="#8C5E45"
                  strokeWidth="2.5"
                  strokeDasharray="5 4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Step-Free Elevator / Ramp Glyph */}
                <circle cx="195" cy="382" r="4.5" fill="#71472F" />
                <circle cx="195" cy="382" r="2" fill="#FAF8F5" />
              </g>
            )}

            {/* South Entrance Badge */}
            <g transform="translate(145, 428)">
              <rect width="100" height="20" rx="10" fill="#4A4642" />
              <text x="50" y="13.5" fill="#FAF8F5" fontFamily="Manrope" fontSize="8.5" fontWeight="600" letterSpacing="0.04em" textAnchor="middle">
                {currentFloor === 'L1' ? 'LEVEL 1 ENTRY' : 'LEVEL 2 SKYWAY'}
              </text>
            </g>
          </svg>

          {/* INTERACTIVE MAP PIN MARKERS (Counter-rotated in 3D Mode so pins stand upright!) */}
          {filteredPois.map(poi => {
            const isSelected = selectedPoi.id === poi.id;
            return (
              <div
                key={poi.id}
                onClick={() => setSelectedPoi(poi)}
                className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer flex flex-col items-center group transition-all duration-300 ${
                  isSelected ? 'scale-110 z-30' : 'hover:scale-105'
                }`}
                style={{ 
                  left: `${poi.x}px`, 
                  top: `${poi.y}px`,
                  transform: is3dMode 
                    ? `translate(-50%, -50%) rotateZ(26deg) rotateX(-52deg) translateZ(28px) ${isSelected ? 'scale(1.15)' : ''}`
                    : `translate(-50%, -50%) ${isSelected ? 'scale(1.1)' : ''}`,
                  transformStyle: 'preserve-3d'
                }}
              >
                <div className="relative flex items-center justify-center">
                  {isSelected && (
                    <span className="absolute w-10 h-10 rounded-full bg-[#71472F]/20 animate-ping"></span>
                  )}
                  <div
                    className={`relative w-8.5 h-8.5 rounded-full flex items-center justify-center shadow-md border transition-all ${
                      isSelected
                        ? 'bg-[#71472F] text-white border-white ring-2 ring-[#71472F]/40'
                        : 'bg-white text-[#71472F] border-[#D5C3BA] hover:bg-[#FDFBF7]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{poi.icon}</span>
                  </div>
                </div>
                <div className="mt-1 px-2 py-0.5 rounded-md bg-white/95 border border-[#E7DFD5] shadow-xs whitespace-nowrap">
                  <span className="font-sans-body text-[10px] font-bold text-[#292524]">
                    {poi.name.split(' ')[0]}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Current User Location Beacon */}
          <div
            className="absolute top-[436px] left-[195px] z-20 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none transition-all duration-300"
            style={{
              transform: is3dMode 
                ? 'translate(-50%, -50%) rotateZ(26deg) rotateX(-52deg) translateZ(16px)'
                : 'translate(-50%, -50%)'
            }}
            title="Your current position (South Entry)"
          >
            <span className="absolute w-7 h-7 rounded-full bg-[#71472F]/25 animate-ping"></span>
            <div className="w-4 h-4 rounded-full bg-[#71472F] border-2 border-white shadow-md"></div>
          </div>
        </div>

        {/* FLOATING MAP CONTROLS (Vertical Stack on right) */}
        <div className="absolute right-3.5 top-3.5 flex flex-col gap-1.5 z-20">
          {/* 3D / 2D PERSPECTIVE TOGGLE BUTTON */}
          <button
            onClick={handleToggle3D}
            className={`h-8 px-2.5 rounded-lg border shadow-xs flex items-center gap-1 font-mono-code text-[10.5px] font-bold transition-all active:scale-95 ${
              is3dMode 
                ? 'bg-[#71472F] text-white border-[#5C3925]' 
                : 'bg-white text-[#71472F] border-[#E7DFD5] hover:bg-[#FAF8F5]'
            }`}
            title="Toggle 2D Top-Down / 3D Isometric View"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">
              {is3dMode ? '3d_rotation' : 'view_in_ar'}
            </span>
            <span>{is3dMode ? '3D ON' : '2D PLAN'}</span>
          </button>

          {/* Compass / Orientation */}
          <button
            onClick={() => onShowToast('Compass aligned: Facing North towards Main Hall')}
            className="w-8 h-8 rounded-lg bg-white border border-[#E7DFD5] shadow-xs flex items-center justify-center text-[#71472F] hover:bg-[#FAF8F5] transition-transform active:scale-95"
            title="Compass Orient North"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]" style={{ transform: 'rotate(-35deg)' }}>
              explore
            </span>
          </button>

          {/* Zoom In & Out */}
          <div className="flex flex-col bg-white border border-[#E7DFD5] rounded-lg shadow-xs overflow-hidden divide-y divide-[#E7DFD5]">
            <button
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.15, 1.4))}
              className="w-8 h-8 flex items-center justify-center text-[#292524] hover:bg-[#FAF8F5] transition-colors active:scale-95"
              title="Zoom In"
              type="button"
            >
              <span className="material-symbols-outlined text-[17px]">add</span>
            </button>
            <button
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 0.85))}
              className="w-8 h-8 flex items-center justify-center text-[#292524] hover:bg-[#FAF8F5] transition-colors active:scale-95"
              title="Zoom Out"
              type="button"
            >
              <span className="material-symbols-outlined text-[17px]">remove</span>
            </button>
          </div>

          {/* Re-Center Target */}
          <button
            onClick={() => {
              setZoomLevel(1);
              setSelectedPoi(activePoisList[0]);
              onShowToast('Map recentered to Current Position');
            }}
            className="w-8 h-8 rounded-lg bg-white border border-[#E7DFD5] shadow-xs flex items-center justify-center text-[#292524] hover:bg-[#FAF8F5] transition-transform active:scale-95"
            title="Recenter Map"
            type="button"
          >
            <span className="material-symbols-outlined text-[17px]">my_location</span>
          </button>
        </div>

        {/* FLOOR LEVEL SWITCHER & 3D VIEW TOGGLE (L1 / L2 / 3D Pill) */}
        <div className="absolute left-3.5 top-3.5 z-20 flex items-center bg-white border border-[#E7DFD5] p-0.5 rounded-lg shadow-md divide-x divide-[#E7DFD5]">
          <div className="flex p-0.5 gap-0.5">
            <button
              onClick={() => handleFloorChange('L1')}
              className={`px-2.5 py-1 rounded font-sans-body text-[11.5px] font-semibold transition-colors ${
                currentFloor === 'L1' ? 'bg-[#71472F] text-[#FAF7F2]' : 'text-[#78716C] hover:text-[#292524]'
              }`}
              type="button"
            >
              Level 1
            </button>
            <button
              onClick={() => handleFloorChange('L2')}
              className={`px-2.5 py-1 rounded font-sans-body text-[11.5px] font-semibold transition-colors ${
                currentFloor === 'L2' ? 'bg-[#71472F] text-[#FAF7F2]' : 'text-[#78716C] hover:text-[#292524]'
              }`}
              type="button"
            >
              Level 2
            </button>
          </div>

          <button
            onClick={handleToggle3D}
            className={`px-2.5 py-1 rounded font-sans-body text-[11.5px] font-bold flex items-center gap-1 transition-all active:scale-95 ml-0.5 ${
              is3dMode 
                ? 'bg-[#B4533C] text-white shadow-xs' 
                : 'bg-[#F5F1E8] text-[#71472F] hover:bg-[#EAE1DA]'
            }`}
            title="Toggle 3D Architectural Perspective View"
            type="button"
          >
            <span className="material-symbols-outlined text-[15px]">
              {is3dMode ? '3d_rotation' : 'view_in_ar'}
            </span>
            <span>{is3dMode ? '3D Active' : '3D View'}</span>
          </button>
        </div>
      </div>

      {/* QUICK MATCHES HORIZONTAL CAROUSEL (When Search / Filter is Active) */}
      {searchQuery && (
        <div className="px-4 pt-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-mono-code uppercase text-[#78716C] font-semibold">
              Search Results ({filteredPois.length})
            </span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {filteredPois.length === 0 ? (
              <span className="text-xs text-[#78716C]">No points of interest match "{searchQuery}".</span>
            ) : (
              filteredPois.map(poi => (
                <button
                  key={poi.id}
                  onClick={() => setSelectedPoi(poi)}
                  className={`shrink-0 px-3 py-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                    selectedPoi.id === poi.id
                      ? 'bg-[#3D2B1F] text-white border-[#292524]'
                      : 'bg-white text-[#292524] border-[#E7DFD5] hover:border-[#A8A29E]'
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">{poi.icon}</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold leading-tight">{poi.name}</span>
                    <span className="text-[10px] opacity-75 font-mono-code">{poi.distance} • {poi.walkTime}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* BOTTOM SHEET OVERLAY CARD: Selected POI Details & Actions */}
      <div className="w-full px-4 mt-3 pb-3 z-30">
        <div className="bg-white rounded-2xl p-4 border border-[#E7DFD5] shadow-lg flex flex-col gap-3 relative animate-in fade-in duration-200">
          {/* Top Grab Bar Decorator */}
          <div className="w-8 h-1 rounded-full bg-[#D5C3BA] self-center -mt-1"></div>

          {/* Header & Status */}
          <div className="flex items-start justify-between gap-3 pt-0.5">
            <div className="flex flex-col min-w-0">
              <span className="font-sans-body text-[11px] text-[#78716C] uppercase tracking-wider font-semibold">
                {selectedPoi.zone}
              </span>
              <h2 className="font-serif-headline text-[22px] text-[#292524] font-semibold truncate leading-tight">
                {selectedPoi.name}
              </h2>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F5F1E8] border border-[#E7DFD5] text-[#71472F] font-sans-body text-[11px] shrink-0 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#71472F] animate-pulse"></span>
              <span>{selectedPoi.status}</span>
            </span>
          </div>

          <p className="text-xs text-[#78716C] leading-relaxed line-clamp-2">
            {selectedPoi.description}
          </p>

          {/* Walking Meta & Step-Free Confirmation */}
          <div className="flex items-center justify-between text-[#78716C] text-[13px] border-y border-[#F5F1E8] py-2 font-medium">
            <div className="flex items-center gap-1.5 text-[#292524]">
              <span className="material-symbols-outlined text-[18px] text-[#71472F]">directions_walk</span>
              <span>{selectedPoi.distance} • ~{selectedPoi.walkTime}</span>
            </div>
            <div className="flex items-center gap-1 text-[#71472F] font-sans-body text-[11.5px] font-semibold">
              <span className="material-symbols-outlined text-[15px]">accessible</span>
              <span>Step-free verified</span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2 pt-0.5">
            <button
              onClick={() => handleStartDirections(selectedPoi)}
              className={`flex-1 flex items-center justify-center gap-2 h-10.5 px-4 rounded-xl text-[#FAF7F2] font-sans-body text-[13px] font-semibold transition-all active:scale-[0.99] shadow-xs ${
                navigatingToPoi?.id === selectedPoi.id
                  ? 'bg-[#3D2B1F]'
                  : 'bg-[#71472F] hover:bg-[#5C3925]'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">navigation</span>
              <span>{navigatingToPoi?.id === selectedPoi.id ? 'Rerouting Active' : 'Get Directions'}</span>
            </button>

            <button
              onClick={() => handleAudioGuide(selectedPoi)}
              className="w-10.5 h-10.5 flex items-center justify-center rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-[#625E59] hover:text-[#292524] transition-colors active:scale-95"
              title="Listen to Audio Guidance"
              type="button"
            >
              <span className="material-symbols-outlined text-[19px]">volume_up</span>
            </button>

            <button
              onClick={() => handleToggleBookmark(selectedPoi.id, selectedPoi.name)}
              className="w-10.5 h-10.5 flex items-center justify-center rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] transition-colors active:scale-95"
              title="Bookmark Location"
              type="button"
            >
              <span
                className={`material-symbols-outlined text-[19px] ${
                  bookmarkedPois[selectedPoi.id] ? 'text-[#71472F]' : 'text-[#625E59]'
                }`}
              >
                {bookmarkedPois[selectedPoi.id] ? 'bookmark' : 'bookmark_border'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
