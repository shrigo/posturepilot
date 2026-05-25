'use client';
import { useEffect, useState } from 'react';
import { useClient } from '@/context/ClientContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

// Client-Specific Network Gateways and Base Indices
// Client-Specific Network Gateways and Base Indices
const clientNetworkMeta = {
  ACME: {
    AWS: {
      gateway: 'AWS Transit Gateway (Palo Alto NGFW Core VM)',
      resellerGateway: 'AWS Virtual Private Gateway (NetShield Enterprise)',
      directoryType: 'AWS IAM Identity Center Active Link',
      baseAlerts: 28,
      basePorts: 8,
      vpnSessions: 64,
      failures24h: 12,
      firewallEvents: { total: 24800, blocked: 22100, rate: 89 },
      openPortsList: [
        { id: 'PT-22', port: '22', service: 'SSH (AWS Systems Manager Target)', risk: 'Critical', desc: 'Allows direct shell logins on public EC2 instances. Secure via AWS SSM Session Manager.', closed: false },
        { id: 'PT-3389', port: '3389', service: 'RDP (Windows EC2 Bastion Host)', risk: 'High', desc: 'Remote desktop frames active. Restrict access via AWS Client VPN or SSM endpoints.', closed: false },
        { id: 'PT-80', port: '80', service: 'HTTP (AWS Application Load Balancer)', risk: 'Medium', desc: 'Active Application Load Balancer redirecting in plain HTTP. Wrap with AWS ACM Certificate.', closed: false }
      ],
      threatsList: [
        { id: 'TH-01', source: '185.220.101.44', location: 'Tor Egress Node', alert: 'AWS GuardDuty: Brute-force SSH Port Knocking', protocol: 'TCP/SSH', severity: 'critical', status: 'Inbound Attack' },
        { id: 'TH-02', source: '45.143.201.89', location: 'Netherlands IP', alert: 'AWS GuardDuty: Anomaly EC2 Instance Metadata Request', protocol: 'TCP/SYN', severity: 'high', status: 'Beacon Spike' },
        { id: 'TH-03', source: '103.250.48.12', location: 'Beijing VPN', alert: 'AWS GuardDuty: Excess HTTP Ingress Post Payload', protocol: 'HTTP/POST', severity: 'medium', status: 'Suspicious Scan' }
      ]
    },
    Azure: {
      gateway: 'Microsoft Azure Virtual WAN Hub',
      resellerGateway: 'SkyShield Gatekeeper Azure WAN Gateway',
      directoryType: 'Microsoft Entra ID Cloud Connector',
      baseAlerts: 34,
      basePorts: 12,
      vpnSessions: 48,
      failures24h: 17,
      firewallEvents: { total: 12470, blocked: 10225, rate: 82 },
      openPortsList: [
        { id: 'PT-22', port: '22', service: 'SSH (Remote Administration)', risk: 'Critical', desc: 'Allows direct terminal administrative shell logins. Exposed to worldwide subnet sweeps.', closed: false },
        { id: 'PT-3389', port: '3389', service: 'RDP (Remote Desktop Protocol)', risk: 'High', desc: 'Remote desktop frame streaming active. Vulnerable to BlueKeep credential brute-forcing.', closed: false },
        { id: 'PT-80', port: '80', service: 'HTTP (Unencrypted Web Ingress)', risk: 'Medium', desc: 'Active web redirection serving plain text traffic without SSL certificate wrapping.', closed: false }
      ],
      threatsList: [
        { id: 'TH-01', source: '185.220.101.44', location: 'Tor Egress Node', alert: 'Brute-force SSH Port Knocking', protocol: 'TCP/SSH', severity: 'critical', status: 'Inbound Attack' },
        { id: 'TH-02', source: '45.143.201.89', location: 'Netherlands IP', alert: 'FIN7 Port Sweep Activity Detected', protocol: 'TCP/SYN', severity: 'high', status: 'Beacon Spike' },
        { id: 'TH-03', source: '103.250.48.12', location: 'Beijing VPN', alert: 'Excessive HTTP Ingress Post Payload', protocol: 'HTTP/POST', severity: 'medium', status: 'Suspicious Scan' }
      ]
    },
    GCP: {
      gateway: 'Google Cloud Network Connectivity Center',
      resellerGateway: 'GCP Cloud VPN Connector (Snort Engine)',
      directoryType: 'Google Workspace Cloud Identity SSO Gateway',
      baseAlerts: 18,
      basePorts: 6,
      vpnSessions: 38,
      failures24h: 8,
      firewallEvents: { total: 9840, blocked: 8960, rate: 91 },
      openPortsList: [
        { id: 'PT-22', port: '22', service: 'SSH (GCP Compute Workload)', risk: 'Critical', desc: 'Exposed Compute Engine interface. Shield using GCP Identity-Aware Proxy (IAP) tunnels.', closed: false },
        { id: 'PT-3389', port: '3389', service: 'RDP (GCP Windows Instance)', risk: 'High', desc: 'Direct remote admin RDP listener active. Secure via Cloud Armor VPC rules.', closed: false },
        { id: 'PT-80', port: '80', service: 'HTTP (GCP Cloud Load Balancer)', risk: 'Medium', desc: 'HTTP forwarding rule serving unencrypted web resources. Wrap with Google-managed SSL.', closed: false }
      ],
      threatsList: [
        { id: 'TH-01', source: '185.220.101.44', location: 'Tor Egress Node', alert: 'GCP Cloud Armor: Brute-force SSH Port Knocking', protocol: 'TCP/SSH', severity: 'critical', status: 'Inbound Attack' },
        { id: 'TH-02', source: '45.143.201.89', location: 'Netherlands IP', alert: 'GCP Cloud Armor: FIN7 scan targeting GKE LoadBalancer', protocol: 'TCP/SYN', severity: 'high', status: 'Beacon Spike' },
        { id: 'TH-03', source: '103.250.48.12', location: 'Beijing VPN', alert: 'GCP Cloud Armor: Excess HTTP Ingress Post Payload', protocol: 'HTTP/POST', severity: 'medium', status: 'Suspicious Scan' }
      ]
    }
  },
  UR: {
    AWS: {
      gateway: 'AWS Transit Gateway (Palo Alto NGFW Core VM)',
      resellerGateway: 'AWS Virtual Private Gateway (NetShield Enterprise)',
      directoryType: 'AWS IAM Identity Center Active Link',
      baseAlerts: 5,
      basePorts: 4,
      vpnSessions: 412,
      failures24h: 3,
      firewallEvents: { total: 58940, blocked: 57210, rate: 97 },
      openPortsList: [
        { id: 'PT-22', port: '22', service: 'SSH (AWS ECS Host Daemon)', risk: 'Critical', desc: 'Open administrative port. Secure via AWS Systems Manager SSM Session Manager.', closed: false },
        { id: 'PT-1433', port: '1433', service: 'MSSQL (AWS RDS SQL Server)', risk: 'High', desc: 'Active RDS database ingress facing public AWS Subnet. Secure via RDS Security Group.', closed: false }
      ],
      threatsList: [
        { id: 'TH-04', source: '198.51.100.12', location: 'Unknown Proxy', alert: 'AWS GuardDuty: Lazarus Malware C2 Outbound Call', protocol: 'HTTPS/Beacon', severity: 'critical', status: 'Anomaly Ingress' }
      ]
    },
    Azure: {
      gateway: 'Microsoft Azure Virtual WAN Hub',
      resellerGateway: 'SkyShield Gatekeeper Gateway',
      directoryType: 'Entra ID Cloud Connector',
      baseAlerts: 3,
      basePorts: 3,
      vpnSessions: 312,
      failures24h: 2,
      firewallEvents: { total: 38420, blocked: 36883, rate: 96 },
      openPortsList: [
        { id: 'PT-22', port: '22', service: 'SSH', risk: 'Critical', desc: 'Open administrative port. Secure via Bastion hosts.', closed: false },
        { id: 'PT-1433', port: '1433', service: 'MSSQL (Microsoft SQL Server)', risk: 'High', desc: 'Active SQL ingress port facing raw internet routing tables directly.', closed: false }
      ],
      threatsList: [
        { id: 'TH-04', source: '198.51.100.12', location: 'Unknown Proxy', alert: 'Lazarus Malware C2 Outbound Call', protocol: 'HTTPS/Beacon', severity: 'critical', status: 'Anomaly Ingress' }
      ]
    },
    GCP: {
      gateway: 'Google Cloud Network Connectivity Center',
      resellerGateway: 'GCP Cloud VPN Connector (Snort Engine)',
      directoryType: 'Google Workspace Cloud Identity SSO Gateway',
      baseAlerts: 2,
      basePorts: 2,
      vpnSessions: 228,
      failures24h: 1,
      firewallEvents: { total: 18450, blocked: 17820, rate: 96 },
      openPortsList: [
        { id: 'PT-22', port: '22', service: 'SSH (GCP Compute Workload)', risk: 'Critical', desc: 'Compute VM SSH interface exposed publicly. Restrict ingress with Google Identity-Aware Proxy (IAP).', closed: false },
        { id: 'PT-1433', port: '1433', service: 'MSSQL (GCP Cloud SQL instance)', risk: 'High', desc: 'Cloud SQL database ingress listening to all subnets. Lock with Authorized Networks & Private IP.', closed: false }
      ],
      threatsList: [
        { id: 'TH-04', source: '198.51.100.12', location: 'Unknown Proxy', alert: 'GCP Cloud Armor: Lazarus Malware Beacon from GKE Workload', protocol: 'HTTPS/Beacon', severity: 'critical', status: 'Anomaly Ingress' }
      ]
    }
  }
};

