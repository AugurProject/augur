export function listWordsUnderLength(str, maxLength) {
  const wordsList = []
  let currentLength = 0

  if (!str || !str.length) {
    return wordsList
  }

  str.toString().split(' ').some((word) => {
    const cleanWord = word.replace(/[^a-zA-Z0-9-]/ig, '')

    if (!cleanWord || !cleanWord.length) {
      return false
    }

    currentLength += cleanWord.length

    if (currentLength <= maxLength) {
      wordsList.push(cleanWord)
      return false
    }
    return true
  })

  return wordsList
}
