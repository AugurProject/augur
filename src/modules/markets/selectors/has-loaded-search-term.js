import { each } from 'async'

export const hasLoadedSearchTerm = (hasLoadedSearch, category, keywords, tags) => {
  const hasLoaded = {}

  each(Object.keys(hasLoadedSearch), (key) => {
    hasLoaded[key] = hasLoadedSearch[key].state
  })

  if (category && !hasLoaded[category]) hasLoaded[category] = false
  if (keywords) hasLoaded.keywords = hasLoadedSearch.keywords && hasLoadedSearch.keywords.term === keywords

  if (tags && tags.length > 0) {
    each(tags, (t) => {
      hasLoaded[t] = hasLoadedSearch[t] && hasLoadedSearch[t].state
    })
  }
  return hasLoaded
}
