export type Php2ShellStatus = 'vulnerable' | 'eol' | 'patched' | 'remediated' | 'mitigated';

export interface Php2ShellFinding {
  id: string;
  asset: string;
  path: string;
  kind: 'Dockerfile' | 'composer.json' | 'Image digest' | 'php.ini' | 'CI pin' | 'Running worker';
  version: string;
  sapi: 'mod_php' | 'PHP-FPM' | 'php-cgi' | 'FrankenPHP' | 'LiteSpeed';
  internetFacing: boolean;
  hidden: boolean;
  hiddenReason: string;
  status: Php2ShellStatus;
  evidence: string;
  fix: string;
}

export const PHP2SHELL_CVES = [
  {
    id: 'CVE-2026-109618',
    title: 'Partial request cleanup after an out-of-memory interrupt',
    cvss: '9.2',
    scoreSystem: 'CVSS v4.0',
    kev: true,
    summary:
      'An out-of-memory failure can interrupt PHP while internal request data is only partly initialized. Request cleanup may then treat that invalid data as valid. Unauthenticated remote code execution against any PHP process serving web traffic.',
  },
  {
    id: 'CVE-2026-109619',
    title: 'Stale request state reused by a later worker request',
    cvss: '9.2',
    scoreSystem: 'CVSS v4.0',
    kev: true,
    summary:
      'Request-owned internal state can remain after its backing memory is freed. A later request handled by the same worker may use that stale state before normal initialization resets it. Same impact: unauthenticated remote code execution.',
  },
] as const;

export const PATCHED_RELEASES = [
  { branch: '8.5', version: '8.5.12' },
  { branch: '8.4', version: '8.4.27' },
  { branch: '8.3', version: '8.3.36' },
  { branch: '8.2', version: '8.2.35' },
] as const;

export const INTERIM_CONTROLS = [
  'Upgrade is the only complete fix. Interim settings reduce specific paths and do not replace a patched runtime.',
  'If a system cannot be upgraded now, take internet-facing PHP offline or place it behind network authentication.',
  'A web application firewall can reduce exposure. It does not close the flaw, especially on Apache mod_php, where the issue can be hit before application code runs.',
  'PHP 8.1 and earlier are end of life. The PHP project is not shipping binary fixes for those branches. Move them to 8.2.35 or newer.',
  'After any upgrade or config change, restart every PHP worker and confirm the version from a live web request, not only the CLI or the image tag.',
  'Published interim profile, until the binary is patched: memory_limit=-1 where applications cannot override it, session.upload_progress.enabled=0, and on PHP 8.5 fatal_error_backtraces=0.',
] as const;

const wells: Php2ShellFinding[] = [
  {
    id: 'WF-01',
    asset: 'payments-portal',
    path: 'deploy/Dockerfile',
    kind: 'Dockerfile',
    version: '8.3.11',
    sapi: 'mod_php',
    internetFacing: true,
    hidden: false,
    hiddenReason: '',
    status: 'vulnerable',
    evidence: 'FROM php:8.3.11-apache',
    fix: 'Rebuild on php:8.3.36-fpm (or 8.4.27 / 8.5.12), leave mod_php, and recycle every Apache worker before returning the service to the internet.',
  },
  {
    id: 'WF-02',
    asset: 'intranet-cms',
    path: 'charts/wordpress/values.yaml',
    kind: 'Image digest',
    version: '8.1.31',
    sapi: 'mod_php',
    internetFacing: false,
    hidden: true,
    hiddenReason: 'The application repo has no composer.json or Dockerfile. PHP is pinned inside the official WordPress image, so a normal dependency scan never sees it.',
    status: 'eol',
    evidence: 'image: wordpress:6.6-php8.1-apache',
    fix: 'Move the chart to a WordPress image built on PHP 8.2.35 or newer. PHP 8.1 has no upstream binary fix.',
  },
  {
    id: 'WF-03',
    asset: 'swift-docs',
    path: 'composer.json',
    kind: 'composer.json',
    version: '8.2.28',
    sapi: 'PHP-FPM',
    internetFacing: true,
    hidden: false,
    hiddenReason: '',
    status: 'vulnerable',
    evidence: '"php": ">=8.2.0 <8.3.0"  → lock resolves 8.2.28',
    fix: 'Raise the platform constraint to >=8.2.35 and redeploy the FPM pool. 8.2.28 is below the fixed release.',
  },
  {
    id: 'WF-04',
    asset: 'legacy-crm',
    path: 'appliance/lamp-marketplace',
    kind: 'Image digest',
    version: '7.4.33',
    sapi: 'mod_php',
    internetFacing: true,
    hidden: true,
    hiddenReason: 'Marketplace LAMP appliance. The Helm tag reads php-lts, but the image digest still unpacks PHP 7.4.',
    status: 'eol',
    evidence: 'digest sha256:9c1e… → php -v inside the image reports 7.4.33',
    fix: 'Replace the appliance image. Do not leave PHP 7.4 on an internet-facing host.',
  },
  {
    id: 'WF-05',
    asset: 'mortgage-api',
    path: 'fpm-pool/www.conf',
    kind: 'Running worker',
    version: '8.4.27',
    sapi: 'PHP-FPM',
    internetFacing: true,
    hidden: false,
    hiddenReason: '',
    status: 'patched',
    evidence: 'Live phpinfo() on the pool matches the image tag 8.4.27',
    fix: 'No PHP2Shell action. Keep the pool on 8.4.27 or later.',
  },
];

