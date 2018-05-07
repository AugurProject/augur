import { eachOfSeries, eachLimit } from 'async'
import { constants } from 'services/augurjs'

import { invalidateMarketCreation, clearNewMarket } from 'modules/create-market/actions/update-new-market'
import { updateTradesInProgress } from 'modules/trade/actions/update-trades-in-progress'
import { placeTrade } from 'modules/trade/actions/place-trade'
import { addNewMarketCreationTransactions } from 'modules/transactions/actions/add-transactions'

import makePath from 'modules/routes/helpers/make-path'

import { BUY, SELL, BID } from 'modules/transactions/constants/types'
import { CATEGORICAL } from 'modules/markets/constants/market-types'
import { TRANSACTIONS } from 'modules/routes/constants/views'
import { buildCreateMarket } from 'modules/create-market/helpers/build-create-market'

export function submitNewMarket(newMarket, history) {
  return (dispatch, getState) => {
    const { universe, loginAccount, contractAddresses } = getState()
    const { createMarket, formattedNewMarket } = buildCreateMarket(newMarket, false, universe, loginAccount, contractAddresses)

    createMarket({
      ...formattedNewMarket,
      meta: loginAccount.meta,
      onSent: (res) => {
        dispatch(addNewMarketCreationTransactions({ ...formattedNewMarket, ...res }))
        history.push(makePath(TRANSACTIONS))
        dispatch(clearNewMarket())
      },
      onSuccess: (res) => {
        const marketId = res.callReturn

        if (Object.keys(newMarket.orderBook).length) {
          eachOfSeries(Object.keys(newMarket.orderBook), (outcome, index, seriesCB) => {
            eachLimit(newMarket.orderBook[outcome], constants.PARALLEL_LIMIT, (order, orderCB) => {
              const outcomeId = newMarket.type === CATEGORICAL ? index : 1 // NOTE -- Both Scalar + Binary only trade against one outcome, that of outcomeId 1
              dispatch(updateTradesInProgress(marketId, outcomeId, order.type === BID ? BUY : SELL, order.quantity, order.price, null, (err, tradingActions) => {
                const tradeToExecute = {
                  [outcomeId]: tradingActions,
                }

                if (tradeToExecute) {
                  dispatch(placeTrade(marketId, outcomeId, tradeToExecute[outcomeId], null, (err) => {
                    if (err) return console.error('ERROR: ', err)

                    orderCB()
                  }))
                }
              }))
            }, (err) => {
              if (err !== null) return console.error('ERROR: ', err)

              seriesCB()
            })
          }, (err) => {
            if (err !== null) console.error('ERROR: ', err)
          })
        }
      },
      onFailed: (err) => {
        console.error('ERROR create market failed:', err)

        dispatch(invalidateMarketCreation(err.message))
      },
    })
  }
}
