import { eachOfSeries, eachLimit } from 'async'
import { augur, constants } from 'services/augurjs'

import { invalidateMarketCreation, clearNewMarket } from 'modules/create-market/actions/update-new-market'
import { updateTradesInProgress } from 'modules/trade/actions/update-trades-in-progress'
import { placeTrade } from 'modules/trade/actions/place-trade'

import makePath from 'modules/routes/helpers/make-path'

import { BID } from 'modules/transactions/constants/types'
import { BUY, SELL } from 'modules/trade/constants/types'
import { BINARY, CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types'
import { CATEGORICAL_OUTCOMES_SEPARATOR, CATEGORICAL_OUTCOME_SEPARATOR } from 'modules/markets/constants/market-outcomes'
import { TRANSACTIONS } from 'modules/routes/constants/views'

export function submitNewMarket(newMarket, history) {
  return (dispatch, getState) => {
    const { branch, loginAccount } = getState()

    // General Properties
    const formattedNewMarket = {
      branch: branch.id,
      description: newMarket.description,
      expDate: newMarket.endDate.timestamp / 1000,
      resolution: newMarket.expirySource,
      takerFee: newMarket.takerFee / 100,
      makerFee: newMarket.makerFee / 100,
      extraInfo: newMarket.detailsText,
      tags: [
        newMarket.category,
        newMarket.tag1,
        newMarket.tag2
      ]
    }

    // Type Specific Properties
    switch (newMarket.type) {
      case CATEGORICAL:
        formattedNewMarket.minValue = 1
        formattedNewMarket.maxValue = newMarket.outcomes.length
        formattedNewMarket.numOutcomes = newMarket.outcomes.length
        formattedNewMarket.description = newMarket.description + CATEGORICAL_OUTCOMES_SEPARATOR + newMarket.outcomes.map(outcome => outcome).join(CATEGORICAL_OUTCOME_SEPARATOR)
        break
      case SCALAR:
        formattedNewMarket.minValue = newMarket.scalarSmallNum
        formattedNewMarket.maxValue = newMarket.scalarBigNum
        formattedNewMarket.numOutcomes = 2
        break
      case BINARY:
      default:
        formattedNewMarket.minValue = 1
        formattedNewMarket.maxValue = 2
        formattedNewMarket.numOutcomes = 2
    }

    augur.create.createSingleEventMarket({
      ...formattedNewMarket,
      _signer: loginAccount.privateKey,
      onSent: (res) => {
        history.push(makePath(TRANSACTIONS))
        dispatch(clearNewMarket())
      },
      onSuccess: (res) => {
        if (Object.keys(newMarket.orderBook).length) {
          eachOfSeries(Object.keys(newMarket.orderBook), (outcome, index, seriesCB) => {
            eachLimit(newMarket.orderBook[outcome], constants.PARALLEL_LIMIT, (order, orderCB) => {
              const outcomeID = newMarket.type === CATEGORICAL ? index + 1 : 2 // NOTE -- Both Scalar + Binary only trade against one outcome, that of outcomeID 2

              dispatch(updateTradesInProgress(res.callReturn, outcomeID, order.type === BID ? BUY : SELL, order.quantity, order.price, null, (tradingActions) => {
                const tradeToExecute = {
                  [outcomeID]: tradingActions
                }

                if (tradeToExecute) {
                  dispatch(placeTrade(res.callReturn, outcomeID, tradeToExecute, null, (err) => {
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
        console.error('ERROR createSingleEventMarket failed:', err)

        dispatch(invalidateMarketCreation(err.message))
      }
    })
  }
}
