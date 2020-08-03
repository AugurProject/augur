export function isFirefox(): boolean {
  const ua = window.navigator.userAgent;
  const firefox = !!ua.match(/Firefox/i);
  return firefox;
}
