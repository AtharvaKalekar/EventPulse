import React, { useState, useRef } from 'react';
import { ScreenType } from '../types';
import { createIncident } from '../services/api';

interface EmergencySOSScreenProps {
  onBack: () => void;
  onNavigate: (screen: ScreenType) => void;
  onShowToast: (message: string) => void;
}

export const EmergencySOSScreen: React.FC<EmergencySOSScreenProps> = ({
  onBack,
  onNavigate,
  onShowToast
}) => {
  const [selectedIncident, setSelectedIncident] = useState<'medical' | 'security' | 'help' | 'accessibility'>('medical');
  const [currentZone, setCurrentZone] = useState('Main Stage — Hall A');
  const [showZoneDropdown, setShowZoneDropdown] = useState(false);
  const [alertSent, setAlertSent] = useState(true);
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);

  const holdIntervalRef = useRef<any>(null);

  const incidentResponders: Record<string, { unit: string; eta: string; station: string; distance: string }> = {
    medical: {
      unit: 'First-Aid Unit Alpha',
      eta: '2 min',
      station: 'First-Aid Station 1',
      distance: '40m away'
    },
    security: {
      unit: 'Security Unit 4 (Patrol)',
      eta: '1.5 min',
      station: 'West Gate Security Post',
      distance: '65m away'
    },
    help: {
      unit: 'Venue Escort Patrol',
      eta: '3 min',
      station: 'Central Concourse Information',
      distance: '80m away'
    },
    accessibility: {
      unit: 'Mobility Support Squad',
      eta: '2.5 min',
      station: 'Ramp B Accessibility Annex',
      distance: '50m away'
    }
  };

  const startHold = () => {
    setIsHolding(true);
    let progress = 0;
    clearInterval(holdIntervalRef.current);
    holdIntervalRef.current = setInterval(() => {
      progress += 5;
      setHoldProgress(progress);
      if (progress >= 100) {
        clearInterval(holdIntervalRef.current);
        triggerDispatchSuccess();
      }
    }, 90);
  };

  const cancelHold = () => {
    clearInterval(holdIntervalRef.current);
    setIsHolding(false);
    setHoldProgress(0);
  };

  const triggerDispatchSuccess = async () => {
    setIsHolding(false);
    setHoldProgress(0);
    setAlertSent(true);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
    await createIncident({
      type: selectedIncident,
      typeLabel: selectedIncident.charAt(0).toUpperCase() + selectedIncident.slice(1),
      icon: selectedIncident === 'medical' ? 'medical_services' : selectedIncident === 'security' ? 'shield' : selectedIncident === 'accessibility' ? 'accessible' : 'help_center',
      zone: currentZone,
      locationDetail: 'Attendee Live Beacon Position',
      reportedBy: `Attendee #${Math.floor(1000 + Math.random() * 9000)}`,
      isUrgent: true
    });
    onShowToast(`High-priority ${selectedIncident.toUpperCase()} alert broadcasted! Responders notified.`);
  };

  const currentResponder = incidentResponders[selectedIncident];

  return (
    <div className="flex flex-col w-full pb-28 max-w-lg mx-auto select-none">
      {/* Reassuring Triage Ambient Ribbon */}
      <div className="px-4 py-2.5 bg-[#FAF5EE] border-b border-[#E7E1D7] flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[17px] text-[#B84234] animate-pulse">
            crisis_alert
          </span>
          <span className="font-mono-code text-[11px] uppercase tracking-wider text-[#8C5E45] font-bold">
            Event Response Command Linked
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-[#F1E8DC] px-2.5 py-1 rounded-full border border-[#E2D8CC]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B84234] animate-ping"></span>
          <span className="font-mono-code text-[11px] text-[#44403C] font-semibold">
            99.8% RT-GPS Lock
          </span>
        </div>
      </div>

      <div className="px-4 flex flex-col gap-5 pt-4">
        {/* Calm Assurance Header */}
        <div className="flex flex-col gap-1 text-center">
          <span className="font-sans-body text-[11px] uppercase tracking-widest text-[#B84234] font-bold">
            Priority Operational Safety
          </span>
          <h1 className="font-serif-headline text-[28px] font-normal text-[#292524] tracking-tight">
            Emergency Response
          </h1>
          <p className="font-sans-body text-[13px] text-[#78716C] max-w-xs mx-auto leading-relaxed">
            Stay where you are if safe. First responders immediately receive your telemetry upon activation.
          </p>
        </div>

        {/* Category Selector (Grid of 4) */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <label className="font-sans-body text-[11px] uppercase tracking-wider text-[#78716C] font-bold">
              Incident Classification
            </label>
            <span className="font-sans-body text-[11px] text-[#B84234] font-bold">
              1 Type Selected
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Medical */}
            <button
              onClick={() => setSelectedIncident('medical')}
              className={`relative flex items-center gap-2.5 p-3 rounded-xl text-left transition-all duration-200 ${
                selectedIncident === 'medical'
                  ? 'shadow-sm bg-[#FDF5F3] border-2 border-[#B84234] text-[#292524]'
                  : 'bg-white border border-[#E7E1D7] hover:border-[#D5C3BA] shadow-xs text-[#292524]'
              }`}
              type="button"
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 shadow-xs ${
                  selectedIncident === 'medical'
                    ? 'bg-[#B84234] text-white'
                    : 'bg-[#F5EFE6] text-[#8C5E45]'
                }`}
              >
                <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  medical_services
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-sans-body text-[14px] font-bold text-[#292524] leading-tight">Medical</p>
                <p className="font-sans-body text-[12px] text-[#8C5E45] truncate">First-aid, triage</p>
              </div>
              {selectedIncident === 'medical' && (
                <span className="absolute top-2 right-2 material-symbols-outlined text-[18px] text-[#B84234]">
                  check_circle
                </span>
              )}
            </button>

            {/* Security */}
            <button
              onClick={() => setSelectedIncident('security')}
              className={`relative flex items-center gap-2.5 p-3 rounded-xl text-left transition-all duration-200 ${
                selectedIncident === 'security'
                  ? 'shadow-sm bg-[#FDF5F3] border-2 border-[#B84234] text-[#292524]'
                  : 'bg-white border border-[#E7E1D7] hover:border-[#D5C3BA] shadow-xs text-[#292524]'
              }`}
              type="button"
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 shadow-xs ${
                  selectedIncident === 'security'
                    ? 'bg-[#B84234] text-white'
                    : 'bg-[#F5EFE6] text-[#8C5E45]'
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">security</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-sans-body text-[14px] font-bold text-[#292524] leading-tight">Security</p>
                <p className="font-sans-body text-[12px] text-[#78716C] truncate">Threat, crowd crush</p>
              </div>
              {selectedIncident === 'security' && (
                <span className="absolute top-2 right-2 material-symbols-outlined text-[18px] text-[#B84234]">
                  check_circle
                </span>
              )}
            </button>

            {/* Lost / Help */}
            <button
              onClick={() => setSelectedIncident('help')}
              className={`relative flex items-center gap-2.5 p-3 rounded-xl text-left transition-all duration-200 ${
                selectedIncident === 'help'
                  ? 'shadow-sm bg-[#FDF5F3] border-2 border-[#B84234] text-[#292524]'
                  : 'bg-white border border-[#E7E1D7] hover:border-[#D5C3BA] shadow-xs text-[#292524]'
              }`}
              type="button"
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 shadow-xs ${
                  selectedIncident === 'help'
                    ? 'bg-[#B84234] text-white'
                    : 'bg-[#F5EFE6] text-[#8C5E45]'
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">travel_explore</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-sans-body text-[14px] font-bold text-[#292524] leading-tight">Lost / Help</p>
                <p className="font-sans-body text-[12px] text-[#78716C] truncate">Missing person, info</p>
              </div>
              {selectedIncident === 'help' && (
                <span className="absolute top-2 right-2 material-symbols-outlined text-[18px] text-[#B84234]">
                  check_circle
                </span>
              )}
            </button>

            {/* Accessibility */}
            <button
              onClick={() => setSelectedIncident('accessibility')}
              className={`relative flex items-center gap-2.5 p-3 rounded-xl text-left transition-all duration-200 ${
                selectedIncident === 'accessibility'
                  ? 'shadow-sm bg-[#FDF5F3] border-2 border-[#B84234] text-[#292524]'
                  : 'bg-white border border-[#E7E1D7] hover:border-[#D5C3BA] shadow-xs text-[#292524]'
              }`}
              type="button"
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 shadow-xs ${
                  selectedIncident === 'accessibility'
                    ? 'bg-[#B84234] text-white'
                    : 'bg-[#F5EFE6] text-[#8C5E45]'
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">accessible</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-sans-body text-[14px] font-bold text-[#292524] leading-tight">Accessibility</p>
                <p className="font-sans-body text-[12px] text-[#78716C] truncate">Mobility assist</p>
              </div>
              {selectedIncident === 'accessibility' && (
                <span className="absolute top-2 right-2 material-symbols-outlined text-[18px] text-[#B84234]">
                  check_circle
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Live Verified Location Anchor Card */}
        <div className="bg-white border border-[#E7E1D7] p-4 rounded-xl shadow-xs flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[#B84234]">
              <span className="material-symbols-outlined text-[18px]">near_me</span>
              <span className="font-mono-code text-[11px] uppercase font-bold tracking-wider">
                Venue Geo-Beacon
              </span>
            </div>
            <button
              onClick={() => setShowZoneDropdown(!showZoneDropdown)}
              className="font-sans-body text-[12px] text-[#8C5E45] hover:text-[#B84234] font-semibold flex items-center gap-0.5 transition-colors"
              type="button"
            >
              <span>Change Zone</span>
              <span className="material-symbols-outlined text-[16px]">
                {showZoneDropdown ? 'expand_less' : 'expand_more'}
              </span>
            </button>
          </div>

          <div className="flex items-start gap-3 mt-1">
            <div className="w-9 h-9 rounded-full bg-[#FAF5EE] border border-[#EAE2D7] flex items-center justify-center shrink-0 text-[#B84234] mt-0.5">
              <span className="material-symbols-outlined text-[19px]">stadium</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-serif-headline text-[18px] font-semibold text-[#292524] leading-snug">
                {currentZone}
              </p>
              <p className="font-mono-code text-[11px] text-[#78716C] mt-0.5">
                Sector 3 • Row F • Beacon #B-1049 (Active)
              </p>
            </div>
          </div>

          {/* Expandable Selector Dropdown */}
          {showZoneDropdown && (
            <div className="flex flex-col gap-1.5 mt-2 pt-2 border-t border-[#EAE2D7] bg-[#FAF7F2] p-2.5 rounded-lg animate-in fade-in duration-150">
              <span className="font-mono-code text-[11px] text-[#78716C] font-semibold uppercase tracking-wider">
                Select Nearest Checkpoint:
              </span>
              {[
                { name: 'Main Stage — Hall A (Sector 3, Row F)', distance: 'Current' },
                { name: 'Exhibition Center — Zone B Booth 42', distance: '120m' },
                { name: 'Outdoor Plaza — Food Truck Terrace', distance: '210m' },
                { name: 'Central Concourse — Registration Hub', distance: '85m' }
              ].map(item => (
                <button
                  key={item.name}
                  onClick={() => {
                    setCurrentZone(item.name);
                    setShowZoneDropdown(false);
                    onShowToast(`Location updated to ${item.name}`);
                  }}
                  className="text-left py-1.5 px-2.5 rounded-md hover:bg-[#F0EBE1] text-[#292524] text-[13px] font-medium flex items-center justify-between transition-colors"
                  type="button"
                >
                  <span className="truncate">{item.name}</span>
                  <span className="font-mono-code text-[11px] text-[#78716C] shrink-0 ml-2">
                    {item.distance}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Center Area: High Precision SOS Trigger Button */}
        <div className="flex flex-col items-center justify-center py-2 relative">
          <div className="relative flex items-center justify-center w-64 h-64">
            {/* Ambient Pulse Wave 1 */}
            <span className="absolute w-60 h-60 rounded-full bg-[#B84234]/10 animate-ping opacity-60 pointer-events-none" style={{ animationDuration: '2.8s' }}></span>
            {/* Ambient Pulse Wave 2 */}
            <span className="absolute w-52 h-52 rounded-full bg-[#B84234]/15 animate-pulse pointer-events-none" style={{ animationDuration: '2s' }}></span>
            {/* Glowing Halo Backdrop */}
            <div className="absolute w-44 h-44 rounded-full bg-[#B84234]/25 blur-xl pointer-events-none"></div>

            {/* The Interactive Tactile SOS Center Button */}
            <button
              onClick={triggerDispatchSuccess}
              onMouseDown={startHold}
              onMouseUp={cancelHold}
              onMouseLeave={cancelHold}
              onTouchStart={startHold}
              onTouchEnd={cancelHold}
              className="relative z-10 w-40 h-40 rounded-full bg-gradient-to-b from-[#C24A38] via-[#B84234] to-[#A33528] shadow-[0_12px_32px_rgba(184,66,52,0.35)] flex flex-col items-center justify-center active:scale-95 transition-all duration-150 select-none group cursor-pointer text-white overflow-hidden border-4 border-[#FDF5F3]/30"
              type="button"
            >
              {/* Radial Progress Ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                <circle
                  cx="80"
                  cy="80"
                  r="72"
                  fill="transparent"
                  stroke="rgba(255,255,255,0.8)"
                  strokeWidth="6"
                  strokeDasharray="452"
                  strokeDashoffset={452 - (452 * holdProgress) / 100}
                  className="transition-all duration-75"
                />
              </svg>

              <div className="flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-[36px] text-white">
                  e911_emergency
                </span>
                <span className="font-serif-headline text-[36px] leading-none font-bold text-white tracking-tight mt-1">
                  SOS
                </span>
                <span className="font-mono-code text-[10px] tracking-widest text-[#FDF5F3] uppercase font-bold mt-0.5">
                  SIGNAL
                </span>
              </div>
            </button>
          </div>

          {/* Touch Prompt Labeled Instruction Pill */}
          <div className="flex items-center gap-2 mt-1 bg-white border border-[#E7E1D7] px-4 py-1.5 rounded-full shadow-xs">
            <span className="material-symbols-outlined text-[16px] text-[#B84234] animate-bounce">
              touch_app
            </span>
            <span className="font-sans-body text-[12px] text-[#44403C] font-semibold">
              {isHolding ? 'Transmitting alert now...' : 'Hold 2s or tap to dispatch unit'}
            </span>
          </div>
        </div>

        {/* Active Dispatch Live Confirmation Card */}
        {alertSent && (
          <div className="bg-white border border-[#E7E1D7] rounded-xl shadow-xs p-4 flex flex-col gap-4 relative overflow-hidden animate-in fade-in duration-300">
            {/* Top Dynamic Operational Header Bar */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FAF5EE] border border-[#EAE2D7] flex items-center justify-center text-[#B84234] relative">
                  <span className="material-symbols-outlined text-[22px]">check_circle</span>
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#B84234]"></span>
                </div>
                <div>
                  <h2 className="font-serif-headline text-[20px] font-semibold text-[#292524] leading-tight">
                    Help is on the way
                  </h2>
                  <p className="font-sans-body text-[12px] text-[#78716C]">
                    Dispatcher acknowledged and assigned
                  </p>
                </div>
              </div>
              <span className="font-mono-code text-[11px] px-2.5 py-1 rounded-full bg-[#F5EFE6] text-[#8C5E45] border border-[#E7E1D7] font-bold">
                LIVE • #EP-914
              </span>
            </div>

            {/* Live Dispatch Telemetry Strip */}
            <div className="bg-[#FAF7F2] border border-[#EAE2D7] p-3 rounded-lg flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#292524]">
                  <span className="material-symbols-outlined text-[19px] text-[#B84234]">
                    ambulance
                  </span>
                  <span className="font-sans-body text-[14px] font-bold text-[#292524]">
                    {currentResponder.unit}
                  </span>
                </div>
                <span className="font-mono-code text-[13px] text-[#B84234] font-bold">
                  ETA: {currentResponder.eta}
                </span>
              </div>
              <div className="flex items-center justify-between font-mono-code text-[11px] text-[#78716C]">
                <span>Dispatched at 10:32 AM</span>
                <span>Transit Velocity: 12 km/h</span>
              </div>
              {/* Visual Progress Track */}
              <div className="w-full bg-[#EAE2D7] h-2 rounded-full overflow-hidden mt-1 relative">
                <div className="h-full bg-[#B84234] rounded-full w-3/4 animate-pulse"></div>
              </div>
            </div>

            {/* Nearest Physical Landmark Card */}
            <div className="flex items-center gap-3 p-3 bg-[#FAF7F2] border border-[#EAE2D7] rounded-lg">
              <div className="w-10 h-10 rounded-lg bg-[#FAF5EE] border border-[#E2D8CC] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#B84234] text-[22px]">
                  health_and_safety
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-sans-body text-[10px] text-[#78716C] uppercase font-bold tracking-wider">
                  Nearest Fixed Help Station
                </p>
                <p className="font-sans-body text-[14px] font-bold text-[#292524] truncate">
                  {currentResponder.station} • {currentResponder.distance}
                </p>
                <p className="font-sans-body text-[12px] text-[#78716C]">
                  Opposite Restroom Corridor B
                </p>
              </div>
            </div>

            {/* Emergency Operational CTAs */}
            <div className="flex flex-col gap-2.5 pt-1">
              <button
                onClick={() => onNavigate('map')}
                className="w-full h-12 bg-[#B84234] hover:bg-[#A33528] active:scale-[0.99] text-white rounded-lg font-sans-body text-[14px] font-bold flex items-center justify-center gap-2 shadow-xs transition-all"
                type="button"
              >
                <span className="material-symbols-outlined text-[19px]">explore</span>
                <span>Navigate to Help Point ({currentResponder.distance})</span>
              </button>

              <a
                href="tel:911"
                className="w-full h-11 bg-[#F5EFE6] hover:bg-[#EDE5D8] border border-[#E7E1D7] text-[#292524] rounded-lg font-sans-body text-[14px] font-semibold flex items-center justify-center gap-2 active:scale-[0.99] transition-all"
              >
                <span className="material-symbols-outlined text-[18px] text-[#B84234]">call</span>
                <span>Direct Call to Dispatcher</span>
              </a>
            </div>
          </div>
        )}

        {/* Reassuring Guidance Footnote */}
        <div className="flex items-center justify-center gap-2 text-[#78716C] px-4 text-center mt-1">
          <span className="material-symbols-outlined text-[16px] text-[#8C5E45]">verified_user</span>
          <p className="font-sans-body text-[12px]">
            All alerts are logged and escalated with event medical control center.
          </p>
        </div>
      </div>
    </div>
  );
};
