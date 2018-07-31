export function listWordsUnderLength(str, maxLength) {
  const wordsList = []
  let currentLength = 0

  if (!str || !str.length) {
    return wordsList
  }

  str.toString().split(' ').some((word) => {
    if (!word || !word.length) {
      return false
    }

    currentLength += word.length

    if (currentLength <= maxLength) {
      wordsList.push(word)
      return false
    }
    return true
  })

  return wordsList
}
