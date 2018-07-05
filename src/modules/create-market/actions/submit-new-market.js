import { eachOfSeries, eachLimit } from 'async'
import { augur } from 'services/augurjs'

import { invalidateMarketCreation, clearNewMarket } from 'modules/create-market/actions/update-new-market'
import { addNewMarketCreationTransactions } from 'modules/transactions/actions/add-transactions'
import { ZERO } from 'modules/trade/constants/numbers'
import { MODAL_ACCOUNT_APPROVAL } from 'modules/modal/constants/modal-types'
import makePath from 'modules/routes/helpers/make-path'
import noop from 'utils/noop'
import { createBigNumber } from 'utils/create-big-number'
import { updateModal } from 'modules/modal/actions/update-modal'
import { BID } from 'modules/transactions/constants/types'
import { CATEGORICAL } from 'modules/markets/constants/market-types'
import { TRANSACTIONS } from 'modules/routes/constants/views'
import { buildCreateMarket } from 'modules/create-market/helpers/build-create-market'
import { sortOrders } from 'modules/create-market/helpers/liquidity'

export function submitNewMarket(newMarket, history, callback = noop) {
  return (dispatch, getState) => {
    const { universe, loginAccount, contractAddresses } = getState()
    const { createMarket, formattedNewMarket } = buildCreateMarket(newMarket, false, universe, loginAccount, contractAddresses)
    const hasOrders = Object.keys(newMarket.orderBook).length
    console.log('first entrance to submit new market order')
    newMarket.orderBook = sortOrders(newMarket.orderBook)

    dispatch(getHasApproval(hasOrders, (err) => {
      if (err) return console.error('ERROR: ', err)
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

          if (hasOrders) {
            eachOfSeries(Object.keys(newMarket.orderBook), (outcome, index, seriesCB) => {
              // Set the limit for simultaneous async calls to 1 so orders will have to be signed in order, one at a time.
              // (This is done so the gas cost doesn't increase as orders are created, due to having to traverse the
              // order book and insert each order in the appropriate spot.)
              eachLimit(newMarket.orderBook[outcome], 1, (order, orderCB) => {
                const outcomeId = newMarket.type === CATEGORICAL ? index : 1 // NOTE -- Both Scalar + Binary only trade against one outcome, that of outcomeId 1
                const orderType = order.type === BID ? 0 : 1
                const numTicks = formattedNewMarket.tickSize ? (newMarket.scalarBigNum - newMarket.scalarSmallNum) / newMarket.tickSize : augur.constants.DEFAULT_NUM_TICKS[2]
                const tradeCost = augur.trading.calculateTradeCost({
                  displayPrice: order.price,
                  displayAmount: order.quantity,
                  sharesProvided: '0',
                  numTicks,
                  orderType,
                  minDisplayPrice: newMarket.scalarSmallNum || 0,
                  maxDisplayPrice: newMarket.scalarBigNum || 1,
                })
                const { onChainAmount, onChainPrice, cost } = tradeCost
                augur.api.CreateOrder.publicCreateOrder({
                  meta: loginAccount.meta,
                  tx: { value: augur.utils.convertBigNumberToHexString(cost) },
                  _type: orderType,
                  _attoshares: augur.utils.convertBigNumberToHexString(onChainAmount),
                  _displayPrice: augur.utils.convertBigNumberToHexString(onChainPrice),
                  _market: marketId,
                  _outcome: outcomeId,
                  _tradeGroupId: augur.trading.generateTradeGroupId(),
                  onSent: (res) => {
                    orderCB()
                  },
                  onSuccess: noop,
                  onFailed: (err) => {
                    console.error('ERROR creating order in initial market liquidity: ', err)
                    orderCB()
                  },
                })
              }, (err) => {
                if (err !== null) console.error('ERROR: ', err)
                seriesCB()
              })
            }, (err) => {
              if (err !== null) console.error('ERROR: ', err)
            })
          }
          if (callback) callback(null, marketId)
        },
        onFailed: (err) => {
          console.error('ERROR create market failed:', err)
          callback(err)
          dispatch(invalidateMarketCreation(err.message))
        },
      })
    }))
  }
}

function getHasApproval(hasOrders, callback) {
  return (dispatch, getState) => {
    const { loginAccount } = getState()
    if (hasOrders && createBigNumber(loginAccount.allowance).lte(ZERO)) {
      dispatch(updateModal({
        type: MODAL_ACCOUNT_APPROVAL,
        continueDefault: true,
        approveOnSent: noop,
        approveCallback: (err, res) => {
          if (err) return callback(err)
          callback(null)
        },
      }))
    } else {
      callback(null)
    }
  }
}
