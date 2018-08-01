import { augur, constants } from 'services/augurjs'
import { parallel } from 'async'
import {
  MARKET_CREATION_TIME,
  MARKET_END_DATE,
  MARKET_RECENTLY_TRADED,
  MARKET_FEE,
} from 'modules/filter-sort/constants/market-sort-params'
import {
  MARKET_REPORTING,
  MARKET_CLOSED,
} from 'modules/filter-sort/constants/market-states'

const { REPORTING_STATE } = constants

export const loadMarketsByFilter = (filterOptions, cb = () => {}) => (dispatch, getState) => {
  const { universe } = getState()
  const filter = []
  const sort = {}
  const parallelParams = {}
  switch (filterOptions.sort) {
    case (MARKET_RECENTLY_TRADED): {
      // Sort By Recently Traded:
      // defaults for now...
      sort.sortBy = 'lastTradeTime'
      sort.isSortDescending = true
      break
    }
    case (MARKET_END_DATE): {
      // Sort By End Date (soonest first):
      sort.sortBy = 'endTime'
      sort.isSortDescending = false
      break
    }
    case (MARKET_CREATION_TIME): {
      // Sort By Creation Date (most recent first):
      sort.sortBy = 'creationBlockNumber'
      sort.isSortDescending = true
      break
    }
    case (MARKET_FEE): {
      // Sort By Fee (lowest first):
      sort.sortBy = 'marketCreatorFeeRate'
      sort.isSortDescending = false
      break
    }
    default: {
      // Sort By Volume:
      // leave defaults
      break
    }
  }

  const params = { universe: universe.id, search: filterOptions.search, ...sort }
  switch (filterOptions.filter) {
    case (MARKET_REPORTING): {
      // reporting markets only:
      filter.push(REPORTING_STATE.DESIGNATED_REPORTING)
      filter.push(REPORTING_STATE.OPEN_REPORTING)
      filter.push(REPORTING_STATE.CROWDSOURCING_DISPUTE)
      filter.push(REPORTING_STATE.AWAITING_NEXT_WINDOW)
      filter.forEach((filterType) => {
        parallelParams[filterType] = next => augur.markets.getMarkets({ ...params, reportingState: filterType }, next)
      })
      break
    }
    case (MARKET_CLOSED): {
      // resolved markets only:
      filter.push(REPORTING_STATE.AWAITING_FINALIZATION)
      filter.push(REPORTING_STATE.FINALIZED)
      filter.forEach((filterType) => {
        parallelParams[filterType] = next => augur.markets.getMarkets({ ...params, reportingState: filterType }, next)
      })
      break
    }
    default: {
      // open markets only:
      filter.push(REPORTING_STATE.PRE_REPORTING)
      filter.forEach((filterType) => {
        parallelParams[filterType] = next => augur.markets.getMarkets({ ...params, reportingState: filterType }, next)
      })
      break
    }
  }
  parallel(parallelParams, (err, filteredMarkets) => {
    let finalizedMarketList = []
    if (err) return cb(err)
    filter.forEach((filterType) => {
      if (filteredMarkets[filterType] && filteredMarkets[filterType].length > 0) {
        finalizedMarketList = finalizedMarketList.concat(filteredMarkets[filterType])
      }
    })
    return cb(null, finalizedMarketList)
  })
}
