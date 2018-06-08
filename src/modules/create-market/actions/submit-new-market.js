import { eachOfSeries, eachLimit } from 'async'
import { augur, constants } from 'services/augurjs'

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

export function submitNewMarket(newMarket, history) {
  return (dispatch, getState) => {
    const { universe, loginAccount, contractAddresses } = getState()
    const { createMarket, formattedNewMarket } = buildCreateMarket(newMarket, false, universe, loginAccount, contractAddresses)
    const hasOrders = Object.keys(newMarket.orderBook).length
    console.log('first entrance to submit new market order')
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
              eachLimit(newMarket.orderBook[outcome], constants.PARALLEL_LIMIT, (order, orderCB) => {
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
                  onSent: noop,
                  onSuccess: (res) => {
                    orderCB()
                  },
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
        },
        onFailed: (err) => {
          console.error('ERROR create market failed:', err)

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
