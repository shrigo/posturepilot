'use client';
import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { trafficData } from '@/data/mockData';
import { useClient } from '@/context/ClientContext';
import Link from 'next/link';
import ModuleCockpitCard, { ModuleCockpitConfig, ModuleLiveData } from '@/components/ModuleCockpitCard';

const trafficCockpitConfig: ModuleCockpitConfig = {
  title: 'Traffic Control Telemetry',
  badge: 'Module 11',
  apiEndpoint: '/api/findings/traffic',
  rings: [
    { label: 'Clean%', color: '#10b981', glowColor: 'rgba(16,185,129,0.35)' },
    { label: 'Inspected%', color: '#a78bfa', glowColor: 'rgba(167,139,250,0.35)' },
    { label: 'Blocked%', color: '#3b82f6', glowColor: 'rgba(59,130,246,0.35)' },
  ],
  indexLabel: 'TRAFFIC',
  funnel: [
    { label: 'Packets Logged', sublabel: 'Total perimeter packets logged', color: '#7c3aed' },
    { label: 'Protocol Anomalies', sublabel: 'Workloads violating RFC port standards', color: '#ef4444' },
    { label: 'Geo-Fence Hits', sublabel: 'Requests from geo-blocked zones', color: '#ea580c' },
    { label: 'Blocked Payloads', sublabel: 'Malicious packets blocked at edge', color: '#10b981' },
  ],
  gates: ['FLOW INSPECT', 'GEO BLOCK', 'PAYLOAD SCAN'],
  syncLabel: 'Firewall Interfaces Mapped',
  checklist: [
    { name: 'Flow Inspection', desc: 'Inspect flow protocols at edge interface layers continuously.' },
    { name: 'Geo-Fence Enforce', desc: 'Deploy automatic perimeter shaper rules to block geo-IP sources.' },
  ],
};

interface LiveData {
  hasLiveData: boolean; total: number; critical: number; high: number;
  activeAlerts: number; anomalies: number;
  bySeverity: Record<string,number>;
  topCVEs: { cveId: string|null; count: number }[];
}

interface Intruder {
  ip: string;
  origin: string;
  country: string;
  flag: string;
  rateVal: number; // Gbps
  anomaly: string;
}

const initialIntruders: Record<string, Intruder[]> = {
  ACME: [
    { ip: '185.220.101.5', origin: 'Tor Exit Node (Relay #12)', country: 'Russia', flag: '🇷🇺', rateVal: 4.2, anomaly: 'TCP Port Sweep Attack' },
    { ip: '45.138.89.21', origin: 'Suspect VPS (Netherlands)', country: 'Netherlands', flag: '🇳🇱', rateVal: 2.8, anomaly: 'Brute-Force SSH Knocking' },
    { ip: '103.245.23.4', origin: 'Malware CNC Target', country: 'China', flag: '🇨🇳', rateVal: 3.5, anomaly: 'DNS Tunneling Exfil' }
  ],
  UR: [
    { ip: '198.51.100.42', origin: 'Tor Exit Node (Relay #45)', country: 'Russia', flag: '🇷🇺', rateVal: 2.5, anomaly: 'Brute-Force RDP Sweep' },
    { ip: '109.201.134.12', origin: 'Host VPS (Germany)', country: 'Germany', flag: '🇩🇪', rateVal: 1.8, anomaly: 'TCP Port Knocking Sweep' }
  ]
};

const regionsData = [
  { key: 'Russia', flag: '🇷🇺', name: 'Russia & CIS Subnets', threat: 'Tor nodes & credential brute-force', cvss: 9.0 },
  { key: 'China', flag: '🇨🇳', name: 'China Telecom Edge', threat: 'IDS sweeps & IoT exploit attempts', cvss: 8.8 },
  { key: 'Netherlands', flag: '🇳🇱', name: 'Netherlands VPS Pools', threat: 'Malware server relays', cvss: 7.8 },
  { key: 'Germany', flag: '🇩🇪', name: 'Germany Hosting Nodes', threat: 'Port scanners & scanners', cvss: 7.2 }
];

