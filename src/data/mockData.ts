import { Announcement, ZoneData, POIData, SessionData, IncidentAlert, ResponderUnit } from '../types';

export const LOGO_URL = 'https://lh3.googleusercontent.com/aida/AEtjO1X9PLYNFYG8VRs4KvF6G2aIls4Edpy1Jei1w3eKz-zXxgfIF0yqLHJdeYs49qVcJW0VyUcWTM3BeB6pFa-FUi5PSdxOyGc6YQPbo0xYJOKhYKIcaWj8wzgZFWirkQLk3FqZDW14YIgjKFu_O_uSjeXxLkajKII8Nmr7BbHAv5OwGDDTbZ8Hl6aZeRUb20Kbpwb82rmVEn7uYMxFKKaLG38ub2skjMsr_dFitXZSHjsjU6OGsrfHj6yTNQc';
export const KEYNOTE_HERO_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9Emxl7jND6oNFZg8309S_Jr5-H7tdA3wqwf2hTgGT_pFITb7iBduuG5nd6EUTjvjrCOQbGrpBPFDtcUl94v0W36LWbfyh6U_QepZUCl5sgxLWDcnoF6b0i-8C-67xGS3KSePPekfHexS3_EbE2kVecszlk6QAOQtuCNdpQSe1fq3mu-toPFGsdSltzRcXxAr2MsOCopi1DhU_HzRoCF__tB-o0C0RYqr7wAwsrAYzhffyaj2wPkLP';
export const CONVENTION_FLOOR_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAu5y75f_j6eV56dKpxbt1cfEcLZfgSmgh3aWTk0u7kys9w7Vpzi8ll-nito5uf9MvjA1O52ztJ_vxgKckO4P9dBcvJiL6w9Zw_AMJjeKxrsI1AHNusRK7ZsqquNyT4oGbtV3Lvcibdxe_DVQmnGN3hQxz45qTJb3s1pJ44AP7AnwHb1yaMjRn6BCwTkQmkdX3D82pG7aFwr37kEA7r5Ln3ondZvyabUdyspoaEvCSyAGT9fi_-53h-';
export const ALEX_VANCE_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWLRjjsI2RpxU1ZF2Ogk2U5EBuQM-32Xtm8eVBsBNFtk5CmmZWKb84QMPG9JLSdJirGtqtT6965dV-yruSrtaG59I6lgxlIQcfXl67QLQUw61pvMQPzSprr2LS4B6Q6Q9IFEGkbzsmONAVM0QvF4DF_zvYneZTxPzfG6IoIptbjSmY6gjjbIOQa7Yn-eGXtmG02fUQ3PEssc68pjrGNjXa9JrVUO7cfp-gXRIey5cr0wjtt6HIp88q';
export const ELENA_ROSTOVA_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkF8x025wCMgEdbCuWQj3c7i0khYir9YzAnMzEkVSlFtZKJntQlCrF9idzMyTBK21dvsCuf0pyZg02Tr8UulkTgjQB5FcrmO4VDsirWqVqC5blcTezmvceyLCJ-SdpnX5w8L7H5GvVRqBbm94IG49gxWT6hMTH7Nkf6iXqM86VRb5Vn4hKxqgLrf_1XXF3C7BwphZQ4WkbOIBKSgKxMsDlXZLNBkstc8mz5fEdfaoYmUHf3PLREM21';
export const MARCUS_VANCE_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBW3gptC1cv2jX62GM1ob6irgAXAoeVbbyOLkukzeeryBZnCKjhqx70BAKrIiJzlmLq4O7JfF4RbnC13p4GDunKOAN_qjSfo0vm8_I7aGPwh8HZYKLJQXF-wVQ8MEtCfKUvznpQre47MD4IFjsdD8HC51Lh62ufo1HB56ftsD-Tg_4fbMX6rmbU8hNB27nvo3XqMvSVAMSIRdRTsudi5QkbnZXi8macHC_VUqs0jSNHPQ_lGI_YAhiC';
export const AMINA_CHEN_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAOMrxBtT395bO7cQ5--uk7O5zSz7euHVEcO9iMFUosTdpTCgAh16uDZCbf2pRobZ2llmN_TaCw0llYH36t_7JDNLkGsHOSAud_k4F3VXoEfwWdKaOadEkFUNq3QLo8rzk4uyfrDgdZMNtZG9AtYYSUdnfk7IUNciAOS3818JFw4wtoR8_0kWllwG8vgFcsgWz9-kVqR7dknPxR1TlXkUv8truKu-uyMh08K5KepMUNUrNi2MK7bIn';

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    tag: 'Keynote Starting',
    tagType: 'keynote',
    timeAgo: '2m ago',
    title: 'Main Hall Doors Open',
    description: 'Autonomous Systems Keynote starts at 10:30 AM sharp. VIP seating in front 4 rows.',
    location: 'Stage Alpha',
    actionLabel: 'Route Me',
    actionType: 'route'
  },
  {
    id: 'ann-2',
    tag: 'Livestream',
    tagType: 'livestream',
    timeAgo: '6m ago',
    title: 'Overflow Stream Active',
    description: 'Stage B panel is at capacity. High-definition low latency feed is streaming now.',
    badgeMeta: '1,280 tuning in',
    actionLabel: 'Watch Feed',
    actionType: 'stream'
  },
  {
    id: 'ann-3',
    tag: 'Room Update',
    tagType: 'room',
    timeAgo: '10m ago',
    title: 'Lab Room 302 Reassigned',
    description: 'Quantum Hardware session moved to Pavilion West to accommodate extra attendees.',
    badgeMeta: 'Shifted +15 mins',
    actionLabel: 'Details',
    actionType: 'details'
  }
];