const toyota: Php2ShellFinding[] = [
  {
    id: 'TY-01',
    asset: 'supplier-portal',
    path: 'docker/php/Dockerfile',
    kind: 'Dockerfile',
    version: '8.3.30',
    sapi: 'PHP-FPM',
    internetFacing: true,
    hidden: false,
    hiddenReason: '',
    status: 'vulnerable',
    evidence: 'FROM php:8.3.30-fpm',
    fix: 'Rebuild on php:8.3.36-fpm or newer and roll the supplier-portal deployment.',
  },
  {
    id: 'TY-02',
    asset: 'dealer-cms',
    path: 'images/drupal/Dockerfile',
    kind: 'Image digest',
    version: '8.1.29',
    sapi: 'PHP-FPM',
    internetFacing: true,
    hidden: true,
    hiddenReason: 'Drupal base image carries PHP. The dealer theme repo only contains Twig and YAML, so AppSec SCA reports a clean tree.',
    status: 'eol',
    evidence: 'FROM drupal:10.3-php8.1',
    fix: 'Retarget the image to a Drupal build on PHP 8.2.35 or newer and take the current site off the internet until that roll completes.',
  },
  {
    id: 'TY-03',
    asset: 'plant-docs',
    path: '.github/workflows/docs.yml',
    kind: 'CI pin',
    version: '8.4.27',
    sapi: 'PHP-FPM',
    internetFacing: false,
    hidden: false,
    hiddenReason: '',
    status: 'patched',
    evidence: 'shivammathur/setup-php@v2 with php-version: 8.4.27',
    fix: 'No PHP2Shell action.',
  },
];

const ur: Php2ShellFinding[] = [
  {
    id: 'UR-01',
    asset: 'rental-portal',
    path: 'deploy/Dockerfile',
    kind: 'Dockerfile',
    version: '8.3.36',
    sapi: 'PHP-FPM',
    internetFacing: true,
    hidden: false,
    hiddenReason: '',
    status: 'patched',
    evidence: 'FROM php:8.3.36-fpm',
    fix: 'No PHP2Shell action. Confirm workers were restarted after the image roll.',
  },
  {
    id: 'UR-02',
    asset: 'marketing-site',
    path: 'helm/wordpress/values.yaml',
    kind: 'Image digest',
    version: '8.1.30',
    sapi: 'mod_php',
    internetFacing: true,
    hidden: true,
    hiddenReason: 'Marketing WordPress is owned by the agency repo. The rental-portal scan does not include this chart.',
    status: 'eol',
    evidence: 'image: wordpress:6.5-php8.1-apache',
    fix: 'Replace the image with a build on PHP 8.2.35 or newer, or take the site offline until that image exists.',
  },
];

