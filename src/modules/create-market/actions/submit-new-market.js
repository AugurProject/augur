import speedomatic from 'speedomatic'
import { eachOfSeries, eachLimit } from 'async'
import { augur, constants } from 'services/augurjs'

import { invalidateMarketCreation, clearNewMarket } from 'modules/create-market/actions/update-new-market'
import { updateTradesInProgress } from 'modules/trade/actions/update-trades-in-progress'
import { placeTrade } from 'modules/trade/actions/place-trade'
import { addNewMarketCreationTransactions } from 'modules/transactions/actions/add-transactions'

import makePath from 'modules/routes/helpers/make-path'

import { BUY, SELL } from 'modules/transactions/constants/types'
import { BINARY, CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types'
import { DESIGNATED_REPORTER_SELF } from 'modules/create-market/constants/new-market-constraints'
import { TRANSACTIONS } from 'modules/routes/constants/views'

export function submitNewMarket(newMarket, history) {
  return (dispatch, getState) => {
    const { universe, loginAccount, contractAddresses } = getState()
    const tags = []
    if (newMarket.tag1) tags.push(newMarket.tag1)
    if (newMarket.tag2) tags.push(newMarket.tag2)
    // General Properties
    const formattedNewMarket = {
      universe: universe.id,
      _endTime: parseInt(newMarket.endDate.timestamp, 10),
      _feePerEthInWei: speedomatic.fix(newMarket.settlementFee / 100, 'hex'),
      _denominationToken: contractAddresses.Cash,
      _description: newMarket.description,
      _designatedReporterAddress: newMarket.designatedReporterType === DESIGNATED_REPORTER_SELF ? loginAccount.address : newMarket.designatedReporterAddress,
      _topic: newMarket.category,
      _extraInfo: {
        marketType: newMarket.type,
        longDescription: newMarket.detailsText,
        resolutionSource: newMarket.expirySource,
        tags,
      },
    }

    // Type Specific Properties
    let createMarket
    switch (newMarket.type) {
      case CATEGORICAL:
        formattedNewMarket._outcomes = newMarket.outcomes.filter(outcome => outcome !== '')
        createMarket = augur.createMarket.createCategoricalMarket
        break
      case SCALAR:
        formattedNewMarket.tickSize = newMarket.tickSize
        formattedNewMarket._minPrice = newMarket.scalarSmallNum.toString()
        formattedNewMarket._maxPrice = newMarket.scalarBigNum.toString()
        formattedNewMarket._extraInfo._scalarDenomination = newMarket.scalarDenomination
        createMarket = augur.createMarket.createScalarMarket
        break
      case BINARY:
      default:
        createMarket = augur.createMarket.createBinaryMarket
    }
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

              dispatch(updateTradesInProgress(marketId, outcomeId, order.type === BUY ? BUY : SELL, order.quantity, order.price, null, (tradingActions) => {
                const tradeToExecute = {
                  [outcomeId]: tradingActions,
                }

                if (tradeToExecute) {
                  dispatch(placeTrade(marketId, outcomeId, tradeToExecute, null, (err) => {
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
