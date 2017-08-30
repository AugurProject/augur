import { eachOfSeries, eachLimit } from 'async'
import { augur, constants } from 'services/augurjs'

import { invalidateMarketCreation, clearNewMarket } from 'modules/create-market/actions/update-new-market'
import { updateTradesInProgress } from 'modules/trade/actions/update-trades-in-progress'
import { placeTrade } from 'modules/trade/actions/place-trade'

import makePath from 'modules/app/helpers/make-path'

import { BUY, SELL } from 'modules/transactions/constants/types'
import { BINARY, CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types'
import { TRANSACTIONS } from 'modules/app/constants/views'

export function submitNewMarket(newMarket, history) {
  return (dispatch, getState) => {
    const { branch, loginAccount, contractAddresses } = getState()

    // General Properties
    const formattedNewMarket = {
      _branch: branch.id,
      _endTime: parseInt(newMarket.endDate.timestamp / 1000, 10),
      settlementFee: (newMarket.settlementFee / 100).toString(),
      _denominationToken: contractAddresses.Cash,
      _automatedReporterAddress: loginAccount.address, // FIXME prompt user for actual automated reporter address
      _topic: newMarket.topic,
      _extraInfo: {
        description: newMarket.description,
        longDescription: newMarket.detailsText,
        resolution: newMarket.expirySource,
        tags: (newMarket.keywords || [])
      }
    }

    // Type Specific Properties
    let createMarket
    switch (newMarket.type) {
      case CATEGORICAL:
        formattedNewMarket._minDisplayPrice = '0'
        formattedNewMarket._maxDisplayPrice = '1'
        formattedNewMarket._numOutcomes = newMarket.outcomes.length
        formattedNewMarket._extraInfo.outcomeNames = newMarket.outcomes
        createMarket = augur.createMarket.createCategoricalMarket
        break
      case SCALAR:
        formattedNewMarket._minDisplayPrice = newMarket.scalarSmallNum.toString()
        formattedNewMarket._maxDisplayPrice = newMarket.scalarBigNum.toString()
        formattedNewMarket._numOutcomes = 2
        createMarket = augur.createMarket.createScalarMarket
        break
      case BINARY:
      default:
        formattedNewMarket._minDisplayPrice = '0'
        formattedNewMarket._maxDisplayPrice = '1'
        formattedNewMarket._numOutcomes = 2
        createMarket = augur.createMarket.createCategoricalMarket
    }

    createMarket({
      ...formattedNewMarket,
      _signer: loginAccount.privateKey,
      onSent: (res) => {
        history.push(makePath(TRANSACTIONS))
        dispatch(clearNewMarket())
      },
      onSuccess: (res) => {
        const marketID = res.callReturn
        if (Object.keys(newMarket.orderBook).length) {
          eachOfSeries(Object.keys(newMarket.orderBook), (outcome, index, seriesCB) => {
            eachLimit(newMarket.orderBook[outcome], constants.PARALLEL_LIMIT, (order, orderCB) => {
              const outcomeID = newMarket.type === CATEGORICAL ? index + 1 : 2 // NOTE -- Both Scalar + Binary only trade against one outcome, that of outcomeID 2

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
        console.error('ERROR createSingleEventMarket failed:', err)

        dispatch(invalidateMarketCreation(err.message))
      }
    })
  }
}
