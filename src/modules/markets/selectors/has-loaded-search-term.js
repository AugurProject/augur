import { each } from 'async'

export const hasLoadedSearchTerm = (hasLoadedSearch, category, keywords, tags) => {
  const MIN_KEYWORDS_LENGTH = 3

  const hasLoaded = {}

  if (!hasLoadedSearch.search || !hasLoadedSearch.search.terms || !hasLoadedSearch.search.terms.length === 0) return hasLoaded

  const keywordSearch = keywords && keywords.length > MIN_KEYWORDS_LENGTH ? keywords : undefined
  const terms = [];
  [category, ...tags, keywordSearch].forEach((i) => {
    if (i) terms.push(i)
  })

  if (hasLoadedSearch.search.terms.length !== terms.length) return hasLoaded

  if (category && !hasLoadedSearch.search.terms.includes(category)) return hasLoaded
  if (keywords && keywords.length > MIN_KEYWORDS_LENGTH && !hasLoadedSearch.search.terms.includes(keywords)) return hasLoaded

  if (tags && tags.length > 0) {
    const notFound = each(tags, (t) => {
      if (!hasLoadedSearch.search.terms.includes(t)) return true
    })
    if (notFound) return hasLoaded
  }

  hasLoaded.search = true
  return hasLoaded
}
