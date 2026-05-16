// src/lib/pdf/reportTemplate.tsx
// PosturePilot — Executive Security Posture Report (React PDF)

import {
  Document, Page, Text, View, StyleSheet, Svg, Rect, Circle, G,
} from '@react-pdf/renderer';

// ─── Styles ──────────────────────────────────────────────────────────────────
const C = {
  navy:   '#1e2d6e',
  purple: '#7c3aed',
  orange: '#f97316',
  green:  '#16a34a',
  red:    '#dc2626',
  amber:  '#d97706',
  blue:   '#2563eb',
  slate:  '#475569',
  muted:  '#94a3b8',
  bg:     '#f8fafc',
  white:  '#ffffff',
  border: '#e2e8f0',
};

const S = StyleSheet.create({
  page:        { fontFamily:'Helvetica', backgroundColor: C.white, paddingBottom: 48 },
  // Header
  header:      { backgroundColor: C.navy, padding: '28 36', flexDirection:'row', alignItems:'center', justifyContent:'space-between' },
  headerLeft:  { flexDirection:'column' },
  logoText:    { fontSize: 20, fontFamily:'Helvetica-Bold', color: C.white, letterSpacing: -0.5 },
  logoSub:     { fontSize: 8,  color: 'rgba(255,255,255,0.55)', marginTop: 2, letterSpacing: 1.5 },
  headerRight: { alignItems:'flex-end' },
  reportTitle: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontFamily:'Helvetica-Bold', letterSpacing: 0.5 },
  reportDate:  { fontSize: 9,  color: 'rgba(255,255,255,0.45)', marginTop: 3 },
  // Banner bar
  pillBar:     { backgroundColor: '#f0f4ff', borderBottom: `1 solid ${C.border}`, padding: '8 36', flexDirection:'row', gap: 20 },
  pillItem:    { flexDirection:'row', alignItems:'center', gap: 5 },
  pillDot:     { width: 6, height: 6, borderRadius: 3 },
  pillLabel:   { fontSize: 7, color: C.slate, fontFamily:'Helvetica-Bold', textTransform:'uppercase', letterSpacing: 0.8 },
  pillVal:     { fontSize: 9, fontFamily:'Helvetica-Bold', color: C.navy },
  // Body
  body:        { padding: '24 36' },
  section:     { marginBottom: 20 },
  sectionTitle:{ fontSize: 11, fontFamily:'Helvetica-Bold', color: C.navy, marginBottom: 10, paddingBottom: 5, borderBottom:`1.5 solid ${C.navy}` },
  // Stat cards row
  statRow:     { flexDirection:'row', gap: 10, marginBottom: 16 },
  statCard:    { flex: 1, backgroundColor: C.bg, border:`1 solid ${C.border}`, borderRadius: 8, padding: '12 14', position:'relative' },
  statTop:     { height: 3, borderRadius: 2, marginBottom: 8 },
  statLabel:   { fontSize: 7, color: C.muted, fontFamily:'Helvetica-Bold', textTransform:'uppercase', letterSpacing:0.8, marginBottom:4 },
  statValue:   { fontSize: 22, fontFamily:'Helvetica-Bold', color: C.navy, letterSpacing: -0.5 },
  statDelta:   { fontSize: 7, color: C.slate, marginTop: 3 },
  // Severity bars
  sevRow:      { flexDirection:'row', alignItems:'center', gap:8, marginBottom:7 },
  sevLabel:    { fontSize: 8, fontFamily:'Helvetica-Bold', width: 52, color: C.slate },
  sevBarBg:    { flex: 1, height: 7, backgroundColor:'#f1f5f9', borderRadius: 4 },
  sevBarFill:  { height: 7, borderRadius: 4 },
  sevCount:    { fontSize: 8, fontFamily:'Helvetica-Bold', width: 30, textAlign:'right' },
  sevPct:      { fontSize: 7, color: C.muted, width: 28, textAlign:'right' },
  // Table
  tableHeader: { flexDirection:'row', backgroundColor:'#f1f5f9', padding:'5 8', borderRadius:4, marginBottom:2 },
  tableRow:    { flexDirection:'row', padding:'6 8', borderBottom:`1 solid #f1f5f9` },
  tableCell:   { fontSize: 7.5, color: C.slate },
  badge:       { borderRadius: 10, padding: '2 6', fontSize: 6.5, fontFamily:'Helvetica-Bold', textTransform:'uppercase' },
  // Footer
  footer:      { position:'absolute', bottom: 16, left: 36, right: 36, flexDirection:'row', justifyContent:'space-between', borderTop:`1 solid ${C.border}`, paddingTop: 8 },
  footerText:  { fontSize: 7, color: C.muted },
  // Divider
  divider:     { height: 1, backgroundColor: C.border, marginBottom: 16 },
  // Two-col layout
  cols:        { flexDirection:'row', gap: 14 },
  col:         { flex: 1 },
  // Info box
  infoBox:     { backgroundColor:'#f0fdf4', border:`1 solid #86efac`, borderRadius:8, padding:'10 14', marginBottom:12 },
  infoText:    { fontSize: 8.5, color:'#15803d', lineHeight: 1.5 },
});