export const INITIAL_ZONES: ZoneData[] = [
  {
    id: 'zone-1',
    name: 'Main Stage (Hall A)',
    subtitle: 'Keynotes, Fireside chats • Capacity 1,200',
    icon: 'podium',
    type: 'stages',
    congestion: 89,
    statusLevel: 'crowded',
    callout: {
      icon: 'info',
      text: 'Entry queue ~8 mins. Alternative overflow seating open in Hall C with full live audio-visual broadcast.'
    },
    footerInfo: 'Gate A1–A4',
    canNotify: true
  },
  {
    id: 'zone-2',
    name: 'Food Court & Lounge',
    subtitle: 'Central Atrium • Level 2',
    icon: 'restaurant',
    type: 'amenities',
    congestion: 54,
    statusLevel: 'moderate',
    callout: {
      icon: 'schedule',
      text: 'Short queue at coffee bar and food trucks. Barista lane moving with ~3 min wait.'
    },
    canNotify: false
  },
  {
    id: 'zone-3',
    name: 'Workshop Hall (Tech Wing)',
    subtitle: 'Hands-on Labs • Wings B1–B3',
    icon: 'laptop_mac',
    type: 'stages',
    congestion: 28,
    statusLevel: 'low',
    callout: {
      icon: 'check_circle',
      text: 'Plenty of open seats and workstations. Power strips available at tables 14–26.'
    },
    canNotify: false
  },
  {
    id: 'zone-4',
    name: 'Main Entrance & Registration',
    subtitle: 'North Boulevard Gate • Security Point 1',
    icon: 'badge',
    type: 'entrances',
    congestion: 15,
    statusLevel: 'low',
    callout: {
      icon: 'speed',
      text: 'Express check-in flowing smoothly. Digital badges scan in under 5 seconds.'
    },
    canNotify: false
  },
  {
    id: 'zone-5',
    name: 'Restrooms (West Wing)',
    subtitle: 'Adjacent to Exhibitor Hub • All Gender & Accessible',
    icon: 'wc',
    type: 'amenities',
    congestion: 60,
    statusLevel: 'moderate',
    callout: {
      icon: 'alt_route',
      text: 'East wing restrooms currently have zero wait (2 min walk via Skybridge).',
      isRecommendation: true
    },
    canNotify: false
  }
];

