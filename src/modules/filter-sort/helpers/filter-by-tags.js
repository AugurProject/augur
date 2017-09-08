import parseQuery from 'modules/routes/helpers/parse-query'
import parseStringToArray from 'modules/routes/helpers/parse-string-to-array'

import { TAGS_PARAM_NAME } from 'modules/routes/constants/param-names'

export default function filterByTags(location, items) {
  // NOTE -- tag filtering is case sensitive

  const selectedTags = parseQuery(location.search)[TAGS_PARAM_NAME]

  if (selectedTags == null || !selectedTags.length) return null

  const tagsArray = parseStringToArray(decodeURIComponent(selectedTags), '+')

  const filteredItems = items.reduce((p, item, i) => {
    if (tagsArray.every(filterTag => item.tags.some(tag => tag.indexOf(filterTag) !== -1))) return [...p, i]

    return p
  }, [])

  return filteredItems
}
