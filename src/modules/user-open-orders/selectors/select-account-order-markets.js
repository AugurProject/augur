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
    console.log(loginAccountAddress)
    console.log(orderBooks)
    if (loginAccountAddress == null || orderBooks == null || Object.keys(orderBooks).length === 0) {
      return []
    }

    return Object.keys(orderBooks)
      .filter(marketID => Object.keys(orderBooks[marketID])
        .filter(outcome => Object.keys(orderBooks[marketID][outcome])
          .filter(type => Object.keys(orderBooks[marketID][outcome][type])
            .filter(hash => orderBooks[marketID][outcome][type][hash].owner === loginAccountAddress))))
  }
)
