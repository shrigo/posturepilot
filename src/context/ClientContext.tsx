'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

export type ClientKey = 'ACME' | 'UR';

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
  ACME: {
    key: 'ACME',
    name: 'Acme Financial Corp',
    avatar: 'AC',
    scanDate: 'May 13, 6:42 PM',
    score: 74,
    grade: 'C+',
    criticals: '14',
    threats: '3',
    backlog: '234',
    assets: '1,247',
  },
  UR: {
    key: 'UR',
    name: 'Unified Rentals',
    avatar: 'UR',
    scanDate: 'May 24, 2:15 PM',
    score: 88,
    grade: 'B+',
    criticals: '4',
    threats: '1',
    backlog: '92',
    assets: '3,842',
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
  const [currentKey, setCurrentKey] = useState<ClientKey>('ACME');
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