export default function TrafficPage() {
  const { currentClient } = useClient();
  const [live, setLive] = useState<LiveData | null>(null);

  // Simulator State Management
  const [firewallVendor, setFirewallVendor] = useState<'PaloAlto' | 'Fortinet'>('PaloAlto');
  const [blockedRegions, setBlockedRegions] = useState<string[]>([]);
  const [ipThrottles, setIpThrottles] = useState<Record<string, number>>({}); // maps IP to scale (1 = 100%, 0.5 = 50%, 0.1 = 10%, 0 = Blocked)
  const [activeProtocolFilter, setActiveProtocolFilter] = useState<'All' | 'HTTPS' | 'TCP' | 'UDP' | 'DNS'>('All');
  
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncLogs, setSyncLogs] = useState<string[]>([]);
  const [livePackets, setLivePackets] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/findings/traffic').then(r => r.json())
      .then(d => { if (d.hasLiveData) setLive(d); else setLive(null); }).catch(() => {});
  }, [currentClient.key]);

  // Reset simulator values on client change for repeatable demo presentations
  useEffect(() => {
    setBlockedRegions([]);
    setIpThrottles({});
    setSyncLogs([]);
    setSyncProgress(0);
    setIsSyncing(false);
    setActiveProtocolFilter('All');
  }, [currentClient.key]);

  // Generate continuous mock packet streams when not actively syncing configs
  useEffect(() => {
    const interval = setInterval(() => {
      if (isSyncing) return;
      const ips = ['192.168.1.100', '10.0.5.21', '172.16.8.99', '192.168.12.45'];
      const extIps = ['185.220.101.5', '45.138.89.21', '103.245.23.4', '198.51.100.42', '109.201.134.12'];
      const randomIp = ips[Math.floor(Math.random() * ips.length)];
      const randomExtIp = extIps[Math.floor(Math.random() * extIps.length)];
      const port = Math.floor(Math.random() * 65535);

      const packetTemplates = {
        HTTPS: `[PACKET] INBOUND HTTPS ${randomExtIp}:443 -> ${randomIp}:${port} (TLSv1.3 AES_256_GCM handshake OK)`,
        TCP: `[PACKET] INBOUND SYN ${randomExtIp}:${port} -> ${randomIp}:22 (TCP Handshake Sweep - Flagged)`,
        UDP: `[PACKET] OUTBOUND UDP ${randomIp}:${port} -> 8.8.8.8:53 (Syslog Payload Forward)`,
        DNS: `[PACKET] DNS QUERY "${currentClient.key.toLowerCase()}-core.internal" -> 1.1.1.1 (Resolved to 10.42.0.1)`
      };

      let newPacket = '';
      if (activeProtocolFilter === 'All') {
        const types = Object.keys(packetTemplates) as ('HTTPS'|'TCP'|'UDP'|'DNS')[];
        const selected = types[Math.floor(Math.random() * types.length)];
        newPacket = packetTemplates[selected];
      } else {
        newPacket = packetTemplates[activeProtocolFilter as keyof typeof packetTemplates] || packetTemplates.HTTPS;
      }

      setLivePackets(prev => [newPacket, ...prev.slice(0, 15)]);
    }, 1500);

    return () => clearInterval(interval);
  }, [activeProtocolFilter, isSyncing, currentClient.key]);

  // Resolve exposed intruders list
  const intrudersList = initialIntruders[currentClient.key] || [];

  // Calculate dynamic scale factor
  // 1. Regions block factor
  const regionFactor = Math.max(0.1, 1.0 - (blockedRegions.length * 0.25));

  // 2. Individual IP throttles factor
  let ipThrottleSum = 0;
  intrudersList.forEach(item => {
    const scale = ipThrottles[item.ip] !== undefined ? ipThrottles[item.ip] : 1.0;
    ipThrottleSum += scale;
  });
  const avgIpThrottleScale = intrudersList.length > 0 ? (ipThrottleSum / intrudersList.length) : 1.0;

  // Combined scale factor bound to minimum of 0.15 to avoid empty charts
  const blockScale = Math.max(0.15, avgIpThrottleScale * regionFactor);

  // Compute stats
  const totalFindings = live ? live.total : (currentClient.key === 'UR' ? 38420 : 12470);
  const activeAlerts = Math.max(0, (live ? live.activeAlerts : (currentClient.key === 'UR' ? 3 : 34)) - Math.round((1.0 - blockScale) * 30));
  const activeAnomalies = Math.max(0, (live ? live.anomalies : (currentClient.key === 'UR' ? 1 : 3)) - blockedRegions.length - Object.values(ipThrottles).filter(v => v === 0).length);
  
  const activeInbound = live ? `${live.total} Gbps` : (currentClient.key === 'UR' ? `${(38.4 * blockScale).toFixed(1)} Gbps` : `${(12.4 * blockScale).toFixed(1)} Gbps`);
  const activeOutbound = live ? `${live.high} Gbps` : (currentClient.key === 'UR' ? `${(12.5 * blockScale).toFixed(1)} Gbps` : `${(4.8 * blockScale).toFixed(1)} Gbps`);

  // Scale chart data dynamically based on the block state
  const activeChartData = trafficData.hourlyTraffic.map(point => ({
    ...point,
    inbound: Math.round(point.inbound * blockScale),
    outbound: Math.round(point.outbound * blockScale)
  }));

  // Perform NetFlow IP Throttle Adjustment
  const handleThrottleIp = (ip: string, value: number) => {
    const intruder = intrudersList.find(i => i.ip === ip);
    setIpThrottles(prev => ({ ...prev, [ip]: value }));
    
    setIsSyncing(true);
    setSyncProgress(10);
    
    const logs = firewallVendor === 'PaloAlto' ? [
      `[SHIELD] Intercepting NetFlow rate configuration for IP: ${ip}...`,
      `[PAN-OS] Creating Palo Alto Network Security Profile policy limit...`,
      `[PAN-OS] Adjusting QoS interface band-limiter node to ${(value * 100).toFixed(0)}% throughput...`,
      `[PAN-OS] Committing config candidates to Device Group cluster...`,
      `[SYNC] Palo Alto PAN-OS successfully pushed QoS policy. Ingress restricted to ${(value * 100).toFixed(0)}%! 🟢 Nominal`
    ] : [
      `[SHIELD] Intercepting FortiOS rate settings for threat host IP: ${ip}...`,
      `[FORTIOS] Appending traffic shaper rules in FortiGate Virtual Domain (VDOM)...`,
      `[FORTIOS] Setting ingress traffic-shaping rate to ${(value * itemRateVal(ip) * 1000).toFixed(0)} Mbps max...`,
      `[FORTIOS] Syncing policy configurations across active-passive FortiGate HA cluster...`,
      `[COMPLETE] FortiOS traffic shaping policy enforced! Bandwidth limited to ${(value * 100).toFixed(0)}%! 🟢 Enforced`
    ];

    setSyncLogs([logs[0]]);

    setTimeout(() => {
      setSyncProgress(40);
      setSyncLogs(prev => [...prev, logs[1], logs[2]]);
    }, 200);

    setTimeout(() => {
      setSyncProgress(75);
      setSyncLogs(prev => [...prev, logs[3]]);
    }, 450);

    setTimeout(() => {
      setSyncProgress(100);
      setSyncLogs(prev => [...prev, logs[4]]);
      setIsSyncing(false);
    }, 700);
  };

  const itemRateVal = (ip: string) => {
    const item = intrudersList.find(i => i.ip === ip);
    return item ? item.rateVal : 2.5;
  };

  // Toggle Geographic Region Block (BGP Null-route)
  const handleToggleRegion = (region: string) => {
    const isBlocked = blockedRegions.includes(region);
    const newBlocked = isBlocked
      ? blockedRegions.filter(r => r !== region)
      : [...blockedRegions, region];
    
    setBlockedRegions(newBlocked);
    setIsSyncing(true);
    setSyncProgress(20);

    const log1 = firewallVendor === 'PaloAlto'
      ? `[PAN-OS] Initializing BGP Neighbor Route-Map adjustments...`
      : `[FORTIOS] Modifying VDOM boundary routing tables...`;
    
    const log2 = isBlocked
      ? (firewallVendor === 'PaloAlto' 
          ? `[PAN-OS] Re-establishing BGP peering announce routes for ${region} subnets...` 
          : `[FORTIOS] Withdrawing BGP blackhole shaper path. Restoring routing table ingress...`)
      : (firewallVendor === 'PaloAlto'
          ? `[PAN-OS] Injecting BGP AS-Path null-route Null0 block for all ${region} IPs...`
          : `[FORTIOS] Announcing edge blackhole routing entry for ${region} CIDR blocks...`);

    const log3 = isBlocked
      ? `[SYNC] Peering re-routed. Region ${region} traffic flow re-established. 🟢 Routed`
      : `[COMPLETE] Subnets isolated. Region ${region} now blackholed at boundary. 🔴 Isolated`;

    setSyncLogs([`[BGP-MONITOR] Alert: Change detected in geographic region ${region} transit rules...`, log1]);

    setTimeout(() => {
      setSyncProgress(60);
      setSyncLogs(prev => [...prev, log2]);
    }, 250);

    setTimeout(() => {
      setSyncProgress(100);
      setSyncLogs(prev => [...prev, log3]);
      setIsSyncing(false);
    }, 600);
  };

  const handleResetSandbox = () => {
    setBlockedRegions([]);
    setIpThrottles({});
    setSyncLogs([]);
    setSyncProgress(0);
    setIsSyncing(false);
    setActiveProtocolFilter('All');
  };

  return (
    <>
      <div className="page-content animate-in" style={{ paddingBottom: '2.5rem' }}>

        {/* Dynamic CISO Executive Traffic Sticky Banner */}
        <div className="sticky-alert-banner" style={{ background: '#f5f3ff', border: '1px solid #ddd6fe' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
            <span className="hud-pulse" style={{ background: '#7c3aed', boxShadow: '0 0 8px #7c3aed', width: 10, height: 10 }} />
            <div>
              <div style={{ fontWeight:800, color:'#6d28d9', fontSize:'0.9rem' }}>
                Perimeter Traffic & Gateway Controller — {currentClient.name}
              </div>
              <div style={{ fontSize:'0.75rem', color:'#7c3aed', fontWeight: 600 }}>
                Inbound Ingress: <span style={{ fontWeight: 800 }}>{activeInbound}</span> · Outbound Egress: <span style={{ fontWeight: 800 }}>{activeOutbound}</span> · Active Anomalies: <span style={{ fontWeight: 800 }}>{activeAnomalies} flagged</span> · Open Alerts: {activeAlerts}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Multi-Gateway Vendor Toggle Selector */}
            <select
              value={firewallVendor}
              onChange={(e) => setFirewallVendor(e.target.value as any)}
              style={{
                fontSize: '0.78rem', fontWeight: 800, color: '#7c3aed', background: 'rgba(255, 255, 255, 0.7)', 
                border: '1px solid #c084fc', padding: '0.5rem 1rem', borderRadius: 8, cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)', outline: 'none'
              }}
            >
              <option value="PaloAlto">🛡️ Palo Alto PAN-OS Gateway</option>
              <option value="Fortinet">🛡️ Fortinet FortiOS Edge</option>
            </select>
            <button
              onClick={handleResetSandbox}
              style={{
                fontSize: '0.78rem', fontWeight: 800, color: '#7c3aed', background: 'rgba(255, 255, 255, 0.7)', 
                border: '1px solid #c084fc', padding: '0.5rem 1rem', borderRadius: 8, cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '4px'
              }}
            >
              🔄 Reset Sandbox
            </button>
            <Link href="/dashboard/findings?tool=traffic" style={{ fontSize:'0.78rem', fontWeight:700, color:'#fff', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', textDecoration:'none', padding:'0.5rem 1.25rem', borderRadius:8, boxShadow: '0 4px 12px rgba(124, 58, 237, 0.2)' }}>
              View Network Findings →
            </Link>
          </div>
        </div>

        <div className="grid-4">
          {[
            { label:'Inbound Ingress',  value: activeInbound,     accent:'#0891b2', delta: 'Active telemetry flow' },
            { label:'Open alerts',      value: `${activeAlerts}`, accent:'#dc2626', delta: 'Requires shaper rules' },
            { label:'Active Threats',   value: `${activeAnomalies}`, accent:'#d97706', delta: 'Flagged network anomalies' },
            { label:'Outbound Egress',  value: activeOutbound,    accent:'#7c3aed', delta: 'Encrypted tunnel egress' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-card-accent" style={{ background: s.accent }} />
              <div>
                <div className="stat-label">{s.label}</div>
                <div className="stat-value" style={{ color: s.accent, fontSize: '1.8rem', lineHeight: '1.2' }}>{s.value}</div>
              </div>
              <div className="stat-delta delta-down">{s.delta}</div>
            </div>
          ))}
        </div>

        {/* Cockpit telemetry card */}
        <ModuleCockpitCard config={trafficCockpitConfig} live={live as any} />

        {/* ========================================================================= */}
        {/* VOLUME CHART & SPIKES ROW */}
        {/* ========================================================================= */}
        <div className="grid-2" style={{ marginBottom: '1.25rem' }}>
          <div className="card" style={{ height: '320px', display: 'flex', flexDirection: 'column' }}>
            <div className="card-title">📈 Dynamic Ingress & Egress Volume (24h)</div>
            <p style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: '0.85rem' }}>
              Real-time NetFlow bandwidth analysis. Throttle suspect IPs or block regions to see the curve morph.
            </p>
            <div style={{ flex: 1, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart key={`${currentClient.key}-${blockedRegions.join('-')}-${Object.keys(ipThrottles).length}-${blockScale}`} data={activeChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: any) => `${v} Gbps`} />
                  <Area type="monotone" dataKey="inbound" stroke="#0891b2" fill="rgba(8, 145, 178, 0.08)" strokeWidth={2} />
                  <Area type="monotone" dataKey="outbound" stroke="#7c3aed" fill="rgba(124, 58, 237, 0.08)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card" style={{ height: '320px', display: 'flex', flexDirection: 'column' }}>
            <div className="card-title">🚨 Detected Inbound Packet Spikes</div>
            <p style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: '0.85rem' }}>
              Historical high-volume packet spikes captured by perimeter nodes.
            </p>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <table className="data-table">
                <thead><tr><th>Time</th><th>Magnitude</th><th>Type</th><th>Gateway Action</th></tr></thead>
                <tbody>
                  {trafficData.trafficSpikes.map((s, i) => {
                    const isThreatSpike = s.type.includes('DDoS') || s.type.includes('Sweep');
                    return (
                      <tr key={i}>
                        <td style={{ fontSize:'0.75rem', color:'#64748b' }}>{s.time}</td>
                        <td style={{ fontWeight:700, color: isThreatSpike ? '#dc2626' : '#d97706' }}>{s.magnitude}</td>
                        <td style={{ fontSize:'0.78rem', fontWeight:600 }}>{s.type}</td>
                        <td>
                          <span style={{ fontSize: '0.68rem', fontWeight: 800, color: s.resolved ? '#15803d' : '#dc2626', background: s.resolved ? '#dcfce7' : '#fef2f2', border: s.resolved ? '1px solid #bbf7d0' : '1px solid #fecaca', padding: '2px 8px', borderRadius: 20 }}>
                            {s.resolved ? '✓ Shaper Nominal' : 'Over Limit'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE GEOGRAPHIC COUNTRY BGP NULL-ROUTING CARD */}
        {/* ========================================================================= */}
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <div className="card-title">🌎 Geographic Transit & BGP Null-Routing Controls</div>
          <p style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: '0.85rem' }}>
            Block traffic from high-risk geopolitical jurisdictions by announcing dynamic blackholes to edge routers.
          </p>
          <div className="grid-4" style={{ margin: 0, gap: '12px' }}>
            {regionsData.map(region => {
              const isBlocked = blockedRegions.includes(region.key);
              return (
                <div 
                  key={region.key} 
                  style={{
                    background: isBlocked ? '#fff1f2' : '#f8fafc',
                    border: isBlocked ? '1px solid #fecaca' : '1px solid #e2e8f0',
                    borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    transition: 'all 0.2s ease', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '1.25rem' }}>{region.flag}</span>
                      <span style={{ fontWeight: 800, fontSize: '0.82rem', color: '#0f172a' }}>{region.name}</span>
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#64748b', lineHeight: '1.3', minHeight: '28px' }}>
                      {region.threat}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.62rem', fontWeight: 800, color: isBlocked ? '#dc2626' : '#16a34a' }}>
                      {isBlocked ? '🔴 NULL-ROUTED' : '🟢 ROUTED (ACTIVE)'}
                    </span>
                    <button
                      onClick={() => handleToggleRegion(region.key)}
                      style={{
                        padding: '0.35rem 0.65rem', border: 'none', borderRadius: 6, fontWeight: 800, fontSize: '0.62rem', cursor: 'pointer',
                        background: isBlocked ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #ef4444, #dc2626)',
                        color: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                      }}
                    >
                      {isBlocked ? 'Allow Traffic' : 'Null-Route BGP'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* NETFLOW IP BLOCKER & ORCHESTRATOR TERMINAL ROW */}
        {/* ========================================================================= */}
        <div className="grid-2">
          
          {/* Top Blocked Traffic Sources */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '350px' }}>
            <div className="card-title">🛡️ Suspect Ingress Sweeps & Active Throttle Sliders</div>
            <p style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: '0.85rem' }}>
              Rate-limit individual suspect IP subnets. Reductions directly throttle back the volumetric bandwidth curves.
            </p>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {intrudersList.length === 0 ? (
                <div style={{ color: '#16a34a', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '0.8rem' }}>
                  🟢 Zero Suspect Perimeter Connections!
                </div>
              ) : (
                <table className="data-table" style={{ fontSize: '0.76rem' }}>
                  <thead>
                    <tr>
                      <th>Intruder Address</th>
                      <th>Max Rate</th>
                      <th>Throttle Allocation</th>
                      <th>QoS Shaper State</th>
                    </tr>
                  </thead>
                  <tbody>
                    {intrudersList.map(item => {
                      const activeScale = ipThrottles[item.ip] !== undefined ? ipThrottles[item.ip] : 1.0;
                      const activeRateGbps = (item.rateVal * activeScale).toFixed(1);
                      return (
                        <tr key={item.ip}>
                          <td style={{ fontWeight: 700, color: '#0f172a' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <span>{item.flag}</span>
                              <span>{item.ip}</span>
                            </span>
                            <span style={{ display: 'block', fontSize: '0.58rem', fontWeight: 600, color: '#94a3b8' }}>
                              {item.origin} · <span style={{ color: '#dc2626' }}>{item.anomaly}</span>
                            </span>
                          </td>
                          <td style={{ fontWeight: 700 }}>
                            {activeScale === 0 ? '0 Gbps' : `${activeRateGbps} Gbps`}
                          </td>
                          <td style={{ width: '130px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              <input 
                                type="range" 
                                min="0" 
                                max="1" 
                                step="0.5" 
                                value={activeScale} 
                                onChange={(e) => handleThrottleIp(item.ip, parseFloat(e.target.value))}
                                style={{ width: '100%', accentColor: '#7c3aed', cursor: 'pointer' }}
                              />
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.58rem', color: '#64748b', fontWeight: 600 }}>
                                <span>Block</span>
                                <span>10%</span>
                                <span>50%</span>
                                <span>Full</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            {activeScale === 0 ? (
                              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', padding: '2px 8px', borderRadius: 20, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', display: 'inline-block', boxShadow: '0 0 6px #ef4444' }} /> Fully Blocked
                              </span>
                            ) : activeScale < 1 ? (
                              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#d97706', background: '#fffbeb', border: '1px solid #fde68a', padding: '2px 8px', borderRadius: 20, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ea580c', display: 'inline-block', boxShadow: '0 0 6px #ea580c' }} /> Throttled ({(activeScale * 100).toFixed(0)}%)
                              </span>
                            ) : (
                              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#15803d', background: '#dcfce7', border: '1px solid #bbf7d0', padding: '2px 8px', borderRadius: 20, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 6px #22c55e' }} /> Unrestricted
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Simulated Router Logs Terminal Console */}
          <div className="card" style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 16, padding: '1.25rem', display: 'flex', flexDirection: 'column', height: '350px', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '0.5rem', marginBottom: '0.65rem', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#eab308' }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
              </div>
              <span style={{ fontSize: '0.58rem', fontFamily: 'monospace', color: '#64748b' }}>
                {firewallVendor === 'PaloAlto' ? 'paloalto_acl_boundary@posturepilot: ~' : 'fortigate_fortios_edge@posturepilot: ~'}
              </span>
            </div>

            {/* Protocol Mix Filter Pills */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
              {(['All', 'HTTPS', 'TCP', 'UDP', 'DNS'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setActiveProtocolFilter(p)}
                  style={{
                    fontFamily: 'monospace', fontSize: '0.58rem', fontWeight: 800,
                    padding: '3px 8px', borderRadius: '4px', cursor: 'pointer', border: 'none',
                    background: activeProtocolFilter === p ? '#7c3aed' : '#1e293b',
                    color: activeProtocolFilter === p ? '#fff' : '#a78bfa',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {p}
                </button>
              ))}
            </div>

            {isSyncing && (
              <div style={{ marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: '#a78bfa', fontFamily: 'monospace', marginBottom: 2 }}>
                  <span>GATEWAY SHAPER CONFLICT RESOLUTION:</span>
                  <span>{syncProgress}%</span>
                </div>
                <div style={{ height: 8, background: '#1e293b', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${syncProgress}%`, background: '#7c3aed', transition: 'width 0.3s ease' }} />
                </div>
              </div>
            )}

            <div style={{ flex: 1, overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.72rem', color: '#c084fc', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {isSyncing ? (
                syncLogs.map((log, i) => (
                  <div key={i} style={{ color: log.includes('SYNC') ? '#fbbf24' : log.includes('COMPLETE') ? '#34d399' : '#a78bfa', whiteSpace: 'pre-wrap' }}>
                    {log}
                  </div>
                ))
              ) : (
                <>
                  <div style={{ color: '#475569', fontStyle: 'italic', marginBottom: '0.25rem', fontSize: '0.65rem', borderBottom: '1px dashed #1e293b', paddingBottom: '0.25rem' }}>
                    {`[LIVE CAPTURING] Listening to perimeter network devices. Filter active: ${activeProtocolFilter}`}
                  </div>
                  {livePackets.map((pkt, i) => {
                    const isAlert = pkt.includes('Sweep') || pkt.includes('Flagged');
                    return (
                      <div key={i} style={{ color: isAlert ? '#f87171' : '#38bdf8', fontSize: '0.68rem' }}>
                        {pkt}
                      </div>
                    );
                  })}
                  {livePackets.length === 0 && (
                    <div style={{ color: '#475569', fontStyle: 'italic', margin: 'auto', textAlign: 'center', fontSize: '0.74rem' }}>
                      Palo Alto & Fortinet NetFlow tunnels online.<br/>Adjust sliders or block BGP subnets to sync shaper policies...
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

        </div>

      </div>
    </>
  );
}
