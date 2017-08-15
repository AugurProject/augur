export default function parseStringToArray(words) {
  const cleanWords = cleanString(words).toLowerCase();
  return cleanWords ? cleanWords.split(' ') : [];
}

function cleanString(words) {
  return (words || '').replace(/\s+/g, ' ').trim();
}
