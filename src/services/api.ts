import { Announcement, ZoneData, POIData, SessionData, IncidentAlert, ResponderUnit, User, AuthResponse } from '../types';
import {
  INITIAL_ANNOUNCEMENTS,
  INITIAL_ZONES,
  VENUE_POIS,
  INITIAL_SESSIONS,
  INITIAL_INCIDENTS,
  RESPONDER_UNITS,
  ALEX_VANCE_AVATAR,
  ELENA_ROSTOVA_AVATAR
} from '../data/mockData';

const API_BASE = '/api';
const TOKEN_KEY = 'eventpulse_auth_token';
const USERS_KEY = 'eventpulse_client_users';
const ANNOUNCEMENTS_KEY = 'eventpulse_client_announcements';
const ZONES_KEY = 'eventpulse_client_zones';
const SESSIONS_KEY = 'eventpulse_client_sessions';
const INCIDENTS_KEY = 'eventpulse_client_incidents';
const RESPONDERS_KEY = 'eventpulse_client_responders';

type UserWithPass = User & { passwordHash: string };

const DEFAULT_USERS: UserWithPass[] = [
  {
    id: 'user-organizer-1',
    name: 'Atharva',
    email: 'atharva@eventpulse.io',
    passwordHash: 'password123',
    role: 'organizer',
    avatarUrl: ALEX_VANCE_AVATAR,
    ticketId: 'EP-2025-9981'
  },
  {
    id: 'user-attendee-1',
    name: 'Alex Rivera',
    email: 'attendee@eventpulse.io',
    passwordHash: 'password123',
    role: 'attendee',
    avatarUrl: ELENA_ROSTOVA_AVATAR,
    ticketId: 'EP-2025-4412'
  }
];

function getStoredUsers(): UserWithPass[] {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) {
    localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return DEFAULT_USERS;
  }
}

function saveStoredUsers(users: UserWithPass[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function createToken(userId: string): string {
  return `token_ep_${userId}_${Date.now()}`;
}

export function setAuthToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function isServerError(status: number, text: string): boolean {
  return status >= 500 || text.includes('FUNCTION_INVOCATION_FAILED') || text.includes('server error') || text.includes('Server Error');
}

// Client Storage Helpers for Mock Data Persistence
function getLocalItem<T>(key: string, initial: T): T {
  const raw = localStorage.getItem(key);
  if (!raw) {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return initial;
  }
}

function setLocalItem<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ----------------------------------------------------
// Authentication API Methods with Graceful Standalone Fallback
// ----------------------------------------------------

export async function loginApi(email: string, password: string): Promise<AuthResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const text = await res.text();
    if (res.ok) {
      const data: AuthResponse = JSON.parse(text);
      setAuthToken(data.token);
      return data;
    }
    if (!isServerError(res.status, text)) {
      let errJson: any = {};
      try { errJson = JSON.parse(text); } catch {}
      throw new Error(errJson.error || 'Invalid email or password');
    }
  } catch (err: any) {
    if (err.message === 'Invalid email or password' || err.message === 'Email and password are required') {
      throw err;
    }
    console.warn('Backend API unavailable, using client-side login fallback');
  }

  // --- Client Fallback Login ---
  const users = getStoredUsers();
  const match = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!match || match.passwordHash !== password) {
    throw new Error('Invalid email or password');
  }
  const { passwordHash, ...userProfile } = match;
  const token = createToken(match.id);
  setAuthToken(token);
  return { user: userProfile, token };
}

export async function signupApi(name: string, email: string, password: string, role: 'attendee' | 'organizer'): Promise<AuthResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });
    const text = await res.text();
    if (res.ok) {
      const data: AuthResponse = JSON.parse(text);
      setAuthToken(data.token);
      return data;
    }
    if (!isServerError(res.status, text)) {
      let errJson: any = {};
      try { errJson = JSON.parse(text); } catch {}
      throw new Error(errJson.error || 'Signup failed');
    }
  } catch (err: any) {
    if (err.message && err.message !== 'Signup failed' && !err.message.includes('server error') && !err.message.includes('FUNCTION_INVOCATION_FAILED') && err.message !== 'Failed to fetch') {
      throw err;
    }
    console.warn('Backend API unavailable, using client-side signup fallback');
  }

  // --- Client Fallback Signup ---
  const users = getStoredUsers();
  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    throw new Error('An account with this email already exists');
  }
  const newUser: UserWithPass = {
    id: `user-${Date.now()}`,
    name,
    email,
    passwordHash: password,
    role: (role === 'organizer' ? 'organizer' : 'attendee') as 'attendee' | 'organizer',
    avatarUrl: ALEX_VANCE_AVATAR,
    ticketId: `EP-2025-${Math.floor(1000 + Math.random() * 9000)}`
  };
  users.push(newUser);
  saveStoredUsers(users);

  const { passwordHash, ...userProfile } = newUser;
  const token = createToken(newUser.id);
  setAuthToken(token);
  return { user: userProfile, token };
}

