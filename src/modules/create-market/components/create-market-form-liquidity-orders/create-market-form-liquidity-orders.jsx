import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
// import { BigNumber, createBigNumber } from 'utils/create-big-number'
import { CATEGORICAL, SCALAR, YES_NO } from 'modules/markets/constants/market-types'
import { formatEther, formatShares } from 'utils/format-number'
import { BID, ASK } from 'modules/transactions/constants/types'

import StylesForm from 'modules/create-market/components/create-market-form/create-market-form.styles'
import Styles from 'modules/create-market/components/create-market-form-liquidity-orders/create-market-form-liquidity-orders.styles'

const CreateMarketLiquidityOrders = (props) => {
  const {
    newMarket,
    liquidityState,
    removeOrderFromNewMarket,
  } = props
  const defaultOutcome = newMarket.type !== CATEGORICAL ? 1 : ''
  const selectedOutcome = liquidityState && liquidityState.selectedOutcome ? liquidityState.selectedOutcome : defaultOutcome
  const outcomeOrders = newMarket.orderBook[selectedOutcome]
  const isNullState = !(outcomeOrders && outcomeOrders.length)
  let outcomeLabel = newMarket.type === YES_NO ? 'Yes' : selectedOutcome

  return (
    <div className={StylesForm['CreateMarketForm__form-outer-wrapper']}>
      <div className={StylesForm['CreateMarketForm__form-inner-wrapper']}>
        <h1 className={Styles.LiquidityOrders__Header}>Initial Liquidity Orders</h1>
        { isNullState &&
          <div className={Styles.LiquidityOrders__NullState}>
            It appears you have not created any orders for this outcome. You will be able to view and cancel your orders here once you have created some.
          </div>
        }
        { !isNullState &&
          <div className={Styles.LiquidityOrders__TableWrapper}>
            <ul className={Styles.LiquidityOrders__TableHeader}>
              <li>Order Type</li>
              <li>Outcome</li>
              <li>Quantity</li>
              <li>Limit Price</li>
              <li>EST. ETH</li>
              <li>Action</li>
            </ul>
            <div className={Styles['LiquidityOrders__table-body']}>
              { outcomeOrders.map((order, index) => {
                const direction = order.type === BID ? '' : '-'
                outcomeLabel = newMarket.type === SCALAR ? formatEther(order.price).formattedValue : outcomeLabel
                return (
                  <ul
                    key={`${selectedOutcome}-${order.type}-${order.price.toFixed()}`}
                    className={classNames(Styles.LiquidityOrders__Order, {
                      [`${Styles.positive}`]: order.type === BID,
                      [`${Styles.negative}`]: order.type === ASK,
                    })}
                  >
                    <li>{order.type}</li>
                    <li>{outcomeLabel}</li>
                    <li>{`${direction}${formatShares(order.quantity).full}`}</li>
                    <li>{formatEther(order.price).full}</li>
                    <li>{formatEther(order.orderEstimate).full}</li>
                    <li>
                      <button
                        onClick={e => removeOrderFromNewMarket({
                          outcome: selectedOutcome,
                          index,
                        })}
                      >Cancel
                      </button>
                    </li>
                  </ul>
                )
              })
              }
            </div>
          </div>
        }
      </div>
    </div>
  )
}

CreateMarketLiquidityOrders.propTypes = {
  newMarket: PropTypes.object.isRequired,
  liquidityState: PropTypes.object.isRequired,
  removeOrderFromNewMarket: PropTypes.func.isRequired,
}

export default CreateMarketLiquidityOrders
