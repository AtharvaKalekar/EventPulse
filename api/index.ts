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
} from '../src/data/mockData';
import {
  Announcement,
  ZoneData,
  POIData,
  SessionData,
  IncidentAlert,
  ResponderUnit,
  User
} from '../src/types';

dotenv.config();

const app = express();
app.use(express.json());

// Enable CORS for Vercel Serverless Functions
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

const router = express.Router();

// Helper to generate simple token
const createToken = (userId: string) => `token_ep_${userId}_${Date.now()}`;

// ----------------------------------------------------
// Auth Endpoints
// ----------------------------------------------------
router.post('/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
  const userMatch = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!userMatch || userMatch.passwordHash !== password) return res.status(401).json({ error: 'Invalid email or password' });
  const { passwordHash, ...userProfile } = userMatch;
  res.json({ user: userProfile, token: createToken(userMatch.id) });
});

router.post('/auth/signup', (req, res) => {
  const { name, email, password, role } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ error: 'Name, email, and password are required' });
  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) return res.status(409).json({ error: 'An account with this email already exists' });
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
  res.status(201).json({ user: userProfile, token: createToken(newUser.id) });
});

router.get('/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  const token = authHeader.split(' ')[1];
  const parts = token.split('_');
  const userId = parts[2];
  const userMatch = users.find(u => u.id === userId);
  if (!userMatch) return res.status(401).json({ error: 'Session expired' });
  const { passwordHash, ...userProfile } = userMatch;
  res.json({ user: userProfile });
});

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), activeIncidents: incidents.filter(i => i.status !== 'resolved').length });
});

// Announcements
router.get('/announcements', (req, res) => res.json(announcements));
router.post('/announcements', (req, res) => {
  const { title, description, tag, tagType, location, actionLabel, actionType, badgeMeta } = req.body || {};
  if (!title || !description) return res.status(400).json({ error: 'Title and description are required' });
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

// Zones
router.get('/zones', (req, res) => res.json(zones));
router.patch('/zones/:id', (req, res) => {
  const { id } = req.params;
  const index = zones.findIndex(z => z.id === id);
  if (index === -1) return res.status(404).json({ error: 'Zone not found' });
  zones[index] = { ...zones[index], ...req.body };
  res.json(zones[index]);
});

// POIs & Sessions
router.get('/pois', (req, res) => res.json(pois));
router.get('/sessions', (req, res) => res.json(sessions));
router.patch('/sessions/:id', (req, res) => {
  const { id } = req.params;
  const index = sessions.findIndex(s => s.id === id);
  if (index === -1) return res.status(404).json({ error: 'Session not found' });
  sessions[index] = { ...sessions[index], ...req.body };
  res.json(sessions[index]);
});

// Incidents
router.get('/incidents', (req, res) => res.json(incidents));
router.post('/incidents', (req, res) => {
  const { type, typeLabel, icon, zone, locationDetail, reportedBy, isUrgent } = req.body || {};
  if (!zone) return res.status(400).json({ error: 'Zone is required' });
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

router.patch('/incidents/:id', (req, res) => {
  const { id } = req.params;
  const index = incidents.findIndex(i => i.id === id);
  if (index === -1) return res.status(404).json({ error: 'Incident not found' });
  incidents[index] = { ...incidents[index], ...req.body };
  res.json(incidents[index]);
});

// Responders
router.get('/responders', (req, res) => res.json(responders));
router.patch('/responders/:id', (req, res) => {
  const { id } = req.params;
  const index = responders.findIndex(r => r.id === id);
  if (index === -1) return res.status(404).json({ error: 'Responder not found' });
  responders[index] = { ...responders[index], ...req.body };
  res.json(responders[index]);
});

// AI Assistant
router.post('/ai/assistant', async (req, res) => {
  const { prompt } = req.body || {};
  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    try {
      const aiClient = new GoogleGenAI({ apiKey });
      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: `You are EventPulse AI. User prompt: ${prompt}` }] }]
      });
      return res.json({ answer: response.text });
    } catch (err) {
      console.error('Gemini error:', err);
    }
  }
  res.json({ answer: `EventPulse Assistant: Response for "${prompt}". Main Stage is at 89% capacity. Use SOS button for emergency dispatch.` });
});

// Mount router under both /api and /
app.use('/api', router);
app.use('/', router);

// Global Error Handler Middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('API Error:', err);
  res.status(500).json({ error: err?.message || 'Internal Server Error' });
});

export default app;
