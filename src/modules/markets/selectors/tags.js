import { createSelector } from 'reselect';
import store from 'src/store';
import { selectSelectedTagsState } from 'src/select-state';
import { selectFilteredMarkets } from '../../markets/selectors/markets-filtered';
import { toggleTag } from '../../markets/actions/toggle-tag';

export default function () {
  return selectTags(store.getState());
}

export const selectTags = createSelector(
  selectFilteredMarkets,
  selectSelectedTagsState,
  (markets, selectedTags) => {
    const tagCounts = {};

    // count matches for each filter and tag
    markets.forEach((market) => {
      market.tags.forEach((tag) => {
        tagCounts[tag.name] = tagCounts[tag.name] || 0;
        tagCounts[tag.name] += 1;
      });
    });

    // make sure all selected tags are displayed, even if markets haven't loaded yet
    Object.keys(selectedTags).forEach((selectedTag) => {
      if (!tagCounts[selectedTag]) {
        tagCounts[selectedTag] = 0;
      }
    });

    const tags = Object.keys(tagCounts)
      .filter(tag => tagCounts[tag] > 0 || !!selectedTags[tag])
      .sort((a, b) => (tagCounts[b] - tagCounts[a]) || (a < b ? -1 : 1))
      .slice(0, 50)
      .map((tag) => {
        const obj = {
          name: tag,
          value: tag,
          numMatched: tagCounts[tag],
          isSelected: !!selectedTags[tag],
          onClick: () => store.dispatch(toggleTag(tag))
        };
        return obj;
      });

    return tags;
  }
);
