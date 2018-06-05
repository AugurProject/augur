import { listWordsUnderLength } from 'utils/list-words-under-length'

export default function parseMarketTitle(description) {
  const words = listWordsUnderLength(description, 100)

  const title = words.reduce(
    (prev, word, i) => (
      prev.length < 40 && i < words.length ?
        `${prev} ${word}` :
        prev),
    '',
  )

  return title.length > 40 ?
    `${title.substring(0, 40).trim()}...` :
    `${title.trim()}`
}
