export const buildSearchString = (category, keywords, tags) => {
  const MIN_KEYWORDS_LENGTH = 3

  const keywordSearch = keywords && keywords.length > MIN_KEYWORDS_LENGTH ? keywords : undefined
  const terms = [];
  [category, ...tags, keywordSearch].forEach((i) => {
    if (i) terms.push(i)
  })

  const search = (terms && terms.length > 1) ? terms.join(' AND ').trim(' AND ') : terms[0]

  return search
}
