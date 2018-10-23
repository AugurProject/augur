export default function() {
  if (typeof window === "undefined") return false;
  if (!window) return false;
  if (!window.ethereum) return false;
  return true;
}
