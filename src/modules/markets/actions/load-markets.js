import { augur, constants } from "services/augurjs";
import logError from "utils/log-error";
import { parallel } from "async";
import {
  MARKET_CREATION_TIME,
  MARKET_END_DATE,
  MARKET_RECENTLY_TRADED,
  MARKET_FEE,
  MARKET_OPEN_INTEREST
} from "modules/filter-sort/constants/market-sort-params";
import {
  MARKET_REPORTING,
  MARKET_CLOSED
} from "modules/filter-sort/constants/market-states";
import { updateMarketsData } from "modules/markets/actions/update-markets-data";
import {
  updateAppStatus,
  HAS_LOADED_MARKETS
} from "modules/app/actions/update-app-status";

const { REPORTING_STATE } = constants;

// NOTE -- We ONLY load the market ids during this step.
// From here we populate the marketsData
export const loadMarkets = (type, callback = logError) => (
  dispatch,
  getState
) => {
  const { universe } = getState();
  const params = { universe: universe.id };

  augur.markets.getMarkets(params, (err, marketsArray) => {
    if (err) return callback(err);

    const marketsData = marketsArray.reduce(
      (p, id) => ({
        ...p,
        [id]: { id }
      }),
      {}
    );

    dispatch(updateAppStatus(HAS_LOADED_MARKETS, true));
    dispatch(updateMarketsData(marketsData));
    callback(null, marketsArray);
  });
};

// NOTE -- We ONLY load the market ids during this step.
export const loadUserMarkets = (callback = logError) => (
  dispatch,
  getState
) => {
  const { universe, loginAccount } = getState();

  augur.markets.getMarkets(
    { universe: universe.id, creator: loginAccount.address },
    (err, marketsArray) => {
      if (err || !marketsArray) return callback(err);

      const marketsData = marketsArray.reduce(
        (p, id) => ({
          ...p,
          [id]: { id, author: loginAccount.address }
        }),
        {}
      );
      dispatch(updateMarketsData(marketsData));
      callback(null, marketsArray);
    }
  );
};

export const loadMarketsByFilter = (filterOptions, cb = () => {}) => (
  dispatch,
  getState
) => {
  const { universe } = getState();
  const filter = [];
  const sort = {};
  const parallelParams = {};
  switch (filterOptions.sort) {
    case MARKET_RECENTLY_TRADED: {
      // Sort By Recently Traded:
      sort.sortBy = "lastTradeTime";
      sort.isSortDescending = true;
      break;
    }
    case MARKET_END_DATE: {
      // Sort By End Date (soonest first):
      sort.sortBy = "endTime";
      sort.isSortDescending = false;
      break;
    }
    case MARKET_CREATION_TIME: {
      // Sort By Creation Date (most recent first):
      sort.sortBy = "creationBlockNumber";
      sort.isSortDescending = true;
      break;
    }
    case MARKET_FEE: {
      // Sort By Fee (lowest first):
      sort.sortBy = "marketCreatorFeeRate";
      sort.isSortDescending = false;
      break;
    }
    case MARKET_OPEN_INTEREST: {
      sort.sortBy = "openInterest";
      sort.isSortDescending = true;
      break;
    }
    default: {
      // Sort By Volume:
      // leave defaults
      break;
    }
  }

  dispatch(updateAppStatus(HAS_LOADED_MARKETS, false));

  const params = {
    universe: universe.id,
    category: filterOptions.category,
    search: filterOptions.search,
    maxFee: parseFloat(filterOptions.maxFee),
    ...sort
  };
  switch (filterOptions.filter) {
    case MARKET_REPORTING: {
      // reporting markets only:
      filter.push(REPORTING_STATE.DESIGNATED_REPORTING);
      filter.push(REPORTING_STATE.OPEN_REPORTING);
      filter.push(REPORTING_STATE.CROWDSOURCING_DISPUTE);
      filter.push(REPORTING_STATE.AWAITING_NEXT_WINDOW);
      filter.forEach(filterType => {
        parallelParams[filterType] = next =>
          augur.markets.getMarkets(
            { ...params, reportingState: filterType },
            next
          );
      });
      break;
    }
    case MARKET_CLOSED: {
      // resolved markets only:
      filter.push(REPORTING_STATE.AWAITING_FINALIZATION);
      filter.push(REPORTING_STATE.FINALIZED);
      filter.forEach(filterType => {
        parallelParams[filterType] = next =>
          augur.markets.getMarkets(
            { ...params, reportingState: filterType },
            next
          );
      });
      break;
    }
    default: {
      // open markets only:
      filter.push(REPORTING_STATE.PRE_REPORTING);
      filter.forEach(filterType => {
        parallelParams[filterType] = next =>
          augur.markets.getMarkets(
            { ...params, reportingState: filterType },
            next
          );
      });
      break;
    }
  }
  parallel(parallelParams, (err, filteredMarkets) => {
    let finalizedMarketList = [];
    if (err) return cb(err);
    filter.forEach(filterType => {
      if (
        filteredMarkets[filterType] &&
        filteredMarkets[filterType].length > 0
      ) {
        finalizedMarketList = finalizedMarketList.concat(
          filteredMarkets[filterType]
        );
      }
    });

    setTimeout(() => {
      dispatch(updateAppStatus(HAS_LOADED_MARKETS, true));
    }, 2000);
    return cb(null, finalizedMarketList);
  });
};
