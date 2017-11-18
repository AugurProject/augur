import speedomatic from 'speedomatic'
import { eachOfSeries, eachLimit } from 'async'
import { augur, constants } from 'services/augurjs'

import { invalidateMarketCreation, clearNewMarket } from 'modules/create-market/actions/update-new-market'
import { updateTradesInProgress } from 'modules/trade/actions/update-trades-in-progress'
import { placeTrade } from 'modules/trade/actions/place-trade'

import makePath from 'modules/routes/helpers/make-path'

import { BUY, SELL } from 'modules/transactions/constants/types'
import { BINARY, CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types'
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
      _endTime: parseInt(newMarket.endDate.timestamp / 1000, 10),
      _feePerEthInWei: speedomatic.fix(newMarket.settlementFee / 100, 'hex'),
      _denominationToken: contractAddresses.Cash,
      _designatedReporterAddress: loginAccount.address, // FIXME prompt user for actual automated reporter address
      _topic: newMarket.category,
      _extraInfo: {
        marketType: newMarket.type,
        description: newMarket.description,
        longDescription: newMarket.detailsText,
        resolutionSource: newMarket.expirySource,
        tags
      }
    }

    // Type Specific Properties
    let createMarket
    switch (newMarket.type) {
      case CATEGORICAL:
        formattedNewMarket._numOutcomes = newMarket.outcomes.filter(outcome => outcome !== '').length
        formattedNewMarket._extraInfo.outcomeNames = newMarket.outcomes.filter(outcome => outcome !== '')
        createMarket = augur.createMarket.createCategoricalMarket
        break
      case SCALAR:
        formattedNewMarket.minPrice = newMarket.scalarSmallNum.toString()
        formattedNewMarket.maxPrice = newMarket.scalarBigNum.toString()
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
        history.push(makePath(TRANSACTIONS))
        dispatch(clearNewMarket())
      },
      onSuccess: (res) => {
        const marketID = res.callReturn

        if (Object.keys(newMarket.orderBook).length) {
          eachOfSeries(Object.keys(newMarket.orderBook), (outcome, index, seriesCB) => {
            eachLimit(newMarket.orderBook[outcome], constants.PARALLEL_LIMIT, (order, orderCB) => {
              const outcomeID = newMarket.type === CATEGORICAL ? index : 1 // NOTE -- Both Scalar + Binary only trade against one outcome, that of outcomeID 1

              dispatch(updateTradesInProgress(marketID, outcomeID, order.type === BUY ? BUY : SELL, order.quantity, order.price, null, (tradingActions) => {
                const tradeToExecute = {
                  [outcomeID]: tradingActions
                }

                if (tradeToExecute) {
                  dispatch(placeTrade(marketID, outcomeID, tradeToExecute, null, (err) => {
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
      }
    })
  }
}
