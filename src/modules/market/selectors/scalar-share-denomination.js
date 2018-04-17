import store from 'src/store'
import { updateScalarMarketShareDenomination } from 'modules/market/actions/update-scalar-market-share-denomination'

import { SHARE, MILLI_SHARE, MICRO_SHARE } from 'modules/market/constants/share-denominations'

export default function () {
  const { scalarMarketsShareDenomination } = store.getState()

  return {
    denominations,
    markets: scalarMarketsShareDenomination,
    updateSelectedShareDenomination: selectShareDenomination,
  }
}

const denominations = [
  {
    label: 'Shares',
    value: SHARE,
  },
  {
    label: 'mShares',
    value: MILLI_SHARE,
  },
  {
    label: 'μShares',
    value: MICRO_SHARE,
  },
]

function selectShareDenomination(marketId, denomination) {
  store.dispatch(updateScalarMarketShareDenomination(marketId, denomination))
}