const cisco: Php2ShellFinding[] = [
  {
    id: 'CS-01',
    asset: 'docs-site',
    path: 'Dockerfile',
    kind: 'Dockerfile',
    version: '8.3.36',
    sapi: 'PHP-FPM',
    internetFacing: true,
    hidden: false,
    hiddenReason: '',
    status: 'patched',
    evidence: 'FROM php:8.3.36-fpm-bookworm',
    fix: 'No PHP2Shell action.',
  },
  {
    id: 'CS-02',
    asset: 'partner-portal',
    path: 'marketplace/lamp/image.lock',
    kind: 'Image digest',
    version: '8.2.34',
    sapi: 'mod_php',
    internetFacing: true,
    hidden: true,
    hiddenReason: 'Chart tag is php-8.2. The locked marketplace digest is still 8.2.34, one release below the fix.',
    status: 'vulnerable',
    evidence: 'tag php-8.2 → digest resolves to 8.2.34',
    fix: 'Repin the digest to an image that actually contains PHP 8.2.35 or newer, then restart Apache.',
  },
  {
    id: 'CS-03',
    asset: 'status-page',
    path: 'runtime/phpinfo-probe',
    kind: 'Running worker',
    version: '8.5.12',
    sapi: 'FrankenPHP',
    internetFacing: true,
    hidden: false,
    hiddenReason: '',
    status: 'patched',
    evidence: 'Live worker banner: PHP/8.5.12',
    fix: 'No PHP2Shell action.',
  },
];

const disney: Php2ShellFinding[] = [
  {
    id: 'WD-01',
    asset: 'cms-render',
    path: 'platform/Dockerfile',
    kind: 'Dockerfile',
    version: '8.3.11',
    sapi: 'mod_php',
    internetFacing: true,
    hidden: false,
    hiddenReason: '',
    status: 'vulnerable',
    evidence: 'FROM php:8.3.11-apache',
    fix: 'Rebuild on a patched 8.3, 8.4, or 8.5 image and restart Apache. mod_php on this host is internet-facing.',
  },
  {
    id: 'WD-02',
    asset: 'tickets',
    path: 'composer.lock',
    kind: 'composer.json',
    version: '8.2.26',
    sapi: 'PHP-FPM',
    internetFacing: true,
    hidden: false,
    hiddenReason: '',
    status: 'vulnerable',
    evidence: '"platform": { "php": "8.2.26" }',
    fix: 'Bump platform.php to 8.2.35 or newer and roll the FPM deployment.',
  },
  {
    id: 'WD-03',
    asset: 'shop-magento',
    path: 'images/magento/Dockerfile',
    kind: 'Image digest',
    version: '8.1.27',
    sapi: 'PHP-FPM',
    internetFacing: true,
    hidden: true,
    hiddenReason: 'Magento project image vendors PHP 8.1. The storefront repo scan only sees PHP packages inside vendor/, not the interpreter.',
    status: 'eol',
    evidence: 'FROM magento/magento-cloud-docker-php:8.1-fpm',
    fix: 'Upgrade the Magento runtime image to PHP 8.2.35 or newer. 8.1 will not receive a binary patch.',
  },
  {
    id: 'WD-04',
    asset: 'streaming-meta',
    path: 'services/meta/Dockerfile',
    kind: 'Dockerfile',
    version: '8.4.27',
    sapi: 'PHP-FPM',
    internetFacing: false,
    hidden: false,
    hiddenReason: '',
    status: 'patched',
    evidence: 'FROM php:8.4.27-fpm',
    fix: 'No PHP2Shell action.',
  },
];

export const php2shellInventories: Record<string, Php2ShellFinding[]> = {
  WELLS: wells,
  TOYOTA: toyota,
  UR: ur,
  CISCO: cisco,
  DISNEY: disney,
};

export function isOpenStatus(status: Php2ShellStatus) {
  return status === 'vulnerable' || status === 'eol';
}

export function php2shellSummary(clientKey: string) {
  const findings = php2shellInventories[clientKey] ?? wells;
  const open = findings.filter(f => isOpenStatus(f.status)).length;
  const hidden = findings.filter(f => f.hidden && isOpenStatus(f.status)).length;
  const total = findings.length;
  return {
    open,
    hidden,
    total,
    progress: Math.round(((total - open) / total) * 100),
  };
}
