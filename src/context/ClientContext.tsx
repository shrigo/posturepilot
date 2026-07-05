'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export type ClientKey = 'WELLS' | 'TOYOTA' | 'UR' | 'CISCO' | 'DISNEY';

export interface Client {
  key: ClientKey;
  name: string;
  avatar: string;
  scanDate: string;
  score: number;
  grade: string;
  criticals: string;
  threats: string;
  backlog: string;
  assets: string;
  tier: 'Basic' | 'Professional' | 'Enterprise';
  allowedModules: string[]; // URLs of modules they have license for
}

export const GUEST_CLIENT: Client = {
  key: 'UR',
  name: 'Self-Service Sandbox',
  avatar: 'SS',
  scanDate: 'Real-time',
  score: 75,
  grade: 'C',
  criticals: '0',
  threats: '0',
  backlog: '0',
  assets: '0',
  tier: 'Basic',
  allowedModules: [
    '/dashboard', '/dashboard/posture', '/dashboard/settings',
    '/dashboard/findings', '/dashboard/upload'
  ]
};

const AUTHORIZED_EMAILS = ['shrigo.now@gmail.com', 'shrigonow@gmail.com', 'demo@posturepilot.io'];

export const clients: Record<ClientKey, Client> = {
  WELLS: {
    key: 'WELLS',
    name: 'Wells Fargo',
    avatar: 'WF',
    scanDate: 'May 27, 1:15 PM',
    score: 76,
    grade: 'C+',
    criticals: '12',
    threats: '2',
    backlog: '184',
    assets: '14,240',
    tier: 'Enterprise',
    allowedModules: [
      '/dashboard', '/dashboard/posture', '/dashboard/ai-risk', '/dashboard/appsec',
      '/dashboard/cloud', '/dashboard/infosec', '/dashboard/dispatch', '/dashboard/server',
      '/dashboard/kpi', '/dashboard/identity', '/dashboard/network', '/dashboard/secure',
      '/dashboard/traffic', '/dashboard/ciso', '/dashboard/findings', '/dashboard/upload',
      '/dashboard/settings'
    ]
  },
  TOYOTA: {
    key: 'TOYOTA',
    name: 'Toyota',
    avatar: 'TY',
    scanDate: 'May 26, 4:42 PM',
    score: 85,
    grade: 'B',
    criticals: '6',
    threats: '1',
    backlog: '78',
    assets: '9,450',
    tier: 'Professional',
    allowedModules: [
      '/dashboard', '/dashboard/posture', '/dashboard/appsec', '/dashboard/cloud',
      '/dashboard/infosec', '/dashboard/server', '/dashboard/kpi', '/dashboard/identity',
      '/dashboard/network', '/dashboard/secure', '/dashboard/traffic', '/dashboard/ciso',
      '/dashboard/findings', '/dashboard/upload', '/dashboard/settings'
    ] // lacks ai-risk and dispatch
  },
  UR: {
    key: 'UR',
    name: 'United Rentals',
    avatar: 'UR',
    scanDate: 'May 24, 2:15 PM',
    score: 91,
    grade: 'A-',
    criticals: '3',
    threats: '0',
    backlog: '45',
    assets: '5,120',
    tier: 'Basic',
    allowedModules: [
      '/dashboard', '/dashboard/posture', '/dashboard/cloud', '/dashboard/server',
      '/dashboard/findings', '/dashboard/upload', '/dashboard/settings'
    ] // highly restricted basic plan
  },
  CISCO: {
    key: 'CISCO',
    name: 'CISCO',
    avatar: 'CS',
    scanDate: 'May 27, 9:30 AM',
    score: 96,
    grade: 'A',
    criticals: '1',
    threats: '0',
    backlog: '12',
    assets: '28,400',
    tier: 'Enterprise',
    allowedModules: [
      '/dashboard', '/dashboard/posture', '/dashboard/ai-risk', '/dashboard/appsec',
      '/dashboard/cloud', '/dashboard/infosec', '/dashboard/dispatch', '/dashboard/server',
      '/dashboard/kpi', '/dashboard/identity', '/dashboard/network', '/dashboard/secure',
      '/dashboard/traffic', '/dashboard/ciso', '/dashboard/findings', '/dashboard/upload',
      '/dashboard/settings'
    ]
  },
  DISNEY: {
    key: 'DISNEY',
    name: 'Disney',
    avatar: 'WD',
    scanDate: 'May 25, 11:05 AM',
    score: 81,
    grade: 'B-',
    criticals: '8',
    threats: '3',
    backlog: '115',
    assets: '12,650',
    tier: 'Professional',
    allowedModules: [
      '/dashboard', '/dashboard/posture', '/dashboard/appsec', '/dashboard/cloud',
      '/dashboard/infosec', '/dashboard/dispatch', '/dashboard/server', '/dashboard/kpi',
      '/dashboard/identity', '/dashboard/network', '/dashboard/secure', '/dashboard/traffic',
      '/dashboard/ciso', '/dashboard/findings', '/dashboard/upload', '/dashboard/settings'
    ] // lacks ai-risk
  }
};

