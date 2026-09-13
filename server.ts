import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import {
  INITIAL_ANNOUNCEMENTS,
  INITIAL_ZONES,
  VENUE_POIS,
  INITIAL_SESSIONS,
  INITIAL_INCIDENTS,
  RESPONDER_UNITS
} from './src/data/mockData';
import {
  Announcement,
  ZoneData,
  POIData,
  SessionData,
  IncidentAlert,
  ResponderUnit,
  User
} from './src/types';

dotenv.config({ path: '.env.local' });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Enable CORS for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// In-Memory Data Stores
let announcements: Announcement[] = [...INITIAL_ANNOUNCEMENTS];
let zones: ZoneData[] = [...INITIAL_ZONES];
let pois: POIData[] = [...VENUE_POIS];
let sessions: SessionData[] = [...INITIAL_SESSIONS];
let incidents: IncidentAlert[] = [...INITIAL_INCIDENTS];
let responders: ResponderUnit[] = [...RESPONDER_UNITS];

// Registered Users Data Store
let users: (User & { passwordHash: string })[] = [
  {
    id: 'user-organizer-1',
    name: 'Atharva',
    email: 'atharva@eventpulse.io',
    passwordHash: 'password123',
    role: 'organizer',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWLRjjsI2RpxU1ZF2Ogk2U5EBuQM-32Xtm8eVBsBNFtk5CmmZWKb84QMPG9JLSdJirGtqtT6965dV-yruSrtaG59I6lgxlIQcfXl67QLQUw61pvMQPzSprr2LS4B6Q6Q9IFEGkbzsmONAVM0QvF4DF_zvYneZTxPzfG6IoIptbjSmY6gjjbIOQa7Yn-eGXtmG02fUQ3PEssc68pjrGNjXa9JrVUO7cfp-gXRIey5cr0wjtt6HIp88q',
    ticketId: 'EP-2025-9981'
  },
  {
    id: 'user-attendee-1',
    name: 'Alex Rivera',
    email: 'attendee@eventpulse.io',
    passwordHash: 'password123',
    role: 'attendee',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkF8x025wCMgEdbCuWQj3c7i0khYir9YzAnMzEkVSlFtZKJntQlCrF9idzMyTBK21dvsCuf0pyZg02Tr8UulkTgjQB5FcrmO4VDsirWqVqC5blcTezmvceyLCJ-SdpnX5w8L7H5GvVRqBbm94IG49gxWT6hMTH7Nkf6iXqM86VRb5Vn4hKxqgLrf_1XXF3C7BwphZQ4WkbOIBKSgKxMsDlXZLNBkstc8mz5fEdfaoYmUHf3PLREM21',
    ticketId: 'EP-2025-4412'
  }
];

// Helper to generate simple token
const createToken = (userId: string) => `token_ep_${userId}_${Date.now()}`;

// ----------------------------------------------------
// Authentication Endpoints
// ----------------------------------------------------

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const userMatch = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!userMatch || userMatch.passwordHash !== password) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const { passwordHash, ...userProfile } = userMatch;
  const token = createToken(userMatch.id);

  res.json({
    user: userProfile,
    token
  });
});

// POST /api/auth/signup
app.post('/api/auth/signup', (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }

  const newUser = {
    id: `user-${Date.now()}`,
    name,
    email,
    passwordHash: password,
    role: (role === 'organizer' ? 'organizer' : 'attendee') as 'attendee' | 'organizer',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAOMrxBtT395bO7cQ5--uk7O5zSz7euHVEcO9iMFUosTdpTCgAh16uDZCbf2pRobZ2llmN_TaCw0llYH36t_7JDNLkGsHOSAud_k4F3VXoEfwWdKaOadEkFUNq3QLo8rzk4uyfrDgdZMNtZG9AtYYSUdnfk7IUNciAOS3818JFw4wtoR8_0kWllwG8vgFcsgWz9-kVqR7dknPxR1TlXkUv8truKu-uyMh08K5KepMUNUrNi2MK7bIn',
    ticketId: `EP-2025-${Math.floor(1000 + Math.random() * 9000)}`
  };

  users.push(newUser);

  const { passwordHash, ...userProfile } = newUser;
  const token = createToken(newUser.id);

  res.status(201).json({
    user: userProfile,
    token
  });
});

// GET /api/auth/me
app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  const parts = token.split('_');
  const userId = parts[2];

  const userMatch = users.find(u => u.id === userId);
  if (!userMatch) {
    return res.status(401).json({ error: 'Session expired or invalid user' });
  }

  const { passwordHash, ...userProfile } = userMatch;
  res.json({ user: userProfile });
});

// Gemini AI Client Instance
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client:', err);
  }
}

// ----------------------------------------------------
// Health Check Endpoint
// ----------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptimeSeconds: process.uptime(),
    activeIncidents: incidents.filter(i => i.status !== 'resolved').length
  });
});

// ----------------------------------------------------
// Announcements Endpoints
// ----------------------------------------------------
app.get('/api/announcements', (req, res) => {
  res.json(announcements);
});

