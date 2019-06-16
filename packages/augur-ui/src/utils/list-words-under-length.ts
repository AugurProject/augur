export function listWordsUnderLength(str: string, maxLength: number): Array<string> {
  const wordsList: Array<string> = [];
  let currentLength = 0;

  if (!str || !str.length) {
    return wordsList;
  }

  str
    .toString()
    .split(" ")
    .some((word: string) => {
      if (!word || !word.length) {
        return false;
      }

      currentLength += word.length;

      if (currentLength <= maxLength) {
        wordsList.push(word);
        return false;
      }
      return true;
    });

  return wordsList;
}
