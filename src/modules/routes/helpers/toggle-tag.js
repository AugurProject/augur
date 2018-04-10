import parseQuery from 'modules/routes/helpers/parse-query'
import makeQuery from 'modules/routes/helpers/make-query'
import parseStringToArray from 'modules/routes/helpers/parse-string-to-array'

import { TAGS_PARAM_NAME } from 'modules/filter-sort/constants/param-names'
import { QUERY_VALUE_DELIMITER } from 'modules/routes/constants/query-value-delimiter'

const toggleTag = (tag, location, history) => () => {
  let searchParams = parseQuery(location.search)

  if (searchParams[TAGS_PARAM_NAME] == null || !searchParams[TAGS_PARAM_NAME].length) {
    searchParams[TAGS_PARAM_NAME] = tag
    searchParams = makeQuery(searchParams)

    return history.push({
      ...location,
      search: searchParams,
    })
  }

  const tags = parseStringToArray(decodeURIComponent(searchParams[TAGS_PARAM_NAME]), QUERY_VALUE_DELIMITER)

  if (tags.indexOf(tag) !== -1) { // Remove Tag
    tags.splice(tags.indexOf(tag), 1)
  } else { // add tag
    tags.push(tag)
  }

  if (tags.length) {
    searchParams[TAGS_PARAM_NAME] = tags.join(QUERY_VALUE_DELIMITER)
  } else {
    delete searchParams[TAGS_PARAM_NAME]
  }

  searchParams = makeQuery(searchParams)

  history.push({
    ...location,
    search: searchParams,
  })
}

export default toggleTag
