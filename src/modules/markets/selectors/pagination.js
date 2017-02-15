import store from 'src/store';

import { updateSelectedPageNum } from 'modules/markets/actions/update-selected-page-num';

import { makeLocation, parseURL } from 'utils/parse-url';

export default function () {
  const { pagination } = store.getState();
  const { marketsTotals } = require('src/selectors');

  if (!pagination || !marketsTotals.numUnpaginated) {
    return {};
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

    o.nextPageLink = o.nextPageNum ? makePaginationLink(o.nextPageNum, o) : null;
    o.previousPageLink = o.previousPageNum ? makePaginationLink(o.previousPageNum, o) : null;
  }

  return o;
}

export function makePaginationLink(page, o) {
  const { links } = require('src/selectors');

  const parsedMarketsURL = parseURL(links.marketsLink.href);

  parsedMarketsURL.searchParams.page = page;

  const href = makeLocation(parsedMarketsURL.searchParams).url;

  return {
    href,
    onClick: () => { o.onUpdateSelectedPageNum(page, href); }
  };
}
