import React, { useState, useEffect } from 'react';
import { ScreenType, IncidentAlert } from '../types';
import { INITIAL_INCIDENTS, RESPONDER_UNITS, ALEX_VANCE_AVATAR, LOGO_URL } from '../data/mockData';
import { fetchIncidents, updateIncident, createAnnouncement } from '../services/api';

interface OrganizerDashboardProps {
  onNavigate: (screen: ScreenType) => void;
  onShowToast: (message: string) => void;
}

export const OrganizerDashboard: React.FC<OrganizerDashboardProps> = ({
  onNavigate,
  onShowToast
}) => {
  const [incidents, setIncidents] = useState<IncidentAlert[]>(INITIAL_INCIDENTS);
  const [filterStatus, setFilterStatus] = useState<'all' | 'new' | 'acknowledged' | 'resolved'>('all');
  const [selectedZoneFilter, setSelectedZoneFilter] = useState('all');
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchIncidents().then(data => {
      if (data && data.length > 0) {
        setIncidents(data);
      }
    });
  }, []);

  const handleAcknowledge = async (id: string) => {
    setIncidents(prev =>
      prev.map(item =>
        item.id === id ? { ...item, status: 'acknowledged', responderStatus: 'Acknowledged & Dispatched' } : item
      )
    );
    await updateIncident(id, { status: 'acknowledged', responderStatus: 'Acknowledged & Dispatched' });
    onShowToast(`Incident #${id} acknowledged. Responder dispatch confirmed.`);
  };

  const handleResolve = async (id: string) => {
    setIncidents(prev =>
      prev.map(item =>
        item.id === id ? { ...item, status: 'resolved', responderStatus: 'On Scene Cleared' } : item
      )
    );
    await updateIncident(id, { status: 'resolved', responderStatus: 'On Scene Cleared' });
    onShowToast(`Incident #${id} marked as RESOLVED.`);
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(incidents, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `eventpulse_incidents_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onShowToast('Exported incident response log (JSON).');
  };

  const handleDispatchAll = () => {
    onShowToast('Priority broadcast dispatched to all 4 field units simultaneously.');
  };

  const handleSendBroadcast = async () => {
    if (!broadcastMessage.trim()) return;
    await createAnnouncement({
      title: 'Organizer Broadcast Alert',
      description: broadcastMessage.trim(),
      tag: 'Broadcast Alert',
      tagType: 'keynote',
      location: 'All Venues',
      actionLabel: 'Details',
      actionType: 'details'
    });
    onShowToast(`Broadcast alert sent to all attendees: "${broadcastMessage}"`);
    setBroadcastMessage('');
    setShowBroadcastModal(false);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    const updatedIncidents = await fetchIncidents();
    if (updatedIncidents && updatedIncidents.length > 0) {
      setIncidents(updatedIncidents);
    }
    setTimeout(() => {
      setIsRefreshing(false);
      onShowToast('Telemetry feed refreshed from backend API.');
    }, 400);
  };

  const filteredIncidents = incidents.filter(item => {
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    if (selectedZoneFilter !== 'all') {
      if (selectedZoneFilter === 'hall-a' && !item.zone.includes('Main Stage')) return false;
      if (selectedZoneFilter === 'ramp-b' && !item.zone.includes('Entrance Ramp')) return false;
      if (selectedZoneFilter === 'food-court' && !item.zone.includes('Food Court')) return false;
      if (selectedZoneFilter === 'hall-c' && !item.zone.includes('Workshop Hall')) return false;
    }
    return true;
  });

  const activeAlertsCount = incidents.filter(i => i.status !== 'resolved').length;
  const newAlertsCount = incidents.filter(i => i.status === 'new').length;
  const ackAlertsCount = incidents.filter(i => i.status === 'acknowledged').length;
  const resAlertsCount = incidents.filter(i => i.status === 'resolved').length;

  return (
    <div className="min-h-screen bg-[#FAF8FF] text-[#131B2E] font-sans-body flex flex-col lg:flex-row pb-12 lg:pb-0">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-72 bg-[#F2F3FF] shadow-xs border-r border-[#DAE2FD]/60 flex flex-col justify-between p-4 shrink-0">
        <div className="flex flex-col gap-6">
          {/* Brand Header */}
          <div className="flex items-center justify-between px-2 py-1">
            <div 
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <img
                src={LOGO_URL}
                alt="EventPulse Logo"
                className="h-8 w-auto object-contain"
              />
              <span className="font-display-command text-xl font-bold text-[#131B2E] tracking-tight">
                EventPulse
              </span>
            </div>
            <button
              onClick={() => onNavigate('home')}
              className="lg:hidden text-xs bg-[#E2E7FF] text-[#4225D0] px-2.5 py-1 rounded-full font-semibold"
              type="button"
            >
              Attendee App
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 text-sm font-semibold">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[#474555] hover:bg-[#E2E7FF] hover:text-[#131B2E] transition-colors text-left"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">grid_view</span>
              <span>Overview</span>
            </button>

            <button
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors bg-[#4225D0] text-white shadow-xs text-left"
              type="button"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px]">warning</span>
                <span>SOS Alerts</span>
              </div>
              <span className="bg-[#FFDAD6] text-[#93000A] font-mono-code text-[11px] px-2 py-0.5 rounded-full font-bold">
                {activeAlertsCount} Live
              </span>
            </button>

            <button
              onClick={() => onNavigate('crowd')}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[#474555] hover:bg-[#E2E7FF] hover:text-[#131B2E] transition-colors text-left"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">groups</span>
              <span>Crowd Control</span>
            </button>

            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[#474555] hover:bg-[#E2E7FF] hover:text-[#131B2E] transition-colors text-left"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">campaign</span>
              <span>Announcements</span>
            </button>

            <button
              onClick={() => onShowToast('Command console configuration loaded.')}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[#474555] hover:bg-[#E2E7FF] hover:text-[#131B2E] transition-colors text-left"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">settings</span>
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* User Profile Card */}
        <div className="bg-white rounded-xl p-3 shadow-xs flex items-center justify-between mt-6 border border-[#DAE2FD]/80">
          <div className="flex items-center gap-3">
            <img
              src={ALEX_VANCE_AVATAR}
              alt="Atharva"
              className="w-9 h-9 rounded-full object-cover border border-[#DAE2FD]"
            />
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-[#131B2E] truncate">Atharva</span>
              <span className="text-xs text-[#474555]">Lead Coordinator</span>
            </div>
          </div>
          <button
            onClick={() => onNavigate('home')}
            className="text-[#474555] hover:text-[#131B2E] p-1.5 rounded-lg hover:bg-[#F2F3FF]"
            title="Switch to Attendee Mobile App"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">smartphone</span>
          </button>
        </div>
      </aside>

      {/* Main Command Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-[#DAE2FD]/80 z-30 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[#F2F3FF] px-3 py-1 rounded-full shadow-xs border border-[#DAE2FD]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-mono-code text-xs text-[#131B2E] font-medium">
                Summit 2025: Live (Hall A)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowBroadcastModal(true)}
              className="flex items-center gap-1.5 bg-[#C02028] text-white px-3.5 py-1.5 rounded-lg font-semibold text-xs hover:opacity-90 transition-opacity shadow-xs"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">emergency_share</span>
              <span>Broadcast Alert</span>
            </button>

            <button
              onClick={() => onShowToast('Stage Controls: Keynote Audio Visuals nominal')}
              className="flex items-center gap-1.5 bg-[#4225D0] text-white px-3.5 py-1.5 rounded-lg font-semibold text-xs hover:bg-[#331CA8] transition-colors shadow-xs"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">tune</span>
              <span>Stage Controls</span>
            </button>

            <button
              onClick={() => onShowToast('No pending system warnings.')}
              className="p-2 text-[#474555] hover:text-[#131B2E] transition-colors rounded-full hover:bg-[#F2F3FF]"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>

            <button
              onClick={() => onNavigate('home')}
              title="Return to attendee mobile view"
              className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#E2E7FF] text-[#4225D0] hover:bg-[#D2D9F4] transition-colors"
              type="button"
            >
              Mobile View
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto">
          {/* Header Command Title Strip */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="font-mono-code text-xs uppercase tracking-widest text-[#4225D0] font-bold">
                  Incident Response Center
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#C8C4D8]"></span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFDAD6] text-[#93000A] font-mono-code text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#BA1A1A] animate-ping"></span>
                  DEFCON 3 ACTIVE
                </span>
              </div>
              <h1 className="font-display-command text-3xl lg:text-4xl font-bold text-[#131B2E] tracking-tight">
                SOS Alerts & Incident Response
              </h1>
              <p className="text-sm text-[#474555]">
                Live operational telemetry, automated dispatch routing, and emergency attendee beacons.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="hidden sm:flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl shadow-xs border border-[#DAE2FD]">
                <span className="material-symbols-outlined text-[#4225D0] text-[20px]">sensors</span>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#474555] uppercase font-bold">Mesh Network</span>
                  <span className="font-mono-code text-xs text-[#131B2E] font-bold">99.98% Healthy</span>
                </div>
              </div>

              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 bg-white hover:bg-[#F2F3FF] text-[#131B2E] px-3.5 py-2 rounded-lg font-semibold text-xs shadow-xs border border-[#DAE2FD] transition-all active:scale-95"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">file_download</span>
                <span>Export Incident Log</span>
              </button>

              <button
                onClick={handleDispatchAll}
                className="flex items-center gap-1.5 bg-[#C02028] hover:bg-[#9B0015] text-white px-3.5 py-2 rounded-lg font-semibold text-xs shadow-xs transition-all active:scale-95"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">campaign</span>
                <span>Dispatch All Units</span>
              </button>
            </div>
          </div>

          {/* Top Metric Cards Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Metric 1: Active Alerts */}
            <div className="bg-white rounded-xl p-5 shadow-xs border border-[#DAE2FD] flex flex-col justify-between group hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="text-xs text-[#474555] uppercase tracking-wider font-bold">
                    Active SOS Alerts
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-display-command text-5xl font-extrabold text-[#9B0015] tracking-tight leading-none">
                      {activeAlertsCount}
                    </span>
                    <span className="flex h-3 w-3 relative ml-1">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#BA1A1A] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-[#9B0015]"></span>
                    </span>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FFDAD6] text-[#93000A]">
                  <span className="material-symbols-outlined text-[24px]">crisis_alert</span>
                </div>
              </div>
              <div className="mt-4 pt-3 flex items-center justify-between border-t border-[#DAE2FD]/60">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#9B0015]"></span>
                  <span className="text-xs text-[#131B2E] font-medium">2 Medical</span>
                  <span className="text-[#C8C4D8] font-mono-code">/</span>
                  <span className="inline-block w-2 h-2 rounded-full bg-[#5B598C]"></span>
                  <span className="text-xs text-[#131B2E] font-medium">1 Accessibility</span>
                </div>
                <span className="font-mono-code text-xs text-[#9B0015] font-bold flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[14px]">arrow_upward</span> High Priority
                </span>
              </div>
            </div>

            {/* Metric 2: Total Attendees */}
            <div className="bg-white rounded-xl p-5 shadow-xs border border-[#DAE2FD] flex flex-col justify-between group hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="text-xs text-[#474555] uppercase tracking-wider font-bold">
                    Total Attendees On-Site
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-display-command text-5xl font-extrabold text-[#131B2E] tracking-tight leading-none">
                      14,820
                    </span>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#E4DFFF] text-[#160066]">
                  <span className="material-symbols-outlined text-[24px]">group</span>
                </div>
              </div>
              <div className="mt-4 pt-3 flex items-center justify-between border-t border-[#DAE2FD]/60">
                <div className="flex items-center gap-3 w-full">
                  <div className="flex-1 bg-[#DAE2FD] rounded-full h-2 overflow-hidden">
                    <div className="bg-[#4225D0] h-full rounded-full" style={{ width: '92%' }}></div>
                  </div>
                  <span className="font-mono-code text-xs font-bold text-[#4225D0]">92% Cap</span>
                </div>
              </div>
            </div>

            {/* Metric 3: Zones Monitored */}
            <div className="bg-white rounded-xl p-5 shadow-xs border border-[#DAE2FD] flex flex-col justify-between group hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="text-xs text-[#474555] uppercase tracking-wider font-bold">
                    Zones & Sensors Online
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="font-display-command text-5xl font-extrabold text-[#131B2E] tracking-tight leading-none">
                      18
                    </span>
                    <span className="text-xl font-bold text-[#474555]">/ 18</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#E2E7FF] text-[#4225D0]">
                  <span className="material-symbols-outlined text-[24px]">hub</span>
                </div>
              </div>
              <div className="mt-4 pt-3 flex items-center justify-between border-t border-[#DAE2FD]/60">
                <div className="flex items-center gap-2 text-[#131B2E]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-xs font-medium">All BLE Beacons Synced</span>
                </div>
                <span className="font-mono-code text-xs text-[#474555]">0 Dead Zones</span>
              </div>
            </div>
          </div>

          {/* Main Grid: Incidents Table (8 cols) & Live Telemetry Map (4 cols) */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            {/* Table Area (Span 8) */}
            <div className="xl:col-span-8 flex flex-col bg-white rounded-xl shadow-xs border border-[#DAE2FD] overflow-hidden">
              {/* Toolbar */}
              <div className="p-4 bg-white border-b border-[#DAE2FD] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center flex-wrap gap-2">
                  <span className="text-xs uppercase font-bold text-[#474555] mr-1">Filter Status:</span>
                  <button
                    onClick={() => setFilterStatus('all')}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      filterStatus === 'all'
                        ? 'bg-[#E2E7FF] text-[#131B2E]'
                        : 'bg-[#F2F3FF] text-[#474555] hover:text-[#131B2E]'
                    }`}
                    type="button"
                  >
                    All ({incidents.length})
                  </button>

                  <button
                    onClick={() => setFilterStatus('new')}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      filterStatus === 'new'
                        ? 'bg-[#FFDAD7] text-[#410004]'
                        : 'bg-[#F2F3FF] text-[#474555] hover:text-[#131B2E]'
                    }`}
                    type="button"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9B0015]"></span>
                    New ({newAlertsCount})
                  </button>

                  <button
                    onClick={() => setFilterStatus('acknowledged')}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      filterStatus === 'acknowledged'
                        ? 'bg-[#E2E7FF] text-[#131B2E]'
                        : 'bg-[#F2F3FF] text-[#474555] hover:text-[#131B2E]'
                    }`}
                    type="button"
                  >
                    Acknowledged ({ackAlertsCount})
                  </button>

                  <button
                    onClick={() => setFilterStatus('resolved')}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      filterStatus === 'resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-[#F2F3FF] text-[#474555] hover:text-[#131B2E]'
                    }`}
                    type="button"
                  >
                    Resolved ({resAlertsCount})
                  </button>
                </div>

                {/* Zone Filter & Refresh */}
                <div className="flex items-center gap-2">
                  <div className="relative inline-flex items-center">
                    <span className="material-symbols-outlined absolute left-2.5 text-[18px] text-[#474555] pointer-events-none">
                      place
                    </span>
                    <select
                      value={selectedZoneFilter}
                      onChange={(e) => setSelectedZoneFilter(e.target.value)}
                      className="pl-8 pr-7 py-1.5 bg-[#F2F3FF] text-[#131B2E] rounded-lg text-xs font-semibold appearance-none focus:outline-none cursor-pointer border border-transparent hover:border-[#DAE2FD]"
                    >
                      <option value="all">All Zones (18)</option>
                      <option value="hall-a">Main Stage (Hall A)</option>
                      <option value="ramp-b">Entrance Ramp B</option>
                      <option value="food-court">Food Court North</option>
                      <option value="hall-c">Workshop Hall C</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-2 text-[18px] text-[#474555] pointer-events-none">
                      expand_more
                    </span>
                  </div>

                  <button
                    onClick={handleRefresh}
                    className="p-1.5 rounded-lg bg-[#F2F3FF] hover:bg-[#E2E7FF] text-[#131B2E] transition-colors"
                    title="Refresh Feed"
                    type="button"
                  >
                    <span className={`material-symbols-outlined text-[18px] ${isRefreshing ? 'animate-spin' : ''}`}>
                      refresh
                    </span>
                  </button>
                </div>
              </div>

              {/* Incidents Table */}
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F2F3FF] text-[#474555] text-xs uppercase font-bold tracking-wider">
                      <th className="py-3 px-4">Time</th>
                      <th className="py-3 px-4">Incident Type</th>
                      <th className="py-3 px-4">Zone / Location</th>
                      <th className="py-3 px-4">Reported By</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Responder</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DAE2FD]/50 text-sm">
                    {filteredIncidents.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-xs text-[#474555]">
                          No incidents match the active filters.
                        </td>
                      </tr>
                    ) : (
                      filteredIncidents.map(item => {
                        const isNew = item.status === 'new';
                        const isAck = item.status === 'acknowledged';

                        return (
                          <tr
                            key={item.id}
                            className={`transition-colors ${
                              isNew
                                ? 'bg-[#FFDAD6]/30 hover:bg-[#FFDAD6]/40'
                                : 'hover:bg-[#F2F3FF]/60'
                            }`}
                          >
                            <td className="py-3.5 px-4 font-mono-code text-xs font-semibold whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                {isNew && (
                                  <span className="w-2 h-2 rounded-full bg-[#BA1A1A] animate-pulse"></span>
                                )}
                                {item.time}
                              </div>
                            </td>

                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                  item.type === 'medical'
                                    ? 'bg-[#C02028] text-white'
                                    : item.type === 'accessibility'
                                    ? 'bg-[#E3DFFF] text-[#181445]'
                                    : item.type === 'security'
                                    ? 'bg-[#E4DFFF] text-[#160066]'
                                    : 'bg-[#DAE2FD] text-[#131B2E]'
                                }`}
                              >
                                <span className="material-symbols-outlined text-[14px]">
                                  {item.icon}
                                </span>
                                <span>{item.typeLabel}</span>
                              </span>
                            </td>

                            <td className="py-3.5 px-4">
                              <div className="flex flex-col">
                                <span className="font-semibold text-xs text-[#131B2E]">{item.zone}</span>
                                <span className="text-[11px] text-[#474555]">{item.locationDetail}</span>
                              </div>
                            </td>

                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span className="font-mono-code text-xs bg-[#DAE2FD] px-2 py-0.5 rounded text-[#131B2E]">
                                {item.reportedBy}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono-code text-xs font-bold ${
                                  isNew
                                    ? 'bg-[#FFDAD6] text-[#93000A]'
                                    : isAck
                                    ? 'bg-[#C7C3FE] text-[#181445]'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    isNew ? 'bg-[#BA1A1A]' : isAck ? 'bg-[#5B598C]' : 'bg-emerald-600'
                                  }`}
                                />
                                {item.status.toUpperCase()}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 whitespace-nowrap">
                              {item.responderUnit && (
                                <div className="flex items-center gap-1.5">
                                  <span className="material-symbols-outlined text-[18px] text-[#4225D0]">
                                    emergency
                                  </span>
                                  <div className="flex flex-col">
                                    <span className="font-semibold text-xs text-[#131B2E]">
                                      {item.responderUnit}
                                    </span>
                                    <span className="font-mono-code text-[10px] text-[#474555]">
                                      {item.responderStatus}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </td>

                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                {isNew && (
                                  <button
                                    onClick={() => handleAcknowledge(item.id)}
                                    className="bg-[#4225D0] text-white hover:bg-[#331CA8] px-2.5 py-1 rounded-md text-xs font-semibold transition-all active:scale-95 shadow-xs"
                                    type="button"
                                  >
                                    Acknowledge
                                  </button>
                                )}
                                {isAck && (
                                  <button
                                    onClick={() => handleResolve(item.id)}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-md text-xs font-semibold transition-all active:scale-95 shadow-xs"
                                    type="button"
                                  >
                                    Resolve
                                  </button>
                                )}
                                <button
                                  onClick={() => onNavigate('map')}
                                  className="bg-[#F2F3FF] hover:bg-[#E2E7FF] text-[#131B2E] px-2.5 py-1 rounded-md text-xs font-semibold transition-colors flex items-center gap-1"
                                  type="button"
                                >
                                  <span className="material-symbols-outlined text-[13px]">my_location</span>
                                  <span>Map</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="px-4 py-3 bg-[#F2F3FF] flex items-center justify-between border-t border-[#DAE2FD]">
                <span className="text-xs text-[#474555]">
                  Showing {filteredIncidents.length} of {incidents.length} logged incidents today
                </span>
                <div className="flex items-center gap-1">
                  <span className="font-mono-code text-xs px-2 text-[#131B2E] font-semibold">Page 1 of 1</span>
                </div>
              </div>
            </div>

            {/* Right Column (Span 4) */}
            <div className="xl:col-span-4 flex flex-col gap-5">
              {/* Live Incident Map */}
              <div className="bg-white rounded-xl shadow-xs border border-[#DAE2FD] overflow-hidden flex flex-col">
                <div className="p-3.5 bg-[#F2F3FF] flex items-center justify-between border-b border-[#DAE2FD]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#4225D0] text-[20px]">map</span>
                    <span className="font-semibold text-xs text-[#131B2E]">Live Venue Incident Map</span>
                  </div>
                  <span className="font-mono-code text-[11px] text-[#4225D0] font-bold uppercase flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> GPS Real-time
                  </span>
                </div>

                {/* SVG Blueprint Map */}
                <div className="relative w-full h-64 bg-slate-900 overflow-hidden">
                  <svg className="absolute inset-0 w-full h-full opacity-45" viewBox="0 0 400 300" fill="none">
                    <defs>
                      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#334155" strokeWidth="0.5" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />

                    <rect x="30" y="30" width="140" height="110" rx="8" className="fill-indigo-950/40" stroke="#64748B" strokeWidth="1.5" />
                    <text x="40" y="55" fill="#94A3B8" fontFamily="JetBrains Mono" fontSize="9">ZONE A: MAIN STAGE</text>

                    <rect x="200" y="30" width="170" height="90" rx="8" className="fill-indigo-950/20" stroke="#64748B" strokeWidth="1.5" />
                    <text x="210" y="55" fill="#94A3B8" fontFamily="JetBrains Mono" fontSize="9">ZONE B: WORKSHOPS</text>

                    <rect x="30" y="160" width="180" height="110" rx="8" className="fill-indigo-950/30" stroke="#64748B" strokeWidth="1.5" />
                    <text x="40" y="185" fill="#94A3B8" fontFamily="JetBrains Mono" fontSize="9">ZONE C: FOOD COURT</text>

                    <rect x="230" y="140" width="140" height="130" rx="8" className="fill-indigo-950/20" stroke="#64748B" strokeWidth="1.5" />
                    <text x="240" y="165" fill="#94A3B8" fontFamily="JetBrains Mono" fontSize="9">ZONE D: EXPO HALL</text>

                    <path d="M 170 85 L 200 85" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" />
                    <path d="M 120 140 L 120 160" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" />
                    <path d="M 210 200 L 230 200" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" />
                  </svg>

                  {/* Pulsing Node 1: Main Stage Medical */}
                  <div 
                    onClick={() => onNavigate('map')}
                    className="absolute top-[28%] left-[22%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  >
                    <span className="absolute -inset-3 rounded-full bg-red-500/40 animate-ping pointer-events-none"></span>
                    <div className="relative w-7 h-7 rounded-full bg-[#BA1A1A] text-white flex items-center justify-center shadow-lg border-2 border-white">
                      <span className="material-symbols-outlined text-[15px]">medical_services</span>
                    </div>
                  </div>

                  {/* Pulsing Node 2: Ramp B Accessibility */}
                  <div 
                    onClick={() => onNavigate('map')}
                    className="absolute top-[18%] left-[62%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  >
                    <div className="relative w-6 h-6 rounded-full bg-[#5B598C] text-white flex items-center justify-center shadow-md border-2 border-white">
                      <span className="material-symbols-outlined text-[13px]">accessible</span>
                    </div>
                  </div>

                  {/* Responder Position */}
                  <div className="absolute top-[38%] left-[34%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 bg-white/95 px-2 py-0.5 rounded-full shadow-lg border border-slate-200">
                    <span className="w-2 h-2 rounded-full bg-[#4225D0] animate-pulse"></span>
                    <span className="font-mono-code text-[10px] text-[#131B2E] font-bold">ALPHA (2.1 km/h)</span>
                  </div>

                  {/* Map Legend */}
                  <div className="absolute bottom-2 left-2 right-2 bg-slate-900/90 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center justify-between text-white font-mono-code text-[11px]">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#BA1A1A]"></span> SOS
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#5B598C]"></span> Assisting
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#4225D0]"></span> Medic Unit
                      </span>
                    </div>
                    <button
                      onClick={() => onNavigate('map')}
                      className="text-indigo-300 hover:underline flex items-center gap-0.5"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[12px]">open_in_full</span> Expand
                    </button>
                  </div>
                </div>

                {/* Crowd Density by Zone */}
                <div className="p-4 flex flex-col gap-3 bg-white">
                  <span className="text-xs uppercase font-bold text-[#474555]">
                    Crowd Density by Zone
                  </span>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span>Main Stage (Hall A)</span>
                      <span className="font-mono-code text-[#BA1A1A]">96% High</span>
                    </div>
                    <div className="w-full bg-[#DAE2FD] rounded-full h-1.5 overflow-hidden">
                      <div className="bg-[#BA1A1A] h-full rounded-full" style={{ width: '96%' }}></div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span>Food Court North</span>
                      <span className="font-mono-code text-[#474555]">68% Medium</span>
                    </div>
                    <div className="w-full bg-[#DAE2FD] rounded-full h-1.5 overflow-hidden">
                      <div className="bg-[#4225D0] h-full rounded-full" style={{ width: '68%' }}></div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span>Workshops (Hall C)</span>
                      <span className="font-mono-code text-[#474555]">42% Normal</span>
                    </div>
                    <div className="w-full bg-[#DAE2FD] rounded-full h-1.5 overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '42%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Field Responders Status */}
              <div className="bg-white rounded-xl p-4 shadow-xs border border-[#DAE2FD] flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-[#131B2E]">Field Responders Status</span>
                  <span className="text-xs text-[#474555] font-medium">3 Active Units</span>
                </div>

                <div className="flex flex-col gap-2">
                  {RESPONDER_UNITS.map(unit => (
                    <div
                      key={unit.id}
                      className="p-2.5 rounded-lg bg-[#F2F3FF] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${
                            unit.statusColor === 'error'
                              ? 'bg-[#BA1A1A]'
                              : unit.statusColor === 'secondary'
                              ? 'bg-[#5B598C]'
                              : 'bg-emerald-500'
                          }`}
                        />
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-[#131B2E]">{unit.name}</span>
                          <span className="font-mono-code text-[11px] text-[#474555]">
                            {unit.currentTask}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`font-mono-code text-xs font-bold ${
                          unit.statusColor === 'error'
                            ? 'text-[#BA1A1A]'
                            : unit.statusColor === 'secondary'
                            ? 'text-[#5B598C]'
                            : 'text-emerald-600'
                        }`}
                      >
                        {unit.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Broadcast Alert Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 bg-[#131B2E]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-[#DAE2FD] animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-[#C02028]">
                <span className="material-symbols-outlined text-[24px]">emergency_share</span>
                <h3 className="font-display-command text-lg font-bold text-[#131B2E]">
                  Emergency Broadcast Alert
                </h3>
              </div>
              <button
                onClick={() => setShowBroadcastModal(false)}
                className="text-[#474555] hover:text-[#131B2E]"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="text-xs text-[#474555] mb-3 leading-relaxed">
              This will transmit a high-priority push banner to all 14,820 connected attendee devices and digital signage boards.
            </p>

            <textarea
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              placeholder="e.g. Weather alert: Please remain inside Main Hall A until further notice."
              className="w-full h-24 p-3 rounded-xl border border-[#DAE2FD] text-xs text-[#131B2E] focus:outline-none focus:border-[#4225D0] mb-4 resize-none"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowBroadcastModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-[#474555] hover:bg-[#F2F3FF]"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={handleSendBroadcast}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#C02028] text-white hover:bg-[#9B0015] shadow-xs active:scale-95 transition-all"
                type="button"
              >
                Transmit Broadcast
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
