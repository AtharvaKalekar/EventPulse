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

async function handleResponse<T>(res: Response, defaultErrorMsg: string): Promise<T> {
  const text = await res.text();
  let data: any = {};
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: text };
    }
  }

  if (!res.ok) {
    throw new Error(data.error || data.message || (typeof text === 'string' && text.length < 200 ? text : null) || defaultErrorMsg);
  }

  return data as T;
}

export async function loginApi(email: string, password: string): Promise<AuthResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await handleResponse<AuthResponse>(res, 'Login failed');
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
    const data = await handleResponse<AuthResponse>(res, 'Signup failed');
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
    const data = await handleResponse<{ user: User }>(res, 'Fetch user failed');
    return data.user;
  } catch (err) {
    console.warn('API fetchMe error:', err);
    return null;
  }
}

export async function fetchAnnouncements(): Promise<Announcement[]> {
  try {
    const res = await fetch(`${API_BASE}/announcements`);
    return await handleResponse<Announcement[]>(res, 'Failed to fetch announcements');
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
    return await handleResponse<Announcement>(res, 'Failed to create announcement');
  } catch (err) {
    console.error('API createAnnouncement error:', err);
    return null;
  }
}

export async function fetchZones(): Promise<ZoneData[]> {
  try {
    const res = await fetch(`${API_BASE}/zones`);
    return await handleResponse<ZoneData[]>(res, 'Failed to fetch zones');
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
    return await handleResponse<ZoneData>(res, 'Failed to update zone');
  } catch (err) {
    console.error('API updateZone error:', err);
    return null;
  }
}

export async function fetchPois(): Promise<POIData[]> {
  try {
    const res = await fetch(`${API_BASE}/pois`);
    return await handleResponse<POIData[]>(res, 'Failed to fetch POIs');
  } catch (err) {
    console.warn('API fetchPois error:', err);
    return [];
  }
}

export async function fetchSessions(): Promise<SessionData[]> {
  try {
    const res = await fetch(`${API_BASE}/sessions`);
    return await handleResponse<SessionData[]>(res, 'Failed to fetch sessions');
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
    return await handleResponse<SessionData>(res, 'Failed to update session');
  } catch (err) {
    console.error('API updateSession error:', err);
    return null;
  }
}

export async function fetchIncidents(): Promise<IncidentAlert[]> {
  try {
    const res = await fetch(`${API_BASE}/incidents`);
    return await handleResponse<IncidentAlert[]>(res, 'Failed to fetch incidents');
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
    return await handleResponse<IncidentAlert>(res, 'Failed to create incident');
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
    return await handleResponse<IncidentAlert>(res, 'Failed to update incident');
  } catch (err) {
    console.error('API updateIncident error:', err);
    return null;
  }
}

export async function fetchResponders(): Promise<ResponderUnit[]> {
  try {
    const res = await fetch(`${API_BASE}/responders`);
    return await handleResponse<ResponderUnit[]>(res, 'Failed to fetch responders');
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
    return await handleResponse<ResponderUnit>(res, 'Failed to update responder');
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
    const data = await handleResponse<{ answer?: string }>(res, 'Failed to query AI assistant');
    return data.answer || 'No response generated.';
  } catch (err) {
    console.error('API askAiAssistant error:', err);
    return 'EventPulse AI: Network error connecting to backend AI assistant service.';
  }
}

