# AI Security Posture Management (AISPM) - Implementation Plan

This document outlines the architecture, features, and interface specifications for the expanded **AI Risk Command Center** in PosturePilot, incorporating design elements and concepts from **Cisco AI Defense**, **Prisma AI Security (AIRS)**, and **Corgea**.

---

## 🛡️ Core Pillars of the AI Risk Command Center

```mermaid
graph TD
    A[AI Risk Command Center] --> B[Data Leakage Prevention (DLP)]
    A --> C[OWASP Top 10 for LLMs Vulnerability Matrix]
    A --> D[Rogue AI & Model API Key Discovery]
    A --> E[AI Policy Firewall & Remediation Center]
    
    B --> B1[PII, Credentials, & Source Code Leak Alerts]
    C --> C1[Prompt Injection & Sensitive Info Disclosure Scores]
    D --> D1[Shadow Model Registry & Compliance Ratings]
    E --> E1[Auto-Remediation Playbooks & Firewall Telemetry]
```

### 1. Data Leakage Prevention (DLP) Dashboard (Cisco AI Defense Inspired)
* **Goal**: Monitor and alert on sensitive data (PII, credentials, proprietary source code) being pasted into unauthorized or public AI systems.
* **UI Features**:
  - **Live DLP Alert Stream**: A running telemetry log displaying prompt inspection alerts in real-time.
  - **Exposed Categories Donut Chart**: Clear visualization of data leak vector distributions (Credentials, Financials, PII, Source Code).

### 2. OWASP Top 10 for LLMs Vulnerability Matrix (Prisma AIRS Inspired)
* **Goal**: Track coverage and risk profiles against specialized AI vulnerabilities (e.g., prompt injections, training data poisoning, model denial of service).
* **UI Features**:
  - **Threat Grid Scorecard**: Visual progression bars indicating remediation status and vulnerability ratings per category.
  - **Interactive Threat Profiler**: Switch between specific target models to view their dedicated OWASP risk metrics.

### 3. Rogue AI & API Key Discovery (Corgea & Prisma Inspired)
* **Goal**: Automatically catalog shadow AI model usages and detect exposed or weakly-stored AI credentials in local pipelines and codebases.
* **UI Features**:
  - **AI Compliance & Model Registry Table**: Lists active company models alongside their compliance standards (SOC2, HIPAA, GDPR).
  - **Active AI Firewall Rules Status**: Dashboard toggles to enforce/disable compliance rules on the fly (e.g., *“Enforce PII Masking”*, *“Block Free Tier Models”*).

---

## 🛠️ Proposed File Changes

### 1. [page.tsx](file:///Users/shrigo/Desktop/Apps/posturepilot/src/app/dashboard/ai-risk/page.tsx)
* Upgrade dashboard UI with a high-fidelity dark-themed cyber telemetry style.
* Add **Live DLP Telemetry Feed** with animated warning status indicators.
* Build the **OWASP LLM Threat Coverage Matrix** complete with progress meters and custom rating states.
* Implement interactive **AI Policy Firewall** rule controls that update the metrics dynamically.
* Integrate the **Model Compliance Registry** interactive data table.

### 2. [mockData.ts](file:///Users/shrigo/Desktop/Apps/posturepilot/src/app/data/mockData.ts)
* Create structured mock datasets simulating DLP leak events, compliance scores, model properties, and active firewall rule structures.

---

## 🎨 Design & Feedback Choices
* **Theme Preference**: High-fidelity dark SOC mode vs. unified clean light/indigo theme.
* **Firewall Interactions**: Fully interactive UI toggles dynamically updating dashboard risk scores in real-time.
