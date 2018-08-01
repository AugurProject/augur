export const buildSearchString = (keywords, tags) => {
  const MIN_KEYWORDS_LENGTH = 3

  const keywordSearch = keywords && keywords.length > MIN_KEYWORDS_LENGTH ? keywords : undefined
  const terms = [];
  [...tags, keywordSearch].forEach((i) => {
    if (i) terms.push(i)
  })

  const search = (terms && terms.length > 1) ? terms.join(' OR ').trim(' OR ') : terms[0]

  return search
}