export const CLIENT_MAPPING: Record<string, ClientKey[]> = {
  'shrigo.now@gmail.com': ['WELLS', 'TOYOTA', 'UR', 'CISCO', 'DISNEY'],
  'shrigonow@gmail.com': ['WELLS', 'TOYOTA', 'UR', 'CISCO', 'DISNEY'],
  'demo@posturepilot.io': ['WELLS', 'TOYOTA', 'UR', 'CISCO', 'DISNEY'],
  // Future clients can be added here, e.g.:
  // 'user@toyota.com': ['TOYOTA'],
};

interface ClientContextType {
  currentClient: Client;
  allowedClients: ClientKey[];
  setClient: (key: ClientKey) => void;
  isEnterpriseMode: boolean;
  setIsEnterpriseMode: (val: boolean) => void;
  isUnderAttack: boolean;
  setIsUnderAttack: (val: boolean) => void;
  isMitigating: boolean;
  setIsMitigating: (val: boolean) => void;
  slaThresholds: { critical: number; high: number; med: number };
  setSlaThresholds: (val: { critical: number; high: number; med: number }) => void;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export function ClientProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [currentKey, setCurrentKey] = useState<ClientKey>('WELLS');
  const [isEnterpriseMode, setIsEnterpriseMode] = useState<boolean>(false);
  const [isUnderAttack, setIsUnderAttack] = useState<boolean>(false);
  const [isMitigating, setIsMitigating] = useState<boolean>(false);
  const [slaThresholds, setSlaThresholds] = useState<{ critical: number; high: number; med: number }>({
    critical: 7,
    high: 30,
    med: 90
  });

  const email = session?.user?.email;
  const allowedClients = email ? (CLIENT_MAPPING[email] || []) : [];
  const isAuthorized = allowedClients.length > 0;
  const safeKey = allowedClients.includes(currentKey) ? currentKey : allowedClients[0];
  const activeClient = isAuthorized ? clients[safeKey] : GUEST_CLIENT;

  useEffect(() => {
    const saved = localStorage.getItem('posturepilot_client') as ClientKey;
    if (saved && clients[saved]) {
      setCurrentKey(saved);
    }
    const savedMode = localStorage.getItem('posturepilot_enterprise_mode');
    if (savedMode === 'true') {
      setIsEnterpriseMode(true);
    }
    const savedAttack = localStorage.getItem('posturepilot_under_attack');
    if (savedAttack === 'true') {
      setIsUnderAttack(true);
    }
    const savedSla = localStorage.getItem('posturepilot_sla_thresholds');
    if (savedSla) {
      try {
        setSlaThresholds(JSON.parse(savedSla));
      } catch {}
    }
  }, []);

  const setClient = (key: ClientKey) => {
    if (!isAuthorized || !allowedClients.includes(key)) return; // Only allow permitted switches
    if (clients[key]) {
      setCurrentKey(key);
      localStorage.setItem('posturepilot_client', key);
    }
  };

  const toggleEnterpriseMode = (val: boolean) => {
    setIsEnterpriseMode(val);
    localStorage.setItem('posturepilot_enterprise_mode', val ? 'true' : 'false');
  };

  const setGlobalUnderAttack = (val: boolean) => {
    setIsUnderAttack(val);
    localStorage.setItem('posturepilot_under_attack', val ? 'true' : 'false');
  };

  const setGlobalSlaThresholds = (val: { critical: number; high: number; med: number }) => {
    setSlaThresholds(val);
    localStorage.setItem('posturepilot_sla_thresholds', JSON.stringify(val));
  };

  return (
    <ClientContext.Provider value={{ 
      currentClient: activeClient, 
      allowedClients,
      setClient, 
      isEnterpriseMode, 
      setIsEnterpriseMode: toggleEnterpriseMode,
      isUnderAttack,
      setIsUnderAttack: setGlobalUnderAttack,
      isMitigating,
      setIsMitigating,
      slaThresholds,
      setSlaThresholds: setGlobalSlaThresholds
    }}>
      {children}
    </ClientContext.Provider>
  );
}

export function useClient() {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClient must be used within a ClientProvider');
  }
  return context;
}
