import { Announcement, ZoneData, POIData, SessionData, IncidentAlert, ResponderUnit, User, AuthResponse } from '../types';

const API_BASE = '/api';
const TOKEN_KEY = 'eventpulse_auth_token';

export function setAuthToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function loginApi(email: string, password: string): Promise<AuthResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Login failed');
    }
    const data: AuthResponse = await res.json();
    setAuthToken(data.token);
    return data;
  } catch (err: any) {
    console.error('API login error:', err);
    throw err;
  }
}

export async function signupApi(name: string, email: string, password: string, role: 'attendee' | 'organizer'): Promise<AuthResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Signup failed');
    }
    const data: AuthResponse = await res.json();
    setAuthToken(data.token);
    return data;
  } catch (err: any) {
    console.error('API signup error:', err);
    throw err;
  }
}

export async function fetchMeApi(): Promise<User | null> {
  const token = getStoredToken();
  if (!token) return null;
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) {
      clearAuthToken();
      return null;
    }
    const data = await res.json();
    return data.user;
  } catch (err) {
    console.warn('API fetchMe error:', err);
    return null;
  }
}

export async function fetchAnnouncements(): Promise<Announcement[]> {
  try {
    const res = await fetch(`${API_BASE}/announcements`);
    if (!res.ok) throw new Error('Failed to fetch announcements');
    return await res.json();
  } catch (err) {
    console.warn('API fetchAnnouncements error, returning fallback:', err);
    return [];
  }
}

export async function createAnnouncement(data: Partial<Announcement>): Promise<Announcement | null> {
  try {
    const res = await fetch(`${API_BASE}/announcements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create announcement');
    return await res.json();
  } catch (err) {
    console.error('API createAnnouncement error:', err);
    return null;
  }
}

export async function fetchZones(): Promise<ZoneData[]> {
  try {
    const res = await fetch(`${API_BASE}/zones`);
    if (!res.ok) throw new Error('Failed to fetch zones');
    return await res.json();
  } catch (err) {
    console.warn('API fetchZones error:', err);
    return [];
  }
}

export async function updateZone(id: string, updates: Partial<ZoneData>): Promise<ZoneData | null> {
  try {
    const res = await fetch(`${API_BASE}/zones/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update zone');
    return await res.json();
  } catch (err) {
    console.error('API updateZone error:', err);
    return null;
  }
}

export async function fetchPois(): Promise<POIData[]> {
  try {
    const res = await fetch(`${API_BASE}/pois`);
    if (!res.ok) throw new Error('Failed to fetch POIs');
    return await res.json();
  } catch (err) {
    console.warn('API fetchPois error:', err);
    return [];
  }
}

export async function fetchSessions(): Promise<SessionData[]> {
  try {
    const res = await fetch(`${API_BASE}/sessions`);
    if (!res.ok) throw new Error('Failed to fetch sessions');
    return await res.json();
  } catch (err) {
    console.warn('API fetchSessions error:', err);
    return [];
  }
}

export async function updateSession(id: string, updates: Partial<SessionData>): Promise<SessionData | null> {
  try {
    const res = await fetch(`${API_BASE}/sessions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update session');
    return await res.json();
  } catch (err) {
    console.error('API updateSession error:', err);
    return null;
  }
}

export async function fetchIncidents(): Promise<IncidentAlert[]> {
  try {
    const res = await fetch(`${API_BASE}/incidents`);
    if (!res.ok) throw new Error('Failed to fetch incidents');
    return await res.json();
  } catch (err) {
    console.warn('API fetchIncidents error:', err);
    return [];
  }
}

export async function createIncident(data: Partial<IncidentAlert>): Promise<IncidentAlert | null> {
  try {
    const res = await fetch(`${API_BASE}/incidents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create incident');
    return await res.json();
  } catch (err) {
    console.error('API createIncident error:', err);
    return null;
  }
}

export async function updateIncident(id: string, updates: Partial<IncidentAlert>): Promise<IncidentAlert | null> {
  try {
    const res = await fetch(`${API_BASE}/incidents/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update incident');
    return await res.json();
  } catch (err) {
    console.error('API updateIncident error:', err);
    return null;
  }
}

export async function fetchResponders(): Promise<ResponderUnit[]> {
  try {
    const res = await fetch(`${API_BASE}/responders`);
    if (!res.ok) throw new Error('Failed to fetch responders');
    return await res.json();
  } catch (err) {
    console.warn('API fetchResponders error:', err);
    return [];
  }
}

export async function updateResponder(id: string, updates: Partial<ResponderUnit>): Promise<ResponderUnit | null> {
  try {
    const res = await fetch(`${API_BASE}/responders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update responder');
    return await res.json();
  } catch (err) {
    console.error('API updateResponder error:', err);
    return null;
  }
}

export async function askAiAssistant(prompt: string): Promise<string> {
  try {
    const res = await fetch(`${API_BASE}/ai/assistant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    if (!res.ok) throw new Error('Failed to query AI assistant');
    const data = await res.json();
    return data.answer || 'No response generated.';
  } catch (err) {
    console.error('API askAiAssistant error:', err);
    return 'EventPulse AI: Network error connecting to backend AI assistant service.';
  }
}