export const VENUE_POIS: POIData[] = [
  {
    id: 'main-stage',
    name: 'Main Stage Arena',
    zone: 'Hall A • Zone 1',
    category: 'stages',
    status: 'In Progress',
    distance: '120 m',
    walkTime: '2 min',
    stepFree: true,
    icon: 'theater_comedy',
    x: 92,
    y: 110,
    description: 'Primary auditorium for Summit keynotes, executive firesides, and general assemblies.'
  },
  {
    id: 'workshop-hall',
    name: 'Workshop Hall B',
    zone: 'Tech Wing • Level 1',
    category: 'stages',
    status: 'Starting Soon',
    distance: '180 m',
    walkTime: '3 min',
    stepFree: true,
    icon: 'lightbulb',
    x: 288,
    y: 114,
    description: 'Interactive deep-dive technical workshops with dedicated developer workstations.'
  },
  {
    id: 'help-desk',
    name: 'Central Concourse Help',
    zone: 'Atrium Pavilion',
    category: 'help',
    status: 'Staffed',
    distance: '75 m',
    walkTime: '1 min',
    stepFree: true,
    icon: 'support_agent',
    x: 295,
    y: 236,
    description: 'Guest relations, digital credential troubleshooting, and lost & found assistance.'
  },
  {
    id: 'food-court',
    name: 'Food & Beverage Pavilion',
    zone: 'West Concourse',
    category: 'food',
    status: 'Moderate Line',
    distance: '140 m',
    walkTime: '2 min',
    stepFree: true,
    icon: 'restaurant',
    x: 108,
    y: 342,
    description: 'Artisanal espresso bars, healthy catering stations, and quiet dining booths.'
  },
  {
    id: 'restrooms',
    name: 'Accessible Restrooms',
    zone: 'Amenities Wing',
    category: 'restrooms',
    status: 'Open',
    distance: '95 m',
    walkTime: '1.5 min',
    stepFree: true,
    icon: 'wc',
    x: 242,
    y: 320,
    description: 'All-gender, wheelchair-accessible facilities with automated tactile doorways.'
  },
  {
    id: 'first-aid',
    name: 'First-Aid Station 1',
    zone: 'Hall A West Corridor',
    category: 'help',
    status: 'Medical Active',
    distance: '40 m',
    walkTime: '45 sec',
    stepFree: true,
    icon: 'medical_services',
    x: 314,
    y: 382,
    description: 'Paramedic triage station with AED equipment, hydration salts, and private rest bays.'
  }
];

