export default function trimString(string) {
  if (string == null) return null;
  return `${string.substring(0, 4)}...`;
}
