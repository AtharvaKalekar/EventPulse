import React, { useState, useEffect } from 'react';
import { ScreenType, SessionData } from '../types';
import { INITIAL_SESSIONS } from '../data/mockData';
import { fetchSessions, updateSession } from '../services/api';

interface ScheduleScreenProps {
  onShowToast: (message: string) => void;
  onNavigate?: (screen: ScreenType) => void;
}

export const ScheduleScreen: React.FC<ScheduleScreenProps> = ({ onShowToast, onNavigate }) => {
  const [selectedDay, setSelectedDay] = useState<'day1' | 'day2'>('day1');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'for-you' | 'all-sessions' | 'saved'>('for-you');
  const [selectedTracks, setSelectedTracks] = useState<string[]>(['tech', 'business']);
  const [sessions, setSessions] = useState<SessionData[]>(INITIAL_SESSIONS);

  useEffect(() => {
    fetchSessions().then(data => {
      if (data && data.length > 0) {
        setSessions(data);
      }
    });
  }, []);

  const toggleBookmark = async (sessionId: string) => {
    const targetSession = sessions.find(s => s.id === sessionId);
    if (!targetSession) return;
    const nextSaved = !targetSession.isSaved;

    setSessions(prev =>
      prev.map(s => (s.id === sessionId ? { ...s, isSaved: nextSaved } : s))
    );

    await updateSession(sessionId, { isSaved: nextSaved });
    onShowToast(
      nextSaved
        ? `Saved "${targetSession.title.substring(0, 30)}..." to your itinerary`
        : `Removed "${targetSession.title.substring(0, 30)}..." from saved`
    );
  };

  const handleActionClick = async (session: SessionData) => {
    let updates: Partial<SessionData> = {};
    if (session.track === 'tech' || session.track === 'ai' || session.track === 'design' || session.track === 'workshop') {
      const nextReserved = !session.seatReserved;
      updates = { seatReserved: nextReserved };
      onShowToast(
        nextReserved
          ? `Confirmed seat reservation for ${session.title.substring(0, 25)}!`
          : `Reservation cancelled for ${session.title.substring(0, 25)}.`
      );
    } else {
      const nextRemind = !session.remindMeSet;
      updates = { remindMeSet: nextRemind };
      onShowToast(
        nextRemind
          ? `Reminder set for 15 minutes prior to start.`
          : `Reminder turned off.`
      );
    }

    setSessions(prev =>
      prev.map(s => (s.id === session.id ? { ...s, ...updates } : s))
    );

    await updateSession(session.id, updates);
  };

  const handleShare = (session: SessionData) => {
    navigator.clipboard.writeText(`EventPulse: ${session.title} with ${session.speaker.name} (${session.time})`).catch(() => {});
    onShowToast(`Session details copied for sharing!`);
  };

  const toggleTrackFilter = (trackKey: string) => {
    setSelectedTracks(prev =>
      prev.includes(trackKey) ? prev.filter(t => t !== trackKey) : [...prev, trackKey]
    );
  };

  const savedCount = sessions.filter(s => s.isSaved).length;

  const filteredSessions = sessions.filter(session => {
    if (session.day !== selectedDay) return false;

    if (activeTab === 'for-you' && !session.isRecommended) return false;
    if (activeTab === 'saved' && !session.isSaved) return false;

    if (selectedTracks.length > 0 && !selectedTracks.includes(session.track)) {
      // allow if only browsing all without strict filter
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = session.title.toLowerCase().includes(q);
      const matchSpeaker = session.speaker.name.toLowerCase().includes(q);
      const matchCompany = session.speaker.company.toLowerCase().includes(q);
      const matchLoc = session.location.toLowerCase().includes(q);
      return matchTitle || matchSpeaker || matchCompany || matchLoc;
    }

    return true;
  });

  return (
    <div className="flex flex-col w-full pb-28 max-w-md mx-auto">
      {/* Date Selector & Search Header */}
      <div className="px-4 pt-3 pb-2">
        {/* Date Selector Pills */}
        <div className="flex items-center gap-2 p-1 bg-[#EBE7DF] rounded-xl mb-3">
          <button
            onClick={() => setSelectedDay('day1')}
            className={`flex-1 py-2 px-3 rounded-lg font-medium text-xs tracking-wide transition-all text-center flex items-center justify-center gap-1.5 ${
              selectedDay === 'day1'
                ? 'bg-white text-[#292524] shadow-xs font-semibold'
                : 'text-[#78716C] hover:text-[#292524]'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[15px] text-[#78716C]">calendar_today</span>
            <span>Day 1 • Oct 24</span>
          </button>
          <button
            onClick={() => setSelectedDay('day2')}
            className={`flex-1 py-2 px-3 rounded-lg font-medium text-xs tracking-wide transition-all text-center flex items-center justify-center gap-1.5 ${
              selectedDay === 'day2'
                ? 'bg-white text-[#292524] shadow-xs font-semibold'
                : 'text-[#78716C] hover:text-[#292524]'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[15px] text-[#78716C]">event</span>
            <span>Day 2 • Oct 25</span>
          </button>
        </div>

        {/* Streamlined Search Field */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A89F91] text-[18px] pointer-events-none">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sessions, speakers, topics..."
              className="w-full h-10 pl-9 pr-8 rounded-lg bg-white border border-[#E9E4DB] text-[#292524] text-xs placeholder:text-[#A89F91] focus:outline-none focus:border-[#78716C] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center text-[#A89F91] hover:text-[#292524]"
                type="button"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            )}
          </div>
          <button
            onClick={() => onShowToast('Filter preferences: All venues, in-person and streams included')}
            aria-label="Open filter preferences"
            className="h-10 w-10 shrink-0 rounded-lg bg-white border border-[#E9E4DB] text-[#292524] flex items-center justify-center hover:bg-[#FAF8F5] active:scale-95 transition-all relative"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
          </button>
        </div>
      </div>

      {/* Segmented Tabs Navigation */}
      <div className="px-4 py-2">
        <div className="flex items-center border-b border-[#E9E4DB]">
          <button
            onClick={() => setActiveTab('for-you')}
            className={`pb-2.5 px-3 border-b-2 text-xs transition-all flex items-center gap-1.5 ${
              activeTab === 'for-you'
                ? 'border-[#292524] text-[#292524] font-semibold'
                : 'border-transparent text-[#78716C] hover:text-[#292524] font-medium'
            }`}
            type="button"
          >
            <span>For You</span>
          </button>
          <button
            onClick={() => setActiveTab('all-sessions')}
            className={`pb-2.5 px-3 border-b-2 text-xs transition-all flex items-center gap-1.5 ${
              activeTab === 'all-sessions'
                ? 'border-[#292524] text-[#292524] font-semibold'
                : 'border-transparent text-[#78716C] hover:text-[#292524] font-medium'
            }`}
            type="button"
          >
            <span>All Sessions</span>
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`pb-2.5 px-3 border-b-2 text-xs transition-all flex items-center gap-1.5 ${
              activeTab === 'saved'
                ? 'border-[#292524] text-[#292524] font-semibold'
                : 'border-transparent text-[#78716C] hover:text-[#292524] font-medium'
            }`}
            type="button"
          >
            <span>Saved</span>
            <span className="px-1.5 py-0.5 rounded-full bg-[#EBE7DF] text-[#292524] text-[10px] font-mono-code font-bold">
              {savedCount}
            </span>
          </button>
        </div>
      </div>

      {/* Natural Stone Category Chips */}
      <div className="py-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 px-4 w-max">
          {[
            { id: 'tech', label: 'Tech' },
            { id: 'design', label: 'Design' },
            { id: 'business', label: 'Business' },
            { id: 'ai', label: 'AI / ML' },
            { id: 'culture', label: 'Culture' },
            { id: 'workshop', label: 'Workshop' }
          ].map(track => {
            const isActive = selectedTracks.includes(track.id);
            return (
              <button
                key={track.id}
                onClick={() => toggleTrackFilter(track.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#292524] text-white shadow-xs'
                    : 'bg-white border border-[#E9E4DB] text-[#78716C] hover:text-[#292524]'
                }`}
                type="button"
              >
                <span>{track.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sessions Feed Content */}
      <div className="px-4 py-2 flex flex-col gap-3">
        {filteredSessions.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-[#E9E4DB]">
            <span className="material-symbols-outlined text-4xl text-[#A89F91] mb-2">event_busy</span>
            <h4 className="font-serif-headline text-base font-semibold text-[#292524]">No sessions found</h4>
            <p className="text-xs text-[#78716C] mt-1">Try clearing filters or switching between Day 1 & Day 2.</p>
          </div>
        ) : (
          filteredSessions.map(session => (
            <article
              key={session.id}
              className="bg-white rounded-xl p-4 border border-[#E9E4DB] shadow-xs hover:border-[#D5CFC5] transition-all"
            >
              {/* Card Topline */}
              <div className="flex items-center justify-between mb-2">
                {session.isRecommended ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#78716C] tracking-wide uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8C5E45]"></span>
                    <span>Recommended</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#78716C]">
                    <span>{session.trackLabel} Track</span>
                  </span>
                )}

                <button
                  onClick={() => toggleBookmark(session.id)}
                  aria-label={session.isSaved ? "Remove from saved" : "Bookmark session"}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#292524] hover:bg-[#F7F4EE] transition-colors"
                  type="button"
                >
                  <span
                    className={`material-symbols-outlined text-[19px] ${
                      session.isSaved ? 'text-[#292524]' : 'text-[#A89F91]'
                    }`}
                    style={{ fontVariationSettings: session.isSaved ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {session.isSaved ? 'bookmark' : 'bookmark_border'}
                  </span>
                </button>
              </div>

              {/* Title */}
              <h3 className="font-serif-headline text-[18px] leading-snug font-medium text-[#292524] mb-1.5">
                {session.title}
              </h3>

              {/* Time & Location Metadata */}
              <div className="flex items-center gap-2 text-[#78716C] text-xs mb-3">
                <span className="font-mono-code text-[11px] text-[#292524] font-medium">
                  {session.time}
                </span>
                <span className="text-[#E9E4DB]">•</span>
                <span>{session.location}</span>
              </div>

              {/* Speaker Section */}
              <div className="flex items-center gap-2.5 pt-2.5 pb-3 border-t border-[#F7F4EE]">
                <img
                  src={session.speaker.avatarUrl}
                  alt={session.speaker.name}
                  className="w-8 h-8 rounded-full object-cover shrink-0 border border-[#E9E4DB]"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-[#292524] truncate">
                    {session.speaker.name}
                  </p>
                  <p className="text-[11px] text-[#78716C] truncate">
                    {session.speaker.role}, {session.speaker.company}
                  </p>
                </div>
                {session.statusTag && (
                  <span className="text-[10px] text-[#8C5E45] font-semibold bg-[#F7F4EE] px-2 py-0.5 rounded">
                    {session.statusTag}
                  </span>
                )}
              </div>

              {/* Clean Actions */}
              <div className="flex items-center gap-2 pt-1">
                {session.track === 'tech' || session.track === 'ai' ? (
                  <button
                    onClick={() => handleActionClick(session)}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 active:scale-[0.99] ${
                      session.seatReserved
                        ? 'bg-[#EBE7DF] text-[#292524] font-semibold'
                        : 'bg-[#292524] text-white hover:bg-[#44403C]'
                    }`}
                    type="button"
                  >
                    {session.seatReserved ? (
                      <>
                        <span className="material-symbols-outlined text-[15px]">check</span>
                        <span>Seat Reserved</span>
                      </>
                    ) : (
                      <span>Reserve Seat</span>
                    )}
                  </button>
                ) : session.track === 'design' || session.track === 'workshop' ? (
                  <button
                    onClick={() => handleActionClick(session)}
                    className={`flex-1 py-2 px-3 rounded-lg border border-[#E9E4DB] text-xs font-medium transition-all flex items-center justify-center gap-1.5 active:scale-[0.99] ${
                      session.seatReserved
                        ? 'bg-[#EBE7DF] text-[#292524]'
                        : 'bg-[#FAF8F5] text-[#292524] hover:bg-[#F0EBE1]'
                    }`}
                    type="button"
                  >
                    {session.seatReserved ? (
                      <>
                        <span className="material-symbols-outlined text-[15px]">check</span>
                        <span>In Itinerary</span>
                      </>
                    ) : (
                      <span>Add to Itinerary</span>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => handleActionClick(session)}
                    className={`flex-1 py-2 px-3 rounded-lg border border-[#E9E4DB] text-xs font-medium transition-all flex items-center justify-center gap-1.5 active:scale-[0.99] ${
                      session.remindMeSet
                        ? 'bg-[#EBE7DF] text-[#292524]'
                        : 'bg-[#FAF8F5] text-[#292524] hover:bg-[#F0EBE1]'
                    }`}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      {session.remindMeSet ? 'check' : 'notifications_none'}
                    </span>
                    <span>{session.remindMeSet ? 'Reminder Set' : 'Remind Me'}</span>
                  </button>
                )}

                <button
                  onClick={() => handleShare(session)}
                  aria-label="Share session"
                  className="h-8 w-8 rounded-lg border border-[#E9E4DB] text-[#78716C] hover:text-[#292524] hover:bg-[#FAF8F5] transition-colors flex items-center justify-center active:scale-95"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">share</span>
                </button>
              </div>

              {/* Event Direct Options Bar */}
              <div className="flex items-center gap-1.5 pt-2.5 mt-2.5 border-t border-[#F7F4EE]">
                <button
                  onClick={() => {
                    if (onNavigate) onNavigate('map');
                    onShowToast(`Routing to ${session.location}`);
                  }}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-[#FAF8F5] hover:bg-[#F3EFE6] border border-[#E9E4DB] text-[#292524] text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[14px] text-[#71472F]">explore</span>
                  <span>Venue Map</span>
                </button>

                <button
                  onClick={() => {
                    if (onNavigate) onNavigate('crowd');
                    onShowToast(`Opening Live Crowd Radar for ${session.location}`);
                  }}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-[#FAF8F5] hover:bg-[#F3EFE6] border border-[#E9E4DB] text-[#292524] text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[14px] text-[#71472F]">radar</span>
                  <span>Crowd Radar</span>
                </button>

                <button
                  onClick={() => {
                    if (onNavigate) onNavigate('sos');
                    onShowToast(`Emergency SOS linked for ${session.title.substring(0, 20)}...`);
                  }}
                  className="py-1.5 px-2.5 rounded-lg bg-[#FDF2EF] hover:bg-[#FCE4DE] border border-[#F5C2B8] text-[#B4533C] text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                  type="button"
                  title="Direct SOS Dispatch"
                >
                  <span className="material-symbols-outlined text-[14px]">emergency</span>
                  <span>SOS</span>
                </button>
              </div>
            </article>
          ))
        )}

        {/* Gentle Discovery Note */}
        <div className="rounded-xl border border-[#E9E4DB] bg-[#FAF8F5] p-3 flex items-center gap-3 mt-1">
          <span className="material-symbols-outlined text-[18px] text-[#78716C] shrink-0">info</span>
          <p className="text-xs text-[#78716C] leading-relaxed">
            Recommendations update automatically based on your saved interests and schedule openings.
          </p>
        </div>
      </div>
    </div>
  );
};
