import { selectLoginAccountAddress, selectOrderBooksState } from 'src/select-state'
import { createSelector } from 'reselect'
import store from 'src/store'

export default function () {
  return selectAllUserOpenOrderMarkets(store.getState())
}

export const selectAllUserOpenOrderMarkets = createSelector(
  selectLoginAccountAddress,
  selectOrderBooksState,
  (loginAccountAddress, orderBooks) => {
    if (loginAccountAddress == null || orderBooks == null || Object.keys(orderBooks).length === 0) {
      return []
    }

    return Object.keys(orderBooks)
      .filter(marketId => Object.keys(orderBooks[marketId])
        .filter(outcome => Object.keys(orderBooks[marketId][outcome])
          .filter(type => Object.keys(orderBooks[marketId][outcome][type])
            .filter(hash => orderBooks[marketId][outcome][type][hash].owner === loginAccountAddress))))
  },
)
