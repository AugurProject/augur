import * as PARAMS from 'modules/filter-sort/constants/market-sort-params'

import getValue from 'utils/get-value'

export default function (selectedMarketParam, selectedSort, items, combinedFiltered) {
  if (selectedMarketParam == null || selectedSort == null || combinedFiltered == null) return null

  return combinedFiltered.slice().sort((a, b) => {
    switch (selectedMarketParam) {
      case PARAMS.MARKET_CREATION_TIME:
      case PARAMS.MARKET_END_DATE: {
        if (selectedSort) {
          return getValue(items, `${b}.${selectedMarketParam}.timestamp`) - getValue(items, `${a}.${selectedMarketParam}.timestamp`)
        }

        return getValue(items, `${a}.${selectedMarketParam}.timestamp`) - getValue(items, `${b}.${selectedMarketParam}.timestamp`)
      }
      case PARAMS.MARKET_VOLUME:
      case PARAMS.MARKET_TAKER_FEE:
      case PARAMS.MARKET_MAKER_FEE: {
        if (selectedSort) {
          return getValue(items, `${b}.${selectedMarketParam}.value`) - getValue(items, `${a}.${selectedMarketParam}.value`)
        }

        return getValue(items, `${a}.${selectedMarketParam}.value`) - getValue(items, `${b}.${selectedMarketParam}.value`)
      }
      default:
        return 0 // No sorting
    }
  })
}
