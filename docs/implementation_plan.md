# Implementation Plan - Sub-pixel Scroll Bleed & AWS Cloud Gateway Numbers

This plan resolves the sub-pixel scroll bleeding across all dashboards and integrates dynamic cloud-specific network numbers (AWS as default, with Azure and GCP options) in the Network Command Center.

## User Review Required

> [!IMPORTANT]
> 1. **Scroll-Bleed Seal**: We will re-enable and expand the `.sticky-alert-banner` `::before` and `::after` pseudo-masks with a generous `6px` overlap that slides *under* the Topbar. This completely blocks scrolling content from bleeding through the sub-pixel rounding gap and the right/left margins on all screen sizes.
> 2. **AWS Market-Leader Numbers**: Switching the Cloud Selector dynamically translates all network stats (open ports, threat IPS lists, VPN tunnel volumes, SIEM correlation events) to brand-authentic cloud metrics. By default, AWS (Transit Gateway) metrics load on start.

## Proposed Changes

### Stylesheets

#### [MODIFY] [globals.css](file:///Users/shrigo/Desktop/Apps/posturepilot/src/app/globals.css)
- Re-enable `.sticky-alert-banner::before` (top gap mask) and `.sticky-alert-banner::after` (right gutter mask).
- Add a `6px` vertical overlap (`top: calc(-1.25rem - 6px); height: calc(1.25rem + 6px);`) so the mask slides under the topbar.
- Add horizontal gutter margins (`right: -1.25rem`) to ensure scrolling cards don't bleed through margins.
- Add mobile responsiveness overrides for left/right viewport gutter masks (`left: -0.75rem; right: -0.75rem;`).
- Remove redundant `.topbar-wrapper::after` mask.

### Dashboard Components

#### [MODIFY] [page.tsx](file:///Users/shrigo/Desktop/Apps/posturepilot/src/app/dashboard/network/page.tsx)
- Reorganize `clientNetworkMeta` so that ACME and UR clients contain separate nested data structures for **AWS**, **Azure**, and **GCP**.
- When `cloudProvider` is swapped, dynamically transition:
  - **Open vulnerable ports count** (e.g. AWS SSH port knocks and SSM session configurations).
  - **IDS intrusion alerts** (e.g. AWS GuardDuty logs and TCP sweeps).
  - **VPN Active tunnels** (e.g. AWS Virtual Private Gateway and Palo Alto IPSec hubs).
  - **Firewall event volumes** (e.g. AWS Transit Gateway traffic Mirroring statistics).
- Integrate dynamic description details (e.g., mentioning AWS SSM, Azure Bastion, Google Identity-Aware Proxy) depending on the selected provider.
- Keep AWS as the starting default so it is immediately visible as the market leader.

## Verification Plan

### Automated Build Checks
- Run `npm run build` or Next.js compile check to verify type safety and layout integrity.

### Manual Layout & Flow Verification
1. **Gutters and Overlaps Check**: Scroll any upgraded dashboard (e.g. `/network`, `/appsec`, `/infosec`) and verify that content slides behind the topbar and subheading banner perfectly, with zero sub-pixel lines or margins leaking text.
2. **AWS Dynamic Switching Check**:
   - Select **AWS (Transit Gateway)** in the Network Command dropdown and verify stats load with high volumes (e.g. 58,940 events for UR).
   - Enforce port blocks and IPS mitigations and verify that the logs terminal prints `"AWS GuardDuty IPS Engine"` or `"AWS Palo Alto VPN Hub"`.
   - Hit **Reset Sandbox** and confirm that baseline AWS numbers restore cleanly.
