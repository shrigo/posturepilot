// Bare layout for the /admin section — no sidebar, no topbar, no dashboard chrome.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