// Static correlation events for SIEM engine
const siemCorrelationRules = [
  { id: 'CR-01', name: 'FIN7 Portscan correlated with subsequent failed SSH root logins', weight: 'Critical CVSS 9.2', triggerCount: '17 Scans' },
  { id: 'CR-02', name: 'Okta SSO travel spikes correlated with multiple outbound firewall packets', weight: 'High CVSS 8.4', triggerCount: '3 Session Drifts' },
  { id: 'CR-03', name: 'Continuous ICMP echo sweeps correlated with stale API key token calls', weight: 'Medium CVSS 5.8', triggerCount: '8 Event Logs' }
];

export default function NetworkPage() {
  const { currentClient, isEnterpriseMode } = useClient();

  // Network State Management
  const [closedPorts, setClosedPorts] = useState<Record<string, boolean>>({});
  const [mitigatedThreats, setMitigatedThreats] = useState<Record<string, boolean>>({});
  const [correlatedSIEM, setCorrelatedSIEM] = useState<Record<string, boolean>>({});
  const [terminatedTunnels, setTerminatedTunnels] = useState<Record<string, boolean>>({});
  const [tracedRoutes, setTracedRoutes] = useState<Record<string, boolean>>({});

  // Dynamic Network Gateways based on integration provider
  const [cloudProvider, setCloudProvider] = useState<'AWS' | 'Azure' | 'GCP'>('AWS');

  const gatewayMeta = {
    AWS: {
      enterprise: 'AWS Transit Gateway (Palo Alto NGFW Core VM)',
      reseller: 'AWS Virtual Private Gateway (NetShield Enterprise)',
      directory: 'AWS IAM Identity Center Active Link',
    },
    Azure: {
      enterprise: 'Microsoft Azure Virtual WAN Hub',
      reseller: 'SkyShield Gatekeeper Azure WAN Gateway',
      directory: 'Microsoft Entra ID Cloud Connector',
    },
    GCP: {
      enterprise: 'Google Cloud Network Connectivity Center',
      reseller: 'GCP Cloud VPN Connector (Snort Engine)',
      directory: 'Google Workspace Cloud Identity SSO Gateway',
    }
  };

  // Packet Sniffer (PCAP) simulator state
  const [snifferLogs, setSnifferLogs] = useState<string[]>([]);
  const [isSniffing, setIsSniffing] = useState(false);
  const [snifferProgress, setSnifferProgress] = useState(0);

  // General terminal commands
  const [terminalCommands, setTerminalCommands] = useState<string[]>([]);
  const [isOrchestrating, setIsOrchestrating] = useState(false);
  const [currentTask, setCurrentTask] = useState<string | null>(null);

  // Sync baseline whenever client or cloud integration changes
  useEffect(() => {
    setClosedPorts({});
    setMitigatedThreats({});
    setCorrelatedSIEM({});
    setTerminatedTunnels({});
    setTracedRoutes({});
    setIsSniffing(false);
    setSnifferLogs([]);
    
    const activeGatewayName = isEnterpriseMode 
      ? gatewayMeta[cloudProvider].enterprise 
      : gatewayMeta[cloudProvider].reseller;

    setTerminalCommands([
      `[GATEWAY] Connected to secure network gateway: ${currentClient.name}`,
      `[FIREWALL] Active firewall interface linked: ${activeGatewayName}`,
      `[IDENTITY] Synced network directory: ${gatewayMeta[cloudProvider].directory} Active`
    ]);
  }, [currentClient.key, isEnterpriseMode, cloudProvider]);

  // Resolve active metadata based on active Client and Cloud Provider
  const activeMetaClient = clientNetworkMeta[currentClient.key as 'ACME' | 'UR'] || clientNetworkMeta.ACME;
  const activeMeta = activeMetaClient[cloudProvider];

  // Real-time dynamic recalculations
  const closedCount = Object.keys(closedPorts).length;
  const mitigatedCount = Object.keys(mitigatedThreats).length;
  const correlatedCount = Object.keys(correlatedSIEM).length;
  const terminatedCount = Object.keys(terminatedTunnels).length;
  const tracedCount = Object.keys(tracedRoutes).length;

  const currentPortsCount = Math.max(0, activeMeta.basePorts - closedCount);
  const currentAlertsCount = Math.max(0, activeMeta.baseAlerts - mitigatedCount * Math.ceil(activeMeta.baseAlerts / activeMeta.threatsList.length));
  const activeVPNSessions = Math.max(0, activeMeta.vpnSessions - terminatedCount);
  const currentRate = Math.min(100, activeMeta.firewallEvents.rate + (closedCount * 2) + (mitigatedCount * 2));
  const networkSla = currentAlertsCount === 0 ? 'CONFORMANCE' : currentAlertsCount > 10 ? 'BREACH WARNING' : 'WARNING SPIKE';

  // Inbound attack gateway blocker
  const handleBlockPort = (portId: string, portNum: string, serviceName: string) => {
    if (isOrchestrating) return;
    setIsOrchestrating(true);
    setCurrentTask(portId);
    setTerminalCommands(prev => [...prev, `[FIREWALL ACL] Modifying inbound security access control list rules...`]);

    const firewallName = isEnterpriseMode 
      ? (cloudProvider === 'AWS' ? 'AWS Palo Alto API Tunnel' : cloudProvider === 'GCP' ? 'GCP Palo Alto Connector' : 'Palo Alto API Command Tunnel')
      : (cloudProvider === 'AWS' ? 'AWS NetShield Security Gateway' : cloudProvider === 'GCP' ? 'GCP NetShield Gateway' : 'GateGuard NGFW local terminal');
    const logsSequence = [
      `[FIREWALL ACL] Connecting securely to ${firewallName}...`,
      `[FIREWALL ACL] Revoking public TCP/UDP ingress permission on PORT: ${portNum}...`,
      `[SIEM ENGINE] Transmitting port-closed audit log to centralized dashboard correlation index...`,
      `[SUCCESS] Closed: Public port ingress disabled for ${serviceName} (Port ${portNum})!`,
      `[SUCCESS] Recalculating network exposure vulnerabilities ledger...`
    ];

    let delay = 250;
    logsSequence.forEach((log, idx) => {
      setTimeout(() => {
        setTerminalCommands(prev => [...prev, log]);
        if (idx === logsSequence.length - 1) {
          setIsOrchestrating(false);
          setClosedPorts(prev => ({ ...prev, [portId]: true }));
        }
      }, delay);
      delay += 350;
    });
  };

  // IPS Threat Detection Preventer
  const handleActivateIPS = (threatId: string, sourceIp: string, alertName: string) => {
    if (isOrchestrating) return;
    setIsOrchestrating(true);
    setCurrentTask(threatId);
    setTerminalCommands(prev => [...prev, `[IPS CONTROLLERS] Deploying active prevention signatures for: ${alertName}...`]);

    const ipsName = isEnterpriseMode 
      ? (cloudProvider === 'AWS' ? 'AWS GuardDuty IPS Engine' : cloudProvider === 'GCP' ? 'GCP Cloud Armor Intrusion Guard' : 'Cisco Secure IPS Prevention Engine')
      : (cloudProvider === 'AWS' ? 'AWS SnortEngine Signatures' : cloudProvider === 'GCP' ? 'GCP Snort Signature Blocker' : 'SnortEngine Signature Blocker');
    const logsSequence = [
      `[IPS CONTROLLERS] Querying IDS/IPS logs via ${ipsName}...`,
      `[IPS CONTROLLERS] Appending drop signature rules to gateway filter tables for IP: ${sourceIp}/32...`,
      `[FIREWALL] Purging active inbound state tables linked to matching sockets...`,
      `[SUCCESS] Mitigated: Threat '${alertName}' contained! Blocked malicious IP ${sourceIp}.`,
      `[SUCCESS] Dynamic network threat level indicators updated.`
    ];

    let delay = 250;
    logsSequence.forEach((log, idx) => {
      setTimeout(() => {
        setTerminalCommands(prev => [...prev, log]);
        if (idx === logsSequence.length - 1) {
          setIsOrchestrating(false);
          setMitigatedThreats(prev => ({ ...prev, [threatId]: true }));
        }
      }, delay);
      delay += 350;
    });
  };

  // SIEM correlation auditing trigger
  const handleSIEMCorrelate = (ruleId: string, ruleName: string) => {
    if (isOrchestrating) return;
    setIsOrchestrating(true);
    setCurrentTask(ruleId);
    setTerminalCommands(prev => [...prev, `[SIEM CORRELATOR] Running event correlation sequence across network logs...`]);

    const logsSequence = [
      `[SIEM CORRELATOR] Sweeping raw firewall gateway connection attempts...`,
      `[SIEM CORRELATOR] Querying directory authentication alerts in parallel...`,
      `[SIEM CORRELATOR] Rule match: '${ruleName}' verified and logged to CISO compliance index!`,
      `[SUCCESS] Correlated: Event correlation audit completed for '${ruleName.slice(0, 30)}...'`,
      `[SUCCESS] Synced audit details back to executive dashboard.`
    ];

    let delay = 250;
    logsSequence.forEach((log, idx) => {
      setTimeout(() => {
        setTerminalCommands(prev => [...prev, log]);
        if (idx === logsSequence.length - 1) {
          setIsOrchestrating(false);
          setCorrelatedSIEM(prev => ({ ...prev, [ruleId]: true }));
        }
      }, delay);
      delay += 350;
    });
  };

  // Terminate active VPN Session
  const handleTerminateVPN = (tunnelId: string, userMail: string, userIp: string) => {
    if (isOrchestrating) return;
    setIsOrchestrating(true);
    setCurrentTask(tunnelId);
    setTerminalCommands(prev => [...prev, `[VPN GATEWAY] Revoking access token credentials for user: ${userMail}...`]);

    const firewallName = isEnterpriseMode 
      ? (cloudProvider === 'AWS' ? 'AWS Palo Alto VPN Hub' : cloudProvider === 'GCP' ? 'GCP Palo Alto Gateway' : 'Palo Alto WAN Controller') 
      : (cloudProvider === 'AWS' ? 'AWS NetShield IPsec Node' : cloudProvider === 'GCP' ? 'GCP NetShield Tunnel' : 'GateGuard NGFW VPN interface');
    const logsSequence = [
      `[VPN GATEWAY] Querying connected tunnels via ${firewallName}...`,
      `[VPN GATEWAY] Revoking IPsec/SSL active keys for IP: ${userIp}...`,
      `[VPN GATEWAY] Transmitting tunnel-terminated event logs to SIEM central correlator...`,
      `[SUCCESS] Revoked: Closed VPN access tunnel for ${userMail}!`,
      `[SUCCESS] Active session indexes successfully updated.`
    ];

    let delay = 250;
    logsSequence.forEach((log, idx) => {
      setTimeout(() => {
        setTerminalCommands(prev => [...prev, log]);
        if (idx === logsSequence.length - 1) {
          setIsOrchestrating(false);
          setTerminatedTunnels(prev => ({ ...prev, [tunnelId]: true }));
        }
      }, delay);
      delay += 350;
    });
  };

  // Trace Attack Route Hops
  const handleTraceRoute = (sourceId: string, attackIp: string, attackType: string) => {
    if (isOrchestrating) return;
    setIsOrchestrating(true);
    setCurrentTask(sourceId);
    setTerminalCommands(prev => [...prev, `[TRACEROUTE] Sweeping network routing hops to target IP: ${attackIp}...`]);

    const logsSequence = [
      `[TRACEROUTE] Hop 1: 10.0.0.1 (Internal Gateway Router) - 0.8ms`,
      `[TRACEROUTE] Hop 2: 72.14.238.12 (ISP Ingress Backbone) - 4.2ms`,
      `[TRACEROUTE] Hop 3: 209.85.241.109 (Regional Edge Router) - 18.5ms`,
      `[TRACEROUTE] Hop 4: ${attackIp} (${attackType}) - 42.1ms`,
      `[SUCCESS] Trace Route completed! Hops correlated and logged to SIEM perimeter ledger.`
    ];

    let delay = 250;
    logsSequence.forEach((log, idx) => {
      setTimeout(() => {
        setTerminalCommands(prev => [...prev, log]);
        if (idx === logsSequence.length - 1) {
          setIsOrchestrating(false);
          setTracedRoutes(prev => ({ ...prev, [sourceId]: true }));
        }
      }, delay);
      delay += 350;
    });
  };

  // Wireshark / Snort packet analyzer PCAP simulation
  const handleStartSniffer = () => {
    if (isSniffing) return;
    setIsSniffing(true);
    setSnifferProgress(0);
    setSnifferLogs([
      `[PCAP SNIFFER] Initializing Wireshark/Snort live packet capture trace...`,
      isEnterpriseMode 
        ? `[PCAP SNIFFER] Linking into ${cloudProvider === 'AWS' ? 'AWS VPC Traffic Mirroring TAP' : cloudProvider === 'GCP' ? 'GCP Packet Mirroring interface' : 'Palo Alto SPAN mirrored port'}...`
        : `[PCAP SNIFFER] Linking into ${cloudProvider === 'AWS' ? 'AWS VPC Core Snort TAP' : cloudProvider === 'GCP' ? 'GCP VPC Snort TAP' : 'SnortEngine packet sniffer virtual TAP'}...`
    ]);

    const packetTunnels = [
      `[TCP] 10.0.12.84:50210 -> 185.220.101.44:22 [SYN] Seq=0 Win=64240 Len=0 MSS=1460`,
      `[UDP] 10.0.4.155:53 -> 8.8.8.8:53 [DNS] Standard query A api.github.com`,
      `[TCP] 45.143.201.89:443 -> 10.0.12.33:80 [ACK] Seq=1 Ack=1 Win=502 Len=104 TTL=52`,
      `[ICMP] 10.0.8.22 -> 10.0.8.1 [PING] Echo request (id=0x0001, seq=1)`,
      `[TCP] 185.220.101.44:22 -> 10.0.12.84:50210 [RST, ACK] Seq=1 Win=0 Len=0`,
      `[HTTPS] 10.0.12.99:443 -> 104.18.23.40:443 [TLSv1.3] Application Data Stream`,
      `[UDP] 10.0.2.14:123 -> 162.159.200.123:123 [NTP] Client NTP synchronization request`,
      `[TCP] 10.0.12.84:50210 -> 185.220.101.44:22 [SYN] Retry Seq=0 Win=64240`,
      `[PCAP COMPLETE] Live packet capture trace stream captured. 1,024 raw packets parsed.`
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < packetTunnels.length) {
        setSnifferLogs(prev => [...prev, packetTunnels[currentStep]]);
        setSnifferProgress(Math.round(((currentStep + 1) / packetTunnels.length) * 100));
        currentStep++;
      } else {
        clearInterval(interval);
        setIsSniffing(false);
      }
    }, 450);
  };

  // Reset console sandbox
  const handleResetSandbox = () => {
    setClosedPorts({});
    setMitigatedThreats({});
    setCorrelatedSIEM({});
    setTerminatedTunnels({});
    setTracedRoutes({});
    setIsSniffing(false);
    setSnifferLogs([]);
    setTerminalCommands([
      `[RESET] Network Command Center baselines successfully restored.`,
      `[RESET] Port ACL controls and IPS prevention rules toggled back to defaults.`,
      `[INFO] Choose an open security group port to enforce gateway access blocks.`
    ]);
    setCurrentTask(null);
    setIsOrchestrating(false);
  };

  // Mock Recharts chart data (weekly activity flow) scaled by selected cloud provider
  const isUR = currentClient.key === 'UR';
  const scale = cloudProvider === 'AWS' ? 1.5 : cloudProvider === 'Azure' ? 1.0 : 0.6;
  const firewallChartData = [
    { day: 'Mon', blocked: Math.round((isUR ? 240 : 1240) * scale), allowed: Math.round((isUR ? 8400 : 3800) * scale) },
    { day: 'Tue', blocked: Math.round((isUR ? 180 : 1530) * scale), allowed: Math.round((isUR ? 7900 : 4100) * scale) },
    { day: 'Wed', blocked: Math.round((isUR ? 290 : 1100) * scale), allowed: Math.round((isUR ? 9100 : 3900) * scale) },
    { day: 'Thu', blocked: Math.round((isUR ? 150 : 1480) * scale), allowed: Math.round((isUR ? 8800 : 4400) * scale) },
    { day: 'Fri', blocked: Math.round((isUR ? 210 : 1600) * scale), allowed: Math.round((isUR ? 9500 : 4200) * scale) },
    { day: 'Sat', blocked: Math.round((isUR ? 80 : 890) * scale), allowed: Math.round((isUR ? 6200 : 2500) * scale) },
    { day: 'Sun', blocked: Math.round((isUR ? 90 : 920) * scale), allowed: Math.round((isUR ? 6400 : 2800) * scale) }
  ];

  return (
    <div className="page-content animate-in" style={{ paddingBottom: '2.5rem' }}>
      
      {/* ── STICKY NETWORK COMMAND LINK BANNER ── */}
      <div className="sticky-alert-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#7c3aed', display: 'inline-block', boxShadow: '0 0 8px #7c3aed' }} />
          <div>
            <div style={{ fontWeight: 800, color: '#6d28d9', fontSize: '0.9rem' }}>
              Network Command Center — {isEnterpriseMode ? gatewayMeta[cloudProvider].enterprise : gatewayMeta[cloudProvider].reseller}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#7c3aed', fontWeight: 600 }}>
              🔗 Connected Interface: {gatewayMeta[cloudProvider].directory} Interface Active
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={cloudProvider}
            onChange={(e) => setCloudProvider(e.target.value as 'AWS' | 'Azure' | 'GCP')}
            style={{
              fontSize: '0.78rem', fontWeight: 800, color: '#7c3aed', background: 'rgba(255, 255, 255, 0.4)', 
              border: '1px solid #c084fc', padding: '0.5rem 1rem', borderRadius: 8, cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)', outline: 'none'
            }}
          >
            <option value="AWS">☁️ AWS (Transit Gateway)</option>
            <option value="Azure">☁️ Microsoft Azure (Virtual WAN)</option>
            <option value="GCP">☁️ Google Cloud (NCC)</option>
          </select>
          <button
            onClick={handleResetSandbox}
            style={{
              fontSize: '0.78rem', fontWeight: 800, color: '#7c3aed', background: 'rgba(255, 255, 255, 0.4)', 
              border: '1px solid #c084fc', padding: '0.5rem 1rem', borderRadius: 8, cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '4px'
            }}
          >
            🔄 Reset Sandbox
          </button>
          <Link href="/dashboard/findings?tool=network" style={{
            fontSize: '0.78rem', fontWeight: 800, color: '#fff', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
            border: 'none', padding: '0.5rem 1.25rem', borderRadius: 8, textDecoration: 'none',
            boxShadow: '0 4px 12px rgba(124, 58, 237, 0.2)', transition: 'all 0.15s'
          }}>
            View All Findings →
          </Link>
        </div>
      </div>

      {/* ── SECURITY NETWORKING STATISTICS HUD ── */}
      <div className="grid-4" style={{ marginBottom: '1.25rem' }}>
        
        {/* Dynamic Firewall Gateway Blocking Progress Dial */}
        <div className="stat-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.25rem' }}>
          <div className="stat-card-accent" style={{ background: '#7c3aed' }} />
          <div style={{ position: 'relative', width: 90, height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="90" height="90" viewBox="0 0 90 90" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="45" cy="45" r="38" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
              <circle 
                cx="45" cy="45" r="38" 
                stroke="#7c3aed" strokeWidth="8" fill="transparent" 
                strokeDasharray={`${2 * Math.PI * 38}`}
                strokeDashoffset={`${2 * Math.PI * 38 * (1 - currentRate / 100)}`}
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
            </svg>
            <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#7c3aed', letterSpacing: '-0.04em' }}>{currentRate}%</span>
            </div>
          </div>
          <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748b', marginTop: 10, textTransform: 'uppercase' }}>Gateway ACL Rate</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-accent" style={{ background: '#dc2626' }} />
          <div className="stat-label">Open Vulnerable Ports</div>
          <div className="stat-value" style={{ color: '#dc2626', fontSize: '1.8rem', marginTop: 4 }}>{currentPortsCount}</div>
          <div className="stat-delta" style={{ color: closedCount > 0 ? '#10b981' : '#dc2626', fontWeight: 800 }}>
            {closedCount > 0 ? `🟢 Closed ${closedCount} open ports` : '🚨 exposed to network sweeps'}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-accent" style={{ background: '#ea580c' }} />
          <div className="stat-label">IDS Intrusion Threats</div>
          <div className="stat-value" style={{ color: '#ea580c', fontSize: '1.8rem', marginTop: 4 }}>{currentAlertsCount}</div>
          <div className="stat-delta" style={{ color: mitigatedCount > 0 ? '#10b981' : '#ea580c', fontWeight: 800 }}>
            {mitigatedCount > 0 ? `🟢 Mitigated ${mitigatedCount} attacks` : 'Inbound connection attempts'}
          </div>
        </div>

        <div className="stat-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div className="stat-card-accent" style={{ background: '#059669' }} />
          <div>
            <div className="stat-label">SLA Warn Status</div>
            <div className="stat-value" style={{ color: currentAlertsCount === 0 ? '#059669' : '#ea580c', fontSize: '1.1rem', fontWeight: 900, textTransform: 'uppercase', marginTop: 4 }}>
              {networkSla}
            </div>
            <div style={{ fontSize: '0.62rem', color: '#64748b', marginTop: 6 }}>
              Active Tunnels: <span style={{ fontWeight: 800, color: '#334155' }}>{activeVPNSessions} VPN Sessions</span>
            </div>
          </div>
        </div>

      </div>

      {/* ── ROW 1: FIREWALL ACL PORT SWEEPER & IDS INTRUSION prevenion WIDGETS ── */}
      <div className="grid-2" style={{ marginBottom: '1.25rem' }}>
        
        {/* FIREWALL GATEWAY INGRESS ACCESS CONTROL LIST */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-title">🛡️ Next-Generation Firewall (NGFW) Ingress Access Control</div>
          <p style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: '1rem' }}>
            List open network gateway ports scanned on public servers. Close open ports to enforce boundary least privilege.
          </p>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            <table className="data-table" style={{ fontSize: '0.76rem' }}>
              <thead>
                <tr>
                  <th>Vulnerable Port</th>
                  <th>Exposure Risk</th>
                  <th>Firewall ACL Action</th>
                </tr>
              </thead>
              <tbody>
                {activeMeta.openPortsList.map(port => {
                  const isClosed = !!closedPorts[port.id];
                  return (
                    <tr key={port.id} style={{ background: isClosed ? '#f0fdf4' : 'transparent', transition: 'all 0.2s' }}>
                      <td style={{ fontWeight: 700, color: '#0f172a' }}>
                        Port {port.port} — {port.service}
                        <span style={{ display: 'block', fontSize: '0.58rem', fontWeight: 600, color: '#64748b', marginTop: 1, whiteSpace: 'normal', maxWidth: '300px' }}>
                          {port.desc}
                        </span>
                      </td>
                      <td>
                        <span className={`badge badge-${isClosed ? 'low' : port.risk.toLowerCase()}`}>
                          {isClosed ? 'Blocked (Safe)' : port.risk}
                        </span>
                      </td>
                      <td>
                        {isClosed ? (
                          <span style={{ color: '#059669', fontWeight: 800, fontSize: '0.72rem' }}>✓ Closed Port</span>
                        ) : (
                          <button
                            onClick={() => handleBlockPort(port.id, port.port, port.service)}
                            disabled={isOrchestrating}
                            style={{
                              fontSize: '0.68rem', fontWeight: 800, padding: '3px 8px', borderRadius: 6, cursor: isOrchestrating ? 'not-allowed' : 'pointer',
                              border: 'none', background: '#3b82f6', color: '#fff', boxShadow: '0 2px 6px rgba(59,130,246,0.1)'
                            }}
                          >
                            Block Port
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* IDS/IPS ALERT INTRUSION LEDGER */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-title">🚨 IDS/IPS Intrusion alerts & Detection Ledger</div>
          <p style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: '1rem' }}>
            Real-time signatures matching malicious connection sweeps. Activate IPS prevention filters to block source IPs dynamically.
          </p>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {currentAlertsCount === 0 ? (
              <div style={{ color: '#059669', fontStyle: 'italic', margin: 'auto', textAlign: 'center', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: '2.5rem' }}>🟢</span>
                <span style={{ fontWeight: 800 }}>Gateways Secure! All malicious IPs successfully blocked at perimeter.</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {activeMeta.threatsList.map(threat => {
                  const isMitigated = !!mitigatedThreats[threat.id];
                  if (isMitigated) return null;
                  return (
                    <div 
                      key={threat.id}
                      style={{
                        padding: '0.75rem 1rem', background: '#fffafb', border: '1px solid #fca5a5', borderRadius: 12,
                        display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#991b1b' }}>{threat.alert}</span>
                          <span style={{ display: 'block', fontSize: '0.72rem', color: '#4b5563', marginTop: 1 }}>Source Socket: <strong>{threat.source}</strong> ({threat.location})</span>
                        </div>
                        <span className="badge badge-critical">{threat.severity}</span>
                      </div>
                      <p style={{ fontSize: '0.71rem', color: '#64748b', margin: '4px 0 8px' }}>Active signature vector matching: protocol {threat.protocol} sweep attempts.</p>
                      <button
                        onClick={() => handleActivateIPS(threat.id, threat.source, threat.alert)}
                        disabled={isOrchestrating}
                        style={{
                          fontSize: '0.68rem', fontWeight: 800, background: '#dc2626', color: '#fff', border: 'none',
                          padding: '4px 10px', borderRadius: 6, cursor: isOrchestrating ? 'not-allowed' : 'pointer', alignSelf: 'flex-start',
                          boxShadow: '0 2px 6px rgba(220, 38, 38, 0.1)', transition: 'all 0.15s'
                        }}
                      >
                        Enforce IPS Access Blockade
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ── ROW 2: LIVE PACKET SNIFFER (WIRESHARK SIM) & SIEM CORRELATOR ── */}
      <div className="grid-2" style={{ marginBottom: '1.25rem' }}>
        
        {/* WIRESHARK PACKET ANALYZER & SNIFFER TERMINAL */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '380px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
            <div>
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', display: 'block' }}>📡 Wireshark Live Packet Analyzer & PCAP Sniffer</span>
              <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Monitor raw networking packets (TCP/UDP/ICMP) inside active interfaces.</span>
            </div>
            <button
              onClick={handleStartSniffer}
              disabled={isSniffing || isOrchestrating}
              style={{
                fontSize: '0.74rem', fontWeight: 800, background: '#7c3aed', color: '#fff', border: 'none',
                padding: '5px 12px', borderRadius: 6, cursor: (isSniffing || isOrchestrating) ? 'not-allowed' : 'pointer',
                boxShadow: '0 2px 8px rgba(124,58,237,0.2)'
              }}
            >
              {isSniffing ? `Sniffing (${snifferProgress}%)` : 'Capture Packet Stream'}
            </button>
          </div>

          <div style={{ 
            flex: 1, background: '#020617', padding: '1rem', borderRadius: 12, 
            fontFamily: 'monospace', fontSize: '0.71rem', color: '#38bdf8', border: '1px solid #1e293b',
            overflowY: 'auto', lineHeight: '1.4'
          }}>
            {snifferLogs.length === 0 ? (
              <div style={{ color: '#64748b', fontStyle: 'italic', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                [READY] Console interface active. Click "Capture Packet Stream" to trace real-time TCP/UDP socket payloads...
              </div>
            ) : (
              snifferLogs.map((log, idx) => {
                const isCrit = log.includes('185.220.101.44') || log.includes('45.143.201.89');
                return (
                  <div key={idx} style={{
                    color: isCrit ? '#f87171' : log.startsWith('[PCAP') ? '#34d399' : log.includes('TCP') ? '#c084fc' : log.includes('UDP') ? '#60a5fa' : '#38bdf8',
                    marginBottom: 3
                  }}>
                    {log}
                  </div>
                );
              })
            )}
            {isSniffing && <div style={{ display: 'inline-block', width: 6, height: 12, background: '#38bdf8', marginLeft: 2, verticalAlign: 'middle', animation: 'blink 1s infinite' }} />}
          </div>
        </div>

        {/* SIEM LOGS CORRELATION ENGINE */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '380px' }}>
          <div className="card-title">🔌 SIEM logs Correlation Engine</div>
          <p style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: '0.75rem' }}>
            Centralized SIEM platform correlator. Synthesize raw gateway alerts, port checks, and auth drifts into correlation logs.
          </p>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {siemCorrelationRules.map(rule => {
              const isCorrelated = !!correlatedSIEM[rule.id];
              return (
                <div 
                  key={rule.id}
                  style={{
                    padding: '0.65rem 0.85rem', background: isCorrelated ? '#f0fdf4' : '#f8fafc',
                    border: isCorrelated ? '1px solid #86efac' : '1px solid #cbd5e1', borderRadius: 10,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s'
                  }}
                >
                  <div style={{ flex: 1, marginRight: '1rem' }}>
                    <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0f172a' }}>{rule.name}</div>
                    <div style={{ fontSize: '0.62rem', color: '#94a3b8', marginTop: 2 }}>
                      Weight: <strong style={{ color: '#475569' }}>{rule.weight}</strong> · Checked: {rule.triggerCount}
                    </div>
                  </div>
                  <div>
                    {isCorrelated ? (
                      <span style={{ color: '#059669', fontSize: '0.72rem', fontWeight: 800 }}>✓ SIEM Audited</span>
                    ) : (
                      <button
                        onClick={() => handleSIEMCorrelate(rule.id, rule.name)}
                        disabled={isOrchestrating}
                        style={{
                          fontSize: '0.68rem', fontWeight: 800, background: '#7c3aed', color: '#fff', border: 'none',
                          padding: '4px 10px', borderRadius: 6, cursor: isOrchestrating ? 'not-allowed' : 'pointer',
                          boxShadow: '0 2px 6px rgba(124,58,237,0.1)'
                        }}
                      >
                        Correlate Logs
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Security alerts progress card */}
          <div style={{ padding: '0.65rem 0.85rem', background: '#fcf8ff', borderRadius: 10, border: '1px dashed #ddd6fe', marginTop: '0.75rem' }}>
            <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#7c3aed', textTransform: 'uppercase' }}>SIEM Correlation Audit Coverage</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
              <span style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 600 }}>Active SIEM Rules Audited:</span>
              <span style={{ fontSize: '0.78rem', fontWeight: 900, color: '#7c3aed' }}>{correlatedCount} of {siemCorrelationRules.length} correlated</span>
            </div>
            <div className="progress-bar-wrap" style={{ height: 6, marginTop: 6 }}>
              <div className="progress-bar-fill" style={{ width: `${(correlatedCount / siemCorrelationRules.length) * 100}%`, background: '#7c3aed' }} />
            </div>
          </div>

        </div>

      </div>

      {/* ── ROW 3: ORCHESTRATOR TERMINAL LOGS & HISTORICAL FIREWALL TRENDS ── */}
      <div className="grid-2" style={{ marginBottom: '1.25rem' }}>
        
        {/* DYNAMIC ORCHESTRATOR SIEM LOGS TERMINAL */}
        <div className="card" style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 16, padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', height: '240px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.50rem' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: isOrchestrating ? '#ef4444' : '#10b981', display: 'inline-block' }} />
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Gateway SIEM & Firewall Orchestration Terminal
              </span>
            </div>
            <button 
              onClick={() => setTerminalCommands([])}
              style={{ 
                fontSize: '0.65rem', fontWeight: 800, background: '#1e293b', border: '1px solid #334155', 
                color: '#94a3b8', padding: '2px 8px', borderRadius: 4, cursor: 'pointer' 
              }}
            >
              Clear Console
            </button>
          </div>
          
          <div style={{ 
            flex: 1, background: '#020617', padding: '1rem', borderRadius: 10, 
            fontFamily: 'monospace', fontSize: '0.71rem', color: '#38bdf8', border: '1px solid #1e293b',
            overflowY: 'auto', lineHeight: '1.4'
          }}>
            {terminalCommands.map((log, idx) => (
              <div key={idx} style={{
                color: log.startsWith('[ERR') ? '#f87171' : log.startsWith('[SUCCESS') ? '#34d399' : log.startsWith('[FIREWALL') ? '#60a5fa' : log.startsWith('[SIEM') ? '#f472b6' : '#38bdf8',
                marginBottom: 4
              }}>
                {log}
              </div>
            ))}
            <div style={{ display: 'inline-block', width: 6, height: 12, background: '#38bdf8', marginLeft: 2, verticalAlign: 'middle', animation: 'blink 1s infinite' }} />
          </div>
        </div>

        {/* WEEKLY ACTIVITY CHART */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '240px' }}>
          <div className="card-title">📊 Weekly Firewall Packet Filter Trend</div>
          <div style={{ flex: 1, paddingTop: '0.5rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={firewallChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: any) => v.toLocaleString()} />
                <Bar dataKey="blocked" name="Blocked Packets" fill="#dc2626" radius={[3,3,0,0]} />
                <Bar dataKey="allowed" name="Allowed Packets" fill="#3b82f6" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* ── ROW 4: VPN ACCESS TUNNELS & TOP BLOCKED ATTACKERS ── */}
      <div className="grid-2" style={{ marginBottom: '1.25rem' }}>
        
        {/* VPN ACCESS TUNNEL MONITOR */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '340px' }}>
          <div className="card-title">🔒 Virtual Private Network (VPN) Gateway Monitor</div>
          <p style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: '0.75rem' }}>
            Active corporate VPN encrypted tunnels. Terminate active sessions to simulate containment of compromised external nodes.
          </p>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            <table className="data-table" style={{ fontSize: '0.76rem' }}>
              <thead>
                <tr>
                  <th>User & Endpoint</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 'VPN-01', user: 'contractor-sec@acme.internal', ip: '198.51.100.44', location: 'London, UK', status: 'Active SSL Tunnel' },
                  { id: 'VPN-02', user: 'ops-deploy@acme.internal', ip: '203.0.113.88', location: 'New York, US', status: 'Active IPsec' },
                  { id: 'VPN-03', user: 'vendor-audit@acme.internal', ip: '192.0.2.14', location: 'Frankfurt, DE', status: 'Active SSL Tunnel' }
                ]
                .filter(() => currentClient.key === 'ACME')
                .concat(currentClient.key === 'UR' ? [
                  { id: 'VPN-04', user: 'fleet-ops@unifiedrentals.com', ip: '198.51.100.12', location: 'Chicago, US', status: 'Active IPsec' },
                  { id: 'VPN-05', user: 'rental-portal@unifiedrentals.com', ip: '203.0.113.5', location: 'Dallas, US', status: 'Active SSL Tunnel' }
                ] : [])
                .map(session => {
                  const isTerminated = !!terminatedTunnels[session.id];
                  return (
                    <tr key={session.id} style={{ background: isTerminated ? '#fef2f2' : 'transparent', transition: 'all 0.2s' }}>
                      <td style={{ fontWeight: 700, color: '#0f172a' }}>
                        {session.user}
                        <span style={{ display: 'block', fontSize: '0.58rem', fontWeight: 600, color: '#64748b', marginTop: 1 }}>IP: {session.ip}</span>
                      </td>
                      <td>{session.location}</td>
                      <td>
                        <span className={`badge badge-${isTerminated ? 'critical' : 'low'}`}>
                          {isTerminated ? 'Terminated' : session.status}
                        </span>
                      </td>
                      <td>
                        {isTerminated ? (
                          <span style={{ color: '#dc2626', fontWeight: 800, fontSize: '0.72rem' }}>✗ Revoked</span>
                        ) : (
                          <button
                            onClick={() => handleTerminateVPN(session.id, session.user, session.ip)}
                            disabled={isOrchestrating}
                            style={{
                              fontSize: '0.68rem', fontWeight: 800, padding: '3px 8px', borderRadius: 6, cursor: isOrchestrating ? 'not-allowed' : 'pointer',
                              border: 'none', background: '#dc2626', color: '#fff', boxShadow: '0 2px 6px rgba(220,38,38,0.1)'
                            }}
                          >
                            Disconnect
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* TOP BLOCKED SOURCES PERIMETER LEDGER */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '340px' }}>
          <div className="card-title">🚫 Inbound Blocked Sources & Threat Intelligence</div>
          <p style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: '0.75rem' }}>
            List of malicious IP blocks locked at firewall boundary. Trace active route path hops to verify origin node networks.
          </p>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            <table className="data-table" style={{ fontSize: '0.76rem' }}>
              <thead>
                <tr>
                  <th>Origin Attacker IP</th>
                  <th>Location</th>
                  <th>Dropped Vol</th>
                  <th>Trace Audits</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 'IP-01', ip: '185.220.101.44', location: 'Tor Egress Node', count: '142,500 packets', type: 'Tor Outbound Attack' },
                  { id: 'IP-02', ip: '45.143.201.89', location: 'Netherlands IP', count: '89,200 packets', type: 'Malware Sweep' },
                  { id: 'IP-03', ip: '103.250.48.12', location: 'Beijing VPN', count: '34,100 packets', type: 'C2 Probe' }
                ]
                .filter(() => currentClient.key === 'ACME')
                .concat(currentClient.key === 'UR' ? [
                  { id: 'IP-04', ip: '198.51.100.12', location: 'Unknown Proxy', count: '12,400 packets', type: 'Brute Force Host' },
                  { id: 'IP-05', ip: '203.0.113.89', location: 'Eastern Europe Host', count: '9,800 packets', type: 'Port Sweep Host' }
                ] : [])
                .map(source => {
                  const isTraced = !!tracedRoutes[source.id];
                  return (
                    <tr key={source.id} style={{ background: isTraced ? '#f0fdf4' : 'transparent', transition: 'all 0.2s' }}>
                      <td style={{ fontWeight: 700, color: '#0f172a' }}>
                        {source.ip}
                        <span style={{ display: 'block', fontSize: '0.58rem', fontWeight: 600, color: '#64748b', marginTop: 1 }}>Type: {source.type}</span>
                      </td>
                      <td>{source.location}</td>
                      <td><strong>{source.count}</strong></td>
                      <td>
                        {isTraced ? (
                          <span style={{ color: '#059669', fontWeight: 800, fontSize: '0.72rem' }}>✓ Route Traced</span>
                        ) : (
                          <button
                            onClick={() => handleTraceRoute(source.id, source.ip, source.type)}
                            disabled={isOrchestrating}
                            style={{
                              fontSize: '0.68rem', fontWeight: 800, padding: '3px 8px', borderRadius: 6, cursor: isOrchestrating ? 'not-allowed' : 'pointer',
                              border: 'none', background: '#7c3aed', color: '#fff', boxShadow: '0 2px 6px rgba(124,58,237,0.1)'
                            }}
                          >
                            Trace Route
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
