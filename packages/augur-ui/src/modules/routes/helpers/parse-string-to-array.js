export default function parseStringToArray(words, delimiter) {
  const cleanWords = cleanString(words);
  return cleanWords ? cleanWords.split(delimiter || " ") : [];
}

function cleanString(words) {
  return (words || "").replace(/\s+/g, " ").trim();
}
