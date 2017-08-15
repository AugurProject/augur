import parseQuery from 'modules/app/helpers/parse-query';
import parseStringToArray from 'modules/app/helpers/parse-string-to-array';

import { TAGS_PARAM_NAME } from 'modules/app/constants/param-names';

export default function filterByTags(location, items) {
  const selectedTags = parseQuery(location.search)[TAGS_PARAM_NAME];

  if (selectedTags == null || !selectedTags.length) return null;

  const tagsArray = parseStringToArray(decodeURIComponent(selectedTags));

  const filteredItems = items.reduce((p, item, i) => {
    if (
      tagsArray.every(filterTag =>
        item.tags.some(tag => tag.toLowerCase().indexOf(filterTag.toLowerCase()) !== -1)
      )
    ) {
      return [...p, i];
    }

    return p;
  }, []);

  return filteredItems;
}
