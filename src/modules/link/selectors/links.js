// NOTE --  I'm working on a way to refine the site view component linking to be more elegant that what we currently have below.
//          Planning to do a rework during CH #2478, since pagination will be getting slightly reworked for markets at that point,
//          leaving an opportune time to take a deeper look at these as well.
//          Largest motivation being the relatively recent implementation of react-redux, which in large part removes the necessity for these.
//          In the market link we've also conflated what would probably be better suited for the component with the ideal duties
//          of the link selectors, which generally should just be to handle routing to the next view.

import memoize from 'memoizee';

import store from 'src/store';

import { loginWithAirbitz } from 'modules/auth/actions/login-with-airbitz';

import { updateURL } from 'modules/link/actions/update-url';
import { logout } from 'modules/auth/actions/logout';

import { loadFullLoginAccountMarkets } from 'modules/portfolio/actions/load-full-login-account-markets';
import { updateSelectedMarketsHeader } from 'modules/markets/actions/update-selected-markets-header';

import {
  ACCOUNT,
  M,
  MARKETS,
  CREATE_MARKET,
  MY_POSITIONS,
  MY_MARKETS,
  MY_REPORTS,
  TRANSACTIONS,
  AUTHENTICATION,
  // ACCOUNT_DETAILS,
  // ACCOUNT_DEPOSIT,
  // ACCOUNT_CONVERT,
  // ACCOUNT_WITHDRAW
} from 'modules/app/constants/views';
import { FAVORITES, PENDING_REPORTS } from 'modules/markets/constants/markets-subset';

import { SEARCH_PARAM_NAME, FILTER_SORT_TYPE_PARAM_NAME, FILTER_SORT_SORT_PARAM_NAME, FILTER_SORT_ISDESC_PARAM_NAME, PAGE_PARAM_NAME, TAGS_PARAM_NAME, TOPIC_PARAM_NAME, SUBSET_PARAM_NAME } from 'modules/link/constants/param-names';
import { FILTER_SORT_TYPE, FILTER_SORT_SORT, FILTER_SORT_ISDESC } from 'modules/markets/constants/filter-sort';

import { listWordsUnderLength } from 'utils/list-words-under-length';
import { makeLocation } from 'utils/parse-url';

export default function () {
  const { keywords, selectedFilterSort, selectedTags, selectedTopic, pagination, loginAccount, auth } = store.getState();
  const { market } = require('../../../selectors');
  return {
    authLink: selectAuthLink(auth.selectedAuthType, !!loginAccount.address, store.dispatch),
    createMarketLink: selectCreateMarketLink(store.dispatch),
    marketsLink: selectMarketsLink(keywords, selectedFilterSort, selectedTags, pagination.selectedPageNum, null, selectedTopic, store.dispatch),
    allMarketsLink: selectMarketsLink(keywords, selectedFilterSort, selectedTags, pagination.selectedPageNum, null, null, store.dispatch),
    favoritesLink: selectMarketsLink(keywords, selectedFilterSort, selectedTags, pagination.selectedPageNum, FAVORITES, null, store.dispatch),
    pendingReportsLink: selectMarketsLink(keywords, selectedFilterSort, selectedTags, pagination.selectedPageNum, PENDING_REPORTS, null, store.dispatch),
    transactionsLink: selectTransactionsLink(store.dispatch),
    marketLink: selectMarketLink(market, store.dispatch),
    previousLink: selectPreviousLink(store.dispatch),
    accountLink: selectAccountLink(store.dispatch),
    myPositionsLink: selectMyPositionsLink(store.dispatch),
    myMarketsLink: selectMyMarketsLink(store.dispatch),
    myReportsLink: selectMyReportsLink(store.dispatch),
    topicsLink: selectTopicsLink(store.dispatch)
  };
  // NOTE -- pagination links are a special case.  Reference the pagination selector for how those work.
}

export const selectAccountLink = memoize((dispatch) => {
  const href = makeLocation({ page: ACCOUNT }).url;
  return {
    href,
    onClick: () => dispatch(updateURL(href))
  };
}, { max: 1 });

export const selectPreviousLink = memoize((dispatch) => {
  const href = makeLocation({ page: MARKETS }).url;
  return {
    href,
    onClick: () => dispatch(updateURL(href))
  };
}, { max: 1 });

export const selectAuthLink = memoize((authType, alsoLogout, dispatch) => {
  const determineLocation = () => makeLocation({ page: AUTHENTICATION }).url;

  const href = determineLocation();

  return {
    href,
    onClick: () => {
      if (alsoLogout) {
        dispatch(logout());
      }

      dispatch(updateURL(href));
    }
  };
}, { max: 1 });

export const selectAirbitzLink = memoize((authType, dispatch) => ({
  onClick: () => {
    require('../../../selectors').abc.openLoginWindow((result, airbitzAccount) => {
      if (airbitzAccount) {
        dispatch(loginWithAirbitz(airbitzAccount));
      } else {
        console.log('error registering in: ' + result);
      }
    });
  }
}), { max: 1 });

