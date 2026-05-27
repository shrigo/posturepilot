'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

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
}

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
  }
};

interface ClientContextType {
  currentClient: Client;
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
  const [currentKey, setCurrentKey] = useState<ClientKey>('WELLS');
  const [isEnterpriseMode, setIsEnterpriseMode] = useState<boolean>(false);
  const [isUnderAttack, setIsUnderAttack] = useState<boolean>(false);
  const [isMitigating, setIsMitigating] = useState<boolean>(false);
  const [slaThresholds, setSlaThresholds] = useState<{ critical: number; high: number; med: number }>({
    critical: 7,
    high: 30,
    med: 90
  });

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
      currentClient: clients[currentKey], 
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
