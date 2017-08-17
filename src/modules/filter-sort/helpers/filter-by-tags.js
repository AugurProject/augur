import parseQuery from 'modules/app/helpers/parse-query';
import parseStringToArray from 'modules/app/helpers/parse-string-to-array';

import { TAGS_PARAM_NAME } from 'modules/app/constants/param-names';

export default function filterByTags(location, items) {
  // NOTE -- tag filtering is case sensitive

  const selectedTags = parseQuery(location.search)[TAGS_PARAM_NAME];

  if (selectedTags == null || !selectedTags.length) return null;

  const tagsArray = parseStringToArray(decodeURIComponent(selectedTags));

  const filteredItems = items.reduce((p, item, i) => {
    if (
      tagsArray.every(filterTag =>
        item.tags.some(tag => tag.indexOf(filterTag) !== -1)
      )
    ) {
      return [...p, i];
    }

    return p;
  }, []);

  return filteredItems;
}

// NOTE -- ref
// import { createSelector } from 'reselect';
// import store from 'src/store';
// import { selectSelectedTagsState } from 'src/select-state';
// import getAllMarkets from 'modules/markets/selectors/markets-all';
//
// export default function () {
//   return selectTags(store.getState());
// }
//
// export const selectTags = createSelector(
//   getAllMarkets,
//   selectSelectedTagsState,
//   (markets, selectedTags) => {
//     const tagCounts = {};
//
//     // console.log('selectedTags -- ', selectedTags);
//
//     // console.log('markets -- ', markets);
//
//     // count matches for each filter and tag
//     markets.forEach((market) => {
//       market.tags.forEach((tag) => {
//         tagCounts[tag] = tagCounts[tag] || 0;
//         tagCounts[tag] += 1;
//       });
//     });
//
//     // make sure all selected tags are displayed, even if markets haven't loaded yet
//     Object.keys(selectedTags).forEach((selectedTag) => {
//       if (!tagCounts[selectedTag]) {
//         tagCounts[selectedTag] = 0;
//       }
//     });
//
//     // console.log('tag counts -- ', tagCounts);
//
//     const tags = Object.keys(tagCounts)
//       .filter(tag => tagCounts[tag] > 0 || !!selectedTags[tag])
//       .sort((a, b) => (tagCounts[b] - tagCounts[a]) || (a < b ? -1 : 1))
//       .slice(0, 50)
//       .map((tag) => {
//         // console.log('mapped tag -- ', tag);
//         const obj = {
//           name: tag,
//           value: tag,
//           numMatched: tagCounts[tag],
//           isSelected: !!selectedTags[tag]
//         };
//         return obj;
//       });
//
//     return tags;
//   }
// );