app.post('/api/announcements', (req, res) => {
  const { title, description, tag, tagType, location, actionLabel, actionType, badgeMeta } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }

  const newAnn: Announcement = {
    id: `ann-${Date.now()}`,
    tag: tag || 'Broadcast Alert',
    tagType: tagType || 'keynote',
    timeAgo: 'Just now',
    title,
    description,
    location: location || 'All Halls',
    actionLabel: actionLabel || 'View',
    actionType: actionType || 'details',
    badgeMeta: badgeMeta || 'Live Alert'
  };

  announcements.unshift(newAnn);
  res.status(201).json(newAnn);
});

// ----------------------------------------------------
// Zones (Crowd Radar) Endpoints
// ----------------------------------------------------
app.get('/api/zones', (req, res) => {
  res.json(zones);
});

app.patch('/api/zones/:id', (req, res) => {
  const { id } = req.params;
  const zoneIndex = zones.findIndex(z => z.id === id);
  if (zoneIndex === -1) {
    return res.status(404).json({ error: 'Zone not found' });
  }

  zones[zoneIndex] = {
    ...zones[zoneIndex],
    ...req.body
  };

  res.json(zones[zoneIndex]);
});

// ----------------------------------------------------
// POIs (Venue Map Points of Interest) Endpoints
// ----------------------------------------------------
app.get('/api/pois', (req, res) => {
  res.json(pois);
});

// ----------------------------------------------------
// Schedule Sessions Endpoints
// ----------------------------------------------------
app.get('/api/sessions', (req, res) => {
  res.json(sessions);
});

app.patch('/api/sessions/:id', (req, res) => {
  const { id } = req.params;
  const sessionIndex = sessions.findIndex(s => s.id === id);
  if (sessionIndex === -1) {
    return res.status(404).json({ error: 'Session not found' });
  }

  sessions[sessionIndex] = {
    ...sessions[sessionIndex],
    ...req.body
  };

  res.json(sessions[sessionIndex]);
});

// ----------------------------------------------------
// Incidents (Emergency SOS) Endpoints
// ----------------------------------------------------
app.get('/api/incidents', (req, res) => {
  res.json(incidents);
});

app.post('/api/incidents', (req, res) => {
  const { type, typeLabel, icon, zone, locationDetail, reportedBy, isUrgent } = req.body;
  if (!zone) {
    return res.status(400).json({ error: 'Zone is required' });
  }

  const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const newIncident: IncidentAlert = {
    id: `inc-${Date.now()}`,
    time: nowStr,
    type: type || 'help',
    typeLabel: typeLabel || 'Help Request',
    icon: icon || 'emergency',
    zone,
    locationDetail: locationDetail || 'Attendee Beacon Pinpoint',
    reportedBy: reportedBy || `Attendee #${Math.floor(1000 + Math.random() * 9000)}`,
    status: 'new',
    responderUnit: 'Medic Unit Alpha',
    responderStatus: 'Dispatched (ETA 2m)',
    isUrgent: isUrgent ?? true
  };

  incidents.unshift(newIncident);
  res.status(201).json(newIncident);
});

app.patch('/api/incidents/:id', (req, res) => {
  const { id } = req.params;
  const incIndex = incidents.findIndex(i => i.id === id);
  if (incIndex === -1) {
    return res.status(404).json({ error: 'Incident not found' });
  }

  incidents[incIndex] = {
    ...incidents[incIndex],
    ...req.body
  };

  res.json(incidents[incIndex]);
});

// ----------------------------------------------------
// Responders Endpoints
// ----------------------------------------------------
app.get('/api/responders', (req, res) => {
  res.json(responders);
});

app.patch('/api/responders/:id', (req, res) => {
  const { id } = req.params;
  const resIndex = responders.findIndex(r => r.id === id);
  if (resIndex === -1) {
    return res.status(404).json({ error: 'Responder unit not found' });
  }

  responders[resIndex] = {
    ...responders[resIndex],
    ...req.body
  };

  res.json(responders[resIndex]);
});

// ----------------------------------------------------
// Gemini AI Event Assistant Endpoint
// ----------------------------------------------------
app.post('/api/ai/assistant', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    if (aiClient) {
      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `You are EventPulse AI, an intelligent summit companion and incident triage assistant. Current event status: Main Stage (Hall A) 89% capacity, Food Court 54% capacity, Workshop Hall 28% capacity. Active incidents: ${incidents.filter(i => i.status !== 'resolved').length}. User prompt: ${prompt}`
              }
            ]
          }
        ]
      });
      return res.json({ answer: response.text });
    }
  } catch (err) {
    console.error('Gemini API call error:', err);
  }

  // Fallback response generator if Gemini API key is missing or encounters network error
  const fallbackAnswer = `EventPulse Assistant: Thank you for asking about "${prompt}". Main Stage is currently at 89% capacity, while Workshop Hall B has lower congestion (28%). For medical or security emergencies, use the SOS button immediately.`;
  res.json({ answer: fallbackAnswer });
});

app.listen(PORT, () => {
  console.log(`⚡ [EventPulse Server] Express API server running on http://localhost:${PORT}`);
});
