export function isGoogleBot(): boolean {
  return /bot|googlebot/i.test(navigator.userAgent);
}
