import store from 'src/store';

import { updateSelectedPageNum } from 'modules/markets/actions/update-selected-page-num';

import { makeLocation } from 'utils/parse-url';

import { PAGE_PARAM_NAME, TOPIC_PARAM_NAME } from 'modules/link/constants/param-names';

export default function () {
  const { pagination, selectedTopic } = store.getState();
  const { marketsTotals } = require('../../../selectors');

  if (!pagination || !marketsTotals.numUnpaginated) {
    return {};
  }

  function makeLink(page, topic, o) {
    const params = {};

    if (page) params[PAGE_PARAM_NAME] = page;
    if (topic) params[TOPIC_PARAM_NAME] = topic;

    const href = makeLocation(params).url;

    return {
      href,
      onClick: () => { o.onUpdateSelectedPageNum(page, href); }
    };
  }

  const o = {
    numUnpaginated: marketsTotals.numUnpaginated,
    selectedPageNum: pagination.selectedPageNum,
    numPerPage: pagination.numPerPage,
    numPages: Math.ceil(marketsTotals.numUnpaginated / pagination.numPerPage),
    startItemNum: ((pagination.selectedPageNum - 1) * pagination.numPerPage) + 1,
    endItemNum: Math.min(pagination.selectedPageNum * pagination.numPerPage,
      marketsTotals.numUnpaginated),
    onUpdateSelectedPageNum: (pageNum, href) => store.dispatch(updateSelectedPageNum(pageNum, href))
  };

  if (marketsTotals.numUnpaginated > o.numPerPage) {
    o.nextPageNum = o.selectedPageNum < o.numPages ? o.selectedPageNum + 1 : undefined;
    o.previousPageNum = o.selectedPageNum >= 2 ? o.selectedPageNum - 1 : undefined;

    o.nextItemNum = o.selectedPageNum < o.numPages ? o.endItemNum + 1 : undefined;
    o.previousItemNum = o.selectedPageNum >= 2 ? o.startItemNum - o.numPerPage : undefined;

    o.nextPageLink = o.nextPageNum ? makeLink(o.nextPageNum, selectedTopic, o) : null;
    o.previousPageLink = o.previousPageNum ? makeLink(o.previousPageNum, selectedTopic, o) : null;
  }

  return o;
}