export async function fetchMeApi(): Promise<User | null> {
  const token = getStoredToken();
  if (!token) return null;
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const text = await res.text();
    if (res.ok) {
      const data = JSON.parse(text);
      return data.user;
    }
    if (res.status === 401) {
      clearAuthToken();
      return null;
    }
  } catch (err) {
    console.warn('API fetchMe error, executing client-side token resolution');
  }

  // --- Client Fallback me ---
  const parts = token.split('_');
  const userId = parts[2];
  const users = getStoredUsers();
  const match = users.find(u => u.id === userId);
  if (!match) {
    clearAuthToken();
    return null;
  }
  const { passwordHash, ...userProfile } = match;
  return userProfile;
}

// ----------------------------------------------------
// Event Content Data API Methods with Standalone Fallback
// ----------------------------------------------------

export async function fetchAnnouncements(): Promise<Announcement[]> {
  try {
    const res = await fetch(`${API_BASE}/announcements`);
    const text = await res.text();
    if (res.ok) return JSON.parse(text);
  } catch (err) {
    console.warn('API fetchAnnouncements error, using local fallback');
  }
  return getLocalItem<Announcement[]>(ANNOUNCEMENTS_KEY, INITIAL_ANNOUNCEMENTS);
}

export async function createAnnouncement(data: Partial<Announcement>): Promise<Announcement | null> {
  try {
    const res = await fetch(`${API_BASE}/announcements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const text = await res.text();
    if (res.ok) return JSON.parse(text);
  } catch (err) {
    console.warn('API createAnnouncement error, using local fallback');
  }

  const list = getLocalItem<Announcement[]>(ANNOUNCEMENTS_KEY, INITIAL_ANNOUNCEMENTS);
  const newAnn: Announcement = {
    id: `ann-${Date.now()}`,
    tag: data.tag || 'Broadcast Alert',
    tagType: data.tagType || 'keynote',
    timeAgo: 'Just now',
    title: data.title || 'Notification',
    description: data.description || '',
    location: data.location || 'All Halls',
    actionLabel: data.actionLabel || 'View',
    actionType: data.actionType || 'details',
    badgeMeta: data.badgeMeta || 'Live Alert'
  };
  list.unshift(newAnn);
  setLocalItem(ANNOUNCEMENTS_KEY, list);
  return newAnn;
}

export async function fetchZones(): Promise<ZoneData[]> {
  try {
    const res = await fetch(`${API_BASE}/zones`);
    const text = await res.text();
    if (res.ok) return JSON.parse(text);
  } catch (err) {
    console.warn('API fetchZones error, using local fallback');
  }
  return getLocalItem<ZoneData[]>(ZONES_KEY, INITIAL_ZONES);
}

export async function updateZone(id: string, updates: Partial<ZoneData>): Promise<ZoneData | null> {
  try {
    const res = await fetch(`${API_BASE}/zones/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    const text = await res.text();
    if (res.ok) return JSON.parse(text);
  } catch (err) {
    console.warn('API updateZone error, using local fallback');
  }

  const zones = getLocalItem<ZoneData[]>(ZONES_KEY, INITIAL_ZONES);
  const idx = zones.findIndex(z => z.id === id);
  if (idx !== -1) {
    zones[idx] = { ...zones[idx], ...updates };
    setLocalItem(ZONES_KEY, zones);
    return zones[idx];
  }
  return null;
}

export async function fetchPois(): Promise<POIData[]> {
  try {
    const res = await fetch(`${API_BASE}/pois`);
    const text = await res.text();
    if (res.ok) return JSON.parse(text);
  } catch (err) {
    console.warn('API fetchPois error, using local fallback');
  }
  return VENUE_POIS;
}

export async function fetchSessions(): Promise<SessionData[]> {
  try {
    const res = await fetch(`${API_BASE}/sessions`);
    const text = await res.text();
    if (res.ok) return JSON.parse(text);
  } catch (err) {
    console.warn('API fetchSessions error, using local fallback');
  }
  return getLocalItem<SessionData[]>(SESSIONS_KEY, INITIAL_SESSIONS);
}

export async function updateSession(id: string, updates: Partial<SessionData>): Promise<SessionData | null> {
  try {
    const res = await fetch(`${API_BASE}/sessions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    const text = await res.text();
    if (res.ok) return JSON.parse(text);
  } catch (err) {
    console.warn('API updateSession error, using local fallback');
  }

  const sessions = getLocalItem<SessionData[]>(SESSIONS_KEY, INITIAL_SESSIONS);
  const idx = sessions.findIndex(s => s.id === id);
  if (idx !== -1) {
    sessions[idx] = { ...sessions[idx], ...updates };
    setLocalItem(SESSIONS_KEY, sessions);
    return sessions[idx];
  }
  return null;
}

export async function fetchIncidents(): Promise<IncidentAlert[]> {
  try {
    const res = await fetch(`${API_BASE}/incidents`);
    const text = await res.text();
    if (res.ok) return JSON.parse(text);
  } catch (err) {
    console.warn('API fetchIncidents error, using local fallback');
  }
  return getLocalItem<IncidentAlert[]>(INCIDENTS_KEY, INITIAL_INCIDENTS);
}

export async function createIncident(data: Partial<IncidentAlert>): Promise<IncidentAlert | null> {
  try {
    const res = await fetch(`${API_BASE}/incidents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const text = await res.text();
    if (res.ok) return JSON.parse(text);
  } catch (err) {
    console.warn('API createIncident error, using local fallback');
  }

  const incidents = getLocalItem<IncidentAlert[]>(INCIDENTS_KEY, INITIAL_INCIDENTS);
  const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const newIncident: IncidentAlert = {
    id: `inc-${Date.now()}`,
    time: nowStr,
    type: data.type || 'help',
    typeLabel: data.typeLabel || 'Help Request',
    icon: data.icon || 'emergency',
    zone: data.zone || 'Main Stage',
    locationDetail: data.locationDetail || 'Attendee Beacon Pinpoint',
    reportedBy: data.reportedBy || `Attendee #${Math.floor(1000 + Math.random() * 9000)}`,
    status: 'new',
    responderUnit: 'Medic Unit Alpha',
    responderStatus: 'Dispatched (ETA 2m)',
    isUrgent: data.isUrgent ?? true
  };
  incidents.unshift(newIncident);
  setLocalItem(INCIDENTS_KEY, incidents);
  return newIncident;
}

export async function updateIncident(id: string, updates: Partial<IncidentAlert>): Promise<IncidentAlert | null> {
  try {
    const res = await fetch(`${API_BASE}/incidents/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    const text = await res.text();
    if (res.ok) return JSON.parse(text);
  } catch (err) {
    console.warn('API updateIncident error, using local fallback');
  }

  const incidents = getLocalItem<IncidentAlert[]>(INCIDENTS_KEY, INITIAL_INCIDENTS);
  const idx = incidents.findIndex(i => i.id === id);
  if (idx !== -1) {
    incidents[idx] = { ...incidents[idx], ...updates };
    setLocalItem(INCIDENTS_KEY, incidents);
    return incidents[idx];
  }
  return null;
}

export async function fetchResponders(): Promise<ResponderUnit[]> {
  try {
    const res = await fetch(`${API_BASE}/responders`);
    const text = await res.text();
    if (res.ok) return JSON.parse(text);
  } catch (err) {
    console.warn('API fetchResponders error, using local fallback');
  }
  return getLocalItem<ResponderUnit[]>(RESPONDERS_KEY, RESPONDER_UNITS);
}

export async function updateResponder(id: string, updates: Partial<ResponderUnit>): Promise<ResponderUnit | null> {
  try {
    const res = await fetch(`${API_BASE}/responders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    const text = await res.text();
    if (res.ok) return JSON.parse(text);
  } catch (err) {
    console.warn('API updateResponder error, using local fallback');
  }

  const responders = getLocalItem<ResponderUnit[]>(RESPONDERS_KEY, RESPONDER_UNITS);
  const idx = responders.findIndex(r => r.id === id);
  if (idx !== -1) {
    responders[idx] = { ...responders[idx], ...updates };
    setLocalItem(RESPONDERS_KEY, responders);
    return responders[idx];
  }
  return null;
}

export async function askAiAssistant(prompt: string): Promise<string> {
  try {
    const res = await fetch(`${API_BASE}/ai/assistant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    const text = await res.text();
    if (res.ok) {
      const data = JSON.parse(text);
      return data.answer || 'No response generated.';
    }
  } catch (err) {
    console.warn('API askAiAssistant error, using client-side AI fallback');
  }

  return `EventPulse Assistant: Thank you for asking about "${prompt}". Main Stage is currently at 89% capacity (Hall A). Workshop Hall B has available seats (28% capacity). For emergency assistance, use the red SOS button.`;
}


