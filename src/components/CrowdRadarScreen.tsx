import React, { useState, useEffect } from 'react';
import { ScreenType, ZoneData } from '../types';
import { INITIAL_ZONES, CONVENTION_FLOOR_IMAGE } from '../data/mockData';
import { fetchZones } from '../services/api';

interface CrowdRadarScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onShowToast: (message: string) => void;
}

export const CrowdRadarScreen: React.FC<CrowdRadarScreenProps> = ({
  onNavigate,
  onShowToast
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'stages' | 'amenities' | 'entrances'>('all');
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [subscribedZones, setSubscribedZones] = useState<Record<string, boolean>>({});
  const [zones, setZones] = useState<ZoneData[]>(INITIAL_ZONES);

  useEffect(() => {
    fetchZones().then(data => {
      if (data && data.length > 0) {
        setZones(data);
      }
    });
  }, []);

  const handleToggleNotify = (zoneId: string, zoneName: string) => {
    setSubscribedZones(prev => {
      const isSubbed = !prev[zoneId];
      if (isSubbed) {
        onShowToast(`Alert active: You'll be notified when ${zoneName} clears (<60%)!`);
      } else {
        onShowToast(`Alert canceled for ${zoneName}.`);
      }
      return { ...prev, [zoneId]: isSubbed };
    });
  };

  const filteredZones = zones.filter(zone => {
    if (activeCategory === 'all') return true;
    return zone.type === activeCategory;
  });

  return (
    <div className="flex flex-col w-full pb-28 px-4 max-w-lg mx-auto">
      {/* Minimalist Live Sensor Updates Banner */}
      <div className="mt-3 mb-4 flex items-center justify-between bg-white/90 border border-[#E8E3DA] px-3.5 py-2 rounded-xl text-xs shadow-xs">
        <div className="flex items-center space-x-2.5 min-w-0">
          <span className="relative flex h-2 w-2 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8C5E45]/40 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8C5E45]"></span>
          </span>
          <p className="text-[#78716C] truncate font-medium">
            Live sensor updates • Active telemetry
          </p>
        </div>
        <span className="font-mono-code text-[11px] font-semibold text-[#78716C] flex-shrink-0 ml-2">
          99.4% precision
        </span>
      </div>

      {/* Hero Visual Overview Card */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-[#E8E3DA] shadow-sm bg-white mb-4">
        <div
          className="bg-cover bg-center w-full h-32 relative"
          style={{ backgroundImage: `url(${CONVENTION_FLOOR_IMAGE})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#292524]/90 via-[#292524]/40 to-transparent flex flex-col justify-end p-4">
            <div className="flex items-end justify-between gap-2">
              <div>
                <span className="text-[10px] font-semibold text-white/70 uppercase tracking-widest font-mono-code">
                  Venue Density
                </span>
                <p className="font-serif-headline text-xl text-white font-medium tracking-tight">
                  Overall Flow: Steady
                </p>
              </div>
              <button
                onClick={() => setShowHeatmap(true)}
                className="flex items-center space-x-1.5 bg-white/95 hover:bg-white text-[#292524] px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs active:scale-95 transition-all"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px] text-[#8C5E45]">hub</span>
                <span>View Heatmap</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center space-x-1.5 overflow-x-auto py-1 mb-4 no-scrollbar">
        {[
          { id: 'all', label: 'All Zones (5)' },
          { id: 'stages', label: 'Stages' },
          { id: 'amenities', label: 'Amenities' },
          { id: 'entrances', label: 'Entrances' }
        ].map(filter => (
          <button
            key={filter.id}
            onClick={() => setActiveCategory(filter.id as any)}
            className={`px-3.5 py-1.5 rounded-full font-medium text-xs whitespace-nowrap transition-all shadow-xs ${
              activeCategory === filter.id
                ? 'bg-[#292524] text-white shadow-sm'
                : 'bg-white border border-[#E8E3DA] text-[#78716C] hover:border-[#292524]/30'
            }`}
            type="button"
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Zone Cards List */}
      <div className="space-y-3">
        {filteredZones.map(zone => {
          const isSubscribed = !!subscribedZones[zone.id];
          const isCrowded = zone.congestion >= 75;
          const isModerate = zone.congestion >= 40 && zone.congestion < 75;

          const badgeBg = isCrowded ? 'bg-[#FAECE9] text-[#9B3828]' : isModerate ? 'bg-[#FBF3E8] text-[#8C591D]' : 'bg-[#EBF3EE] text-[#2C5E43]';
          const barColor = isCrowded ? 'bg-[#BD5A47]' : isModerate ? 'bg-[#C78B43]' : 'bg-[#5B8E71]';

          return (
            <div
              key={zone.id}
              className="bg-white border border-[#E8E3DA] rounded-2xl p-4 shadow-xs space-y-3.5 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="material-symbols-outlined text-[19px] text-[#78716C]">
                      {zone.icon}
                    </span>
                    <h3 className="font-serif-headline text-lg text-[#292524] font-medium truncate">
                      {zone.name}
                    </h3>
                  </div>
                  <p className="text-xs text-[#78716C] mt-0.5">{zone.subtitle}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex-shrink-0 ${badgeBg}`}>
                  {isCrowded ? `Crowded ${zone.congestion}%` : isModerate ? `Moderate ${zone.congestion}%` : `Low ${zone.congestion}%`}
                </span>
              </div>

              {/* Progress Indicator */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[#78716C] font-mono-code text-[11px]">
                  <span>Congestion</span>
                  <span className="font-medium">{zone.congestion}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#EFECE4] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                    style={{ width: `${zone.congestion}%` }}
                  />
                </div>
              </div>

              {/* Quiet Callout */}
              <div className="flex items-start space-x-2.5 bg-[#FAF8F5] border border-[#E8E3DA]/80 p-2.5 rounded-xl text-xs">
                <span className="material-symbols-outlined text-[#78716C] text-[16px] mt-0.5 flex-shrink-0">
                  {zone.callout.icon}
                </span>
                <p className="text-[#292524]/85 leading-relaxed">
                  {zone.callout.isRecommendation && (
                    <strong className="font-medium text-[#292524] mr-1">Recommendation:</strong>
                  )}
                  {zone.callout.text}
                </p>
              </div>

              {/* Card Footer Action (if any) */}
              {(zone.canNotify || zone.footerInfo) && (
                <div className="pt-0.5 flex items-center justify-between">
                  {zone.canNotify ? (
                    <button
                      onClick={() => handleToggleNotify(zone.id, zone.name)}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95 ${
                        isSubscribed
                          ? 'bg-[#EBF3EE] text-[#2C5E43]'
                          : 'bg-[#EFECE4] hover:bg-[#E8E3DA] text-[#292524]'
                      }`}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {isSubscribed ? 'notifications_off' : 'notifications_active'}
                      </span>
                      <span>
                        {isSubscribed ? 'Subscribed (Alert set)' : 'Notify when clearing (<60%)'}
                      </span>
                    </button>
                  ) : <div />}

                  {zone.footerInfo && (
                    <span className="font-mono-code text-[11px] text-[#A8A29E]">
                      {zone.footerInfo}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Heatmap Modal Sheet */}
      {showHeatmap && (
        <div 
          className="fixed inset-0 z-50 bg-[#292524]/40 backdrop-blur-xs flex flex-col justify-end"
          onClick={() => setShowHeatmap(false)}
        >
          <div
            className="w-full max-w-lg mx-auto bg-white border-t border-[#E8E3DA] p-6 rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-[#E8E3DA] rounded-full mx-auto mb-4"></div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-[#292524] text-[22px]">thermostat</span>
                <h3 className="font-serif-headline text-lg text-[#292524] font-medium">
                  Live Heatmap Overview
                </h3>
              </div>
              <button
                onClick={() => setShowHeatmap(false)}
                className="w-8 h-8 rounded-full bg-[#EFECE4] flex items-center justify-center text-[#78716C] hover:text-[#292524]"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <p className="text-xs text-[#78716C] mb-4 leading-relaxed">
              Aggregated sensor network data via local beacons. Privacy-first, no personal identifiers captured.
            </p>

            {/* Modal Inner Card */}
            <div className="relative w-full bg-[#292524] text-white rounded-xl p-4 flex flex-col justify-between space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-mono-code text-[11px] text-white/70 tracking-wider">
                  LEVEL 1 • EXHIBIT FLOOR
                </span>
                <span className="font-mono-code text-[10px] uppercase font-semibold bg-[#FAECE9] text-[#9B3828] px-2 py-0.5 rounded">
                  Peak Density
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center py-2">
                <div className="bg-white/10 rounded-lg p-2.5">
                  <div className="text-[11px] text-white/60 font-sans-body">Hall A</div>
                  <div className="font-serif-headline text-lg text-[#F4BA9C] font-semibold mt-0.5">89%</div>
                </div>
                <div className="bg-white/10 rounded-lg p-2.5">
                  <div className="text-[11px] text-white/60 font-sans-body">Lounge</div>
                  <div className="font-serif-headline text-lg text-[#E4C0A5] font-semibold mt-0.5">54%</div>
                </div>
                <div className="bg-white/10 rounded-lg p-2.5">
                  <div className="text-[11px] text-white/60 font-sans-body">Wing B</div>
                  <div className="font-serif-headline text-lg text-[#D5C3BA] font-semibold mt-0.5">28%</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowHeatmap(false);
                  onNavigate('map');
                }}
                className="w-full bg-[#EFECE4] hover:bg-white text-[#292524] py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-colors"
                type="button"
              >
                Explore Full Interactive Map
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
