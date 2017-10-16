/* eslint react/no-array-index-key: 0 */  // due to potential for dup orders

import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import BigNumber from 'bignumber.js'
// import Highcharts from 'highcharts'
// import classNames from 'classnames'

import { BINARY, CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types'

import { CreateMarketEdit } from 'modules/common/components/icons/icons'

import CreateMarketPreviewRange from 'modules/create-market/components/create-market-preview-range/create-market-preview-range'
import CreateMarketPreviewCategorical from 'modules/create-market/components/create-market-preview-categorical/create-market-preview-categorical'

// import { EXPIRY_SOURCE_GENERIC, EXPIRY_SOURCE_SPECIFIC } from 'modules/create-market/constants/new-market-constraints'
// import newMarketCreationOrder from 'modules/create-market/constants/new-market-creation-order'
// import {
//   NEW_MARKET_DESCRIPTION,
//   NEW_MARKET_OUTCOMES,
//   NEW_MARKET_EXPIRY_SOURCE,
//   NEW_MARKET_END_DATE,
//   NEW_MARKET_DETAILS,
//   NEW_MARKET_TOPIC,
//   NEW_MARKET_KEYWORDS,
//   NEW_MARKET_FEES,
//   NEW_MARKET_ORDER_BOOK,
//   NEW_MARKET_REVIEW
// } from 'modules/create-market/constants/new-market-creation-steps'
// import { BINARY, CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types'
// import { BID, ASK } from 'modules/transactions/constants/types'

// import getValue from 'utils/get-value'
// import debounce from 'utils/debounce'

import Styles from 'modules/create-market/components/create-market-preview/create-market-preview.styles'

export default class CreateMarketPreview extends Component {

  static propTypes = {
    newMarket: PropTypes.object.isRequired,
  }

  static getExpirationDate(p) {
    if (!Object.keys(p.newMarket.endDate).length) {
      return '-'
    }

    const endDate = moment(p.newMarket.endDate.timestamp)
    endDate.set({
      hour: p.newMarket.hour,
      minute: p.newMarket.minute,
    })

    if (p.newMarket.meridiem === 'AM' && endDate.hours() >= 12) {
      endDate.hours(endDate.hours() - 12)
    } else if (p.newMarket.meridiem === 'PM' && endDate.hours() < 12) {
      endDate.hours(endDate.hours() + 12)
    }

    return endDate.format('MMM D, YYYY h:mm a')
  }

  static calculateShares(orderBook) {
    let totalShares = new BigNumber(0)
    if (Object.keys(orderBook).length) {
      Object.keys(orderBook).forEach((option) => {
        orderBook[option].forEach((order) => {
          totalShares = totalShares.plus(order.quantity)
        })
      })
      return `${totalShares} Shares`
    }
    return '- Shares'
  }

  constructor(props) {
    super(props)

    this.state = {
      expirationDate: CreateMarketPreview.getExpirationDate(props),
      shares: CreateMarketPreview.calculateShares(this.props.newMarket.orderBook),
    }

    CreateMarketPreview.getExpirationDate = CreateMarketPreview.getExpirationDate.bind(this)
    CreateMarketPreview.calculateShares = CreateMarketPreview.calculateShares.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.newMarket.endDate !== nextProps.newMarket.endDate ||
        this.props.newMarket.hour !== nextProps.newMarket.hour ||
        this.props.newMarket.minute !== nextProps.newMarket.minute ||
        this.props.newMarket.meridiem !== nextProps.newMarket.meridiem) {
      this.setState({ expirationDate: CreateMarketPreview.getExpirationDate(nextProps) })
    }
    if (this.props.newMarket.orderBook !== nextProps.newMarket.orderBook) {
      this.setState({ shares: CreateMarketPreview.calculateShares(nextProps.newMarket.orderBook) })
    }
  }

  render() {
    const p = this.props
    const s = this.state

    return (
      <article className={Styles.CreateMarketPreview}>
        <div className={Styles.CreateMarketPreview__header}>
          <div className={Styles['CreateMarketPreview__header-wrapper']}>
            <div className={Styles.CreateMarketPreview__tags}>
              <ul>
                <li>Categories</li>
                <li>{p.newMarket.category}</li>
              </ul>
              <div
                className={classNames('prop-container create-market-description', {
                  'is-editing': newMarketCreationOrder[newMarket.currentStep] === NEW_MARKET_DESCRIPTION,
                  'is-null': !newMarket.description,
                  'has-value': !!newMarket.description
                })}
              >
                <button
                  className="unstyled"
                  onClick={() => p.updateNewMarket({ currentStep: newMarketCreationOrder.indexOf(NEW_MARKET_DESCRIPTION) })}
                >
                  <span className="null-mask" />
                  <span className="prop-value">{newMarket.description || '\u00a0'}</span>
                </button>
              </div>
              <span
                className={classNames('prop-container create-market-expiry-source', {
                  'is-editing': newMarketCreationOrder[newMarket.currentStep] === NEW_MARKET_EXPIRY_SOURCE,
                  'is-null': !newMarket.expirySource && (newMarket.expirySourceType === EXPIRY_SOURCE_SPECIFIC || !newMarket.expirySourceType),
                  'has-value': newMarket.expirySourceType === EXPIRY_SOURCE_GENERIC || (newMarket.expirySourceType === EXPIRY_SOURCE_SPECIFIC && !!newMarket.expirySource)
                })}
              >
                <button
                  className="unstyled"
                  onClick={() => p.updateNewMarket({ currentStep: newMarketCreationOrder.indexOf(NEW_MARKET_EXPIRY_SOURCE) })}
                >
                  <span className="null-mask" />
                  <span className="prop-value">
                    {newMarket.expirySourceType === EXPIRY_SOURCE_GENERIC && <span>Source: <span className="market-property-value"> News Media</span></span>}
                    {newMarket.expirySourceType === EXPIRY_SOURCE_SPECIFIC && !!newMarket.expirySource && <span>Source: <span className="market-property-value">{newMarket.expirySource}</span></span>}
                    { newMarket.expirySourceType !== EXPIRY_SOURCE_GENERIC &&
                      !(newMarket.expirySourceType === EXPIRY_SOURCE_SPECIFIC &&
                      !!newMarket.expirySource) &&
                      '\u00a0'
                    }
                  </span>
                </button>
              </span>
              <span
                className={classNames('prop-container create-market-details', {
                  'is-editing': newMarketCreationOrder[newMarket.currentStep] === NEW_MARKET_DETAILS,
                  'is-null': !newMarket.detailsText,
                  'is-unused': !newMarket.detailsText && newMarketCreationOrder[newMarket.currentStep] === NEW_MARKET_REVIEW,
                  'has-value': !!newMarket.detailsText
                })}
              >
                <button
                  className="unstyled"
                  onClick={() => p.updateNewMarket({ currentStep: newMarketCreationOrder.indexOf(NEW_MARKET_DETAILS) })}
                >
                  <span className="null-mask" />
                  <span className="prop-value">{(!!newMarket.detailsText && <span>Additional Details: <span className="market-property-value">{newMarket.detailsText}</span></span>) || '\u00a0'}</span>
                </button>
              </span>
              <ul className="create-market-properties">
                <li
                  className={classNames('prop-container create-market-property', {
                    'is-editing': newMarketCreationOrder[newMarket.currentStep] === NEW_MARKET_END_DATE,
                    'is-null': !Object.keys(newMarket.endDate).length,
                    'has-value': !!Object.keys(newMarket.endDate).length
                  })}
                >
                  <button
                    className="unstyled"
                    onClick={() => p.updateNewMarket({ currentStep: newMarketCreationOrder.indexOf(NEW_MARKET_END_DATE) })}
                  >
                    <span className="null-mask" />
                    <span className="prop-value">{(!!Object.keys(newMarket.endDate).length && <span>Ends: <span className="market-property-value">{newMarket.endDate.formattedLocal}</span></span>) || '\u00a0'}</span>
                  </button>
                </li>
                <li className="grouped-properties">
                  <button
                    className={classNames('unstyled prop-container create-market-property create-market-property-fees', {
                      'is-editing': newMarketCreationOrder[newMarket.currentStep] === NEW_MARKET_FEES
                    })}
                    onClick={() => p.updateNewMarket({ currentStep: newMarketCreationOrder.indexOf(NEW_MARKET_FEES) })}
                  >
                    <ul>
                      <li
                        className={classNames('prop-container', {
                          'is-null': !newMarket.settlementFee || newMarket.validations.indexOf(NEW_MARKET_FEES) === -1,
                          'has-value': newMarket.settlementFee && (newMarket.validations.indexOf(NEW_MARKET_FEES) > -1 || newMarketCreationOrder[newMarket.currentStep] === NEW_MARKET_FEES)
                        })}
                      >
                        <span className="null-mask" />
                        <span className="prop-value">{(newMarket.settlementFee && (newMarket.validations.indexOf(NEW_MARKET_FEES) > -1 || newMarketCreationOrder[newMarket.currentStep] === NEW_MARKET_FEES) && <span>Settlement Fee: <span className="market-property-value">{newMarket.settlementFee}%</span></span>) || '\u00a0'}</span>
                      </li>
                    </ul>
                  </button>
                </li>
                <li
                  className={classNames('prop-container create-market-property', {
                    'is-editing': newMarketCreationOrder[newMarket.currentStep] === NEW_MARKET_ORDER_BOOK,
                    'is-null': s.initialLiquidity == null || s.initialLiquidity === '0',
                    'is-unused': !Object.keys(newMarket.orderBook).length && newMarketCreationOrder[newMarket.currentStep] === NEW_MARKET_REVIEW,
                    'has-value': s.initialLiquidity != null && s.initialLiquidity !== '0'
                  })}
                >
                  <button
                    className={classNames('unstyled', { disabled: p.newMarket.validations.indexOf(NEW_MARKET_OUTCOMES) === -1 })}
                    onClick={() => p.newMarket.validations.indexOf(NEW_MARKET_OUTCOMES) !== -1 && p.updateNewMarket({ currentStep: newMarketCreationOrder.indexOf(NEW_MARKET_ORDER_BOOK) })}
                  >
                    <span className="null-mask" />
                    <span className="prop-value">{((s.initialLiquidity != null && s.initialLiquidity !== '0') && <span>Initial Liquidity: <span className="market-property-value">{s.initialLiquidity} Eth</span></span>) || '\u00a0'}</span>
                  </button>
                </li>
              </ul>
            </div>
            {newMarket.type !== BINARY &&
              <div className="create-market-outcomes">
                <ul
                  className={classNames('prop-container create-market-outcome-list', {
                    'is-editing': newMarketCreationOrder[newMarket.currentStep] === NEW_MARKET_OUTCOMES,
                    'is-null': !newMarket.outcomes.length || newMarket.outcomes.every(outcome => outcome === ''),
                    'has-value': newMarket.outcomes.length && newMarket.outcomes.some(outcome => outcome !== '')
                  })}
                >
                  <button
                    className={classNames('unstyled', { disabled: newMarket.type === BINARY })}
                    onClick={() => newMarket.type !== BINARY && p.updateNewMarket({ currentStep: newMarketCreationOrder.indexOf(NEW_MARKET_OUTCOMES) })}
                  >
                    <div className="outcome-null-masks">
                      {newMarket.type === CATEGORICAL ?
                        <div className="null-outcomes">
                          <li className="null-mask" />
                          <li className="null-mask" />
                          <li className="null-mask" />
                          <li className="null-mask" />
                        </div> :
                        <div className="null-outcomes">
                          <li className="null-mask" />
                          <li className="null-mask" />
                        </div>
                      }
                    </div>
                    {newMarket.outcomes.map((outcome, i) => (
                      <li
                        key={outcome === '' ? i : outcome}
                      >
                        {newMarket.type === SCALAR && i === 0 && outcome[0] && <span>Min:</span>}
                        {newMarket.type === SCALAR && i === 1 && outcome[1] && <span>Max:</span>}
                        {(outcome && Math.sign(outcome) === 1) ? <span style={{ visibility: 'hidden' }}>-</span> : `\u00a0`}{outcome || `\u00a0`}
                      </li>
                    ))}
                  </button>
                </ul>
              </div>
            }
            <div
              ref={(initialLiquidityPreview) => { this.initialLiquidityPreview = initialLiquidityPreview }}
              className={classNames('create-market-initial-liquidity', {
                'reveal-initial-liquidity': newMarketCreationOrder[newMarket.currentStep] === NEW_MARKET_REVIEW && s.initialLiquidity && s.initialLiquidity !== '0',
                'hide-initial-liquidity': newMarketCreationOrder[newMarket.currentStep] !== NEW_MARKET_REVIEW || !s.initialLiquidity || s.initialLiquidity === '0',
              })}
            >
              {newMarket.type === CATEGORICAL &&
                <div className="order-book-outcomes-table">
                  <div className="order-book-outcomes-header">
                    <span>Outcomes</span>
                  </div>
                  <div className="order-book-outcomes">
                    {newMarket.outcomes.map(outcome => (
                      <div
                        key={outcome}
                        className={`order-book-outcome-row ${s.selectedOutcome === outcome ? 'selected' : ''}`}
                      >
                        <button
                          className="unstyled"
                          onClick={() => {
                            this.setState({ selectedOutcome: outcome })
                          }}
                        >
                          <span>{outcome}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              }
              <div
                ref={(orderBookPreview) => { this.orderBookPreview = orderBookPreview }}
                className="create-market-initial-liquidity-preview order-book-preview"
              >
                <div
                  ref={(orderBookChart) => { this.orderBookChart = orderBookChart }}
                  id="order_book_preview_chart_preview"
                />
                <div className="order-book-preview-table">
                  <div className="order-book-preview-table-header">
                    <span>Bid Q.</span>
                    <span>Bid</span>
                    <span>Ask</span>
                    <span>Ask Q.</span>
                  </div>
                  <div className="order-book-preview-table-content">
                    <ul className="order-book-preview-table-bids">
                      {bids ?
                        bids.map((bid, i) => (
                          <li
                            key={i}
                          >
                            <span>
                              {`${bid.quantity}`}
                            </span>
                            <span>
                              {`${bid.price}`}
                            </span>
                          </li>
                      )) :
                        <span>No Bids</span>
                      }
                    </ul>
                    <ul className="order-book-preview-table-asks">
                      {asks ?
                        asks.map((ask, i) => (
                          <li
                            key={i}
                          >
                            <span>
                              {`${ask.price}`}
                            </span>
                            <span>
                              {`${ask.quantity}`}
                            </span>
                          </li>
                        )) :
                        <span>No Asks</span>
                      }
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <span className={Styles.CreateMarketPreview__icon}>
              {CreateMarketEdit}
            </span>
          </div>
        </div>
        <div className={Styles.CreateMarketPreview__footer}>
          <div className={Styles['CreateMarketPreview__footer-wrapper']}>
            <ul className={Styles.CreateMarketPreview__meta}>
              <li>
                <span>Volume</span>
                <span>{ s.shares }</span>
              </li>
              <li>
                <span>Fee</span>
                <span>{ p.newMarket.settlementFee ? p.newMarket.settlementFee : '0.0'}%</span>
              </li>
              <li>
                <span>Expires</span>
                <span>{ s.expirationDate }</span>
              </li>
            </ul>
          </div>
        </div>
      </article>
    )
  }
}