export const selectAirbitzOnLoad = memoize(dispatch => ({
  onLoad: () => {
    const abcContext = require('../../../selectors').abc.abcContext;
    const usernames = abcContext.listUsernames();
    if (usernames.length > 0) {
      require('../../../selectors').abc.openLoginWindow((result, airbitzAccount) => {
        if (airbitzAccount) {
          dispatch(loginWithAirbitz(airbitzAccount));
        } else {
          console.log('error registering in: ' + result);
        }
      });
    }
  }
}), { max: 1 });

export const selectMarketsLink = memoize((keywords, selectedFilterSort, selectedTags, selectedPageNum, subSet, selectedTopic, dispatch) => {
  const params = {};

  // page
  params.page = MARKETS;

  // search
  if (keywords != null && keywords.length > 0) {
    params[SEARCH_PARAM_NAME] = keywords;
  }

  // filter + sort
  if (selectedFilterSort.type !== FILTER_SORT_TYPE) {
    params[FILTER_SORT_TYPE_PARAM_NAME] = `${selectedFilterSort.type}`;
  }
  if (selectedFilterSort.sort !== FILTER_SORT_SORT) {
    params[FILTER_SORT_SORT_PARAM_NAME] = `${selectedFilterSort.sort}`;
  }
  if (selectedFilterSort.isDesc !== FILTER_SORT_ISDESC) {
    params[FILTER_SORT_ISDESC_PARAM_NAME] = `${selectedFilterSort.isDesc}`;
  }

  // pagination
  if (selectedPageNum > 1) {
    params[PAGE_PARAM_NAME] = selectedPageNum;
  }

  // tags
  const tagsParams = Object.keys(selectedTags).filter(tag => !!selectedTags[tag]).join(',');
  if (tagsParams.length) {
    params[TAGS_PARAM_NAME] = tagsParams;
  }

  // Topic
  if (selectedTopic) {
    params[TOPIC_PARAM_NAME] = selectedTopic;
  }

  // Subset
  switch (subSet) {
    case (FAVORITES):
      params[SUBSET_PARAM_NAME] = FAVORITES;
      break;
    case (PENDING_REPORTS):
      params[SUBSET_PARAM_NAME] = PENDING_REPORTS;
      break;
    default:
      break;
  }

  const href = makeLocation(params).url;

  return {
    href,
    onClick: (allMarkets) => {
      dispatch(updateURL(href));
    }
  };
}, { max: 1 });

export const selectMarketLink = memoize((market, dispatch) => {
  const words = listWordsUnderLength(market.description, 300).map(word => encodeURIComponent(word)).join('_') + '_' + market.id;
  const href = makeLocation({ page: M, m: words }).url;
  const link = {
    href,
    onClick: () => {
      dispatch(updateURL(href));
    }
  };

  if (market.isReported) {
    link.text = 'Reported';
    link.className = 'reported';
  } else if (market.isMissedReport) {
    link.text = 'Missed Report';
    link.className = 'missed-report';
  } else if (market.isPendingReport) {
    link.text = 'Report';
    link.className = 'report';
  } else if (!market.isOpen) {
    link.text = 'View';
    link.className = 'view';
  } else {
    link.text = 'Trade';
    link.className = 'trade';
  }

  return link;
}, { max: 1 });

export const selectTransactionsLink = memoize((dispatch) => {
  const href = makeLocation({ page: TRANSACTIONS }).url;
  return {
    href,
    onClick: () => dispatch(updateURL(href))
  };
}, { max: 1 });

export const selectCreateMarketLink = memoize((dispatch) => {
  const href = makeLocation({ page: CREATE_MARKET }).url;
  return {
    href,
    onClick: () => dispatch(updateURL(href))
  };
}, { max: 1 });

export const selectMyPositionsLink = memoize((dispatch) => {
  const href = makeLocation({ page: MY_POSITIONS }).url;
  return {
    href,
    onClick: () => dispatch(updateURL(href))
  };
}, { max: 1 });

export const selectMyMarketsLink = memoize((dispatch) => {
  const href = makeLocation({ page: MY_MARKETS }).url;
  return {
    href,
    onClick: () => {
      dispatch(loadFullLoginAccountMarkets());
      dispatch(updateURL(href));
    }
  };
}, { max: 1 });

export const selectMyReportsLink = memoize((dispatch) => {
  const href = makeLocation({ page: MY_REPORTS }).url;
  return {
    href,
    onClick: () => {
      dispatch(updateURL(href));
    }
  };
}, { max: 1 });

export const selectTopicsLink = memoize((dispatch) => {
  const href = makeLocation({}).url;
  return {
    href,
    onClick: () => {
      dispatch(updateURL(href));
    }
  };
}, { max: 1 });

export const selectTopicLink = memoize((topic, dispatch) => {
  const href = makeLocation({
    page: MARKETS,
    [TOPIC_PARAM_NAME]: topic
  }).url;

  return {
    href,
    onClick: () => {
      dispatch(updateSelectedMarketsHeader(topic));
      dispatch(updateURL(href));
    }
  };
}, { max: 1 });
