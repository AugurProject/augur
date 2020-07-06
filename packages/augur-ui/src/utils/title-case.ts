const titleCase = (str) => {
  if (!str) return str;
  return str.toLowerCase().split(' ').map((word) => {
    return word.replace(word[0], word[0].toUpperCase());
  }).join(' ');
}

export default titleCase;