export const INITIAL_SESSIONS: SessionData[] = [
  {
    id: 'sess-1',
    day: 'day1',
    title: 'Building Scalable Agentic Systems in Production',
    time: '10:30 – 11:30 AM',
    location: 'Main Stage (Hall A)',
    track: 'tech',
    trackLabel: 'Tech',
    isRecommended: true,
    isSaved: true,
    seatReserved: false,
    remindMeSet: false,
    statusTag: 'Almost full',
    speaker: {
      name: 'Dr. Elena Rostova',
      role: 'VP of Engineering',
      company: 'NeuroCore',
      avatarUrl: ELENA_ROSTOVA_AVATAR
    }
  },
  {
    id: 'sess-2',
    day: 'day1',
    title: 'Designing Inclusive Public Spaces & Event Tech',
    time: '11:45 AM – 12:30 PM',
    location: 'Workshop Hall B',
    track: 'design',
    trackLabel: 'Design',
    isRecommended: true,
    isSaved: false,
    seatReserved: false,
    remindMeSet: false,
    speaker: {
      name: 'Marcus Vance',
      role: 'Head of Accessibility',
      company: 'DesignCraft',
      avatarUrl: MARCUS_VANCE_AVATAR
    }
  },
  {
    id: 'sess-3',
    day: 'day1',
    title: 'Future of Decentralized Creative Economy',
    time: '01:15 – 02:00 PM',
    location: 'Stage C',
    track: 'business',
    trackLabel: 'Business',
    isRecommended: false,
    isSaved: false,
    seatReserved: false,
    remindMeSet: false,
    statusTag: 'Open Seating',
    speaker: {
      name: 'Amina Chen',
      role: 'Founder',
      company: 'ArtByte',
      avatarUrl: AMINA_CHEN_AVATAR
    }
  },
  {
    id: 'sess-4',
    day: 'day2',
    title: 'Zero-Latency Edge Inference on Constrained Devices',
    time: '09:30 – 10:45 AM',
    location: 'Main Stage (Hall A)',
    track: 'ai',
    trackLabel: 'AI / ML',
    isRecommended: true,
    isSaved: true,
    seatReserved: true,
    remindMeSet: true,
    statusTag: 'Reserved',
    speaker: {
      name: 'Dr. Elena Rostova',
      role: 'VP of Engineering',
      company: 'NeuroCore',
      avatarUrl: ELENA_ROSTOVA_AVATAR
    }
  },
  {
    id: 'sess-5',
    day: 'day2',
    title: 'Hands-on Spatial Computing & Indoor Wayfinding',
    time: '02:00 – 03:30 PM',
    location: 'Workshop Hall B',
    track: 'workshop',
    trackLabel: 'Workshop',
    isRecommended: false,
    isSaved: true,
    seatReserved: false,
    remindMeSet: false,
    statusTag: 'Preregistration Required',
    speaker: {
      name: 'Marcus Vance',
      role: 'Head of Accessibility',
      company: 'DesignCraft',
      avatarUrl: MARCUS_VANCE_AVATAR
    }
  },
  {
    id: 'sess-6',
    day: 'day1',
    title: 'Next-Gen Quantum Hardware & Encryption Systems',
    time: '02:15 – 03:15 PM',
    location: 'Pavilion West',
    track: 'tech',
    trackLabel: 'Tech',
    isRecommended: true,
    isSaved: false,
    seatReserved: false,
    remindMeSet: false,
    statusTag: 'Open Seating',
    speaker: {
      name: 'Dr. Elena Rostova',
      role: 'VP of Engineering',
      company: 'NeuroCore',
      avatarUrl: ELENA_ROSTOVA_AVATAR
    }
  },
  {
    id: 'sess-7',
    day: 'day1',
    title: 'Fireside Chat: AI Ethics, Guardrails & Public Safety',
    time: '03:30 – 04:30 PM',
    location: 'Main Stage (Hall A)',
    track: 'ai',
    trackLabel: 'AI / ML',
    isRecommended: true,
    isSaved: true,
    seatReserved: false,
    remindMeSet: true,
    statusTag: 'High Demand',
    speaker: {
      name: 'Atharva',
      role: 'Lead Coordinator',
      company: 'EventPulse',
      avatarUrl: ALEX_VANCE_AVATAR
    }
  },
  {
    id: 'sess-8',
    day: 'day1',
    title: 'UX Systems for High-Density Public Venues & Mobility',
    time: '04:45 – 05:30 PM',
    location: 'Workshop Hall B',
    track: 'design',
    trackLabel: 'Design',
    isRecommended: false,
    isSaved: false,
    seatReserved: false,
    remindMeSet: false,
    speaker: {
      name: 'Marcus Vance',
      role: 'Head of Accessibility',
      company: 'DesignCraft',
      avatarUrl: MARCUS_VANCE_AVATAR
    }
  },
  {
    id: 'sess-9',
    day: 'day2',
    title: 'Autonomous Incident Response & First-Aid Drone Dispatch',
    time: '11:00 AM – 12:15 PM',
    location: 'Pavilion West',
    track: 'tech',
    trackLabel: 'Tech',
    isRecommended: true,
    isSaved: false,
    seatReserved: false,
    remindMeSet: false,
    statusTag: 'Live Demo',
    speaker: {
      name: 'Amina Chen',
      role: 'Founder',
      company: 'ArtByte',
      avatarUrl: AMINA_CHEN_AVATAR
    }
  },
  {
    id: 'sess-10',
    day: 'day2',
    title: 'Hands-on Workshop: Building Resilient BLE Mesh Networks',
    time: '01:15 – 02:30 PM',
    location: 'Workshop Hall B',
    track: 'workshop',
    trackLabel: 'Workshop',
    isRecommended: false,
    isSaved: true,
    seatReserved: true,
    remindMeSet: false,
    statusTag: 'Preregistration Required',
    speaker: {
      name: 'Atharva',
      role: 'Lead Coordinator',
      company: 'EventPulse',
      avatarUrl: ALEX_VANCE_AVATAR
    }
  },
  {
    id: 'sess-11',
    day: 'day2',
    title: 'Closing Keynote: The Future of Connected Smart Cities',
    time: '03:45 – 04:45 PM',
    location: 'Main Stage (Hall A)',
    track: 'tech',
    trackLabel: 'Tech',
    isRecommended: true,
    isSaved: true,
    seatReserved: true,
    remindMeSet: true,
    statusTag: 'Keynote Assembly',
    speaker: {
      name: 'Dr. Elena Rostova',
      role: 'VP of Engineering',
      company: 'NeuroCore',
      avatarUrl: ELENA_ROSTOVA_AVATAR
    }
  }
];

