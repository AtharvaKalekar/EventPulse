export type ScreenType = 'landing' | 'login' | 'signup' | 'home' | 'map' | 'schedule' | 'crowd' | 'sos' | 'organizer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'attendee' | 'organizer';
  avatarUrl?: string;
  ticketId?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Announcement {
  id: string;
  tag: string;
  tagType: 'keynote' | 'livestream' | 'room';
  timeAgo: string;
  title: string;
  description: string;
  location?: string;
  badgeMeta?: string;
  actionLabel: string;
  actionType: 'route' | 'stream' | 'details';
}

export interface ZoneData {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  type: 'stages' | 'amenities' | 'entrances';
  congestion: number;
  statusLevel: 'low' | 'moderate' | 'crowded';
  callout: {
    icon: string;
    text: string;
    isRecommendation?: boolean;
  };
  footerInfo?: string;
  canNotify?: boolean;
}

export interface POIData {
  id: string;
  name: string;
  zone: string;
  category: 'stages' | 'food' | 'restrooms' | 'help' | 'accessible';
  status: string;
  distance: string;
  walkTime: string;
  stepFree: boolean;
  icon: string;
  x: number;
  y: number;
  description: string;
}

export interface SessionData {
  id: string;
  day: 'day1' | 'day2';
  title: string;
  time: string;
  location: string;
  track: 'tech' | 'design' | 'business' | 'ai' | 'culture' | 'workshop';
  trackLabel: string;
  isRecommended?: boolean;
  isSaved?: boolean;
  seatReserved?: boolean;
  remindMeSet?: boolean;
  statusTag?: string;
  speaker: {
    name: string;
    role: string;
    company: string;
    avatarUrl: string;
  };
}

export interface IncidentAlert {
  id: string;
  time: string;
  type: 'medical' | 'accessibility' | 'security' | 'help';
  typeLabel: string;
  icon: string;
  zone: string;
  locationDetail: string;
  reportedBy: string;
  status: 'new' | 'acknowledged' | 'resolved';
  responderUnit?: string;
  responderStatus?: string;
  isUrgent?: boolean;
}

export interface ResponderUnit {
  id: string;
  name: string;
  status: 'BUSY' | 'ENGAGED' | 'STANDBY';
  statusColor: 'error' | 'secondary' | 'emerald';
  currentTask: string;
}