// ─── Helpers ─────────────────────────────────────────────────────────────────
const SEV_CONFIG: Record<string, { color: string; bg: string }> = {
  Critical: { color: C.red,    bg: '#fef2f2' },
  High:     { color: '#ea580c', bg: '#fff7ed' },
  Medium:   { color: C.amber,  bg: '#fffbeb' },
  Low:      { color: C.green,  bg: '#f0fdf4' },
  Info:     { color: C.blue,   bg: '#eff6ff' },
};

function riskColor(score: number) {
  if (score >= 80) return C.red;
  if (score >= 60) return '#ea580c';
  if (score >= 40) return C.amber;
  return C.green;
}

// ─── Risk Score Ring (SVG) ────────────────────────────────────────────────────
function RiskRing({ score, color }: { score: number; color: string }) {
  const r = 34, cx = 44, cy = 44;
  const circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ;
  return (
    <View style={{ alignItems:'center' }}>
      <Svg width={88} height={88} viewBox="0 0 88 88">
        <Circle cx={cx} cy={cy} r={r} stroke="#e2e8f0" strokeWidth={7} fill="none" />
        <Circle
          cx={cx} cy={cy} r={r}
          stroke={color} strokeWidth={7} fill="none"
          strokeDasharray={`${filled} ${circ - filled}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
        />
        <G>
          <Text style={{ fontSize: 18, fontFamily:'Helvetica-Bold', color, textAnchor:'middle' }}
            x={cx} y={cy + 6}>{score}</Text>
        </G>
      </Svg>
      <Text style={{ fontSize: 7, color: C.muted, fontFamily:'Helvetica-Bold', textTransform:'uppercase', letterSpacing:0.8, marginTop:2 }}>Risk Score</Text>
    </View>
  );
}

// ─── Document ─────────────────────────────────────────────────────────────────
export interface ReportData {
  orgName:      string;
  generatedAt:  string;
  total:        number;
  critical:     number;
  high:         number;
  riskScore:    number;
  slaCompliance:number;
  avgCvss:      string;
  bySeverity:   Record<string, number>;
  byTool:       Record<string, number>;
  topCVEs:      { cveId: string | null; count: number }[];
  recentScans:  { sourceTool: string; fileName: string | null; findingCount: number; createdAt: string }[];
}

export function ExecutiveReport({ data }: { data: ReportData }) {
  const rc = riskColor(data.riskScore);
  const sevOrder = ['Critical','High','Medium','Low','Info'];
  const totalForPct = data.total || 1;

  return (
    <Document title={`PosturePilot Security Report — ${data.orgName}`} author="PosturePilot">
      <Page size="A4" style={S.page}>

        {/* ── Header ── */}
        <View style={S.header}>
          <View style={S.headerLeft}>
            <Text style={S.logoText}>PosturePilot</Text>
            <Text style={S.logoSub}>CONFIGURE · MONITOR · REPORT · SECURE</Text>
          </View>
          <View style={S.headerRight}>
            <Text style={S.reportTitle}>Executive Security Posture Report</Text>
            <Text style={S.reportDate}>{data.orgName}  ·  Generated {data.generatedAt}</Text>
          </View>
        </View>

        {/* ── KPI pill bar ── */}
        <View style={S.pillBar}>
          {[
            { label:'Total Findings', val: data.total.toLocaleString(), dot: C.blue },
            { label:'Critical',       val: data.critical.toString(),    dot: C.red },
            { label:'Risk Score',     val: `${data.riskScore}/100`,     dot: rc },
            { label:'SLA Compliance', val: `${data.slaCompliance}%`,    dot: C.green },
            { label:'Avg CVSS',       val: data.avgCvss || '—',         dot: '#ea580c' },
          ].map(p => (
            <View key={p.label} style={S.pillItem}>
              <View style={[S.pillDot, { backgroundColor: p.dot }]} />
              <Text style={S.pillLabel}>{p.label}: </Text>
              <Text style={S.pillVal}>{p.val}</Text>
            </View>
          ))}
        </View>

        <View style={S.body}>

          {/* ── Posture Overview ── */}
          <View style={S.section}>
            <Text style={S.sectionTitle}>1. Security Posture Overview</Text>
            <View style={S.cols}>

              {/* Risk ring */}
              <View style={{ width: 100, alignItems:'center', justifyContent:'center' }}>
                <RiskRing score={data.riskScore} color={rc} />
              </View>

              {/* Stat cards */}
              <View style={{ flex: 1 }}>
                <View style={S.statRow}>
                  {[
                    { label:'Total Open', value: data.total.toLocaleString(), color: C.blue,  delta:'All open findings' },
                    { label:'Critical',   value: data.critical.toString(),    color: C.red,   delta:'Needs immediate action' },
                    { label:'High',       value: data.high.toString(),        color:'#ea580c', delta:'Action within 7 days' },
                    { label:'SLA On-Track', value:`${data.slaCompliance}%`,  color: C.green, delta:'Compliance rate' },
                  ].map(s => (
                    <View key={s.label} style={S.statCard}>
                      <View style={[S.statTop, { backgroundColor: s.color }]} />
                      <Text style={S.statLabel}>{s.label}</Text>
                      <Text style={[S.statValue, { color: s.color }]}>{s.value}</Text>
                      <Text style={S.statDelta}>{s.delta}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>

          {/* ── Severity Breakdown ── */}
          <View style={S.section}>
            <Text style={S.sectionTitle}>2. Findings by Severity</Text>
            {sevOrder.map(sev => {
              const count = data.bySeverity[sev] || 0;
              const pct = Math.round((count / totalForPct) * 100);
              const cfg = SEV_CONFIG[sev];
              return (
                <View key={sev} style={S.sevRow}>
                  <Text style={S.sevLabel}>{sev}</Text>
                  <View style={S.sevBarBg}>
                    <View style={[S.sevBarFill, { width:`${pct}%`, backgroundColor: cfg.color }]} />
                  </View>
                  <Text style={[S.sevCount, { color: cfg.color }]}>{count.toLocaleString()}</Text>
                  <Text style={S.sevPct}>{pct}%</Text>
                </View>
              );
            })}
          </View>

          {/* ── Top CVEs + Source Tools ── */}
          <View style={[S.cols, S.section]}>

            {/* Top CVEs */}
            <View style={S.col}>
              <Text style={S.sectionTitle}>3. Top CVEs in Environment</Text>
              {data.topCVEs.length === 0 ? (
                <Text style={{ fontSize:8, color:C.muted }}>No CVE data available.</Text>
              ) : (
                <>
                  <View style={S.tableHeader}>
                    {['CVE ID','Occurrences','Priority'].map(h=>(
                      <Text key={h} style={[S.tableCell,{fontFamily:'Helvetica-Bold',flex: h==='Occurrences'?1:h==='Priority'?1:2}]}>{h}</Text>
                    ))}
                  </View>
                  {data.topCVEs.slice(0,8).map((c,i) => (
                    <View key={c.cveId||i} style={S.tableRow}>
                      <Text style={[S.tableCell,{flex:2,color:C.blue,fontFamily:'Helvetica-Bold',fontSize:7}]}>{c.cveId||'—'}</Text>
                      <Text style={[S.tableCell,{flex:1,textAlign:'center'}]}>{c.count}</Text>
                      <Text style={[S.badge,{flex:1,backgroundColor: i<3?'#fef2f2':i<6?'#fff7ed':'#fffbeb',color: i<3?C.red:i<6?'#ea580c':C.amber}]}>
                        {i<3?'Critical':i<6?'High':'Medium'}
                      </Text>
                    </View>
                  ))}
                </>
              )}
            </View>

            {/* Source tools */}
            <View style={S.col}>
              <Text style={S.sectionTitle}>4. Data Sources</Text>
              {Object.entries(data.byTool).map(([tool, count]) => (
                <View key={tool} style={[S.tableRow,{borderBottom:`1 solid #f1f5f9`}]}>
                  <Text style={[S.tableCell,{flex:2,fontFamily:'Helvetica-Bold',color:C.navy}]}>{tool}</Text>
                  <Text style={[S.tableCell,{flex:1,textAlign:'right'}]}>{(count as number).toLocaleString()} findings</Text>
                </View>
              ))}
              <View style={[S.infoBox,{marginTop:12}]}>
                <Text style={S.infoText}>
                  ✓  Triple-Filter Triage applied{'\n'}
                  ✓  CVSS ≥ 7.0 severity gate{'\n'}
                  ✓  CISA KEV & EPSS enrichment{'\n'}
                  ✓  Asset criticality scoring
                </Text>
              </View>
            </View>
          </View>

          {/* ── Recommendations ── */}
          <View style={S.section}>
            <Text style={S.sectionTitle}>5. Executive Recommendations</Text>
            {[
              { pri:'P1', action:`Patch ${data.critical} Critical findings immediately — breach risk is high`, color: C.red },
              { pri:'P2', action:`Schedule remediation for ${data.high} High findings within 7 days`, color:'#ea580c' },
              { pri:'P3', action:`Review SLA compliance — ${data.slaCompliance}% on-track, enforce escalation for breaches`, color: C.amber },
              { pri:'P4', action:'Enable automated API pull to keep dashboards current without manual uploads', color: C.blue },
            ].map(r => (
              <View key={r.pri} style={{ flexDirection:'row', gap:10, marginBottom:7, alignItems:'flex-start' }}>
                <Text style={[S.badge,{ backgroundColor:`${r.color}18`, color:r.color, marginTop:1 }]}>{r.pri}</Text>
                <Text style={{ fontSize:8.5, color:C.slate, flex:1, lineHeight:1.5 }}>{r.action}</Text>
              </View>
            ))}
          </View>

          {/* ── Recent Scans ── */}
          {data.recentScans.length > 0 && (
            <View style={S.section}>
              <Text style={S.sectionTitle}>6. Recent Scan Jobs</Text>
              <View style={S.tableHeader}>
                {['Tool','File','Findings','Date'].map(h=>(
                  <Text key={h} style={[S.tableCell,{fontFamily:'Helvetica-Bold',flex:1}]}>{h}</Text>
                ))}
              </View>
              {data.recentScans.slice(0,5).map((s,i) => (
                <View key={i} style={S.tableRow}>
                  <Text style={[S.tableCell,{flex:1,fontFamily:'Helvetica-Bold',color:C.navy,textTransform:'capitalize'}]}>{s.sourceTool}</Text>
                  <Text style={[S.tableCell,{flex:1,fontSize:7}]}>{s.fileName||'—'}</Text>
                  <Text style={[S.tableCell,{flex:1,fontFamily:'Helvetica-Bold'}]}>{s.findingCount.toLocaleString()}</Text>
                  <Text style={[S.tableCell,{flex:1,color:C.muted}]}>{new Date(s.createdAt).toLocaleDateString()}</Text>
                </View>
              ))}
            </View>
          )}

        </View>

        {/* ── Footer ── */}
        <View style={S.footer} fixed>
          <Text style={S.footerText}>PosturePilot · Confidential Security Report · {data.generatedAt}</Text>
          <Text style={S.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>

      </Page>
    </Document>
  );
}
