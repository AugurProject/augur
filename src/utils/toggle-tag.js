import parseQuery from 'modules/routes/helpers/parse-query'
import makeQuery from 'modules/routes/helpers/make-query'
import parseStringToArray from 'modules/routes/helpers/parse-string-to-array'

import { TAGS_PARAM_NAME } from 'modules/filter-sort/constants/param-names'

export default function (tag, location, history) {
  let searchParams = parseQuery(location.search)

  if (searchParams[TAGS_PARAM_NAME] == null || !searchParams[TAGS_PARAM_NAME].length) {
    searchParams[TAGS_PARAM_NAME] = tag
    searchParams = makeQuery(searchParams)

    return history.push({
      ...location,
      search: searchParams
    })
  }

  const tags = parseStringToArray(decodeURIComponent(searchParams[TAGS_PARAM_NAME]), '')

  if (tags.indexOf(tag) !== -1) { // Remove Tag
    tags.splice(tags.indexOf(tag), 1)
  } else { // add tag
    tags.push(tag)
  }

  if (tags.length) {
    searchParams[TAGS_PARAM_NAME] = tags.join('')
  } else {
    delete searchParams[TAGS_PARAM_NAME]
  }

  searchParams = makeQuery(searchParams)

  history.push({
    ...location,
    search: searchParams
  })
}