export const INITIAL_INCIDENTS: IncidentAlert[] = [
  {
    id: 'inc-1',
    time: '10:32 AM',
    type: 'medical',
    typeLabel: 'Medical',
    icon: 'medical_services',
    zone: 'Main Stage',
    locationDetail: 'Hall A, Row F (Seat 22)',
    reportedBy: 'Attendee #8942',
    status: 'new',
    responderUnit: 'Unit Alpha',
    responderStatus: 'Dispatched (ETA 1m)',
    isUrgent: true
  },
  {
    id: 'inc-2',
    time: '10:28 AM',
    type: 'accessibility',
    typeLabel: 'Accessibility',
    icon: 'accessible',
    zone: 'Entrance Ramp B',
    locationDetail: 'North Gate Escalator Annex',
    reportedBy: 'Attendee #1043',
    status: 'acknowledged',
    responderUnit: 'Team Bravo',
    responderStatus: 'On Scene (Assisting)'
  },
  {
    id: 'inc-3',
    time: '10:15 AM',
    type: 'security',
    typeLabel: 'Security Check',
    icon: 'shield',
    zone: 'Food Court North',
    locationDetail: 'Unattended Bag Perimeter',
    reportedBy: 'Staff #12',
    status: 'resolved',
    responderUnit: 'Officer Diaz',
    responderStatus: 'Cleared'
  },
  {
    id: 'inc-4',
    time: '10:04 AM',
    type: 'help',
    typeLabel: 'Lost / Help',
    icon: 'help_center',
    zone: 'Workshop Hall C',
    locationDetail: 'Lost Credential Card',
    reportedBy: 'Attendee #5219',
    status: 'resolved',
    responderUnit: 'Info Desk 2',
    responderStatus: 'Card Reissued'
  }
];

export const RESPONDER_UNITS: ResponderUnit[] = [
  {
    id: 'unit-alpha',
    name: 'Medic Unit Alpha',
    status: 'BUSY',
    statusColor: 'error',
    currentTask: 'En route to Hall A'
  },
  {
    id: 'unit-bravo',
    name: 'Accessibility Team Bravo',
    status: 'ENGAGED',
    statusColor: 'secondary',
    currentTask: 'Engaged at Ramp B'
  },
  {
    id: 'unit-charlie',
    name: 'Security Unit Charlie',
    status: 'STANDBY',
    statusColor: 'emerald',
    currentTask: 'Patrolling Zone D'
  }
];
